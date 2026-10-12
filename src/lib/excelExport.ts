import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { UNIT_TYPE_ORDER, UNIT_TYPE_LABELS, APP_NAME } from '@/lib/constants';
import {
  calculateTotalInventory,
  calculateUnitsPerResidentSpace,
  formatInventoryCell,
  formatUnitsPerResidentSpace,
} from '@/lib/calculations';
import { formatAreaSqFt, formatProjectHeader, formatSaleableArea, getDistrictSubDisplay, csvSafeguard } from '@/lib/formatters';
import { mergeCustomParkingItems, mapInventoryData } from '@/lib/comparison';
import type { Project } from '@/types/project';
import type { ComparisonSettings } from '@/types/settings';

function headerLabel(project: Project, settings: ComparisonSettings): string {
  const { primary, secondary } = formatProjectHeader(project, settings.headerLanguage);
  let text = primary;
  if (secondary) text += `\n${secondary}`;
  if (settings.showDistrict) {
    text += `\n${getDistrictSubDisplay(project)}`;
  }
  return csvSafeguard(text);
}

function setColWidths(ws: XLSX.WorkSheet, widths: number[]) {
  ws['!cols'] = widths.map((w) => ({ wch: w }));
}

function applyCommonSheetSettings(ws: XLSX.WorkSheet, rowCount: number, colCount: number) {
  const wsAny = ws as unknown as Record<string, unknown>;
  wsAny['!freeze'] = { xSplit: 1, ySplit: 1 };
  wsAny['!views'] = [{ state: 'frozen', xSplit: 1, ySplit: 1 }];
  ws['!autofilter'] = { ref: XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: rowCount - 1, c: colCount - 1 } }) };
  wsAny['!printSetup'] = { orientation: 'landscape' };
  ws['!margins'] = { left: 0.3, right: 0.3, top: 0.4, bottom: 0.4, header: 0.2, footer: 0.2 };
}

function buildSaleableAreaSheet(projects: Project[], settings: ComparisonSettings): XLSX.WorkSheet {
  const header = ['Unit Type', ...projects.map((p) => headerLabel(p, settings))];
  const rows: string[][] = [header];

  for (const ut of UNIT_TYPE_ORDER) {
    const values = projects.map((p) => formatSaleableArea(p.unitTypes[ut]));
    const hasData = values.some((v) => v !== '—');
    if (settings.hideEmptyUnitTypes && !hasData) continue;
    rows.push([`${UNIT_TYPE_LABELS[ut].en} / ${UNIT_TYPE_LABELS[ut].zh}`, ...values]);
  }

  if (settings.showClubhouseArea) {
    rows.push([
      'Clubhouse Area',
      ...projects.map((p) => formatAreaSqFt(p.clubhouse.clubhouseAreaSqFt, p.clubhouse.clubhouseAreaDisplayOverride)),
    ]);
  }
  if (settings.showCommunalGardenArea) {
    rows.push([
      'Communal Garden / Play Area',
      ...projects.map((p) =>
        formatAreaSqFt(
          p.clubhouse.communalGardenOrPlayAreaSqFt,
          p.clubhouse.communalGardenOrPlayAreaDisplayOverride,
        ),
      ),
    ]);
  }
  if (settings.showGeneralNotes) {
    rows.push(['Notes', ...projects.map((p) => csvSafeguard(p.notes || '—'))]);
  }
  if (settings.showClubhouseNotes) {
    rows.push(['Clubhouse Notes', ...projects.map((p) => csvSafeguard(p.clubhouse.clubhouseNotes || '—'))]);
  }
  if (settings.showCommunalGardenNotes) {
    rows.push([
      'Communal Garden / Play Area Notes',
      ...projects.map((p) => csvSafeguard(p.clubhouse.communalGardenOrPlayAreaNotes || '—')),
    ]);
  }

  rows.push(['']);
  rows.push(['All sizes are listed in saleable area square feet (sq. ft.).']);

  const ws = XLSX.utils.aoa_to_sheet(rows);
  setColWidths(ws, [28, ...projects.map(() => 22)]);
  applyCommonSheetSettings(ws, rows.length, header.length);
  return ws;
}

