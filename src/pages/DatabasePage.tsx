import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Table2, XCircle } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { useProjectFilters } from '@/hooks/useProjectFilters';
import { useSelectionContext } from '@/context/SelectionContext';
import { ProjectFilters } from '@/components/projects/ProjectFilters';
import { ProjectTable } from '@/components/projects/ProjectTable';
import { DemoDataActions } from '@/components/projects/DemoDataActions';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingState } from '@/components/common/LoadingState';
import { MAX_SELECTION } from '@/lib/constants';

export default function DatabasePage() {
  const { projects, isLoading } = useProjects();
  const navigate = useNavigate();
  const {
    keyword,
    setKeyword,
    developer,
    setDeveloper,
    district,
    setDistrict,
    districtDetail,
    setDistrictDetail,
    filteredProjects,
  } = useProjectFilters(projects);
  const { selectedIds, clear } = useSelectionContext();

  const validIds = useMemo(() => new Set(projects.map((p) => p.id)), [projects]);
  const effectiveSelectedCount = selectedIds.filter((id) => validIds.has(id)).length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">樓盤資料庫</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">管理及比較香港樓盤資料，所有資料只儲存於本機瀏覽器。</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <DemoDataActions />
          <button
            type="button"
            onClick={() => navigate('/projects/new')}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <PlusCircle size={16} /> 新增樓盤
          </button>
        </div>
      </div>

      <ProjectFilters
        keyword={keyword}
        onKeywordChange={setKeyword}
        developer={developer}
        onDeveloperChange={setDeveloper}
        district={district}
        onDistrictChange={setDistrict}
        districtDetail={districtDetail}
        onDistrictDetailChange={setDistrictDetail}
        resultCount={filteredProjects.length}
      />

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
          已選 {effectiveSelectedCount} / {MAX_SELECTION}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={clear}
            disabled={effectiveSelectedCount === 0}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <XCircle size={15} /> 清除選擇
          </button>
          <button
            type="button"
            onClick={() => navigate('/comparison')}
            disabled={effectiveSelectedCount === 0}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <Table2 size={15} /> 產生比較表
          </button>
        </div>
      </div>

      {isLoading ? (
        <LoadingState label="正在載入樓盤資料…" />
      ) : projects.length === 0 ? (
        <EmptyState
          title="目前尚未有樓盤資料"
          description="按「新增樓盤」開始建立資料，或載入示範資料快速體驗。"
          action={
            <button
              type="button"
              onClick={() => navigate('/projects/new')}
              className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <PlusCircle size={16} /> 新增樓盤
            </button>
          }
        />
      ) : filteredProjects.length === 0 ? (
        <EmptyState title="找不到符合條件的樓盤" description="請嘗試調整搜尋關鍵字或篩選條件。" />
      ) : (
        <ProjectTable projects={filteredProjects} />
      )}
    </div>
  );
}
