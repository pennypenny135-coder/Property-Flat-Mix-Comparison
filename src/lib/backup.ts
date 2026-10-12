import { generateId } from '@/lib/ids';
import { createEmptyUnitTypes } from '@/types/project';
import type { Project, ParkingItem, UnitType } from '@/types/project';
import type { BackupFile, ImportValidationError } from '@/types/backup';
import { BACKUP_APP_NAME, BACKUP_VERSION } from '@/types/backup';
import { UNIT_TYPE_ORDER } from '@/lib/constants';

export function createBackup(projects: Project[], settings: Record<string, unknown>): BackupFile {
  // Strip any derived fields defensively (should never be present, but guard anyway)
  const cleanedProjects = projects.map((p) => sanitizeProjectForExport(p));
  return {
    appName: BACKUP_APP_NAME,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    projects: cleanedProjects,
    settings,
  };
}

function sanitizeProjectForExport(project: Project): Project {
  const unitTypes = { ...project.unitTypes };
  for (const ut of UNIT_TYPE_ORDER) {
    const data = { ...unitTypes[ut] } as Record<string, unknown>;
    delete data.inventoryPercentage;
    unitTypes[ut] = data as Project['unitTypes'][UnitType];
  }
  const parking = { ...project.parking } as Record<string, unknown>;
  delete parking.unitsPerResidentSpace;
  return {
    ...project,
    unitTypes,
    parking: parking as Project['parking'],
  };
}

function toNumberOrNull(v: unknown): number | null {
  if (v == null || v === '') return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
}

function toStringOrNull(v: unknown): string | null {
  if (v == null) return null;
  return String(v);
}

export function normalizeImportedProject(
  raw: Record<string, unknown>,
): { project: Project; legacyPercentage: boolean; legacyUnitsPerSpace: boolean } {
  let legacyPercentage = false;
  let legacyUnitsPerSpace = false;

  const unitTypes = createEmptyUnitTypes();
  const rawUnitTypes = (raw.unitTypes as Record<string, Record<string, unknown>>) || {};
  for (const ut of UNIT_TYPE_ORDER) {
    const rawData = rawUnitTypes[ut] || {};
    if ('inventoryPercentage' in rawData) legacyPercentage = true;
    unitTypes[ut] = {
      saleableAreaMin: toNumberOrNull(rawData.saleableAreaMin),
      saleableAreaMax: toNumberOrNull(rawData.saleableAreaMax),
      areaDisplayOverride: toStringOrNull(rawData.areaDisplayOverride),
      inventoryCount: toNumberOrNull(rawData.inventoryCount),
    };
  }

  const rawParking = (raw.parking as Record<string, unknown>) || {};
  if ('unitsPerResidentSpace' in rawParking) legacyUnitsPerSpace = true;
  const rawCustomItems = Array.isArray(rawParking.customItems) ? rawParking.customItems : [];
  const customItems: ParkingItem[] = rawCustomItems.map((item: Record<string, unknown>) => ({
    id: typeof item.id === 'string' ? item.id : generateId(),
    name: typeof item.name === 'string' ? item.name : '',
    count: toNumberOrNull(item.count),
    notes: toStringOrNull(item.notes) || '',
    isRequired: Boolean(item.isRequired),
  }));

  const rawClubhouse = (raw.clubhouse as Record<string, unknown>) || {};

  const now = new Date().toISOString();

  const project: Project = {
    id: typeof raw.id === 'string' && raw.id ? raw.id : generateId(),
    projectNameZh: toStringOrNull(raw.projectNameZh),
    projectNameEn: toStringOrNull(raw.projectNameEn),
    developer: (raw.developer as Project['developer']) || 'other',
    developerOther: toStringOrNull(raw.developerOther) || '',
    district: (raw.district as Project['district']) || 'other',
    districtOther: toStringOrNull(raw.districtOther) || '',
    districtDetail: toStringOrNull(raw.districtDetail) || '',
    notes: toStringOrNull(raw.notes) || '',
    isDemo: Boolean(raw.isDemo),
    unitTypes,
    clubhouse: {
      clubhouseAreaSqFt: toNumberOrNull(rawClubhouse.clubhouseAreaSqFt),
      clubhouseAreaDisplayOverride: toStringOrNull(rawClubhouse.clubhouseAreaDisplayOverride) || '',
      clubhouseNotes: toStringOrNull(rawClubhouse.clubhouseNotes) || '',
      communalGardenOrPlayAreaSqFt: toNumberOrNull(rawClubhouse.communalGardenOrPlayAreaSqFt),
      communalGardenOrPlayAreaDisplayOverride:
        toStringOrNull(rawClubhouse.communalGardenOrPlayAreaDisplayOverride) || '',
      communalGardenOrPlayAreaNotes: toStringOrNull(rawClubhouse.communalGardenOrPlayAreaNotes) || '',
    },
    parking: {
      residentParkingSpaces: toNumberOrNull(rawParking.residentParkingSpaces),
      others: toNumberOrNull(rawParking.others),
      totalResidentialUnits: toNumberOrNull(rawParking.totalResidentialUnits),
      customItems,
      remarks: toStringOrNull(rawParking.remarks) || '',
    },
    createdAt: toStringOrNull(raw.createdAt) || now,
    updatedAt: toStringOrNull(raw.updatedAt) || now,
  };

  return { project, legacyPercentage, legacyUnitsPerSpace };
}

export function parseBackupJson(text: string): {
  projects: { project: Project; legacyPercentage: boolean; legacyUnitsPerSpace: boolean }[];
  errors: ImportValidationError[];
  settings: Record<string, unknown>;
} {
  const errors: ImportValidationError[] = [];
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return { projects: [], errors: [{ index: 0, identifier: 'file', reason: '無法解析 JSON 檔案' }], settings: {} };
  }

  const obj = data as Partial<BackupFile> & { projects?: unknown[] };
  const rawProjects = Array.isArray(obj.projects) ? obj.projects : [];
  const settings = (obj.settings as Record<string, unknown>) || {};

  const results: { project: Project; legacyPercentage: boolean; legacyUnitsPerSpace: boolean }[] = [];
  rawProjects.forEach((raw, idx) => {
    try {
      const record = raw as Record<string, unknown>;
      const zh = typeof record.projectNameZh === 'string' ? record.projectNameZh : '';
      const en = typeof record.projectNameEn === 'string' ? record.projectNameEn : '';
      if (!zh.trim() && !en.trim()) {
        errors.push({ index: idx, identifier: `Project ${idx + 1}`, reason: '請至少輸入中文或英文樓盤名稱' });
        return;
      }
      results.push(normalizeImportedProject(record));
    } catch (e) {
      errors.push({ index: idx, identifier: `Project ${idx + 1}`, reason: `解析錯誤: ${String(e)}` });
    }
  });

  return { projects: results, errors, settings };
}

export function findDuplicate(project: Project, existing: Project[]): Project | undefined {
  const byId = existing.find((p) => p.id === project.id);
  if (byId) return byId;
  return existing.find(
    (p) =>
      (p.projectNameZh || '') === (project.projectNameZh || '') &&
      (p.projectNameEn || '') === (project.projectNameEn || '') &&
      p.developer === project.developer &&
      (p.districtDetail || '') === (project.districtDetail || ''),
  );
}