function buildInventorySheet(projects: Project[], settings: ComparisonSettings): XLSX.WorkSheet {
  const header = ['Unit Type', ...projects.map((p) => headerLabel(p, settings))];
  const rows: string[][] = [header];

  const totals = projects.map((p) => calculateTotalInventory(mapInventoryData(p)));

  for (const ut of UNIT_TYPE_ORDER) {
    const cells = projects.map((p, i) =>
      formatInventoryCell(p.unitTypes[ut].inventoryCount, totals[i], settings.showInventoryPercentage),
    );
    const hasData = cells.some((v) => v !== '—');
    if (settings.hideEmptyUnitTypes && !hasData) continue;
    rows.push([`${UNIT_TYPE_LABELS[ut].en} / ${UNIT_TYPE_LABELS[ut].zh}`, ...cells]);
  }

  rows.push([
    'Total',
    ...totals.map((t) => (t == null ? '—' : settings.showTotalPercentage ? `${t.toLocaleString('en-US')} (100.0%)` : t.toLocaleString('en-US'))),
  ]);

  const ws = XLSX.utils.aoa_to_sheet(rows);
  setColWidths(ws, [28, ...projects.map(() => 22)]);
  applyCommonSheetSettings(ws, rows.length, header.length);
  return ws;
}

function buildParkingSheet(projects: Project[], settings: ComparisonSettings): XLSX.WorkSheet {
  const header = ['Item / Parking Type', ...projects.map((p) => headerLabel(p, settings))];
  const rows: string[][] = [header];

  rows.push([
    'Resident Parking Spaces',
    ...projects.map((p) => (p.parking.residentParkingSpaces == null ? '—' : String(p.parking.residentParkingSpaces))),
  ]);
  rows.push(['Others', ...projects.map((p) => (p.parking.others == null ? '—' : String(p.parking.others)))]);

  const customRows = mergeCustomParkingItems(projects);
  for (const row of customRows) {
    rows.push([
      csvSafeguard(row.displayName),
      ...projects.map((p) => {
        const v = row.valuesByProjectId[p.id];
        return v == null ? '—' : String(v);
      }),
    ]);
  }

  rows.push([
    'Total No. of Residential Units',
    ...projects.map((p) => (p.parking.totalResidentialUnits == null ? '—' : String(p.parking.totalResidentialUnits))),
  ]);

  rows.push([
    'Units per Resident Space',
    ...projects.map((p) =>
      formatUnitsPerResidentSpace(
        calculateUnitsPerResidentSpace(p.parking.totalResidentialUnits, p.parking.residentParkingSpaces),
      ),
    ),
  ]);

  if (settings.showCpsRemarks) {
    rows.push(['Remarks', ...projects.map((p) => csvSafeguard(p.parking.remarks || '—'))]);
  }

  const ws = XLSX.utils.aoa_to_sheet(rows);
  setColWidths(ws, [30, ...projects.map(() => 24)]);
  applyCommonSheetSettings(ws, rows.length, header.length);
  return ws;
}

