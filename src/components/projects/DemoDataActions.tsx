import { useState } from 'react';
import { Sparkles, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { bulkImportProjects, deleteDemoProjects } from '@/db/projectRepository';
import { getDemoProjects } from '@/lib/demoData';
import { ConfirmModal } from '@/components/common/ConfirmModal';

export function DemoDataActions() {
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const handleLoadDemo = async () => {
    await bulkImportProjects(getDemoProjects());
    toast.success('示範資料已載入');
  };

  const handleDeleteDemo = async () => {
    await deleteDemoProjects();
    setConfirmDeleteOpen(false);
    toast.success('示範資料已刪除');
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={handleLoadDemo}
        className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700 hover:bg-amber-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400 dark:hover:bg-amber-900"
      >
        <Sparkles size={15} /> 載入示範資料
      </button>
      <button
        type="button"
        onClick={() => setConfirmDeleteOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        <Trash2 size={15} /> 刪除示範資料
      </button>
      <ConfirmModal
        open={confirmDeleteOpen}
        title="確定要刪除所有示範資料嗎？"
        description="此操作只會刪除標記為示範資料的樓盤，不會影響您自行建立的資料。"
        onConfirm={handleDeleteDemo}
        onCancel={() => setConfirmDeleteOpen(false)}
      />
    </div>
  );
}
