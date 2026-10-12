import type { Project } from '@/types/project';

export type MergedCustomParkingRow = {
  key: string;
  displayName: string;
  valuesByProjectId: Record<string, number | null>;
};

function normalizeName(name: string): string {
  return name.trim().toLowerCase();
}

export function mergeCustomParkingItems(projects: Project[]): MergedCustomParkingRow[] {
  const rows = new Map<string, MergedCustomParkingRow>();

  for (const project of projects) {
    for (const item of project.parking.customItems) {
      const key = normalizeName(item.name);
      if (!key) continue;
      if (!rows.has(key)) {
        rows.set(key, {
          key,
          displayName: item.name.trim(),
          valuesByProjectId: {},
        });
      }
      const row = rows.get(key)!;
      row.valuesByProjectId[project.id] = item.count ?? null;
    }
  }

  return Array.from(rows.values());
}

export function mapInventoryData(project: Project) {
  return {
    studio: project.unitTypes.studio.inventoryCount,
    oneBedroom: project.unitTypes.oneBedroom.inventoryCount,
    twoBedrooms: project.unitTypes.twoBedrooms.inventoryCount,
    threeBedrooms: project.unitTypes.threeBedrooms.inventoryCount,
    fourBedrooms: project.unitTypes.fourBedrooms.inventoryCount,
  };
}
