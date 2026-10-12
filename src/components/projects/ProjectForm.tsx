import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Copy, RotateCcw, Save, X } from 'lucide-react';
import { projectFormSchema, type ProjectFormValues } from '@/lib/validators';
import { DEVELOPER_OPTIONS, DISTRICT_OPTIONS } from '@/lib/constants';
import { UnitTypesFormSection } from '@/components/projects/UnitTypesFormSection';
import { ClubhouseFormSection } from '@/components/projects/ClubhouseFormSection';
import { ParkingFormSection } from '@/components/projects/ParkingFormSection';
import { ProjectPreview } from '@/components/projects/ProjectPreview';

const inputCls =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100';
const labelCls = 'mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300';

export type ProjectFormHandlers = {
  onSave: (values: ProjectFormValues) => void | Promise<void>;
  onSaveAndNext?: (values: ProjectFormValues) => void | Promise<void>;
  onCancel: () => void;
  onDuplicate?: () => void;
};

export function ProjectForm({
  defaultValues,
  handlers,
  mode,
}: {
  defaultValues: ProjectFormValues;
  handlers: ProjectFormHandlers;
  mode: 'new' | 'edit';
}) {
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues,
    mode: 'onBlur',
  });

  const developer = watch('developer');
  const district = watch('district');

  const submitAndContinue = handleSubmit(async (values) => {
    if (handlers.onSaveAndNext) {
      await handlers.onSaveAndNext(values);
      reset(defaultValues);
    }
  });

  return (
    <form onSubmit={handleSubmit(handlers.onSave)} className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
      <div className="space-y-6">
        <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">基本資料</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>中文樓盤名稱</label>
              <Controller
                control={control}
                name="projectNameZh"
                render={({ field }) => (
                  <input className={inputCls} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value)} />
                )}
              />
              {errors.projectNameZh && <p className="mt-1 text-xs text-red-500">{errors.projectNameZh.message}</p>}
            </div>
            <div>
              <label className={labelCls}>英文樓盤名稱</label>
              <Controller
                control={control}
                name="projectNameEn"
                render={({ field }) => (
                  <input className={inputCls} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value)} />
                )}
              />
              {errors.projectNameEn && <p className="mt-1 text-xs text-red-500">{errors.projectNameEn.message}</p>}
            </div>

            <div>
              <label className={labelCls}>發展商</label>
              <Controller
                control={control}
                name="developer"
                render={({ field }) => (
                  <select className={inputCls} value={field.value} onChange={(e) => field.onChange(e.target.value)}>
                    {DEVELOPER_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>
            {developer === 'other' && (
              <div>
                <label className={labelCls}>其他發展商名稱</label>
                <Controller
                  control={control}
                  name="developerOther"
                  render={({ field }) => (
                    <input className={inputCls} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value)} />
                  )}
                />
                {errors.developerOther && <p className="mt-1 text-xs text-red-500">{errors.developerOther.message}</p>}
              </div>
            )}

            <div>
              <label className={labelCls}>大區 / 區份</label>
              <Controller
                control={control}
                name="district"
                render={({ field }) => (
                  <select className={inputCls} value={field.value} onChange={(e) => field.onChange(e.target.value)}>
                    {DISTRICT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>
            {district === 'other' && (
              <div>
                <label className={labelCls}>其他地區名稱</label>
                <Controller
                  control={control}
                  name="districtOther"
                  render={({ field }) => (
                    <input className={inputCls} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value)} />
                  )}
                />
                {errors.districtOther && <p className="mt-1 text-xs text-red-500">{errors.districtOther.message}</p>}
              </div>
            )}

            <div>
              <label className={labelCls}>細分地區（可選）</label>
              <Controller
                control={control}
                name="districtDetail"
                render={({ field }) => (
                  <input
                    className={inputCls}
                    placeholder="例如：啟德、將軍澳、康城"
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                )}
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelCls}>一般備註</label>
              <Controller
                control={control}
                name="notes"
                render={({ field }) => (
                  <textarea rows={2} className={inputCls} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value)} />
                )}
              />
            </div>
          </div>
        </section>

        <UnitTypesFormSection control={control} errors={errors} />
        <ClubhouseFormSection control={control} errors={errors} />
        <ParkingFormSection control={control} errors={errors} />

        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50"
          >
            <Save size={16} /> 儲存
          </button>
          {mode === 'new' && handlers.onSaveAndNext && (
            <button
              type="button"
              onClick={submitAndContinue}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 rounded-lg border border-blue-300 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-500/10"
            >
              儲存並新增下一個
            </button>
          )}
          {mode === 'edit' && handlers.onDuplicate && (
            <button
              type="button"
              onClick={handlers.onDuplicate}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Copy size={16} /> 複製目前資料
            </button>
          )}
          <button
            type="button"
            onClick={() => reset(defaultValues)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <RotateCcw size={16} /> 重設
          </button>
          <button
            type="button"
            onClick={handlers.onCancel}
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <X size={16} /> 取消
          </button>
        </div>
      </div>

      <ProjectPreview control={control} />
    </form>
  );
}
