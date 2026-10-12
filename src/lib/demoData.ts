import { generateId } from '@/lib/ids';
import type { Project, ParkingItem, UnitTypeData } from '@/types/project';

function area(min?: number, max?: number): UnitTypeData {
  if (min == null && max == null) return {};
  return { saleableAreaMin: min ?? null, saleableAreaMax: max ?? null };
}

function customItems(
  values: Record<string, number | undefined>,
): ParkingItem[] {
  return Object.entries(values)
    .filter(([, v]) => v != null)
    .map(([name, count]) => ({
      id: generateId(),
      name,
      count: count ?? null,
      notes: '',
      isRequired: false,
    }));
}

function makeDemoProject(data: {
  nameZh?: string;
  nameEn?: string;
  areas: { studio?: [number?, number?]; oneBedroom?: [number?, number?]; twoBedrooms?: [number?, number?]; threeBedrooms?: [number?, number?]; fourBedrooms?: [number?, number?] };
  inventory: { studio?: number; oneBedroom?: number; twoBedrooms?: number; threeBedrooms?: number; fourBedrooms?: number };
  clubhouseAreaSqFt?: number;
  communalGardenOrPlayAreaSqFt?: number;
  residentParkingSpaces?: number;
  others?: number;
  totalResidentialUnits?: number;
  customParking: Record<string, number | undefined>;
  remarks?: string;
}): Project {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    projectNameZh: data.nameZh ?? null,
    projectNameEn: data.nameEn ?? null,
    developer: 'other',
    developerOther: '未提供',
    district: 'other',
    districtOther: '未提供',
    districtDetail: '',
    notes: '',
    isDemo: true,
    unitTypes: {
      studio: { ...area(data.areas.studio?.[0], data.areas.studio?.[1]), inventoryCount: data.inventory.studio ?? null },
      oneBedroom: {
        ...area(data.areas.oneBedroom?.[0], data.areas.oneBedroom?.[1]),
        inventoryCount: data.inventory.oneBedroom ?? null,
      },
      twoBedrooms: {
        ...area(data.areas.twoBedrooms?.[0], data.areas.twoBedrooms?.[1]),
        inventoryCount: data.inventory.twoBedrooms ?? null,
      },
      threeBedrooms: {
        ...area(data.areas.threeBedrooms?.[0], data.areas.threeBedrooms?.[1]),
        inventoryCount: data.inventory.threeBedrooms ?? null,
      },
      fourBedrooms: {
        ...area(data.areas.fourBedrooms?.[0], data.areas.fourBedrooms?.[1]),
        inventoryCount: data.inventory.fourBedrooms ?? null,
      },
    },
    clubhouse: {
      clubhouseAreaSqFt: data.clubhouseAreaSqFt ?? null,
      clubhouseAreaDisplayOverride: '',
      clubhouseNotes: '',
      communalGardenOrPlayAreaSqFt: data.communalGardenOrPlayAreaSqFt ?? null,
      communalGardenOrPlayAreaDisplayOverride: '',
      communalGardenOrPlayAreaNotes: '',
    },
    parking: {
      residentParkingSpaces: data.residentParkingSpaces ?? null,
      others: data.others ?? null,
      totalResidentialUnits: data.totalResidentialUnits ?? null,
      customItems: customItems(data.customParking),
      remarks: data.remarks ?? '',
    },
    createdAt: now,
    updatedAt: now,
  };
}

