import { createContext, useContext, type ReactNode } from 'react';
import { useSelection } from '@/hooks/useSelection';

type SelectionContextValue = ReturnType<typeof useSelection>;

const SelectionContext = createContext<SelectionContextValue | null>(null);

export function SelectionProvider({ children }: { children: ReactNode }) {
  const selection = useSelection();
  return <SelectionContext.Provider value={selection}>{children}</SelectionContext.Provider>;
}

export function useSelectionContext(): SelectionContextValue {
  const ctx = useContext(SelectionContext);
  if (!ctx) throw new Error('useSelectionContext must be used within SelectionProvider');
  return ctx;
}
