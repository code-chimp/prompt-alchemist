import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'mocha' | 'latte';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const getSystemTheme = (): Theme => {
  // Handle environments without matchMedia (e.g., test environments)
  if (typeof window === 'undefined' || !window.matchMedia) {
    return 'mocha'; // Default to dark theme
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'mocha' : 'latte';
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: getSystemTheme(),

      setTheme: theme => {
        document.documentElement.setAttribute('data-theme', theme);
        set({ theme });
      },

      toggleTheme: () => {
        const newTheme = get().theme === 'mocha' ? 'latte' : 'mocha';
        get().setTheme(newTheme);
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => state => {
        // Apply theme immediately on load
        if (state) {
          document.documentElement.setAttribute('data-theme', state.theme);
        }
      },
    },
  ),
);
