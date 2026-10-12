import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import type { ProjectFormValues } from '@/lib/validators';

const inputCls =
  'w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100';
const labelCls = 'mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300';

export function ClubhouseFormSection({
  control,
  errors,
}: {
  control: Control<ProjectFormValues>;
  errors: FieldErrors<ProjectFormValues>;
}) {
  return (
    <section className="space-y-5 rounded-xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900">
      <div>
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Clubhouse 及公共空間資料</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-3 rounded-lg border border-slate-100 p-3 dark:border-slate-800">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Clubhouse Area</p>
          <div>
            <label className={labelCls}>面積 (sq. ft.)</label>
            <Controller
              control={control}
              name="clubhouse.clubhouseAreaSqFt"
              render={({ field }) => (
                <input
                  type="number"
                  className={inputCls}
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                />
              )}
            />
            {errors.clubhouse?.clubhouseAreaSqFt && (
              <p className="mt-1 text-xs text-red-500">{errors.clubhouse.clubhouseAreaSqFt.message}</p>
            )}
          </div>
          <div>
            <label className={labelCls}>自訂顯示文字</label>
            <Controller
              control={control}
              name="clubhouse.clubhouseAreaDisplayOverride"
              render={({ field }) => (
                <input className={inputCls} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value)} />
              )}
            />
          </div>
          <div>
            <label className={labelCls}>備註</label>
            <Controller
              control={control}
              name="clubhouse.clubhouseNotes"
              render={({ field }) => (
                <textarea
                  rows={2}
                  className={inputCls}
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
          </div>
        </div>

        <div className="space-y-3 rounded-lg border border-slate-100 p-3 dark:border-slate-800">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Communal Garden or Play Area</p>
          <div>
            <label className={labelCls}>面積 (sq. ft.)</label>
            <Controller
              control={control}
              name="clubhouse.communalGardenOrPlayAreaSqFt"
              render={({ field }) => (
                <input
                  type="number"
                  className={inputCls}
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                />
              )}
            />
            {errors.clubhouse?.communalGardenOrPlayAreaSqFt && (
              <p className="mt-1 text-xs text-red-500">{errors.clubhouse.communalGardenOrPlayAreaSqFt.message}</p>
            )}
          </div>
          <div>
            <label className={labelCls}>自訂顯示文字</label>
            <Controller
              control={control}
              name="clubhouse.communalGardenOrPlayAreaDisplayOverride"
              render={({ field }) => (
                <input className={inputCls} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value)} />
              )}
            />
          </div>
          <div>
            <label className={labelCls}>備註</label>
            <Controller
              control={control}
              name="clubhouse.communalGardenOrPlayAreaNotes"
              render={({ field }) => (
                <textarea
                  rows={2}
                  className={inputCls}
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
