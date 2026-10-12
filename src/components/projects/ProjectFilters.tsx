import { Search, XCircle } from 'lucide-react';
import { DEVELOPER_OPTIONS, DISTRICT_OPTIONS } from '@/lib/constants';
import type { DeveloperCode, DistrictCode } from '@/types/project';

const selectCls =
  'rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100';

export function ProjectFilters({
  keyword,
  onKeywordChange,
  developer,
  onDeveloperChange,
  district,
  onDistrictChange,
  districtDetail,
  onDistrictDetailChange,
  resultCount,
}: {
  keyword: string;
  onKeywordChange: (v: string) => void;
  developer: DeveloperCode | 'all';
  onDeveloperChange: (v: DeveloperCode | 'all') => void;
  district: DistrictCode | 'all';
  onDistrictChange: (v: DistrictCode | 'all') => void;
  districtDetail: string;
  onDistrictDetailChange: (v: string) => void;
  resultCount: number;
}) {
  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            placeholder="搜尋樓盤名稱、發展商、地區或備註"
            className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-9 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
          {keyword && (
            <button
              type="button"
              aria-label="清除搜尋"
              onClick={() => onKeywordChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <XCircle size={16} />
            </button>
          )}
        </div>
        <select
          className={selectCls}
          value={developer}
          onChange={(e) => onDeveloperChange(e.target.value as DeveloperCode | 'all')}
        >
          <option value="all">全部發展商</option>
          {DEVELOPER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <select
          className={selectCls}
          value={district}
          onChange={(e) => onDistrictChange(e.target.value as DistrictCode | 'all')}
        >
          <option value="all">全部地區</option>
          {DISTRICT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <input
          value={districtDetail}
          onChange={(e) => onDistrictDetailChange(e.target.value)}
          placeholder="細分地區搜尋"
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">顯示 {resultCount} 個樓盤</p>
    </div>
  );
}
