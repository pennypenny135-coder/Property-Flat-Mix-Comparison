import { Controller, useFieldArray, useWatch, type Control, type FieldErrors } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { generateId } from '@/lib/ids';
import { calculateUnitsPerResidentSpace, formatUnitsPerResidentSpace } from '@/lib/calculations';
import type { ProjectFormValues } from '@/lib/validators';

const inputCls =
  'w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100';
const labelCls = 'mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300';

export function ParkingFormSection({
  control,
  errors,
}: {
  control: Control<ProjectFormValues>;
  errors: FieldErrors<ProjectFormValues>;
}) {
  const { fields, append, remove } = useFieldArray({ control, name: 'parking.customItems' });
  const totalUnits = useWatch({ control, name: 'parking.totalResidentialUnits' });
  const residentSpaces = useWatch({ control, name: 'parking.residentParkingSpaces' });
  const unitsPerSpace = calculateUnitsPerResidentSpace(totalUnits, residentSpaces);

  return (
    <section className="space-y-5 rounded-xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900">
      <div>
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">CPS / Car Parking Spaces</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className={labelCls}>Resident Parking Spaces</label>
          <Controller
            control={control}
            name="parking.residentParkingSpaces"
            render={({ field }) => (
              <input
                type="number"
                min={0}
                step={1}
                className={inputCls}
                value={field.value ?? ''}
                onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
              />
            )}
          />
          {errors.parking?.residentParkingSpaces && (
            <p className="mt-1 text-xs text-red-500">{errors.parking.residentParkingSpaces.message}</p>
          )}
        </div>
        <div>
          <label className={labelCls}>Others</label>
          <Controller
            control={control}
            name="parking.others"
            render={({ field }) => (
              <input
                type="number"
                min={0}
                step={1}
                className={inputCls}
                value={field.value ?? ''}
                onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
              />
            )}
          />
        </div>
        <div>
          <label className={labelCls}>Total No. of Residential Units</label>
          <Controller
            control={control}
            name="parking.totalResidentialUnits"
            render={({ field }) => (
              <input
                type="number"
                min={0}
                step={1}
                className={inputCls}
                value={field.value ?? ''}
                onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
              />
            )}
          />
        </div>
        <div>
          <label className={labelCls}>Units per Resident Space（自動計算）</label>
          <div className="flex h-[34px] items-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-2.5 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
            {formatUnitsPerResidentSpace(unitsPerSpace)}
          </div>
        </div>
      </div>

      <div>
        <label className={labelCls}>Remarks</label>
        <Controller
          control={control}
          name="parking.remarks"
          render={({ field }) => (
            <textarea rows={2} className={inputCls} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value)} />
          )}
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">自訂車位項目</p>
          <button
            type="button"
            onClick={() => append({ id: generateId(), name: '', count: null, notes: '', isRequired: false })}
            className="inline-flex items-center gap-1 rounded-lg border border-blue-300 px-2.5 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-500/10"
          >
            <Plus size={14} /> 新增自訂車位項目
          </button>
        </div>

        {fields.length === 0 && (
          <p className="text-xs text-slate-400">尚未新增自訂車位項目。</p>
        )}

        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-1 gap-2 rounded-lg border border-slate-100 p-3 sm:grid-cols-[1.5fr_1fr_1.5fr_auto] dark:border-slate-800">
              <div>
                <label className={labelCls}>項目名稱</label>
                <Controller
                  control={control}
                  name={`parking.customItems.${index}.name`}
                  render={({ field: f }) => (
                    <input className={inputCls} value={f.value ?? ''} onChange={(e) => f.onChange(e.target.value)} />
                  )}
                />
                {errors.parking?.customItems?.[index]?.name && (
                  <p className="mt-1 text-xs text-red-500">{errors.parking.customItems[index]?.name?.message}</p>
                )}
              </div>
              <div>
                <label className={labelCls}>數量</label>
                <Controller
                  control={control}
                  name={`parking.customItems.${index}.count`}
                  render={({ field: f }) => (
                    <input
                      type="number"
                      min={0}
                      step={1}
                      className={inputCls}
                      value={f.value ?? ''}
                      onChange={(e) => f.onChange(e.target.value === '' ? null : Number(e.target.value))}
                    />
                  )}
                />
              </div>
              <div>
                <label className={labelCls}>備註</label>
                <Controller
                  control={control}
                  name={`parking.customItems.${index}.notes`}
                  render={({ field: f }) => (
                    <input className={inputCls} value={f.value ?? ''} onChange={(e) => f.onChange(e.target.value)} />
                  )}
                />
              </div>
              <div className="flex items-end justify-end">
                <button
                  type="button"
                  onClick={() => remove(index)}
                  aria-label="刪除此項目"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:hover:bg-red-500/10"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
