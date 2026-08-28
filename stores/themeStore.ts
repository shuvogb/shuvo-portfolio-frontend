import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'system' | 'light' | 'dark';

interface ThemeStore {
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setResolvedTheme: (resolved: 'light' | 'dark') => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'system',
      resolvedTheme: 'light',
      setTheme: (theme) => {
        set({ theme });
      },
      toggleTheme: () => {
        const current = get().theme;
        let next: ThemeMode;
        if (current === 'system') {
          const isDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
          next = isDark ? 'light' : 'dark';
        } else if (current === 'light') {
          next = 'dark';
        } else {
          next = 'system';
        }
        set({ theme: next });
      },
      setResolvedTheme: (resolvedTheme) => {
        set({ resolvedTheme });
      },
    }),
    { name: 'sm-portfolio-theme-v2' }
  )
);
