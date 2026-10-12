import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, Eye, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Project } from '@/types/project';
import { getDeveloperDisplay, getDistrictDisplay, formatAreaSqFt } from '@/lib/formatters';
import { calculateTotalInventory, calculateUnitsPerResidentSpace, formatUnitsPerResidentSpace } from '@/lib/calculations';
import { mapInventoryData } from '@/lib/comparison';
import { deleteProject, duplicateProject } from '@/db/projectRepository';
import { useSelectionContext } from '@/context/SelectionContext';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { MAX_SELECTION } from '@/lib/constants';

export function ProjectTable({ projects }: { projects: Project[] }) {
  const { selectedIds, toggle } = useSelectionContext();
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const handleDuplicate = async (id: string) => {
    await duplicateProject(id);
    toast.success('樓盤資料已複製');
  };

  const handleDelete = async () => {
    if (!pendingDeleteId) return;
    await deleteProject(pendingDeleteId);
    setPendingDeleteId(null);
    toast.success('樓盤資料已刪除');
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <table className="w-full min-w-[1400px] border-collapse text-sm">
        <thead className="sticky top-0 z-10 bg-slate-100 text-left text-xs font-semibold uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          <tr>
            <th className="px-3 py-2.5"></th>
            <th className="px-3 py-2.5">中文名稱</th>
            <th className="px-3 py-2.5">英文名稱</th>
            <th className="px-3 py-2.5">發展商</th>
            <th className="px-3 py-2.5">地區</th>
            <th className="px-3 py-2.5">細分地區</th>
            <th className="px-3 py-2.5 text-right">Studio</th>
            <th className="px-3 py-2.5 text-right">1房</th>
            <th className="px-3 py-2.5 text-right">2房</th>
            <th className="px-3 py-2.5 text-right">3房</th>
            <th className="px-3 py-2.5 text-right">4房</th>
            <th className="px-3 py-2.5 text-right">Total Inventory</th>
            <th className="px-3 py-2.5">Clubhouse</th>
            <th className="px-3 py-2.5">Communal Garden</th>
            <th className="px-3 py-2.5 text-right">CPS Resident</th>
            <th className="px-3 py-2.5 text-right">CPS Total Units</th>
            <th className="px-3 py-2.5 text-right">Units/Space</th>
            <th className="px-3 py-2.5">更新日期</th>
            <th className="px-3 py-2.5">操作</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => {
            const checked = selectedIds.includes(p.id);
            const total = calculateTotalInventory(mapInventoryData(p));
            const unitsPerSpace = calculateUnitsPerResidentSpace(
              p.parking.totalResidentialUnits,
              p.parking.residentParkingSpaces,
            );
            return (
              <tr
                key={p.id}
                className="border-b border-slate-100 last:border-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
              >
                <td className="px-3 py-2.5">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {
                      if (!checked && selectedIds.length >= MAX_SELECTION) {
                        toast.error(`最多只能選擇 ${MAX_SELECTION} 個樓盤`);
                        return;
                      }
                      toggle(p.id);
                    }}
                    aria-label={`勾選 ${p.projectNameZh || p.projectNameEn || '樓盤'}`}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="px-3 py-2.5 font-medium text-slate-800 dark:text-slate-100">
                  {p.projectNameZh || '—'}
                  {p.isDemo && <span className="ml-1 rounded bg-amber-100 px-1 text-[10px] text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">示範</span>}
                </td>
                <td className="px-3 py-2.5 text-slate-600 dark:text-slate-300">{p.projectNameEn || '—'}</td>
                <td className="px-3 py-2.5 text-slate-600 dark:text-slate-300">{getDeveloperDisplay(p)}</td>
                <td className="px-3 py-2.5 text-slate-600 dark:text-slate-300">{getDistrictDisplay(p)}</td>
                <td className="px-3 py-2.5 text-slate-600 dark:text-slate-300">{p.districtDetail || '—'}</td>
                <td className="px-3 py-2.5 text-right">{p.unitTypes.studio.inventoryCount ?? '—'}</td>
                <td className="px-3 py-2.5 text-right">{p.unitTypes.oneBedroom.inventoryCount ?? '—'}</td>
                <td className="px-3 py-2.5 text-right">{p.unitTypes.twoBedrooms.inventoryCount ?? '—'}</td>
                <td className="px-3 py-2.5 text-right">{p.unitTypes.threeBedrooms.inventoryCount ?? '—'}</td>
                <td className="px-3 py-2.5 text-right">{p.unitTypes.fourBedrooms.inventoryCount ?? '—'}</td>
                <td className="px-3 py-2.5 text-right font-medium">{total == null ? '—' : total.toLocaleString('en-US')}</td>
                <td className="px-3 py-2.5 text-slate-600 dark:text-slate-300">
                  {formatAreaSqFt(p.clubhouse.clubhouseAreaSqFt, p.clubhouse.clubhouseAreaDisplayOverride)}
                </td>
                <td className="px-3 py-2.5 text-slate-600 dark:text-slate-300">
                  {formatAreaSqFt(p.clubhouse.communalGardenOrPlayAreaSqFt, p.clubhouse.communalGardenOrPlayAreaDisplayOverride)}
                </td>
                <td className="px-3 py-2.5 text-right">{p.parking.residentParkingSpaces ?? '—'}</td>
                <td className="px-3 py-2.5 text-right">{p.parking.totalResidentialUnits ?? '—'}</td>
                <td className="px-3 py-2.5 text-right">{formatUnitsPerResidentSpace(unitsPerSpace)}</td>
                <td className="px-3 py-2.5 text-slate-500 dark:text-slate-400">
                  {new Date(p.updatedAt).toLocaleDateString('zh-HK')}
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-1">
                    <Link
                      to={`/projects/${p.id}`}
                      aria-label="查看"
                      className="inline-flex h-7 w-7 items-center justify-center rounded text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
                    >
                      <Eye size={15} />
                    </Link>
                    <Link
                      to={`/projects/${p.id}/edit`}
                      aria-label="編輯"
                      className="inline-flex h-7 w-7 items-center justify-center rounded text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                    >
                      <Pencil size={15} />
                    </Link>
                    <button
                      type="button"
                      aria-label="複製"
                      onClick={() => handleDuplicate(p.id)}
                      className="inline-flex h-7 w-7 items-center justify-center rounded text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
                    >
                      <Copy size={15} />
                    </button>
                    <button
                      type="button"
                      aria-label="刪除"
                      onClick={() => setPendingDeleteId(p.id)}
                      className="inline-flex h-7 w-7 items-center justify-center rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <ConfirmModal
        open={!!pendingDeleteId}
        title="確定要刪除此樓盤資料嗎？"
        description="此操作無法復原。"
        onConfirm={handleDelete}
        onCancel={() => setPendingDeleteId(null)}
      />
    </div>
  );
}
