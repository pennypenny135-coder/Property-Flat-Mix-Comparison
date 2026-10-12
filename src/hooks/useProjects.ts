import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db/db';
import type { Project } from '@/types/project';

export function useProjects(): { projects: Project[]; isLoading: boolean } {
  const projects = useLiveQuery(() => db.projects.toArray(), []);
  return { projects: projects ?? [], isLoading: projects === undefined };
}
