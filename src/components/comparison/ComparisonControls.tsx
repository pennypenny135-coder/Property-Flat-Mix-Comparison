import { ArrowLeft, ArrowDownAZ, ArrowUpAZ, FileSpreadsheet, FileText, Settings2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SORT_OPTIONS, MAX_SELECTION } from '@/lib/constants';
import type { ComparisonSettings, SortDirection, SortKey } from '@/types/settings';

export function ComparisonControls({
  selectedCount,
  settings,
  onUpdate,
  onToggleSettings,
  onExportExcel,
  onExportCsv,
}: {
  selectedCount: number;
  settings: ComparisonSettings;
  onUpdate: (patch: Partial<ComparisonSettings>) => void;
  onToggleSettings: () => void;
  onExportExcel: () => void;
  onExportCsv: () => void;
}) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
      <button
        type="button"
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        <ArrowLeft size={15} /> 返回樓盤資料庫
      </button>
      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
        已選 {selectedCount} / {MAX_SELECTION}
      </span>

      <select
        value={settings.sortKey}
        onChange={(e) => onUpdate({ sortKey: e.target.value as SortKey })}
        className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={() => onUpdate({ sortDirection: settings.sortDirection === 'asc' ? 'desc' : ('asc' as SortDirection) })}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        {settings.sortDirection === 'asc' ? <ArrowDownAZ size={15} /> : <ArrowUpAZ size={15} />}
        {settings.sortDirection === 'asc' ? '升序' : '降序'}
      </button>

      <button
        type="button"
        onClick={onToggleSettings}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        <Settings2 size={15} /> 顯示設定
      </button>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={onExportCsv}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <FileText size={15} /> 匯出 CSV
        </button>
        <button
          type="button"
          onClick={onExportExcel}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          <FileSpreadsheet size={15} /> 匯出目前比較表 Excel
        </button>
      </div>
    </div>
  );
}
