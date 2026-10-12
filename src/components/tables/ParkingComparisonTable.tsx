import { calculateUnitsPerResidentSpace, formatUnitsPerResidentSpace } from '@/lib/calculations';
import { mergeCustomParkingItems } from '@/lib/comparison';
import { csvSafeguard } from '@/lib/formatters';
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

export function ParkingComparisonTable({ projects, settings }: { projects: Project[]; settings: ComparisonSettings }) {
  const rowPad = settings.density === 'compact' ? 'py-1' : 'py-2';
  const customRows = mergeCustomParkingItems(projects);

  return (
    <ComparisonTableShell titleEn="Car Parking Spaces Comparison" titleZh="車位資料比較">
      <table className={tableBaseCls}>
        <thead>
          <ProjectHeaderRow firstColLabel="Item / Parking Type" projects={projects} settings={settings} />
        </thead>
        <tbody>
          <tr className="border-b border-slate-100 dark:border-slate-800">
            <td className={cn(stickyFirstColCellCls, rowPad)}>Resident Parking Spaces</td>
            {projects.map((p) => (
              <td key={p.id} className={cn(cellCls, rowPad)}>
                {p.parking.residentParkingSpaces ?? '—'}
              </td>
            ))}
          </tr>
          <tr className="border-b border-slate-100 dark:border-slate-800">
            <td className={cn(stickyFirstColCellCls, rowPad)}>Others</td>
            {projects.map((p) => (
              <td key={p.id} className={cn(cellCls, rowPad)}>
                {p.parking.others ?? '—'}
              </td>
            ))}
          </tr>

          {customRows.map((row) => (
            <tr key={row.key} className="border-b border-slate-100 dark:border-slate-800">
              <td className={cn(stickyFirstColCellCls, rowPad)}>{csvSafeguard(row.displayName)}</td>
              {projects.map((p) => (
                <td key={p.id} className={cn(cellCls, rowPad)}>
                  {row.valuesByProjectId[p.id] ?? '—'}
                </td>
              ))}
            </tr>
          ))}

          <tr className="border-b border-slate-100 dark:border-slate-800">
            <td className={cn(stickyFirstColCellCls, rowPad)}>Total No. of Residential Units</td>
            {projects.map((p) => (
              <td key={p.id} className={cn(cellCls, rowPad)}>
                {p.parking.totalResidentialUnits ?? '—'}
              </td>
            ))}
          </tr>

          <tr className={cn('font-semibold', settings.showCpsRemarks && 'border-b border-slate-100 dark:border-slate-800')}>
            <td className={cn(stickyFirstColCellCls, rowPad)}>Units per Resident Space</td>
            {projects.map((p) => (
              <td key={p.id} className={cn(cellCls, rowPad)}>
                {formatUnitsPerResidentSpace(
                  calculateUnitsPerResidentSpace(p.parking.totalResidentialUnits, p.parking.residentParkingSpaces),
                )}
              </td>
            ))}
          </tr>

          {settings.showCpsRemarks && (
            <tr>
              <td className={cn(stickyFirstColCellCls, rowPad)}>Remarks</td>
              {projects.map((p) => (
                <td key={p.id} className={cn(cellCls, rowPad, 'whitespace-pre-wrap')}>
                  {csvSafeguard(p.parking.remarks || '') || '—'}
                </td>
              ))}
            </tr>
          )}
        </tbody>
      </table>
    </ComparisonTableShell>
  );
}
