export type DeveloperCode =
  | 'sunhungkai'
  | 'ck'
  | 'henderson'
  | 'wheelock'
  | 'newworld'
  | 'other';

export type DistrictCode =
  | 'hong-kong-island'
  | 'kowloon'
  | 'new-territories'
  | 'other';

export type UnitType =
  | 'studio'
  | 'oneBedroom'
  | 'twoBedrooms'
  | 'threeBedrooms'
  | 'fourBedrooms';

export const UNIT_TYPES: UnitType[] = [
  'studio',
  'oneBedroom',
  'twoBedrooms',
  'threeBedrooms',
  'fourBedrooms',
];

export type UnitTypeData = {
  saleableAreaMin?: number | null;
  saleableAreaMax?: number | null;
  areaDisplayOverride?: string | null;
  inventoryCount?: number | null;
};

export type InventoryData = {
  studio?: number | null;
  oneBedroom?: number | null;
  twoBedrooms?: number | null;
  threeBedrooms?: number | null;
  fourBedrooms?: number | null;
};

export type ClubhouseData = {
  clubhouseAreaSqFt?: number | null;
  clubhouseAreaDisplayOverride?: string | null;
  clubhouseNotes?: string | null;

  communalGardenOrPlayAreaSqFt?: number | null;
  communalGardenOrPlayAreaDisplayOverride?: string | null;
  communalGardenOrPlayAreaNotes?: string | null;
};

export type ParkingItem = {
  id: string;
  name: string;
  count?: number | null;
  notes?: string | null;
  isRequired?: boolean;
};

export type ParkingData = {
  residentParkingSpaces?: number | null;
  others?: number | null;
  totalResidentialUnits?: number | null;
  customItems: ParkingItem[];
  remarks?: string | null;
};

export type Project = {
  id: string;

  projectNameZh?: string | null;
  projectNameEn?: string | null;

  developer: DeveloperCode;
  developerOther?: string | null;

  district: DistrictCode;
  districtOther?: string | null;
  districtDetail?: string | null;

  notes?: string | null;
  isDemo: boolean;

  unitTypes: Record<UnitType, UnitTypeData>;

  clubhouse: ClubhouseData;

  parking: ParkingData;

  createdAt: string;
  updatedAt: string;
};

export function createEmptyUnitTypes(): Record<UnitType, UnitTypeData> {
  return {
    studio: {},
    oneBedroom: {},
    twoBedrooms: {},
    threeBedrooms: {},
    fourBedrooms: {},
  };
}

export function createEmptyProject(): Project {
  const now = new Date().toISOString();
  return {
    id: '',
    projectNameZh: '',
    projectNameEn: '',
    developer: 'sunhungkai',
    developerOther: '',
    district: 'hong-kong-island',
    districtOther: '',
    districtDetail: '',
    notes: '',
    isDemo: false,
    unitTypes: createEmptyUnitTypes(),
    clubhouse: {
      clubhouseAreaSqFt: null,
      clubhouseAreaDisplayOverride: '',
      clubhouseNotes: '',
      communalGardenOrPlayAreaSqFt: null,
      communalGardenOrPlayAreaDisplayOverride: '',
      communalGardenOrPlayAreaNotes: '',
    },
    parking: {
      residentParkingSpaces: null,
      others: null,
      totalResidentialUnits: null,
      customItems: [],
      remarks: '',
    },
    createdAt: now,
    updatedAt: now,
  };
}
