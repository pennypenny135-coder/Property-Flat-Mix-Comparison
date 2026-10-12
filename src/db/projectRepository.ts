import { db } from '@/db/db';
import type { Project, DeveloperCode, DistrictCode } from '@/types/project';
import { generateId } from '@/lib/ids';
import { DEVELOPER_LABELS, DISTRICT_LABELS } from '@/lib/constants';

export async function addProject(project: Project): Promise<Project> {
  const now = new Date().toISOString();
  const toSave: Project = {
    ...project,
    id: project.id || generateId(),
    createdAt: project.createdAt || now,
    updatedAt: now,
  };
  await db.projects.add(toSave);
  return toSave;
}

export async function updateProject(project: Project): Promise<Project> {
  const toSave: Project = { ...project, updatedAt: new Date().toISOString() };
  await db.projects.put(toSave);
  return toSave;
}

export async function deleteProject(id: string): Promise<void> {
  await db.projects.delete(id);
}

export async function duplicateProject(id: string): Promise<Project | null> {
  const original = await db.projects.get(id);
  if (!original) return null;
  const now = new Date().toISOString();
  const copy: Project = {
    ...original,
    id: generateId(),
    projectNameZh: original.projectNameZh
      ? `${original.projectNameZh}（複本）`
      : original.projectNameZh,
    projectNameEn: original.projectNameEn ? `${original.projectNameEn} (Copy)` : original.projectNameEn,
    isDemo: false,
    createdAt: now,
    updatedAt: now,
  };
  await db.projects.add(copy);
  return copy;
}

export async function getProject(id: string): Promise<Project | undefined> {
  return db.projects.get(id);
}

export async function getAllProjects(): Promise<Project[]> {
  return db.projects.toArray();
}

export async function getProjectsByIds(ids: string[]): Promise<Project[]> {
  const all = await db.projects.bulkGet(ids);
  return all.filter((p): p is Project => !!p);
}

export function matchesKeyword(project: Project, keyword: string): boolean {
  const kw = keyword.trim().toLowerCase();
  if (!kw) return true;
  const developerLabel =
    project.developer === 'other' ? project.developerOther || '' : DEVELOPER_LABELS[project.developer];
  const districtLabel =
    project.district === 'other' ? project.districtOther || '' : DISTRICT_LABELS[project.district];

  const fields: (string | null | undefined)[] = [
    project.projectNameZh,
    project.projectNameEn,
    developerLabel,
    project.developerOther,
    districtLabel,
    project.districtOther,
    project.districtDetail,
    project.notes,
    project.clubhouse.clubhouseNotes,
    project.clubhouse.communalGardenOrPlayAreaNotes,
    project.parking.remarks,
    ...project.parking.customItems.flatMap((i) => [i.name, i.notes]),
  ];

  return fields.some((f) => (f || '').toString().toLowerCase().includes(kw));
}

export type ProjectFilterOptions = {
  keyword?: string;
  developer?: DeveloperCode | 'all';
  district?: DistrictCode | 'all';
  districtDetail?: string;
};

export async function searchProjects(keyword: string): Promise<Project[]> {
  const all = await getAllProjects();
  return all.filter((p) => matchesKeyword(p, keyword));
}

export async function filterProjects(options: ProjectFilterOptions): Promise<Project[]> {
  let all = await getAllProjects();
  if (options.keyword) {
    all = all.filter((p) => matchesKeyword(p, options.keyword || ''));
  }
  if (options.developer && options.developer !== 'all') {
    all = all.filter((p) => p.developer === options.developer);
  }
  if (options.district && options.district !== 'all') {
    all = all.filter((p) => p.district === options.district);
  }
  if (options.districtDetail) {
    const dd = options.districtDetail.trim().toLowerCase();
    all = all.filter((p) => (p.districtDetail || '').toLowerCase().includes(dd));
  }
  return all;
}

export async function bulkImportProjects(projects: Project[]): Promise<void> {
  await db.projects.bulkPut(projects);
}

export async function clearAllProjects(): Promise<void> {
  await db.projects.clear();
}

export async function deleteDemoProjects(): Promise<void> {
  const all = await db.projects.toArray();
  const idsToDelete = all.filter((p) => p.isDemo).map((p) => p.id);
  await db.projects.bulkDelete(idsToDelete);
}
