import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useProject } from '@/hooks/useProject';
import { ProjectForm } from '@/components/projects/ProjectForm';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { addProject, duplicateProject, updateProject } from '@/db/projectRepository';
import { createEmptyProject } from '@/types/project';
import { projectToFormValues, formValuesToProject } from '@/lib/projectMapping';
import type { ProjectFormValues } from '@/lib/validators';

function ViewOnlyNotice({ onEdit }: { onEdit: () => void }) {
  return (
    <div className="mb-4 flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
      <span>目前為查看模式，欄位已鎖定。</span>
      <button type="button" onClick={onEdit} className="font-semibold underline">
        切換至編輯
      </button>
    </div>
  );
}

export default function ProjectFormPage({ mode }: { mode: 'new' | 'edit' | 'view' }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { project, isLoading } = useProject(mode === 'new' ? undefined : id);

  if (mode !== 'new' && isLoading) return <LoadingState label="正在載入樓盤資料…" />;
  if (mode !== 'new' && !project) return <ErrorState message="找不到此樓盤資料，可能已被刪除。" />;

  const defaultValues: ProjectFormValues = projectToFormValues(mode === 'new' ? createEmptyProject() : project!);

  const handleSave = async (values: ProjectFormValues) => {
    try {
      if (mode === 'new') {
        await addProject(formValuesToProject(values));
        toast.success('樓盤資料已儲存');
        navigate('/');
      } else {
        await updateProject(formValuesToProject(values, project));
        toast.success('樓盤資料已儲存');
        navigate('/');
      }
    } catch (e) {
      toast.error(`儲存失敗：${String(e)}`);
    }
  };

  const handleSaveAndNext = async (values: ProjectFormValues) => {
    try {
      await addProject(formValuesToProject(values));
      toast.success('樓盤資料已儲存，可繼續新增下一個');
    } catch (e) {
      toast.error(`儲存失敗：${String(e)}`);
    }
  };

  const handleDuplicate = async () => {
    if (!project) return;
    const copy = await duplicateProject(project.id);
    if (copy) {
      toast.success('樓盤資料已複製');
      navigate(`/projects/${copy.id}/edit`);
    }
  };

  const titleMap = { new: '新增樓盤', edit: '編輯樓盤', view: '查看樓盤' };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">{titleMap[mode]}</h1>
      </div>
      {mode === 'view' && project && <ViewOnlyNotice onEdit={() => navigate(`/projects/${project.id}/edit`)} />}
      {mode === 'view' ? (
        <fieldset disabled className="opacity-90">
          <ProjectForm
            mode="edit"
            defaultValues={defaultValues}
            handlers={{
              onSave: () => {},
              onCancel: () => navigate('/'),
            }}
          />
        </fieldset>
      ) : (
        <ProjectForm
          mode={mode}
          defaultValues={defaultValues}
          handlers={{
            onSave: handleSave,
            onSaveAndNext: mode === 'new' ? handleSaveAndNext : undefined,
            onDuplicate: mode === 'edit' ? handleDuplicate : undefined,
            onCancel: () => navigate('/'),
          }}
        />
      )}
    </div>
  );
}
