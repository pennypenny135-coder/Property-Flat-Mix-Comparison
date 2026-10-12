import type { DeveloperCode, DistrictCode, UnitType } from '@/types/project';

export const APP_NAME = 'Hong Kong Property Table Builder';
export const APP_SHORT_NAME = 'Property Tables';
export const MAX_SELECTION = 10;

export const DEVELOPER_LABELS: Record<DeveloperCode, string> = {
  sunhungkai: '新地',
  ck: '長江',
  henderson: '恒基',
  wheelock: '會德豐',
  newworld: '新世界',
  other: '其他',
};

export const DEVELOPER_OPTIONS: { value: DeveloperCode; label: string }[] = (
  Object.keys(DEVELOPER_LABELS) as DeveloperCode[]
).map((value) => ({ value, label: DEVELOPER_LABELS[value] }));

export const DISTRICT_LABELS: Record<DistrictCode, string> = {
  'hong-kong-island': '香港島',
  kowloon: '九龍',
  'new-territories': '新界',
  other: '其他',
};

export const DISTRICT_OPTIONS: { value: DistrictCode; label: string }[] = (
  Object.keys(DISTRICT_LABELS) as DistrictCode[]
).map((value) => ({ value, label: DISTRICT_LABELS[value] }));

export const UNIT_TYPE_LABELS: Record<UnitType, { zh: string; en: string }> = {
  studio: { zh: '開放式', en: 'Studio' },
  oneBedroom: { zh: '1 房', en: '1 Bedroom' },
  twoBedrooms: { zh: '2 房', en: '2 Bedrooms' },
  threeBedrooms: { zh: '3 房', en: '3 Bedrooms' },
  fourBedrooms: { zh: '4 房', en: '4 Bedrooms' },
};

export const UNIT_TYPE_ORDER: UnitType[] = [
  'studio',
  'oneBedroom',
  'twoBedrooms',
  'threeBedrooms',
  'fourBedrooms',
];

export const DEFAULT_CUSTOM_PARKING_NAMES = [
  'Motorcycle Parking',
  'Visitor Parking Spaces',
  'Accessible Visitor Parking',
  'EV Charging Spaces',
  'Loading / Unloading Spaces',
  'Commercial Parking Spaces',
  'Bicycle Parking',
];

export const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: 'tickOrder', label: 'Tick 順序' },
  { value: 'nameZh', label: '中文名稱 A-Z' },
  { value: 'nameEn', label: '英文名稱 A-Z' },
  { value: 'developer', label: '發展商' },
  { value: 'district', label: '地區' },
  { value: 'districtDetail', label: '細分地區' },
  { value: 'areaStudio', label: 'Studio 面積由小至大' },
  { value: 'areaOneBedroom', label: '1 Bedroom 面積由小至大' },
  { value: 'areaTwoBedrooms', label: '2 Bedrooms 面積由小至大' },
  { value: 'areaThreeBedrooms', label: '3 Bedrooms 面積由小至大' },
  { value: 'areaFourBedrooms', label: '4 Bedrooms 面積由小至大' },
  { value: 'totalInventory', label: 'Total Inventory' },
  { value: 'residentParkingSpaces', label: 'Resident Parking Spaces' },
  { value: 'unitsPerResidentSpace', label: 'Units per Resident Space' },
  { value: 'custom', label: '自訂拖曳排序' },
];

export const LOCAL_STORAGE_THEME_KEY = 'hkptb-theme';
export const LOCAL_STORAGE_SELECTION_KEY = 'hkptb-selection';
