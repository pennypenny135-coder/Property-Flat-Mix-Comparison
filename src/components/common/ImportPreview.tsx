import type { ImportPreviewResult } from '@/types/backup';

export function ImportPreview({ result }: { result: ImportPreviewResult }) {
  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        <Stat label="檔案名稱" value={result.fileName} />
        <Stat label="檔案類型" value={result.fileType.toUpperCase()} />
        <Stat label="樓盤總數" value={String(result.totalCount)} />
        <Stat label="可新增數量" value={String(result.newCount)} />
        <Stat label="可能重複數量" value={String(result.duplicateCount)} />
        <Stat label="無效資料數量" value={String(result.invalidCount)} />
      </div>
      {(result.legacyPercentageFound || result.legacyUnitsPerSpaceFound) && (
        <div className="rounded-lg bg-amber-50 p-3 text-xs text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
          {result.legacyPercentageFound && <p>偵測到舊有 inventoryPercentage 欄位，已自動忽略並會重新計算。</p>}
          {result.legacyUnitsPerSpaceFound && (
            <p>偵測到舊有 unitsPerResidentSpace 欄位，已自動忽略並會重新計算。</p>
          )}
        </div>
      )}
      {result.errors.length > 0 && (
        <div className="rounded-lg bg-red-50 p-3 text-xs text-red-700 dark:bg-red-500/10 dark:text-red-400">
          <p className="mb-1 font-medium">驗證錯誤：</p>
          <ul className="list-inside list-disc space-y-0.5">
            {result.errors.slice(0, 20).map((err, idx) => (
              <li key={idx}>
                {err.identifier}：{err.reason}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      <p className="truncate font-medium text-slate-800 dark:text-slate-100">{value}</p>
    </div>
  );
}
