import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { AppErrorBoundary } from '@/components/AppErrorBoundary';
import { Toaster } from '@/components/ui/sonner.tsx';
import '@/lib/global-errors';
import { useThemeStore } from '@/stores/themeStore';

import App from './App';
import './index.css';

// Initialize theme from store (hydrates from localStorage or system preference)
const initialTheme = useThemeStore.getState().theme;
document.documentElement.setAttribute('data-theme', initialTheme);

// Listen for system theme changes (only auto-switch if user hasn't manually set theme)
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
mediaQuery.addEventListener('change', e => {
  // Check if user has explicitly set a theme preference
  const stored = localStorage.getItem('theme-storage');
  const systemTheme = e.matches ? 'mocha' : 'latte';

  if (!stored) {
    // No stored preference, apply system theme
    useThemeStore.getState().setTheme(systemTheme);
  } else {
    // Parse stored state and only auto-switch if theme matches system (not manually overridden)
    try {
      const { state } = JSON.parse(stored);
      const currentSystemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'mocha'
        : 'latte';

      // If stored theme matches previous system preference, user hasn't manually overridden
      if (state.theme === currentSystemTheme) {
        useThemeStore.getState().setTheme(systemTheme);
      }
    } catch {
      // If parsing fails, apply system theme
      useThemeStore.getState().setTheme(systemTheme);
    }
  }
});

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
    <Toaster richColors />
  </StrictMode>,
);
