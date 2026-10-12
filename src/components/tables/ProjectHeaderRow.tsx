import { formatProjectHeader, getDistrictSubDisplay } from '@/lib/formatters';
import { theadRowCls, stickyFirstColHeaderCls, headerColCls } from '@/components/tables/ComparisonTableShell';
import type { Project } from '@/types/project';
import type { ComparisonSettings } from '@/types/settings';

export function ProjectHeaderRow({
  firstColLabel,
  projects,
  settings,
}: {
  firstColLabel: string;
  projects: Project[];
  settings: ComparisonSettings;
}) {
  return (
    <tr className={theadRowCls}>
      <th className={stickyFirstColHeaderCls}>{firstColLabel}</th>
      {projects.map((p) => {
        const { primary, secondary } = formatProjectHeader(p, settings.headerLanguage);
        return (
          <th key={p.id} className={headerColCls}>
            <div className="font-semibold normal-case text-slate-800 dark:text-slate-100">{primary}</div>
            {secondary && <div className="font-normal normal-case text-slate-500 dark:text-slate-400">{secondary}</div>}
            {settings.showDistrict && (
              <div className="mt-0.5 font-normal normal-case text-[11px] text-slate-400 dark:text-slate-500">
                {getDistrictSubDisplay(p)}
              </div>
            )}
          </th>
        );
      })}
    </tr>
  );
}
