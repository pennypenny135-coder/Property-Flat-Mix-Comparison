import { OctagonAlert } from 'lucide-react';

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center dark:border-red-900 dark:bg-red-950/30">
      <OctagonAlert className="text-red-500" size={24} />
      <p className="text-sm text-red-700 dark:text-red-400">{message}</p>
    </div>
  );
}
