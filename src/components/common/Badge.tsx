import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  danger: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400',
  info: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
};

export function Badge({ children, variant = 'default', className }: { children: ReactNode; variant?: BadgeVariant; className?: string }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', VARIANT_CLASSES[variant], className)}>
      {children}
    </span>
  );
}
