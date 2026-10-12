import { UNIT_TYPE_ORDER } from '@/lib/constants';
import { formatNumber } from '@/lib/formatters';
import type { InventoryData } from '@/types/project';

export function calculateTotalInventory(inventory: InventoryData): number | null {
  let total = 0;
  let hasValue = false;
  for (const key of UNIT_TYPE_ORDER) {
    const v = inventory[key];
    if (v != null && !Number.isNaN(v)) {
      total += v;
      hasValue = true;
    }
  }
  return hasValue ? total : null;
}

export function calculateInventoryPercentage(
  count: number | null | undefined,
  total: number | null,
): number | null {
  if (count == null || Number.isNaN(count)) return null;
  if (total == null || total <= 0) return null;
  return (count / total) * 100;
}

export function formatInventoryCell(
  count: number | null | undefined,
  total: number | null,
  showPercentage: boolean,
): string {
  if (count == null || Number.isNaN(count)) return '—';
  const percentage = calculateInventoryPercentage(count, total);
  if (showPercentage && percentage != null) {
    return `${formatNumber(count)} (${percentage.toFixed(1)}%)`;
  }
  return formatNumber(count);
}

export function calculateUnitsPerResidentSpace(
  totalResidentialUnits: number | null | undefined,
  residentParkingSpaces: number | null | undefined,
): number | null {
  if (
    totalResidentialUnits == null ||
    Number.isNaN(totalResidentialUnits) ||
    residentParkingSpaces == null ||
    Number.isNaN(residentParkingSpaces) ||
    residentParkingSpaces <= 0
  ) {
    return null;
  }
  return totalResidentialUnits / residentParkingSpaces;
}

export function formatUnitsPerResidentSpace(value: number | null): string {
  if (value == null || Number.isNaN(value) || !Number.isFinite(value)) return '—';
  return value.toFixed(2);
}
