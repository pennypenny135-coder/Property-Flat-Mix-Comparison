import { useState } from 'react';
import { toast } from 'sonner';
import { DownloadCloud, UploadCloud, Trash2, FileSpreadsheet } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { getAllSettings } from '@/db/settingsRepository';
import { bulkImportProjects, clearAllProjects, getAllProjects } from '@/db/projectRepository';
import { createBackup, parseBackupJson, findDuplicate } from '@/lib/backup';
import { projectsToCsv, csvToProjects } from '@/lib/csv';
import { exportAllDataExcel } from '@/lib/excelExport';
import { FileDropzone } from '@/components/common/FileDropzone';
import { ImportPreview } from '@/components/common/ImportPreview';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import type { ImportMode, ImportPreviewResult } from '@/types/backup';
import type { Project } from '@/types/project';
import { BACKUP_APP_NAME, BACKUP_VERSION } from '@/types/backup';

type PendingImport = {
  result: ImportPreviewResult;
};

export default function BackupPage() {
  const { projects } = useProjects();
  const [pending, setPending] = useState<PendingImport | null>(null);
  const [importMode, setImportMode] = useState<ImportMode>('merge');
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [confirmReplaceOpen, setConfirmReplaceOpen] = useState(false);

  const handleExportJson = async () => {
    const settings = await getAllSettings();
    const backup = createBackup(projects, settings);
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    downloadBlob(blob, `property-backup-${timestamp()}.json`);
    toast.success('JSON Backup 已匯出');
  };

  const handleExportCsv = () => {
    const csv = projectsToCsv(projects);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, `property-all-data-${timestamp()}.csv`);
    toast.success('CSV 已匯出');
  };

  const handleExportAllExcel = () => {
    exportAllDataExcel(projects);
    toast.success('Excel 已匯出');
  };

  const handleClearAll = async () => {
    await clearAllProjects();
    setConfirmClearOpen(false);
    toast.success('所有本機資料已清除');
  };

  const buildPreview = async (
    fileName: string,
    fileType: 'json' | 'csv',
    validProjects: Project[],
    errors: { index: number; identifier: string; reason: string }[],
    legacyPercentageFound: boolean,
    legacyUnitsPerSpaceFound: boolean,
  ) => {
    const existing = await getAllProjects();
    const duplicateIds: string[] = [];
    let duplicateCount = 0;
    for (const p of validProjects) {
      const dup = findDuplicate(p, existing);
      if (dup) {
        duplicateCount += 1;
        duplicateIds.push(dup.id);
      }
    }
    const result: ImportPreviewResult = {
      fileName,
      fileType,
      totalCount: validProjects.length + errors.length,
      newCount: validProjects.length - duplicateCount,
      duplicateCount,
      invalidCount: errors.length,
      errors,
      legacyPercentageFound,
      legacyUnitsPerSpaceFound,
      validProjects,
      duplicateIds,
    };
    setPending({ result });
  };

  const handleJsonFile = async (file: File) => {
    const text = await file.text();
    const { projects: parsed, errors } = parseBackupJson(text);
    const legacyPercentageFound = parsed.some((p) => p.legacyPercentage);
    const legacyUnitsPerSpaceFound = parsed.some((p) => p.legacyUnitsPerSpace);
    await buildPreview(
      file.name,
      'json',
      parsed.map((p) => p.project),
      errors,
      legacyPercentageFound,
      legacyUnitsPerSpaceFound,
    );
  };

  const handleCsvFile = async (file: File) => {
    const text = await file.text();
    const { projects: parsed, errors } = csvToProjects(text);
    await buildPreview(file.name, 'csv', parsed, errors, false, false);
  };

  const runImport = async () => {
    if (!pending) return;
    const { result } = pending;

    if (importMode === 'replace') {
      await clearAllProjects();
      await bulkImportProjects(result.validProjects);
      toast.success(`已匯入 ${result.validProjects.length} 個樓盤（取代模式）`);
    } else {
      const existing = await getAllProjects();
      const toPut: Project[] = [];
      let skipped = 0;
      for (const p of result.validProjects) {
        const dup = findDuplicate(p, existing);
        if (dup) {
          toPut.push({ ...p, id: dup.id });
        } else {
          toPut.push(p);
        }
      }
      await bulkImportProjects(toPut);
      toast.success(`已匯入 ${toPut.length} 個樓盤（合併模式），略過 ${skipped} 個重複項目`);
    }
    setPending(null);
    setConfirmReplaceOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Backup / 匯入匯出</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          所有資料僅儲存在您的瀏覽器本機 IndexedDB，匯出的檔案不會上傳到任何伺服器。
        </p>
      </div>

      <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">匯出</h2>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleExportJson}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <DownloadCloud size={15} /> Export Backup JSON
          </button>
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <DownloadCloud size={15} /> Export CSV
          </button>
          <button
            type="button"
            onClick={handleExportAllExcel}
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 px-3 py-1.5 text-sm font-medium text-emerald-700 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-500/10"
          >
            <FileSpreadsheet size={15} /> Export All Data Excel
          </button>
        </div>
      </section>

      <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">匯入</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-medium text-slate-500 dark:text-slate-400">JSON Backup</p>
            <FileDropzone accept="application/json" onFile={handleJsonFile} label="拖放或選擇 JSON Backup 檔案" />
          </div>
          <div>
            <p className="mb-2 text-xs font-medium text-slate-500 dark:text-slate-400">CSV</p>
            <FileDropzone accept=".csv,text/csv" onFile={handleCsvFile} label="拖放或選擇 CSV 檔案" />
          </div>
        </div>

        {pending && (
          <div className="space-y-3">
            <ImportPreview result={pending.result} />
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-1.5 text-sm">
                <input
                  type="radio"
                  checked={importMode === 'merge'}
                  onChange={() => setImportMode('merge')}
                  className="h-4 w-4"
                />
                Merge（保留現有資料）
              </label>
              <label className="flex items-center gap-1.5 text-sm">
                <input
                  type="radio"
                  checked={importMode === 'replace'}
                  onChange={() => setImportMode('replace')}
                  className="h-4 w-4"
                />
                Replace（清除後匯入）
              </label>
              <div className="ml-auto flex gap-2">
                <button
                  type="button"
                  onClick={() => setPending(null)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={() => (importMode === 'replace' ? setConfirmReplaceOpen(true) : runImport())}
                  disabled={pending.result.validProjects.length === 0}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  <UploadCloud size={15} /> 確認匯入
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="space-y-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
        <h2 className="text-base font-semibold text-red-700 dark:text-red-400">清除本機資料</h2>
        <p className="text-sm text-red-600 dark:text-red-400">
          此操作會刪除所有已儲存的樓盤資料，建議先匯出備份。
        </p>
        <button
          type="button"
          onClick={() => setConfirmClearOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-700"
        >
          <Trash2 size={15} /> Clear All Local Data
        </button>
      </section>

      <p className="text-xs text-slate-400">
        {BACKUP_APP_NAME} · Backup Format Version {BACKUP_VERSION}
      </p>

      <ConfirmModal
        open={confirmClearOpen}
        title="確定要清除所有本機資料嗎？"
        description="此操作無法復原，建議先匯出 JSON Backup。"
        onConfirm={handleClearAll}
        onCancel={() => setConfirmClearOpen(false)}
      />
      <ConfirmModal
        open={confirmReplaceOpen}
        title="確定要以 Replace 模式匯入嗎？"
        description="系統將會先清除所有現有資料，再匯入檔案中的有效資料，此操作無法復原。"
        onConfirm={runImport}
        onCancel={() => setConfirmReplaceOpen(false)}
      />
    </div>
  );
}

function timestamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
