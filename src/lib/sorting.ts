import { calculateTotalInventory, calculateUnitsPerResidentSpace } from '@/lib/calculations';
import { getDeveloperDisplay, getDistrictDisplay } from '@/lib/formatters';
import type { Project, UnitType } from '@/types/project';
import type { SortDirection, SortKey } from '@/types/settings';

function areaSortValue(project: Project, unitType: UnitType): number {
  const data = project.unitTypes[unitType];
  if (data.saleableAreaMin != null) return data.saleableAreaMin;
  if (data.saleableAreaMax != null) return data.saleableAreaMax;
  return Number.POSITIVE_INFINITY;
}

export function sortProjects(
  projects: Project[],
  sortKey: SortKey,
  sortDirection: SortDirection,
  tickOrderIds: string[],
  customOrderIds: string[],
): Project[] {
  const list = [...projects];

  const compareNullableLast = (a: number, b: number) => {
    const aInf = !Number.isFinite(a);
    const bInf = !Number.isFinite(b);
    if (aInf && bInf) return 0;
    if (aInf) return 1;
    if (bInf) return -1;
    return a - b;
  };

  let compare: (a: Project, b: Project) => number;

  switch (sortKey) {
    case 'tickOrder':
      compare = (a, b) => tickOrderIds.indexOf(a.id) - tickOrderIds.indexOf(b.id);
      break;
    case 'custom':
      compare = (a, b) => customOrderIds.indexOf(a.id) - customOrderIds.indexOf(b.id);
      break;
    case 'nameZh':
      compare = (a, b) =>
        (a.projectNameZh || a.projectNameEn || '').localeCompare(b.projectNameZh || b.projectNameEn || '', 'zh-Hant');
      break;
    case 'nameEn':
      compare = (a, b) =>
        (a.projectNameEn || a.projectNameZh || '').localeCompare(b.projectNameEn || b.projectNameZh || '');
      break;
    case 'developer':
      compare = (a, b) => getDeveloperDisplay(a).localeCompare(getDeveloperDisplay(b), 'zh-Hant');
      break;
    case 'district':
      compare = (a, b) => getDistrictDisplay(a).localeCompare(getDistrictDisplay(b), 'zh-Hant');
      break;
    case 'districtDetail':
      compare = (a, b) => (a.districtDetail || '').localeCompare(b.districtDetail || '', 'zh-Hant');
      break;
    case 'areaStudio':
      compare = (a, b) => compareNullableLast(areaSortValue(a, 'studio'), areaSortValue(b, 'studio'));
      break;
    case 'areaOneBedroom':
      compare = (a, b) => compareNullableLast(areaSortValue(a, 'oneBedroom'), areaSortValue(b, 'oneBedroom'));
      break;
    case 'areaTwoBedrooms':
      compare = (a, b) => compareNullableLast(areaSortValue(a, 'twoBedrooms'), areaSortValue(b, 'twoBedrooms'));
      break;
    case 'areaThreeBedrooms':
      compare = (a, b) =>
        compareNullableLast(areaSortValue(a, 'threeBedrooms'), areaSortValue(b, 'threeBedrooms'));
      break;
    case 'areaFourBedrooms':
      compare = (a, b) => compareNullableLast(areaSortValue(a, 'fourBedrooms'), areaSortValue(b, 'fourBedrooms'));
      break;
    case 'totalInventory':
      compare = (a, b) =>
        compareNullableLast(
          calculateTotalInventory(mapInventory(a)) ?? Number.POSITIVE_INFINITY,
          calculateTotalInventory(mapInventory(b)) ?? Number.POSITIVE_INFINITY,
        );
      break;
    case 'residentParkingSpaces':
      compare = (a, b) =>
        compareNullableLast(
          a.parking.residentParkingSpaces ?? Number.POSITIVE_INFINITY,
          b.parking.residentParkingSpaces ?? Number.POSITIVE_INFINITY,
        );
      break;
    case 'unitsPerResidentSpace':
      compare = (a, b) =>
        compareNullableLast(
          calculateUnitsPerResidentSpace(a.parking.totalResidentialUnits, a.parking.residentParkingSpaces) ??
            Number.POSITIVE_INFINITY,
          calculateUnitsPerResidentSpace(b.parking.totalResidentialUnits, b.parking.residentParkingSpaces) ??
            Number.POSITIVE_INFINITY,
        );
      break;
    default:
      compare = () => 0;
  }

  list.sort(compare);
  if (sortDirection === 'desc' && sortKey !== 'tickOrder' && sortKey !== 'custom') {
    list.reverse();
  }
  return list;
}

function mapInventory(project: Project) {
  return {
    studio: project.unitTypes.studio.inventoryCount,
    oneBedroom: project.unitTypes.oneBedroom.inventoryCount,
    twoBedrooms: project.unitTypes.twoBedrooms.inventoryCount,
    threeBedrooms: project.unitTypes.threeBedrooms.inventoryCount,
    fourBedrooms: project.unitTypes.fourBedrooms.inventoryCount,
  };
}
