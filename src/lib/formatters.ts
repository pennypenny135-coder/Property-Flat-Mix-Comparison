import type { Project, UnitTypeData } from '@/types/project';
import type { HeaderLanguage } from '@/types/settings';
import { DEVELOPER_LABELS, DISTRICT_LABELS } from '@/lib/constants';

export function formatNumber(value: number): string {
  return value.toLocaleString('en-US');
}

export function formatSaleableArea(data: UnitTypeData | undefined | null): string {
  if (!data) return '—';
  if (data.areaDisplayOverride && data.areaDisplayOverride.trim() !== '') {
    return data.areaDisplayOverride.trim();
  }
  const min = data.saleableAreaMin ?? null;
  const max = data.saleableAreaMax ?? null;
  if (min == null && max == null) return '—';
  if (min != null && max != null) {
    if (min === max) return formatNumber(min);
    return `${formatNumber(min)}–${formatNumber(max)}`;
  }
  if (min != null) return formatNumber(min);
  return formatNumber(max as number);
}

export function formatAreaSqFt(
  value: number | null | undefined,
  override: string | null | undefined,
): string {
  if (override && override.trim() !== '') return override.trim();
  if (value == null || Number.isNaN(value)) return '—';
  return `${formatNumber(value)} sq. ft.`;
}

export function getDeveloperDisplay(project: Project): string {
  if (project.developer === 'other') {
    return project.developerOther?.trim() || '其他';
  }
  return DEVELOPER_LABELS[project.developer];
}

export function getDistrictDisplay(project: Project): string {
  if (project.district === 'other') {
    return project.districtOther?.trim() || '其他';
  }
  return DISTRICT_LABELS[project.district];
}

export function getDistrictSubDisplay(project: Project): string {
  const main = getDistrictDisplay(project);
  const detail = project.districtDetail?.trim();
  if (detail) return `${main} · ${detail}`;
  return main;
}

export function formatProjectHeader(
  project: Project,
  languageSetting: HeaderLanguage,
): { primary: string; secondary?: string } {
  const zh = project.projectNameZh?.trim() || '';
  const en = project.projectNameEn?.trim() || '';

  if (!zh && !en) return { primary: '未命名樓盤' };

  if (languageSetting === 'zh') {
    return { primary: zh || en };
  }
  if (languageSetting === 'en') {
    return { primary: en || zh };
  }
  // both
  if (zh && en) return { primary: zh, secondary: en };
  return { primary: zh || en };
}

export function csvSafeguard(value: string): string {
  if (value.length === 0) return value;
  if (/^[=+\-@]/.test(value)) {
    return `'${value}`;
  }
  return value;
}
