import { Wifi, WifiOff } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { cn } from '@/utils/cn';

export function OnlineStatus({ className }: { className?: string }) {
  const online = useOnlineStatus();
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
        online
          ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
          : 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400',
        className,
      )}
    >
      {online ? <Wifi size={14} /> : <WifiOff size={14} />}
      {online ? 'Online' : 'Offline'}
    </span>
  );
}
