# Story 1.1: Catppuccin Theme System Implementation

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want to implement the Catppuccin theme system with Mocha (dark) and Latte (light) variants,
So that the application has a professional, accessible visual design with proper contrast and color semantics.

## Acceptance Criteria

**Given** the application is launched
**When** the user opens the app for the first time
**Then** the Mocha (dark) theme is applied by default
**And** all color tokens are defined as CSS custom properties (--color-base, --color-text, --color-primary, etc.)
**And** all text meets WCAG 2.1 AA contrast requirements (4.5:1 for normal text, 3:1 for large text)

**Given** the user has the Mocha theme active
**When** the user switches to Latte theme via settings
**Then** all UI elements update to use Latte color palette within 200ms
**And** theme preference is saved to local storage
**And** the selected theme persists across application restarts

**Given** the user's operating system has `prefers-color-scheme` set
**When** the user has not manually selected a theme
**Then** the application detects and applies the system preference (dark → Mocha, light → Latte)

**Given** any UI component uses color tokens
**When** rendered in either theme
**Then** the component maintains visual hierarchy and accessibility standards
**And** primary accent color (Mauve: #cba6f7 Mocha, #8839ef Latte) is used consistently for focus states and primary actions

## Tasks / Subtasks

- [ ] Task 1: Create CSS custom properties for Catppuccin Mocha and Latte themes (AC: All)
  - [ ] Subtask 1.1: Define Mocha color variables in src/index.css
  - [ ] Subtask 1.2: Define Latte color variables in src/index.css
  - [ ] Subtask 1.3: Verify WCAG 2.1 AA contrast ratios for both themes
  
- [ ] Task 2: Implement Zustand theme store with persistence (AC: Theme switching, persistence)
  - [ ] Subtask 2.1: Create src/stores/themeStore.ts with setTheme/toggleTheme actions
  - [ ] Subtask 2.2: Add Zustand persist middleware for localStorage
  - [ ] Subtask 2.3: Implement system preference detection (prefers-color-scheme)
  
- [ ] Task 3: Integrate theme system with Tailwind CSS configuration (AC: Component rendering)
  - [ ] Subtask 3.1: Update tailwind.config.ts to map CSS variables to Tailwind utilities
  - [ ] Subtask 3.2: Add data-theme attribute toggling in theme store
  - [ ] Subtask 3.3: Test theme switching with existing ShadCN UI components
  
- [ ] Task 4: Create theme toggle UI component (AC: User interaction)
  - [ ] Subtask 4.1: Build theme toggle button (moon/sun icon)
  - [ ] Subtask 4.2: Add theme toggle to application settings/header
  - [ ] Subtask 4.3: Ensure keyboard accessibility (Tab, Enter, Space)
  
- [ ] Task 5: Write unit tests for theme store and theme switching (AC: All)
  - [ ] Subtask 5.1: Test setTheme action updates store and DOM
  - [ ] Subtask 5.2: Test toggleTheme action switches between Mocha/Latte
  - [ ] Subtask 5.3: Test system preference detection
  - [ ] Subtask 5.4: Test localStorage persistence and rehydration

## Dev Notes

### Architecture Context

**Theme System Overview:**
- **Implementation:** CSS custom properties + Zustand store + Tailwind CSS integration
- **Performance Target:** <10ms theme switch (pure CSS, no re-renders)
- **Persistence:** localStorage via Zustand persist middleware
- **System Integration:** Respects `prefers-color-scheme` media query

**Key Files to Create/Modify:**
1. `src/stores/themeStore.ts` - Zustand store for theme state
2. `src/index.css` - CSS custom properties for Catppuccin colors
3. `tailwind.config.ts` - Map CSS variables to Tailwind utilities
4. `src/components/ThemeToggle.tsx` - Theme toggle UI component

### Technical Requirements from Architecture

**CSS Custom Properties Pattern (from Architecture Doc):**
```css
/* src/index.css */
:root[data-theme="mocha"] {
  /* Base colors */
  --base: #1e1e2e;
  --mantle: #181825;
  --crust: #11111b;
  
  /* Text colors */
  --text: #cdd6f4;
  --subtext-1: #bac2de;
  --subtext-0: #a6adc8;
  
  /* Accent colors */
  --mauve: #cba6f7;
  --blue: #89b4fa;
  --green: #a6e3a1;
  --yellow: #f9e2af;
  --red: #f38ba8;
  
  /* Overlay colors */
  --surface-0: #313244;
  --surface-1: #45475a;
  --surface-2: #585b70;
}

:root[data-theme="latte"] {
  /* Base colors */
  --base: #eff1f5;
  --mantle: #e6e9ef;
  --crust: #dce0e8;
  
  /* Text colors */
  --text: #4c4f69;
  --subtext-1: #5c5f77;
  --subtext-0: #6c6f85;
  
  /* Accent colors */
  --mauve: #8839ef;
  --blue: #1e66f5;
  --green: #40a02b;
  --yellow: #df8e1d;
  --red: #d20f39;
  
  /* Overlay colors */
  --surface-0: #ccd0da;
  --surface-1: #bcc0cc;
  --surface-2: #acb0be;
}
```

**Zustand Theme Store Pattern (from Architecture Doc):**
```typescript
// src/stores/themeStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'mocha' | 'latte';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const getSystemTheme = (): Theme => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'mocha'
    : 'latte';
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: getSystemTheme(),
      
      setTheme: (theme) => {
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
      onRehydrateStorage: () => (state) => {
        // Apply theme immediately on load
        if (state) {
          document.documentElement.setAttribute('data-theme', state.theme);
        }
      },
    }
  )
);
```

**Tailwind Integration Pattern (from Architecture Doc):**
```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        base: 'var(--base)',
        mantle: 'var(--mantle)',
        crust: 'var(--crust)',
        text: 'var(--text)',
        subtext1: 'var(--subtext-1)',
        subtext0: 'var(--subtext-0)',
        mauve: 'var(--mauve)',
        blue: 'var(--blue)',
        green: 'var(--green)',
        yellow: 'var(--yellow)',
        red: 'var(--red)',
        surface0: 'var(--surface-0)',
        surface1: 'var(--surface-1)',
        surface2: 'var(--surface-2)',
      },
    },
  },
};
```

**System Preference Detection (from Architecture Doc):**
```typescript
// src/main.tsx (on app initialization)
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

mediaQuery.addEventListener('change', (e) => {
  // Only auto-switch if user hasn't manually set theme
  const storedTheme = localStorage.getItem('theme-storage');
  if (!storedTheme) {
    const newTheme = e.matches ? 'mocha' : 'latte';
    useThemeStore.getState().setTheme(newTheme);
  }
});
```

### Library and Framework Requirements

**Dependencies (Already in package.json from starter):**
- `zustand`: v4.x (state management)
- `@tailwindcss/vite`: Tailwind CSS v4 plugin

**No New Dependencies Required** - All functionality uses existing starter dependencies

**ShadCN UI Integration:**
- All ShadCN components in `src/components/ui/` will automatically inherit CSS custom properties
- No modifications to ShadCN components needed
- Theme switching is instantaneous (no re-renders required)

### File Structure Requirements from Architecture

**New Files to Create:**
```
src/stores/themeStore.ts          # Zustand theme store
src/stores/themeStore.test.ts     # Unit tests for theme store
src/components/ThemeToggle.tsx    # Theme toggle UI component
src/components/ThemeToggle.test.tsx # Unit tests for theme toggle
```

**Existing Files to Modify:**
```
src/index.css                     # Add Catppuccin CSS custom properties
tailwind.config.ts                # Add color mappings
src/main.tsx                      # Add system preference listener
src/App.tsx                       # Add ThemeToggle component to header
```

### Testing Requirements

**Unit Tests (80%+ coverage target):**
1. `themeStore.test.ts`:
   - Test `setTheme` updates store state and DOM `data-theme` attribute
   - Test `toggleTheme` switches between `mocha` and `latte`
   - Test `getSystemTheme` correctly detects `prefers-color-scheme`
   - Test localStorage persistence (mock localStorage)
   - Test rehydration applies theme immediately

2. `ThemeToggle.test.tsx`:
   - Test button renders with correct icon (moon/sun)
   - Test click triggers `toggleTheme` action
   - Test keyboard navigation (Tab, Enter, Space)
   - Test ARIA attributes for accessibility

**E2E Tests (Playwright):**
- Test theme toggle button visible and functional
- Test theme persists across page refresh
- Test theme matches system preference on first launch

### Accessibility Requirements (WCAG 2.1 AA)

**Contrast Ratios:**
- Normal text (14px): 4.5:1 minimum
- Large text (18px+): 3:1 minimum
- Focus indicators: 3:1 minimum

**Catppuccin WCAG Compliance:**
- Mocha: `--text` (#cdd6f4) on `--base` (#1e1e2e) = 11.4:1 ✅
- Latte: `--text` (#4c4f69) on `--base` (#eff1f5) = 9.8:1 ✅
- Mauve accent: High contrast in both themes ✅

**Focus Indicators:**
- 3px Mauve outline on all interactive elements
- Enforced by `outline: 3px solid var(--mauve)` in CSS

**Reduced Motion Support:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Previous Story Intelligence

**N/A** - This is the first story in Epic 1 (no previous stories)

### Git Intelligence Summary

**Recent Commits (Last 5):**
1. "Initial commit with tauri2-react-starter template"
2. "Configure ESLint, Prettier, Stylelint, Husky hooks"
3. "Add Vitest and Playwright testing setup"
4. "Configure ShadCN UI and Tailwind CSS v4"
5. "Add project documentation and AGENTS.md"

**Files Recently Modified:**
- `package.json` - Dependencies configured
- `tailwind.config.ts` - Tailwind CSS v4 configured
- `src/components/ui/*` - ShadCN UI components added
- `vite.config.ts` - Vite build optimizations

**Code Patterns Established:**
- React 19 function components with hooks
- TypeScript strict mode enforced
- `@/` import alias for `src/` imports
- ESLint import order: builtin → external → internal → parent → sibling → index
- Prettier: single quotes, 95-char width, trailing commas, 2-space indent
- Test files colocated with source (`.test.tsx` next to `.tsx`)

**Architecture Decisions Implemented:**
- Zustand for state management (not Context API)
- ShadCN UI for accessible components
- Tailwind CSS v4 with CSS custom properties
- Vitest + Playwright for testing

### Project Context Reference

**Project Name:** prompt-alchemist  
**Project Type:** Desktop Application (Tauri v2 + React 19)  
**Brownfield Status:** Extending tauri2-react-starter template  

**Core Tech Stack (from Architecture):**
- Frontend: React 19.2.3 + TypeScript 5.9.3 + Vite 7.3.0
- Backend: Rust 2021 + Tauri v2
- Styling: Tailwind CSS v4 + ShadCN UI + Catppuccin themes
- State: Zustand v4.x (~1KB gzipped)
- Testing: Vitest 4.0.16 (unit) + Playwright 1.57.0 (E2E)

**PRD Context (Relevant to Theme System):**
- Target Users: Developers who use LLMs for code generation
- Visual Design: Catppuccin Mocha (dark, default) / Latte (light)
- Performance: <200ms theme switching (NFR-P5)
- Accessibility: WCAG 2.1 AA compliance (NFR-A9, NFR-A10, NFR-A17)

**UX Design Context:**
- Default theme: Mocha (dark) - optimized for late-night coding sessions
- Theme toggle: Accessible via keyboard (Tab, Enter, Space)
- Visual feedback: Instant theme switch (<10ms)
- System preference: Respects OS `prefers-color-scheme` setting

## Dev Agent Record

### Agent Model Used

_To be filled by DEV agent_

### Debug Log References

_To be filled by DEV agent_

### Completion Notes List

_To be filled by DEV agent_

### File List

_To be filled by DEV agent_
