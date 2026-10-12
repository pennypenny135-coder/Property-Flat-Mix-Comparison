import type { ReactNode } from 'react';

export function ComparisonTableShell({
  titleEn,
  titleZh,
  footer,
  children,
}: {
  titleEn: string;
  titleZh: string;
  footer?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="space-y-2 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div>
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">{titleEn}</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">{titleZh}</p>
      </div>
      <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">{children}</div>
      {footer && <p className="text-xs text-slate-500 dark:text-slate-400">{footer}</p>}
    </section>
  );
}

export const tableBaseCls = 'w-full border-collapse text-sm';
export const theadRowCls =
  'sticky top-0 z-20 bg-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300';
export const stickyFirstColHeaderCls =
  'sticky left-0 z-30 min-w-[160px] bg-slate-100 px-3 py-2.5 align-top dark:bg-slate-800';
export const stickyFirstColCellCls =
  'sticky left-0 z-10 min-w-[160px] bg-white px-3 py-2 font-medium text-slate-700 dark:bg-slate-900 dark:text-slate-200';
export const headerColCls = 'min-w-[160px] px-3 py-2.5 align-top';
export const cellCls = 'min-w-[160px] whitespace-pre-wrap px-3 py-2 text-slate-700 dark:text-slate-200';
