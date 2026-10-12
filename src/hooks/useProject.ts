import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db/db';

export function useProject(id: string | undefined) {
  const project = useLiveQuery(() => (id ? db.projects.get(id) : undefined), [id]);
  return { project, isLoading: project === undefined && !!id };
}
