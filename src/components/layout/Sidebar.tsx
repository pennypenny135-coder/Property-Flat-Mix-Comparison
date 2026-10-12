import { NavLink } from 'react-router-dom';
import { Building2, PlusCircle, Table2, DatabaseBackup, HelpCircle } from 'lucide-react';
import { cn } from '@/utils/cn';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { OnlineStatus } from '@/components/layout/OnlineStatus';
import { useSelectionContext } from '@/context/SelectionContext';
import { APP_NAME, MAX_SELECTION } from '@/lib/constants';

const NAV_ITEMS = [
  { to: '/', label: '樓盤資料庫', icon: Building2 },
  { to: '/projects/new', label: '新增樓盤', icon: PlusCircle },
  { to: '/comparison', label: '比較表', icon: Table2 },
  { to: '/backup', label: 'Backup / 匯入匯出', icon: DatabaseBackup },
  { to: '/help', label: '使用說明', icon: HelpCircle },
];

export function Sidebar() {
  const { selectedIds } = useSelectionContext();
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex dark:border-slate-800 dark:bg-slate-900">
      <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-5 dark:border-slate-800">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
          HK
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{APP_NAME}</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                isActive
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
              )
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="space-y-3 border-t border-slate-200 p-4 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            已選 {selectedIds.length} / {MAX_SELECTION}
          </span>
          <ThemeToggle />
        </div>
        <OnlineStatus className="w-full justify-center" />
      </div>
    </aside>
  );
}
