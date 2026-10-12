import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { formatProjectHeader } from '@/lib/formatters';
import type { Project } from '@/types/project';
import type { HeaderLanguage } from '@/types/settings';

export function DraggableProjectHeader({
  project,
  index,
  headerLanguage,
}: {
  project: Project;
  index: number;
  headerLanguage: HeaderLanguage;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: project.id });
  const { primary, secondary } = formatProjectHeader(project, headerLanguage);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex min-w-[160px] items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
        isDragging
          ? 'z-10 border-blue-400 bg-blue-50 shadow-lg dark:border-blue-600 dark:bg-blue-500/10'
          : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800'
      }`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label={`拖曳排序 ${primary}`}
        className="cursor-grab touch-none text-slate-400 hover:text-slate-600 active:cursor-grabbing dark:hover:text-slate-200"
      >
        <GripVertical size={16} />
      </button>
      <div className="min-w-0 leading-tight">
        <p className="truncate font-medium text-slate-800 dark:text-slate-100">
          {index + 1}. {primary}
        </p>
        {secondary && <p className="truncate text-xs text-slate-500 dark:text-slate-400">{secondary}</p>}
      </div>
    </div>
  );
}
