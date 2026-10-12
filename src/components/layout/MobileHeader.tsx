import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Building2, PlusCircle, Table2, DatabaseBackup, HelpCircle } from 'lucide-react';
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

export function MobileHeader() {
  const [open, setOpen] = useState(false);
  const { selectedIds } = useSelectionContext();

  return (
    <header className="sticky top-0 z-40 flex flex-col border-b border-slate-200 bg-white lg:hidden dark:border-slate-800 dark:bg-slate-900">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="開啟選單"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{APP_NAME}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            已選 {selectedIds.length}/{MAX_SELECTION}
          </span>
          <ThemeToggle />
        </div>
      </div>
      {open && (
        <nav className="space-y-1 border-t border-slate-200 p-3 dark:border-slate-800">
          <OnlineStatus className="mb-2 w-full justify-center" />
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition',
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
      )}
    </header>
  );
}
