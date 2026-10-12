import { csvSafeguard } from '@/lib/formatters';
import { generateId } from '@/lib/ids';
import { UNIT_TYPE_ORDER } from '@/lib/constants';
import type { Project, UnitType, ParkingItem } from '@/types/project';
import type { ImportValidationError } from '@/types/backup';

const UNIT_TYPE_COLUMN_PREFIX: Record<UnitType, string> = {
  studio: 'studio',
  oneBedroom: 'oneBedroom',
  twoBedrooms: 'twoBedrooms',
  threeBedrooms: 'threeBedrooms',
  fourBedrooms: 'fourBedrooms',
};

const CSV_COLUMNS = [
  'id',
  'projectNameZh',
  'projectNameEn',
  'developer',
  'developerOther',
  'district',
  'districtOther',
  'districtDetail',
  'notes',
  ...UNIT_TYPE_ORDER.flatMap((ut) => [
    `${UNIT_TYPE_COLUMN_PREFIX[ut]}SaleableAreaMin`,
    `${UNIT_TYPE_COLUMN_PREFIX[ut]}SaleableAreaMax`,
    `${UNIT_TYPE_COLUMN_PREFIX[ut]}AreaDisplayOverride`,
    `${UNIT_TYPE_COLUMN_PREFIX[ut]}InventoryCount`,
  ]),
  'clubhouseAreaSqFt',
  'clubhouseAreaDisplayOverride',
  'clubhouseNotes',
  'communalGardenOrPlayAreaSqFt',
  'communalGardenOrPlayAreaDisplayOverride',
  'communalGardenOrPlayAreaNotes',
  'residentParkingSpaces',
  'others',
  'totalResidentialUnits',
  'parkingRemarks',
  'customParkingItemsJson',
  'isDemo',
  'createdAt',
  'updatedAt',
] as const;

