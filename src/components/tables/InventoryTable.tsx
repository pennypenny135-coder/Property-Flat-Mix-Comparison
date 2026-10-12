import { UNIT_TYPE_ORDER, UNIT_TYPE_LABELS } from '@/lib/constants';
import { calculateTotalInventory, formatInventoryCell } from '@/lib/calculations';
import { mapInventoryData } from '@/lib/comparison';
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

export function InventoryTable({ projects, settings }: { projects: Project[]; settings: ComparisonSettings }) {
  const rowPad = settings.density === 'compact' ? 'py-1' : 'py-2';
  const totals = projects.map((p) => calculateTotalInventory(mapInventoryData(p)));

  const visibleUnitTypes = UNIT_TYPE_ORDER.filter((ut) => {
    if (!settings.hideEmptyUnitTypes) return true;
    return projects.some((p) => p.unitTypes[ut].inventoryCount != null);
  });

  return (
    <ComparisonTableShell titleEn="Inventory Comparison" titleZh="單位數量比較">
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
              {projects.map((p, i) => (
                <td key={p.id} className={cn(cellCls, rowPad)}>
                  {formatInventoryCell(p.unitTypes[ut].inventoryCount, totals[i], settings.showInventoryPercentage)}
                </td>
              ))}
            </tr>
          ))}
          <tr className="font-semibold">
            <td className={cn(stickyFirstColCellCls, rowPad)}>Total</td>
            {projects.map((p, i) => (
              <td key={p.id} className={cn(cellCls, rowPad)}>
                {totals[i] == null
                  ? '—'
                  : settings.showTotalPercentage
                    ? `${totals[i]!.toLocaleString('en-US')} (100.0%)`
                    : totals[i]!.toLocaleString('en-US')}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </ComparisonTableShell>
  );
}
