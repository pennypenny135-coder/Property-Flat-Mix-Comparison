import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import { UNIT_TYPE_ORDER, UNIT_TYPE_LABELS } from '@/lib/constants';
import type { ProjectFormValues } from '@/lib/validators';

const inputCls =
  'w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:disabled:bg-slate-900';

export function UnitTypesFormSection({
  control,
  errors,
}: {
  control: Control<ProjectFormValues>;
  errors: FieldErrors<ProjectFormValues>;
}) {
  return (
    <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900">
      <div>
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">戶型資料</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          請輸入各戶型的實用面積及單位數量，百分比將於比較表自動計算，不需要手動輸入。
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
              <th className="py-2 pr-2">戶型</th>
              <th className="py-2 pr-2">最小實用面積</th>
              <th className="py-2 pr-2">最大實用面積</th>
              <th className="py-2 pr-2">自訂顯示文字</th>
              <th className="py-2 pr-2">單位數量</th>
            </tr>
          </thead>
          <tbody>
            {UNIT_TYPE_ORDER.map((ut) => {
              const unitErrors = errors.unitTypes?.[ut];
              return (
                <tr key={ut} className="border-b border-slate-100 align-top dark:border-slate-800">
                  <td className="py-2 pr-2 font-medium text-slate-700 dark:text-slate-200">
                    {UNIT_TYPE_LABELS[ut].zh}
                    <div className="text-xs font-normal text-slate-400">{UNIT_TYPE_LABELS[ut].en}</div>
                  </td>
                  <td className="py-2 pr-2">
                    <Controller
                      control={control}
                      name={`unitTypes.${ut}.saleableAreaMin`}
                      render={({ field }) => (
                        <input
                          type="number"
                          className={inputCls}
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                        />
                      )}
                    />
                    {unitErrors?.saleableAreaMin && (
                      <p className="mt-1 text-xs text-red-500">{unitErrors.saleableAreaMin.message}</p>
                    )}
                  </td>
                  <td className="py-2 pr-2">
                    <Controller
                      control={control}
                      name={`unitTypes.${ut}.saleableAreaMax`}
                      render={({ field }) => (
                        <input
                          type="number"
                          className={inputCls}
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                        />
                      )}
                    />
                    {unitErrors?.saleableAreaMax && (
                      <p className="mt-1 text-xs text-red-500">{unitErrors.saleableAreaMax.message}</p>
                    )}
                  </td>
                  <td className="py-2 pr-2">
                    <Controller
                      control={control}
                      name={`unitTypes.${ut}.areaDisplayOverride`}
                      render={({ field }) => (
                        <input
                          type="text"
                          placeholder="例如：待公布"
                          className={inputCls}
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      )}
                    />
                  </td>
                  <td className="py-2 pr-2">
                    <Controller
                      control={control}
                      name={`unitTypes.${ut}.inventoryCount`}
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
                    {unitErrors?.inventoryCount && (
                      <p className="mt-1 text-xs text-red-500">{unitErrors.inventoryCount.message}</p>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
