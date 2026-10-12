import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useProjects } from '@/hooks/useProjects';
import { useSelectionContext } from '@/context/SelectionContext';
import { useComparisonSettings } from '@/hooks/useComparisonSettings';
import { sortProjects } from '@/lib/sorting';
import { SORT_OPTIONS } from '@/lib/constants';
import { exportComparisonExcel } from '@/lib/excelExport';
import { projectsToCsv } from '@/lib/csv';
import { EmptyState } from '@/components/common/EmptyState';
import { ComparisonControls } from '@/components/comparison/ComparisonControls';
import { ComparisonSettingsPanel } from '@/components/comparison/ComparisonSettings';
import { DraggableProjectHeader } from '@/components/comparison/DraggableProjectHeader';
import { SaleableAreaTable } from '@/components/tables/SaleableAreaTable';
import { InventoryTable } from '@/components/tables/InventoryTable';
import { ParkingComparisonTable } from '@/components/tables/ParkingComparisonTable';

export default function ComparisonPage() {
  const navigate = useNavigate();
  const { projects } = useProjects();
  const { selectedIds } = useSelectionContext();
  const { settings, update } = useComparisonSettings();
  const [showSettings, setShowSettings] = useState(false);

  const selectedProjects = useMemo(
    () => selectedIds.map((id) => projects.find((p) => p.id === id)).filter((p): p is NonNullable<typeof p> => !!p),
    [selectedIds, projects],
  );

  const orderedProjects = useMemo(
    () =>
      sortProjects(
        selectedProjects,
        settings.sortKey,
        settings.sortDirection,
        selectedIds,
        settings.customOrder.length ? settings.customOrder : selectedIds,
      ),
    [selectedProjects, settings.sortKey, settings.sortDirection, settings.customOrder, selectedIds],
  );

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const ids = orderedProjects.map((p) => p.id);
    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    const newOrder = arrayMove(ids, oldIndex, newIndex);
    update({ sortKey: 'custom', customOrder: newOrder });
  };

  const sortLabel = SORT_OPTIONS.find((o) => o.value === settings.sortKey)?.label || settings.sortKey;

  const handleExportExcel = () => {
    if (orderedProjects.length === 0) return;
    exportComparisonExcel(orderedProjects, settings, sortLabel);
    toast.success('Excel 已匯出');
  };

  const handleExportCsv = () => {
    if (orderedProjects.length === 0) return;
    const csv = projectsToCsv(orderedProjects);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `property-comparison-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV 已匯出');
  };

  if (selectedIds.length === 0) {
    return (
      <EmptyState
        title="請先從樓盤資料庫選擇 1 至 10 個樓盤"
        action={
          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            前往樓盤資料庫
          </button>
        }
      />
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">比較表</h1>
      </div>

      <ComparisonControls
        selectedCount={orderedProjects.length}
        settings={settings}
        onUpdate={update}
        onToggleSettings={() => setShowSettings((v) => !v)}
        onExportExcel={handleExportExcel}
        onExportCsv={handleExportCsv}
      />

      {showSettings && <ComparisonSettingsPanel settings={settings} onUpdate={update} />}

      <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          拖曳以下樓盤卡片可自訂比較表欄位順序（三個比較表將同步更新）：
        </p>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={orderedProjects.map((p) => p.id)} strategy={horizontalListSortingStrategy}>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {orderedProjects.map((p, idx) => (
                <DraggableProjectHeader key={p.id} project={p} index={idx} headerLanguage={settings.headerLanguage} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      <SaleableAreaTable projects={orderedProjects} settings={settings} />
      <InventoryTable projects={orderedProjects} settings={settings} />
      <ParkingComparisonTable projects={orderedProjects} settings={settings} />
    </div>
  );
}