export function getDemoProjects(): Project[] {
  return [
    makeDemoProject({
      nameZh: '擎濤 I',
      nameEn: 'The Altas I',
      areas: {
        oneBedroom: [242, 342],
        twoBedrooms: [390, 510],
        threeBedrooms: [674, 721],
      },
      inventory: { oneBedroom: 348, twoBedrooms: 215, threeBedrooms: 54 },
      clubhouseAreaSqFt: 30298,
      communalGardenOrPlayAreaSqFt: 47385,
      residentParkingSpaces: 212,
      others: 5,
      totalResidentialUnits: 1339,
      customParking: {
        'Visitor Parking Spaces': 22,
        'Accessible Visitor Parking': 3,
        'Motorcycle Parking': 14,
      },
      remarks: 'Others refers to 4 loading and unloading spaces and 1 refuse collection space.',
    }),
    makeDemoProject({
      nameEn: 'Peninsula East',
      areas: {
        twoBedrooms: [479, 547],
        threeBedrooms: [829, 959],
        fourBedrooms: [957, 1033],
      },
      inventory: { twoBedrooms: 128, threeBedrooms: 96, fourBedrooms: 32 },
      clubhouseAreaSqFt: 10625,
      communalGardenOrPlayAreaSqFt: 4558,
      residentParkingSpaces: 66,
      others: 24,
      totalResidentialUnits: 256,
      customParking: {
        'Visitor Parking Spaces': 9,
        'Motorcycle Parking': 9,
      },
      remarks:
        'Others refers to 24 commercial loading / unloading parking spaces, commercial parking spaces, commercial accessible (disabled) parking spaces, of which 1 is residential accessible (disabled) parking space.',
    }),
    makeDemoProject({
      nameZh: '蔚藍東岸',
      nameEn: 'Montego Bay',
      areas: {
        studio: [237, 271],
        oneBedroom: [275, 352],
        twoBedrooms: [428, 587],
        threeBedrooms: [651, 1071],
        fourBedrooms: [1025, 2136],
      },
      inventory: { studio: 49, oneBedroom: 131, twoBedrooms: 252, threeBedrooms: 192, fourBedrooms: 64 },
      clubhouseAreaSqFt: 30239,
      communalGardenOrPlayAreaSqFt: 63944,
      residentParkingSpaces: 123,
      others: 3,
      totalResidentialUnits: 688,
      customParking: {
        'Visitor Parking Spaces': 20,
        'Accessible Visitor Parking': 3,
        'Motorcycle Parking': 8,
      },
      remarks: 'Others refers to 3 other non-industrial parking spaces.',
    }),
    makeDemoProject({
      nameZh: '親海駅',
      nameEn: 'The Coast Line Overall',
      areas: {
        studio: [210, 210],
        oneBedroom: [258, 287],
        twoBedrooms: [442, 523],
        threeBedrooms: [707, 736],
      },
      inventory: { studio: 58, oneBedroom: 346, twoBedrooms: 302, threeBedrooms: 180 },
      clubhouseAreaSqFt: 16246,
      communalGardenOrPlayAreaSqFt: 16935,
      residentParkingSpaces: 131,
      others: 4,
      totalResidentialUnits: 886,
      customParking: {
        'Visitor Parking Spaces': 12,
        'Accessible Visitor Parking': 3,
        'Motorcycle Parking': 10,
      },
      remarks: 'Others refers to 4 loading and unloading spaces.',
    }),
    makeDemoProject({
      nameZh: '親海駅 I',
      nameEn: 'The Coast Line I',
      areas: {
        oneBedroom: [273, 287],
        twoBedrooms: [442, 470],
        threeBedrooms: [714, 736],
      },
      inventory: { oneBedroom: 114, twoBedrooms: 46, threeBedrooms: 68 },
      clubhouseAreaSqFt: 2669,
      communalGardenOrPlayAreaSqFt: 3772,
      residentParkingSpaces: 39,
      others: 1,
      totalResidentialUnits: 228,
      customParking: {
        'Visitor Parking Spaces': 4,
        'Accessible Visitor Parking': 1,
        'Motorcycle Parking': 3,
      },
      remarks: '',
    }),
    makeDemoProject({
      nameZh: '親海駅 II',
      nameEn: 'The Coast Line II',
      areas: {
        studio: [210, 210],
        oneBedroom: [258, 283],
        twoBedrooms: [447, 523],
        threeBedrooms: [707, 723],
      },
      inventory: { studio: 58, oneBedroom: 232, twoBedrooms: 256, threeBedrooms: 112 },
      clubhouseAreaSqFt: 13577,
      communalGardenOrPlayAreaSqFt: 13163,
      residentParkingSpaces: 92,
      others: 3,
      totalResidentialUnits: 658,
      customParking: {
        'Visitor Parking Spaces': 8,
        'Accessible Visitor Parking': 2,
        'Motorcycle Parking': 7,
      },
      remarks: '',
    }),
  ];
}
