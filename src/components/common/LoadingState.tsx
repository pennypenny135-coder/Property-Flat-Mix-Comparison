import { Loader2 } from 'lucide-react';

export function LoadingState({ label = '載入中…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-16 text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
      <Loader2 className="animate-spin" size={18} />
      <span className="text-sm">{label}</span>
    </div>
  );
}
