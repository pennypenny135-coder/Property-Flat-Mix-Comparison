import { useCallback, useEffect, useRef, useState } from 'react';
import { getSetting, setSetting } from '@/db/settingsRepository';
import { DEFAULT_COMPARISON_SETTINGS } from '@/types/settings';
import type { ComparisonSettings } from '@/types/settings';

const SETTINGS_KEY = 'comparisonSettings';

export function useComparisonSettings() {
  const [settings, setSettingsState] = useState<ComparisonSettings>(DEFAULT_COMPARISON_SETTINGS);
  const loaded = useRef(false);

  useEffect(() => {
    let mounted = true;
    getSetting<ComparisonSettings>(SETTINGS_KEY, DEFAULT_COMPARISON_SETTINGS).then((value) => {
      if (mounted) {
        setSettingsState({ ...DEFAULT_COMPARISON_SETTINGS, ...value });
        loaded.current = true;
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const update = useCallback((patch: Partial<ComparisonSettings>) => {
    setSettingsState((prev) => {
      const next = { ...prev, ...patch };
      void setSetting(SETTINGS_KEY, next);
      return next;
    });
  }, []);

  return { settings, update };
}
