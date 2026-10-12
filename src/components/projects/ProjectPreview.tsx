import { useWatch, type Control } from 'react-hook-form';
import { UNIT_TYPE_ORDER, UNIT_TYPE_LABELS, DEVELOPER_LABELS, DISTRICT_LABELS } from '@/lib/constants';
import { formatSaleableArea, formatAreaSqFt } from '@/lib/formatters';
import { calculateTotalInventory, calculateUnitsPerResidentSpace, formatInventoryCell, formatUnitsPerResidentSpace } from '@/lib/calculations';
import type { ProjectFormValues } from '@/lib/validators';

export function ProjectPreview({ control }: { control: Control<ProjectFormValues> }) {
  const values = useWatch({ control });

  const nameZh = values.projectNameZh?.trim();
  const nameEn = values.projectNameEn?.trim();
  const developerLabel =
    values.developer === 'other' ? values.developerOther || '未提供' : DEVELOPER_LABELS[values.developer || 'other'];
  const districtLabel =
    values.district === 'other' ? values.districtOther || '未提供' : DISTRICT_LABELS[values.district || 'other'];

  const inventory = {
    studio: values.unitTypes?.studio?.inventoryCount ?? null,
    oneBedroom: values.unitTypes?.oneBedroom?.inventoryCount ?? null,
    twoBedrooms: values.unitTypes?.twoBedrooms?.inventoryCount ?? null,
    threeBedrooms: values.unitTypes?.threeBedrooms?.inventoryCount ?? null,
    fourBedrooms: values.unitTypes?.fourBedrooms?.inventoryCount ?? null,
  };
  const total = calculateTotalInventory(inventory);
  const unitsPerSpace = calculateUnitsPerResidentSpace(
    values.parking?.totalResidentialUnits,
    values.parking?.residentParkingSpaces,
  );

  return (
    <aside className="sticky top-20 space-y-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900">
      <div>
        <p className="text-xs font-medium uppercase text-slate-400">即時預覽</p>
        <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
          {nameZh || nameEn || '未命名樓盤'}
        </h3>
        {nameZh && nameEn && <p className="text-sm text-slate-500 dark:text-slate-400">{nameEn}</p>}
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {developerLabel} · {districtLabel}
          {values.districtDetail ? ` · ${values.districtDetail}` : ''}
        </p>
      </div>

      <div>
        <p className="mb-1 text-xs font-medium uppercase text-slate-400">實用面積 / 單位數量</p>
        <ul className="space-y-1 text-sm">
          {UNIT_TYPE_ORDER.map((ut) => (
            <li key={ut} className="flex items-center justify-between gap-2">
              <span className="text-slate-500 dark:text-slate-400">{UNIT_TYPE_LABELS[ut].zh}</span>
              <span className="text-right text-slate-800 dark:text-slate-100">
                {formatSaleableArea(values.unitTypes?.[ut])} ｜{' '}
                {formatInventoryCell(values.unitTypes?.[ut]?.inventoryCount, total, true)}
              </span>
            </li>
          ))}
          <li className="flex items-center justify-between border-t border-slate-100 pt-1 font-medium dark:border-slate-800">
            <span>Total</span>
            <span>{total == null ? '—' : total.toLocaleString('en-US')}</span>
          </li>
        </ul>
      </div>

      <div>
        <p className="mb-1 text-xs font-medium uppercase text-slate-400">公共空間</p>
        <ul className="space-y-1 text-sm">
          <li className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Clubhouse Area</span>
            <span>{formatAreaSqFt(values.clubhouse?.clubhouseAreaSqFt, values.clubhouse?.clubhouseAreaDisplayOverride)}</span>
          </li>
          <li className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Communal Garden / Play Area</span>
            <span>
              {formatAreaSqFt(
                values.clubhouse?.communalGardenOrPlayAreaSqFt,
                values.clubhouse?.communalGardenOrPlayAreaDisplayOverride,
              )}
            </span>
          </li>
        </ul>
      </div>

      <div>
        <p className="mb-1 text-xs font-medium uppercase text-slate-400">CPS Summary</p>
        <ul className="space-y-1 text-sm">
          <li className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Resident Parking Spaces</span>
            <span>{values.parking?.residentParkingSpaces ?? '—'}</span>
          </li>
          <li className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Others</span>
            <span>{values.parking?.others ?? '—'}</span>
          </li>
          <li className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Total Residential Units</span>
            <span>{values.parking?.totalResidentialUnits ?? '—'}</span>
          </li>
          <li className="flex items-center justify-between font-medium">
            <span>Units per Resident Space</span>
            <span>{formatUnitsPerResidentSpace(unitsPerSpace)}</span>
          </li>
          {(values.parking?.customItems || []).map((item, idx) => (
            <li key={idx} className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">{item?.name || '（未命名項目）'}</span>
              <span>{item?.count ?? '—'}</span>
            </li>
          ))}
        </ul>
        {values.parking?.remarks && (
          <p className="mt-2 whitespace-pre-wrap text-xs text-slate-500 dark:text-slate-400">
            {values.parking.remarks}
          </p>
        )}
      </div>
    </aside>
  );
}
