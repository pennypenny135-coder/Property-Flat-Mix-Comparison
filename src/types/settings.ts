export type ThemeMode = 'dark' | 'light';

export type HeaderLanguage = 'zh' | 'en' | 'both';

export type TableDensity = 'comfortable' | 'compact';

export type SortKey =
  | 'tickOrder'
  | 'nameZh'
  | 'nameEn'
  | 'developer'
  | 'district'
  | 'districtDetail'
  | 'areaStudio'
  | 'areaOneBedroom'
  | 'areaTwoBedrooms'
  | 'areaThreeBedrooms'
  | 'areaFourBedrooms'
  | 'totalInventory'
  | 'residentParkingSpaces'
  | 'unitsPerResidentSpace'
  | 'custom';

export type SortDirection = 'asc' | 'desc';

export type ComparisonSettings = {
  showClubhouseArea: boolean;
  showCommunalGardenArea: boolean;
  showGeneralNotes: boolean;
  showClubhouseNotes: boolean;
  showCommunalGardenNotes: boolean;
  showCpsRemarks: boolean;
  hideEmptyUnitTypes: boolean;
  showInventoryPercentage: boolean;
  showTotalPercentage: boolean;
  showDistrict: boolean;
  density: TableDensity;
  headerLanguage: HeaderLanguage;
  sortKey: SortKey;
  sortDirection: SortDirection;
  customOrder: string[];
};

export const DEFAULT_COMPARISON_SETTINGS: ComparisonSettings = {
  showClubhouseArea: true,
  showCommunalGardenArea: true,
  showGeneralNotes: false,
  showClubhouseNotes: false,
  showCommunalGardenNotes: false,
  showCpsRemarks: true,
  hideEmptyUnitTypes: false,
  showInventoryPercentage: true,
  showTotalPercentage: false,
  showDistrict: true,
  density: 'comfortable',
  headerLanguage: 'both',
  sortKey: 'tickOrder',
  sortDirection: 'asc',
  customOrder: [],
};
