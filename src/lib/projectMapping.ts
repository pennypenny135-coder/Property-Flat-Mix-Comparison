import { createEmptyProject } from '@/types/project';
import type { Project, UnitTypeData } from '@/types/project';
import type { ProjectFormValues } from '@/lib/validators';

function normalizeUnitType(data: UnitTypeData): ProjectFormValues['unitTypes']['studio'] {
  return {
    saleableAreaMin: data.saleableAreaMin ?? null,
    saleableAreaMax: data.saleableAreaMax ?? null,
    areaDisplayOverride: data.areaDisplayOverride ?? '',
    inventoryCount: data.inventoryCount ?? null,
  };
}

export function projectToFormValues(project: Project): ProjectFormValues {
  return {
    projectNameZh: project.projectNameZh || '',
    projectNameEn: project.projectNameEn || '',
    developer: project.developer,
    developerOther: project.developerOther || '',
    district: project.district,
    districtOther: project.districtOther || '',
    districtDetail: project.districtDetail || '',
    notes: project.notes || '',
    isDemo: project.isDemo,
    unitTypes: {
      studio: normalizeUnitType(project.unitTypes.studio),
      oneBedroom: normalizeUnitType(project.unitTypes.oneBedroom),
      twoBedrooms: normalizeUnitType(project.unitTypes.twoBedrooms),
      threeBedrooms: normalizeUnitType(project.unitTypes.threeBedrooms),
      fourBedrooms: normalizeUnitType(project.unitTypes.fourBedrooms),
    },
    clubhouse: {
      clubhouseAreaSqFt: project.clubhouse.clubhouseAreaSqFt ?? null,
      clubhouseAreaDisplayOverride: project.clubhouse.clubhouseAreaDisplayOverride ?? '',
      clubhouseNotes: project.clubhouse.clubhouseNotes ?? '',
      communalGardenOrPlayAreaSqFt: project.clubhouse.communalGardenOrPlayAreaSqFt ?? null,
      communalGardenOrPlayAreaDisplayOverride: project.clubhouse.communalGardenOrPlayAreaDisplayOverride ?? '',
      communalGardenOrPlayAreaNotes: project.clubhouse.communalGardenOrPlayAreaNotes ?? '',
    },
    parking: {
      residentParkingSpaces: project.parking.residentParkingSpaces ?? null,
      others: project.parking.others ?? null,
      totalResidentialUnits: project.parking.totalResidentialUnits ?? null,
      remarks: project.parking.remarks ?? '',
      customItems: project.parking.customItems.map((item) => ({
        id: item.id,
        name: item.name,
        count: item.count ?? null,
        notes: item.notes ?? '',
        isRequired: item.isRequired ?? false,
      })),
    },
  };
}

export function formValuesToProject(values: ProjectFormValues, existing?: Project): Project {
  const base = existing ?? createEmptyProject();
  return {
    ...base,
    projectNameZh: values.projectNameZh || null,
    projectNameEn: values.projectNameEn || null,
    developer: values.developer,
    developerOther: values.developerOther || '',
    district: values.district,
    districtOther: values.districtOther || '',
    districtDetail: values.districtDetail || '',
    notes: values.notes || '',
    isDemo: existing?.isDemo ?? false,
    unitTypes: values.unitTypes,
    clubhouse: values.clubhouse,
    parking: values.parking,
  };
}