function escapeCsvField(value: string): string {
  const safeguarded = csvSafeguard(value);
  if (/[",\n\r]/.test(safeguarded)) {
    return `"${safeguarded.replace(/"/g, '""')}"`;
  }
  return safeguarded;
}

function numOrEmpty(v: number | null | undefined): string {
  return v == null ? '' : String(v);
}

export function projectsToCsv(projects: Project[]): string {
  const header = CSV_COLUMNS.join(',');
  const rows = projects.map((p) => {
    const values: string[] = [
      p.id,
      p.projectNameZh || '',
      p.projectNameEn || '',
      p.developer,
      p.developerOther || '',
      p.district,
      p.districtOther || '',
      p.districtDetail || '',
      p.notes || '',
    ];
    for (const ut of UNIT_TYPE_ORDER) {
      const d = p.unitTypes[ut];
      values.push(
        numOrEmpty(d.saleableAreaMin),
        numOrEmpty(d.saleableAreaMax),
        d.areaDisplayOverride || '',
        numOrEmpty(d.inventoryCount),
      );
    }
    values.push(
      numOrEmpty(p.clubhouse.clubhouseAreaSqFt),
      p.clubhouse.clubhouseAreaDisplayOverride || '',
      p.clubhouse.clubhouseNotes || '',
      numOrEmpty(p.clubhouse.communalGardenOrPlayAreaSqFt),
      p.clubhouse.communalGardenOrPlayAreaDisplayOverride || '',
      p.clubhouse.communalGardenOrPlayAreaNotes || '',
      numOrEmpty(p.parking.residentParkingSpaces),
      numOrEmpty(p.parking.others),
      numOrEmpty(p.parking.totalResidentialUnits),
      p.parking.remarks || '',
      JSON.stringify(p.parking.customItems || []),
      p.isDemo ? 'true' : 'false',
      p.createdAt,
      p.updatedAt,
    );
    return values.map((v) => escapeCsvField(String(v))).join(',');
  });
  const csv = [header, ...rows].join('\r\n');
  return '\uFEFF' + csv;
}

export function parseCsvText(text: string): string[][] {
  const content = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  let i = 0;
  while (i < content.length) {
    const char = content[i];
    if (inQuotes) {
      if (char === '"') {
        if (content[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i += 1;
        continue;
      }
      field += char;
      i += 1;
      continue;
    }
    if (char === '"') {
      inQuotes = true;
      i += 1;
      continue;
    }
    if (char === ',') {
      row.push(field);
      field = '';
      i += 1;
      continue;
    }
    if (char === '\r') {
      i += 1;
      continue;
    }
    if (char === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
      i += 1;
      continue;
    }
    field += char;
    i += 1;
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => !(r.length === 1 && r[0] === ''));
}

function toNumberOrNull(v: string | undefined): number | null {
  if (v == null || v.trim() === '') return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
}

export function csvToProjects(text: string): {
  projects: Project[];
  errors: ImportValidationError[];
} {
  const rows = parseCsvText(text);
  if (rows.length === 0) return { projects: [], errors: [] };
  const header = rows[0];
  const dataRows = rows.slice(1);
  const errors: ImportValidationError[] = [];
  const projects: Project[] = [];

  const colIndex = (name: string) => header.indexOf(name);

  dataRows.forEach((cols, idx) => {
    try {
      const get = (name: string) => {
        const i = colIndex(name);
        return i >= 0 ? cols[i] : undefined;
      };
      const projectNameZh = get('projectNameZh') || '';
      const projectNameEn = get('projectNameEn') || '';
      if (!projectNameZh.trim() && !projectNameEn.trim()) {
        errors.push({
          index: idx + 2,
          identifier: `Row ${idx + 2}`,
          reason: '請至少輸入中文或英文樓盤名稱',
        });
        return;
      }

      const unitTypes = {} as Project['unitTypes'];
      for (const ut of UNIT_TYPE_ORDER) {
        const prefix = UNIT_TYPE_COLUMN_PREFIX[ut];
        unitTypes[ut] = {
          saleableAreaMin: toNumberOrNull(get(`${prefix}SaleableAreaMin`)),
          saleableAreaMax: toNumberOrNull(get(`${prefix}SaleableAreaMax`)),
          areaDisplayOverride: get(`${prefix}AreaDisplayOverride`) || '',
          inventoryCount: toNumberOrNull(get(`${prefix}InventoryCount`)),
        };
      }

      let customItems: ParkingItem[] = [];
      const customJson = get('customParkingItemsJson');
      if (customJson && customJson.trim()) {
        try {
          const parsed = JSON.parse(customJson);
          if (Array.isArray(parsed)) {
            customItems = parsed.map((item: Partial<ParkingItem>) => ({
              id: item.id || generateId(),
              name: String(item.name || ''),
              count: item.count == null ? null : Number(item.count),
              notes: item.notes || '',
              isRequired: false,
            }));
          }
        } catch {
          errors.push({
            index: idx + 2,
            identifier: projectNameZh || projectNameEn,
            reason: 'customParkingItemsJson 格式錯誤，已忽略自訂車位項目',
          });
        }
      }

      const now = new Date().toISOString();
      const project: Project = {
        id: get('id') || generateId(),
        projectNameZh: projectNameZh || null,
        projectNameEn: projectNameEn || null,
        developer: (get('developer') as Project['developer']) || 'other',
        developerOther: get('developerOther') || '',
        district: (get('district') as Project['district']) || 'other',
        districtOther: get('districtOther') || '',
        districtDetail: get('districtDetail') || '',
        notes: get('notes') || '',
        isDemo: get('isDemo') === 'true',
        unitTypes,
        clubhouse: {
          clubhouseAreaSqFt: toNumberOrNull(get('clubhouseAreaSqFt')),
          clubhouseAreaDisplayOverride: get('clubhouseAreaDisplayOverride') || '',
          clubhouseNotes: get('clubhouseNotes') || '',
          communalGardenOrPlayAreaSqFt: toNumberOrNull(get('communalGardenOrPlayAreaSqFt')),
          communalGardenOrPlayAreaDisplayOverride: get('communalGardenOrPlayAreaDisplayOverride') || '',
          communalGardenOrPlayAreaNotes: get('communalGardenOrPlayAreaNotes') || '',
        },
        parking: {
          residentParkingSpaces: toNumberOrNull(get('residentParkingSpaces')),
          others: toNumberOrNull(get('others')),
          totalResidentialUnits: toNumberOrNull(get('totalResidentialUnits')),
          customItems,
          remarks: get('parkingRemarks') || '',
        },
        createdAt: get('createdAt') || now,
        updatedAt: get('updatedAt') || now,
      };
      projects.push(project);
    } catch (e) {
      errors.push({ index: idx + 2, identifier: `Row ${idx + 2}`, reason: `解析錯誤: ${String(e)}` });
    }
  });

  return { projects, errors };
}
