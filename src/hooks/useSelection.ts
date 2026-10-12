import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { LOCAL_STORAGE_SELECTION_KEY, MAX_SELECTION } from '@/lib/constants';

function loadInitial(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = window.localStorage.getItem(LOCAL_STORAGE_SELECTION_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export function useSelection() {
  const [selectedIds, setSelectedIds] = useState<string[]>(loadInitial);

  useEffect(() => {
    window.localStorage.setItem(LOCAL_STORAGE_SELECTION_KEY, JSON.stringify(selectedIds));
  }, [selectedIds]);

  const toggle = useCallback((id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id);
      }
      if (prev.length >= MAX_SELECTION) {
        toast.error(`最多只能選擇 ${MAX_SELECTION} 個樓盤`);
        return prev;
      }
      return [...prev, id];
    });
  }, []);

  const clear = useCallback(() => setSelectedIds([]), []);

  const reorder = useCallback((newOrder: string[]) => {
    setSelectedIds(newOrder);
  }, []);

  const removeMissing = useCallback((validIds: Set<string>) => {
    setSelectedIds((prev) => prev.filter((id) => validIds.has(id)));
  }, []);

  return { selectedIds, toggle, clear, reorder, removeMissing, isFull: selectedIds.length >= MAX_SELECTION };
}
