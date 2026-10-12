import type { ComparisonSettings as ComparisonSettingsType } from '@/types/settings';

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-2 py-1.5 text-sm text-slate-700 dark:text-slate-200">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
      />
    </label>
  );
}

export function ComparisonSettingsPanel({
  settings,
  onUpdate,
}: {
  settings: ComparisonSettingsType;
  onUpdate: (patch: Partial<ComparisonSettingsType>) => void;
}) {
  return (
    <div className="grid gap-x-6 gap-y-1 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-2 dark:border-slate-800 dark:bg-slate-900">
      <Toggle label="顯示 Clubhouse Area" checked={settings.showClubhouseArea} onChange={(v) => onUpdate({ showClubhouseArea: v })} />
      <Toggle
        label="顯示 Communal Garden or Play Area"
        checked={settings.showCommunalGardenArea}
        onChange={(v) => onUpdate({ showCommunalGardenArea: v })}
      />
      <Toggle label="顯示一般備註" checked={settings.showGeneralNotes} onChange={(v) => onUpdate({ showGeneralNotes: v })} />
      <Toggle label="顯示 Clubhouse Notes" checked={settings.showClubhouseNotes} onChange={(v) => onUpdate({ showClubhouseNotes: v })} />
      <Toggle
        label="顯示 Communal Garden / Play Area Notes"
        checked={settings.showCommunalGardenNotes}
        onChange={(v) => onUpdate({ showCommunalGardenNotes: v })}
      />
      <Toggle label="顯示 CPS Remarks" checked={settings.showCpsRemarks} onChange={(v) => onUpdate({ showCpsRemarks: v })} />
      <Toggle
        label="隱藏沒有資料的戶型"
        checked={settings.hideEmptyUnitTypes}
        onChange={(v) => onUpdate({ hideEmptyUnitTypes: v })}
      />
      <Toggle
        label="顯示 Inventory Percentage"
        checked={settings.showInventoryPercentage}
        onChange={(v) => onUpdate({ showInventoryPercentage: v })}
      />
      <Toggle label="顯示 Total Percentage" checked={settings.showTotalPercentage} onChange={(v) => onUpdate({ showTotalPercentage: v })} />
      <Toggle label="顯示地區 District" checked={settings.showDistrict} onChange={(v) => onUpdate({ showDistrict: v })} />

      <div className="col-span-full mt-2 grid gap-3 border-t border-slate-100 pt-3 sm:grid-cols-2 dark:border-slate-800">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Table Density</label>
          <select
            value={settings.density}
            onChange={(e) => onUpdate({ density: e.target.value as ComparisonSettingsType['density'] })}
            className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <option value="comfortable">Comfortable</option>
            <option value="compact">Compact</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Header Language</label>
          <select
            value={settings.headerLanguage}
            onChange={(e) => onUpdate({ headerLanguage: e.target.value as ComparisonSettingsType['headerLanguage'] })}
            className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <option value="zh">中文</option>
            <option value="en">English</option>
            <option value="both">中英雙語</option>
          </select>
        </div>
      </div>
    </div>
  );
}
