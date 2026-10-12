import { useCallback, useEffect, useState } from 'react';
import { LOCAL_STORAGE_THEME_KEY } from '@/lib/constants';
import type { ThemeMode } from '@/types/settings';

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'dark';
  const stored = window.localStorage.getItem(LOCAL_STORAGE_THEME_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return 'dark';
}

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    window.localStorage.setItem(LOCAL_STORAGE_THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, setTheme, toggleTheme };
}