function buildProjectDataSheet(projects: Project[]): XLSX.WorkSheet {
  const header = [
    'ID',
    '中文名稱',
    '英文名稱',
    '發展商',
    '其他發展商',
    '地區',
    '其他地區',
    '細分地區',
    'Studio 面積',
    'Studio 數量',
    '1 Bedroom 面積',
    '1 Bedroom 數量',
    '2 Bedrooms 面積',
    '2 Bedrooms 數量',
    '3 Bedrooms 面積',
    '3 Bedrooms 數量',
    '4 Bedrooms 面積',
    '4 Bedrooms 數量',
    'Clubhouse Area (sq ft)',
    'Clubhouse Notes',
    'Communal Garden Area (sq ft)',
    'Communal Garden Notes',
    'Resident Parking Spaces',
    'Others',
    'Total Residential Units',
    'Custom Parking Items (JSON)',
    'Parking Remarks',
    'Notes',
    'Created At',
    'Updated At',
  ];

  const rows: (string | number)[][] = [header];

  for (const p of projects) {
    rows.push([
      p.id,
      csvSafeguard(p.projectNameZh || ''),
      csvSafeguard(p.projectNameEn || ''),
      p.developer,
      csvSafeguard(p.developerOther || ''),
      p.district,
      csvSafeguard(p.districtOther || ''),
      csvSafeguard(p.districtDetail || ''),
      formatSaleableArea(p.unitTypes.studio),
      p.unitTypes.studio.inventoryCount ?? '',
      formatSaleableArea(p.unitTypes.oneBedroom),
      p.unitTypes.oneBedroom.inventoryCount ?? '',
      formatSaleableArea(p.unitTypes.twoBedrooms),
      p.unitTypes.twoBedrooms.inventoryCount ?? '',
      formatSaleableArea(p.unitTypes.threeBedrooms),
      p.unitTypes.threeBedrooms.inventoryCount ?? '',
      formatSaleableArea(p.unitTypes.fourBedrooms),
      p.unitTypes.fourBedrooms.inventoryCount ?? '',
      p.clubhouse.clubhouseAreaSqFt ?? '',
      csvSafeguard(p.clubhouse.clubhouseNotes || ''),
      p.clubhouse.communalGardenOrPlayAreaSqFt ?? '',
      csvSafeguard(p.clubhouse.communalGardenOrPlayAreaNotes || ''),
      p.parking.residentParkingSpaces ?? '',
      p.parking.others ?? '',
      p.parking.totalResidentialUnits ?? '',
      JSON.stringify(p.parking.customItems || []),
      csvSafeguard(p.parking.remarks || ''),
      csvSafeguard(p.notes || ''),
      p.createdAt,
      p.updatedAt,
    ]);
  }

  const ws = XLSX.utils.aoa_to_sheet(rows);
  setColWidths(ws, header.map((h) => Math.min(Math.max(h.length + 4, 14), 40)));
  applyCommonSheetSettings(ws, rows.length, header.length);
  return ws;
}

function buildExportInfoSheet(info: {
  selectedCount: number;
  sortLabel: string;
  sortDirection: string;
  settings: ComparisonSettings;
}): XLSX.WorkSheet {
  const rows: string[][] = [
    ['應用程式名稱', APP_NAME],
    ['應用程式版本', '1.0.0'],
    ['匯出時間', new Date().toLocaleString('zh-HK')],
    ['被選樓盤數量', String(info.selectedCount)],
    ['排列方式', info.sortLabel],
    ['排序方向', info.sortDirection === 'asc' ? '升序' : '降序'],
    ['顯示 Clubhouse Area', info.settings.showClubhouseArea ? '是' : '否'],
    ['顯示 Communal Garden Area', info.settings.showCommunalGardenArea ? '是' : '否'],
    ['顯示 Inventory Percentage', info.settings.showInventoryPercentage ? '是' : '否'],
    ['顯示 Total Percentage', info.settings.showTotalPercentage ? '是' : '否'],
    ['顯示地區', info.settings.showDistrict ? '是' : '否'],
    ['顯示 CPS Remarks', info.settings.showCpsRemarks ? '是' : '否'],
    [''],
    ['資料為本地資料庫資料，不會同步到雲端。'],
    ['Data is sourced from local browser storage and is never synced to any cloud service.'],
  ];
  const ws = XLSX.utils.aoa_to_sheet(rows);
  setColWidths(ws, [30, 60]);
  return ws;
}

export function exportComparisonExcel(
  projects: Project[],
  settings: ComparisonSettings,
  sortLabel: string,
): void {
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, buildSaleableAreaSheet(projects, settings), 'Saleable Area');
  XLSX.utils.book_append_sheet(wb, buildInventorySheet(projects, settings), 'Inventory');
  XLSX.utils.book_append_sheet(wb, buildParkingSheet(projects, settings), 'Car Parking Spaces');
  XLSX.utils.book_append_sheet(wb, buildProjectDataSheet(projects), 'Project Data');
  XLSX.utils.book_append_sheet(
    wb,
    buildExportInfoSheet({
      selectedCount: projects.length,
      sortLabel,
      sortDirection: settings.sortDirection,
      settings,
    }),
    'Export Info',
  );

  const filename = `property-comparison-${format(new Date(), 'yyyy-MM-dd-HHmm')}.xlsx`;
  XLSX.writeFile(wb, filename);
}

export function exportAllDataExcel(projects: Project[]): void {
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, buildProjectDataSheet(projects), 'Project Data');
  const filename = `property-all-data-${format(new Date(), 'yyyy-MM-dd-HHmm')}.xlsx`;
  XLSX.writeFile(wb, filename);
}
