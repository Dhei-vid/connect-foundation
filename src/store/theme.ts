import { atom } from 'jotai';
import type { Theme } from '@/common/types';

export const themeAtom = atom<Theme>({
  mode: 'light',
  primary: '#6366f1',
  secondary: '#8b5cf6',
  accent: '#f59e0b',
});

export const isDarkModeAtom = atom<boolean>((get) => get(themeAtom).mode === 'dark');

export const toggleThemeAtom = atom(
  null,
  (get, set) => {
    const currentTheme = get(themeAtom);
    set(themeAtom, {
      ...currentTheme,
      mode: currentTheme.mode === 'light' ? 'dark' : 'light',
    });
  }
);

export const setThemeModeAtom = atom(
  null,
  (get, set, mode: 'light' | 'dark') => {
    const currentTheme = get(themeAtom);
    set(themeAtom, {
      ...currentTheme,
      mode,
    });
  }
);
