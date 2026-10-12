import { UNIT_TYPE_ORDER, UNIT_TYPE_LABELS } from '@/lib/constants';
import { formatSaleableArea, formatAreaSqFt, csvSafeguard } from '@/lib/formatters';
import {
  ComparisonTableShell,
  tableBaseCls,
  stickyFirstColCellCls,
  cellCls,
} from '@/components/tables/ComparisonTableShell';
import { ProjectHeaderRow } from '@/components/tables/ProjectHeaderRow';
import type { Project } from '@/types/project';
import type { ComparisonSettings } from '@/types/settings';
import { cn } from '@/utils/cn';

export function SaleableAreaTable({ projects, settings }: { projects: Project[]; settings: ComparisonSettings }) {
  const rowPad = settings.density === 'compact' ? 'py-1' : 'py-2';

  const visibleUnitTypes = UNIT_TYPE_ORDER.filter((ut) => {
    if (!settings.hideEmptyUnitTypes) return true;
    return projects.some((p) => formatSaleableArea(p.unitTypes[ut]) !== '—');
  });

  return (
    <ComparisonTableShell
      titleEn="Saleable Area Comparison"
      titleZh="實用面積比較"
      footer="All sizes are listed in saleable area square feet (sq. ft.)."
    >
      <table className={tableBaseCls}>
        <thead>
          <ProjectHeaderRow firstColLabel="Unit Type" projects={projects} settings={settings} />
        </thead>
        <tbody>
          {visibleUnitTypes.map((ut) => (
            <tr key={ut} className="border-b border-slate-100 dark:border-slate-800">
              <td className={cn(stickyFirstColCellCls, rowPad)}>
                {UNIT_TYPE_LABELS[ut].en}
                <div className="text-xs font-normal text-slate-400">{UNIT_TYPE_LABELS[ut].zh}</div>
              </td>
              {projects.map((p) => (
                <td key={p.id} className={cn(cellCls, rowPad)}>
                  {formatSaleableArea(p.unitTypes[ut])}
                </td>
              ))}
            </tr>
          ))}

          {settings.showClubhouseArea && (
            <tr className="border-b border-slate-100 dark:border-slate-800">
              <td className={cn(stickyFirstColCellCls, rowPad)}>Clubhouse Area</td>
              {projects.map((p) => (
                <td key={p.id} className={cn(cellCls, rowPad)}>
                  {formatAreaSqFt(p.clubhouse.clubhouseAreaSqFt, p.clubhouse.clubhouseAreaDisplayOverride)}
                </td>
              ))}
            </tr>
          )}

          {settings.showCommunalGardenArea && (
            <tr className="border-b border-slate-100 dark:border-slate-800">
              <td className={cn(stickyFirstColCellCls, rowPad)}>Communal Garden / Play Area</td>
              {projects.map((p) => (
                <td key={p.id} className={cn(cellCls, rowPad)}>
                  {formatAreaSqFt(
                    p.clubhouse.communalGardenOrPlayAreaSqFt,
                    p.clubhouse.communalGardenOrPlayAreaDisplayOverride,
                  )}
                </td>
              ))}
            </tr>
          )}

          {settings.showGeneralNotes && (
            <tr className="border-b border-slate-100 dark:border-slate-800">
              <td className={cn(stickyFirstColCellCls, rowPad)}>Notes</td>
              {projects.map((p) => (
                <td key={p.id} className={cn(cellCls, rowPad)}>
                  {csvSafeguard(p.notes || '') || '—'}
                </td>
              ))}
            </tr>
          )}

          {settings.showClubhouseNotes && (
            <tr className="border-b border-slate-100 dark:border-slate-800">
              <td className={cn(stickyFirstColCellCls, rowPad)}>Clubhouse Notes</td>
              {projects.map((p) => (
                <td key={p.id} className={cn(cellCls, rowPad)}>
                  {csvSafeguard(p.clubhouse.clubhouseNotes || '') || '—'}
                </td>
              ))}
            </tr>
          )}

          {settings.showCommunalGardenNotes && (
            <tr>
              <td className={cn(stickyFirstColCellCls, rowPad)}>Communal Garden / Play Area Notes</td>
              {projects.map((p) => (
                <td key={p.id} className={cn(cellCls, rowPad)}>
                  {csvSafeguard(p.clubhouse.communalGardenOrPlayAreaNotes || '') || '—'}
                </td>
              ))}
            </tr>
          )}
        </tbody>
      </table>
    </ComparisonTableShell>
  );
}
