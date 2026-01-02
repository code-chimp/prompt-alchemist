# Story 1.3: Zustand State Management Setup

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want to set up Zustand stores for global application state,
So that state is managed predictably, performantly, and accessible across all components.

## Acceptance Criteria

**Given** the application initializes
**When** the React app mounts
**Then** the following Zustand stores are created and available:
  - `useSnippetStore`: manages snippet library data (snippets array, CRUD operations, usage metadata)
  - `useSettingsStore`: manages user preferences (theme, panel widths, window state)
  - `useUIStore`: manages UI state (active category, search open/closed, selected framework)

**Given** any component needs to access snippet data
**When** the component imports `useSnippetStore`
**Then** the component can read snippets array reactively
**And** changes to snippets trigger re-renders only in subscribed components
**And** store methods (addSnippet, updateSnippet, deleteSnippet) are available

**Given** a snippet is created, edited, or deleted
**When** the store method is called
**Then** the state updates immediately (<50ms)
**And** subscribed components re-render with new data
**And** the change is persisted to JSON file via Tauri IPC (handled in Story 1.4)

**Given** the application is in development mode
**When** Zustand devtools are enabled
**Then** state changes are visible in browser devtools for debugging
**And** time-travel debugging is functional

**Given** the stores are initialized
**When** measuring bundle size impact
**Then** Zustand adds <2KB gzipped to the bundle (verifies lightweight state management)

## Tasks / Subtasks

- [ ] Task 1: Create snippet library store (AC: useSnippetStore available)
  - [ ] Subtask 1.1: Create `src/stores/snippetStore.ts` with TypeScript interfaces
  - [ ] Subtask 1.2: Implement CRUD actions (addSnippet, updateSnippet, deleteSnippet, incrementUseCount)
  - [ ] Subtask 1.3: Add loading/error state for async operations
  - [ ] Subtask 1.4: Add devtools middleware for development debugging
  
- [ ] Task 2: Create settings store (AC: useSettingsStore available, theme persistence)
  - [ ] Subtask 2.1: Create `src/stores/settingsStore.ts` with persist middleware
  - [ ] Subtask 2.2: Migrate theme state from Story 1.1 themeStore to settingsStore
  - [ ] Subtask 2.3: Add panelWidths state (from Story 1.2 requirements)
  - [ ] Subtask 2.4: Add window state properties (position, size) for Story 1.6
  
- [ ] Task 3: Create UI state store (AC: useUIStore available)
  - [ ] Subtask 3.1: Create `src/stores/uiStore.ts` for ephemeral UI state
  - [ ] Subtask 3.2: Add activeCategory state (personas/constraints/guardrails)
  - [ ] Subtask 3.3: Add search modal state (isOpen, query)
  - [ ] Subtask 3.4: Add selectedFramework state (rtf/coder/costar)
  
- [ ] Task 4: Write comprehensive unit tests for all stores (AC: All)
  - [ ] Subtask 4.1: Test snippetStore CRUD operations and state updates
  - [ ] Subtask 4.2: Test settingsStore persistence (mock localStorage)
  - [ ] Subtask 4.3: Test uiStore state transitions
  - [ ] Subtask 4.4: Test selective subscriptions trigger minimal re-renders
  
- [ ] Task 5: Create barrel export and integration helpers (AC: Easy imports)
  - [ ] Subtask 5.1: Create `src/stores/index.ts` barrel export
  - [ ] Subtask 5.2: Document store usage patterns in README or Dev Notes
  - [ ] Subtask 5.3: Add TypeScript types export for testing mocks

## Dev Notes

### Architecture Context

**State Management Overview:**
- **Implementation:** Zustand v4.x with middleware (persist, devtools)
- **Performance Target:** <2KB bundle impact, selective subscriptions prevent unnecessary re-renders
- **Persistence Strategy:** localStorage for settings via persist middleware, Tauri IPC for snippets (Story 1.4)
- **Testing Strategy:** Direct store testing (no Provider wrappers needed), easy mocking with `vi.mock()`

**Key Files to Create:**
1. `src/stores/snippetStore.ts` - Snippet library CRUD and state
2. `src/stores/settingsStore.ts` - User preferences with persistence (replaces themeStore from Story 1.1)
3. `src/stores/uiStore.ts` - Ephemeral UI state (no persistence)
4. `src/stores/index.ts` - Barrel export for clean imports
5. `src/stores/*.test.ts` - Unit tests for each store

**Key Files to Modify/Delete:**
- **DELETE:** `src/stores/themeStore.ts` (from Story 1.1) - migrate to settingsStore
- **UPDATE:** Story 1.2 components that reference settingsStore (if created early)

### Technical Requirements from Architecture

**Zustand Store Pattern (from Architecture Doc):**

The architecture document specifies Zustand v4.x as the state management solution with three distinct stores:

**1. Snippet Library Store (`src/stores/snippetStore.ts`):**

```typescript
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface Snippet {
  id: string;
  name: string;
  type: 'persona' | 'guardrail' | 'constraint';
  content: string;
  tags: string[];
  metadata: {
    created: string; // ISO8601 timestamp
    lastUsed: string; // ISO8601 timestamp
    useCount: number;
  };
}

interface SnippetStoreState {
  snippets: Snippet[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadSnippets: () => Promise<void>;
  addSnippet: (snippet: Omit<Snippet, 'id' | 'metadata'>) => void;
  updateSnippet: (id: string, updates: Partial<Snippet>) => void;
  deleteSnippet: (id: string) => void;
  incrementUseCount: (id: string) => void;
}

export const useSnippetStore = create<SnippetStoreState>()(
  devtools(
    (set, get) => ({
      snippets: [],
      isLoading: false,
      error: null,

      loadSnippets: async () => {
        set({ isLoading: true, error: null });
        try {
          // Story 1.4 will implement Tauri IPC for loading
          // For now, initialize with empty array or mock data
          set({ snippets: [], isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to load snippets',
            isLoading: false,
          });
        }
      },

      addSnippet: (snippet) => {
        const newSnippet: Snippet = {
          ...snippet,
          id: crypto.randomUUID(),
          metadata: {
            created: new Date().toISOString(),
            lastUsed: new Date().toISOString(),
            useCount: 0,
          },
        };
        set((state) => ({
          snippets: [...state.snippets, newSnippet],
        }));
        // Story 1.4 will add saveSnippets() call here
      },

      updateSnippet: (id, updates) => {
        set((state) => ({
          snippets: state.snippets.map((snippet) =>
            snippet.id === id ? { ...snippet, ...updates } : snippet
          ),
        }));
        // Story 1.4 will add saveSnippets() call here
      },

      deleteSnippet: (id) => {
        set((state) => ({
          snippets: state.snippets.filter((snippet) => snippet.id !== id),
        }));
        // Story 1.4 will add saveSnippets() call here
      },

      incrementUseCount: (id) => {
        set((state) => ({
          snippets: state.snippets.map((snippet) =>
            snippet.id === id
              ? {
                  ...snippet,
                  metadata: {
                    ...snippet.metadata,
                    lastUsed: new Date().toISOString(),
                    useCount: snippet.metadata.useCount + 1,
                  },
                }
              : snippet
          ),
        }));
        // Story 1.4 will add saveSnippets() call here
      },
    }),
    { name: 'SnippetStore' } // Devtools name
  )
);
```

**2. Settings Store (`src/stores/settingsStore.ts`):**

**CRITICAL:** This store **replaces** the `themeStore` from Story 1.1. Migrate theme functionality here.

```typescript
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

type Theme = 'mocha' | 'latte';

interface SettingsStoreState {
  // Theme (migrated from Story 1.1 themeStore)
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;

  // Panel widths (from Story 1.2)
  panelWidths: {
    sidebar: number;
    library: number;
    preview: number;
  };
  setPanelWidths: (widths: Partial<SettingsStoreState['panelWidths']>) => void;

  // Window state (for Story 1.6)
  windowState: {
    width: number;
    height: number;
    x: number;
    y: number;
  };
  setWindowState: (state: Partial<SettingsStoreState['windowState']>) => void;
}

const getSystemTheme = (): Theme => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'mocha'
    : 'latte';
};

export const useSettingsStore = create<SettingsStoreState>()(
  devtools(
    persist(
      (set, get) => ({
        // Theme defaults
        theme: getSystemTheme(),

        setTheme: (theme) => {
          document.documentElement.setAttribute('data-theme', theme);
          set({ theme });
        },

        toggleTheme: () => {
          const newTheme = get().theme === 'mocha' ? 'latte' : 'mocha';
          get().setTheme(newTheme);
        },

        // Panel width defaults
        panelWidths: {
          sidebar: 5,
          library: 28,
          preview: 67,
        },

        setPanelWidths: (widths) =>
          set((state) => ({
            panelWidths: { ...state.panelWidths, ...widths },
          })),

        // Window state defaults (800x600 at 100,100)
        windowState: {
          width: 800,
          height: 600,
          x: 100,
          y: 100,
        },

        setWindowState: (state) =>
          set((prevState) => ({
            windowState: { ...prevState.windowState, ...state },
          })),
      }),
      {
        name: 'settings-storage', // localStorage key
        // Apply theme immediately on rehydration
        onRehydrateStorage: () => (state) => {
          if (state) {
            document.documentElement.setAttribute('data-theme', state.theme);
          }
        },
      }
    ),
    { name: 'SettingsStore' } // Devtools name
  )
);
```

**3. UI State Store (`src/stores/uiStore.ts`):**

```typescript
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type Category = 'personas' | 'constraints' | 'guardrails';
type Framework = 'rtf' | 'coder' | 'costar';

interface UIStoreState {
  // Sidebar category selection
  activeCategory: Category;
  setActiveCategory: (category: Category) => void;

  // Search modal state
  isSearchOpen: boolean;
  searchQuery: string;
  openSearch: () => void;
  closeSearch: () => void;
  setSearchQuery: (query: string) => void;

  // Framework selection (for Epic 3)
  selectedFramework: Framework;
  setFramework: (framework: Framework) => void;
}

export const useUIStore = create<UIStoreState>()(
  devtools(
    (set) => ({
      // Sidebar defaults
      activeCategory: 'personas',
      setActiveCategory: (category) => set({ activeCategory: category }),

      // Search defaults
      isSearchOpen: false,
      searchQuery: '',
      openSearch: () => set({ isSearchOpen: true }),
      closeSearch: () => set({ isSearchOpen: false, searchQuery: '' }),
      setSearchQuery: (query) => set({ searchQuery: query }),

      // Framework defaults
      selectedFramework: 'rtf',
      setFramework: (framework) => set({ selectedFramework: framework }),
    }),
    { name: 'UIStore' } // Devtools name
  )
);
```

**Barrel Export Pattern (`src/stores/index.ts`):**

```typescript
export { useSnippetStore } from './snippetStore';
export { useSettingsStore } from './settingsStore';
export { useUIStore } from './uiStore';

export type { Snippet } from './snippetStore';
```

**Usage in Components:**

```typescript
// Selective subscription (only re-renders when snippets change)
import { useSnippetStore } from '@/stores';

function SnippetList() {
  const snippets = useSnippetStore((state) => state.snippets);
  const deleteSnippet = useSnippetStore((state) => state.deleteSnippet);

  return (
    <ul>
      {snippets.map((snippet) => (
        <li key={snippet.id}>
          {snippet.name}
          <button onClick={() => deleteSnippet(snippet.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
```

### Library and Framework Requirements

**Existing Dependencies (Already Installed):**
- `zustand@^4.5.0` - Already added in Story 1.1 for theme management

**No New Dependencies Required** ✅

**Zustand Middleware:**
- `persist`: Built into Zustand, used for settingsStore localStorage persistence
- `devtools`: Built into Zustand, enabled in development for time-travel debugging

**TypeScript Configuration:**
- Zustand is fully typed, no `@types` package needed
- Export store types for testing: `export type { Snippet } from './snippetStore'`

### File Structure Requirements from Architecture

**New Files to Create:**

```
src/stores/
├── snippetStore.ts              # Snippet library CRUD and state
├── snippetStore.test.ts         # Unit tests for snippet store
├── settingsStore.ts             # User preferences with persistence
├── settingsStore.test.ts        # Unit tests for settings store
├── uiStore.ts                   # Ephemeral UI state (no persistence)
├── uiStore.test.ts              # Unit tests for UI store
└── index.ts                     # Barrel export
```

**Files to Delete (Migration):**
```
src/stores/themeStore.ts         # DELETE - theme moved to settingsStore
src/stores/themeStore.test.ts    # DELETE - tests moved to settingsStore.test.ts
```

**Files to Update (if already created in Story 1.2):**
```
src/components/Layout/MainLayout.tsx    # Update: import from settingsStore instead of standalone
src/components/Layout/Sidebar.tsx       # Update: use uiStore for activeCategory
src/App.tsx                              # Update: remove themeStore import, use settingsStore
```

### Testing Requirements

**Unit Tests (80%+ coverage target):**

**1. snippetStore.test.ts:**
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { useSnippetStore } from './snippetStore';

describe('snippetStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useSnippetStore.setState({ snippets: [], isLoading: false, error: null });
  });

  it('should add snippet with generated ID and metadata', () => {
    const { addSnippet, snippets } = useSnippetStore.getState();
    
    addSnippet({
      name: 'Senior Developer',
      type: 'persona',
      content: 'You are a senior developer...',
      tags: ['developer', 'senior'],
    });

    const state = useSnippetStore.getState();
    expect(state.snippets).toHaveLength(1);
    expect(state.snippets[0].id).toBeDefined();
    expect(state.snippets[0].metadata.created).toBeDefined();
    expect(state.snippets[0].metadata.useCount).toBe(0);
  });

  it('should update snippet by ID', () => {
    const { addSnippet, updateSnippet, snippets } = useSnippetStore.getState();
    
    addSnippet({
      name: 'Original Name',
      type: 'persona',
      content: 'Original content',
      tags: [],
    });

    const snippetId = useSnippetStore.getState().snippets[0].id;
    updateSnippet(snippetId, { name: 'Updated Name' });

    const state = useSnippetStore.getState();
    expect(state.snippets[0].name).toBe('Updated Name');
    expect(state.snippets[0].content).toBe('Original content'); // Unchanged
  });

  it('should delete snippet by ID', () => {
    const { addSnippet, deleteSnippet } = useSnippetStore.getState();
    
    addSnippet({ name: 'Test', type: 'persona', content: 'Test', tags: [] });
    const snippetId = useSnippetStore.getState().snippets[0].id;
    
    deleteSnippet(snippetId);

    const state = useSnippetStore.getState();
    expect(state.snippets).toHaveLength(0);
  });

  it('should increment use count and update lastUsed timestamp', () => {
    const { addSnippet, incrementUseCount } = useSnippetStore.getState();
    
    addSnippet({ name: 'Test', type: 'persona', content: 'Test', tags: [] });
    const snippetId = useSnippetStore.getState().snippets[0].id;
    const originalLastUsed = useSnippetStore.getState().snippets[0].metadata.lastUsed;

    // Wait 10ms to ensure timestamp changes
    setTimeout(() => {
      incrementUseCount(snippetId);

      const state = useSnippetStore.getState();
      expect(state.snippets[0].metadata.useCount).toBe(1);
      expect(state.snippets[0].metadata.lastUsed).not.toBe(originalLastUsed);
    }, 10);
  });

  it('should trigger selective re-renders only for subscribed state', () => {
    // This test verifies Zustand's selective subscription behavior
    let renderCount = 0;

    const unsubscribe = useSnippetStore.subscribe(
      (state) => state.snippets,
      () => {
        renderCount++;
      }
    );

    // Trigger state change
    useSnippetStore.getState().addSnippet({
      name: 'Test',
      type: 'persona',
      content: 'Test',
      tags: [],
    });

    expect(renderCount).toBe(1);

    // Change isLoading (not subscribed) - should NOT trigger callback
    useSnippetStore.setState({ isLoading: true });
    expect(renderCount).toBe(1); // Still 1, not 2

    unsubscribe();
  });
});
```

**2. settingsStore.test.ts:**
```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useSettingsStore } from './settingsStore';

describe('settingsStore', () => {
  beforeEach(() => {
    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
    global.localStorage = localStorageMock as any;

    // Reset store
    useSettingsStore.setState({
      theme: 'mocha',
      panelWidths: { sidebar: 5, library: 28, preview: 67 },
      windowState: { width: 800, height: 600, x: 100, y: 100 },
    });
  });

  it('should toggle theme between mocha and latte', () => {
    const { toggleTheme, theme } = useSettingsStore.getState();
    
    expect(theme).toBe('mocha');
    toggleTheme();
    expect(useSettingsStore.getState().theme).toBe('latte');
    toggleTheme();
    expect(useSettingsStore.getState().theme).toBe('mocha');
  });

  it('should update data-theme attribute on setTheme', () => {
    const { setTheme } = useSettingsStore.getState();
    
    setTheme('latte');
    expect(document.documentElement.getAttribute('data-theme')).toBe('latte');
  });

  it('should persist panelWidths to localStorage', () => {
    const { setPanelWidths } = useSettingsStore.getState();
    
    setPanelWidths({ library: 35 });

    const state = useSettingsStore.getState();
    expect(state.panelWidths.library).toBe(35);
    expect(state.panelWidths.sidebar).toBe(5); // Unchanged
    
    // Verify persist middleware called localStorage.setItem
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it('should restore theme from localStorage on rehydration', () => {
    // Mock localStorage returning saved theme
    (localStorage.getItem as any).mockReturnValue(
      JSON.stringify({ state: { theme: 'latte' }, version: 0 })
    );

    // Trigger rehydration (simulate app restart)
    const { theme } = useSettingsStore.getState();
    
    expect(theme).toBe('latte');
    expect(document.documentElement.getAttribute('data-theme')).toBe('latte');
  });
});
```

**3. uiStore.test.ts:**
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore } from './uiStore';

describe('uiStore', () => {
  beforeEach(() => {
    useUIStore.setState({
      activeCategory: 'personas',
      isSearchOpen: false,
      searchQuery: '',
      selectedFramework: 'rtf',
    });
  });

  it('should change active category', () => {
    const { setActiveCategory } = useUIStore.getState();
    
    setActiveCategory('constraints');
    expect(useUIStore.getState().activeCategory).toBe('constraints');
  });

  it('should open and close search modal', () => {
    const { openSearch, closeSearch, isSearchOpen } = useUIStore.getState();
    
    expect(isSearchOpen).toBe(false);
    openSearch();
    expect(useUIStore.getState().isSearchOpen).toBe(true);
    closeSearch();
    expect(useUIStore.getState().isSearchOpen).toBe(false);
  });

  it('should clear search query when closing search', () => {
    const { openSearch, setSearchQuery, closeSearch } = useUIStore.getState();
    
    openSearch();
    setSearchQuery('test query');
    expect(useUIStore.getState().searchQuery).toBe('test query');
    
    closeSearch();
    expect(useUIStore.getState().searchQuery).toBe('');
  });

  it('should change selected framework', () => {
    const { setFramework } = useUIStore.getState();
    
    setFramework('coder');
    expect(useUIStore.getState().selectedFramework).toBe('coder');
  });
});
```

**Integration Test (Component + Store):**

```typescript
// Example: Test Sidebar component with uiStore integration
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { Sidebar } from '@/components/Layout/Sidebar';
import { useUIStore } from '@/stores';

describe('Sidebar + uiStore integration', () => {
  beforeEach(() => {
    useUIStore.setState({ activeCategory: 'personas' });
  });

  it('should update store when category button clicked', () => {
    render(<Sidebar />);
    
    const constraintsButton = screen.getByLabelText('Constraints');
    fireEvent.click(constraintsButton);

    expect(useUIStore.getState().activeCategory).toBe('constraints');
  });
});
```

### Accessibility Requirements (WCAG 2.1 AA)

**No Direct Accessibility Impact:**
- Zustand stores are state management only (no UI components)
- Accessibility handled at component level (Stories 1.1, 1.2, Epic 2/3)

**Indirect Benefits for Accessibility:**
- uiStore tracks `isSearchOpen` for modal state (proper focus management in Epic 4)
- settingsStore persists theme preference (supports user's vision preferences)
- Selective subscriptions prevent unnecessary re-renders (improves screen reader experience)

### Previous Story Intelligence

**Learnings from Story 1.1 (Catppuccin Theme System):**

Story 1.1 created a standalone `themeStore` that Story 1.3 must now **migrate** into `settingsStore`.

**CRITICAL MIGRATION STEPS:**

1. **Copy theme logic from Story 1.1 themeStore:**
   - `theme` state (mocha/latte)
   - `setTheme()` action with `data-theme` attribute update
   - `toggleTheme()` action
   - `getSystemTheme()` helper function
   - `onRehydrateStorage` callback for immediate theme application

2. **Delete old themeStore files:**
   - `src/stores/themeStore.ts`
   - `src/stores/themeStore.test.ts`

3. **Update imports in existing components:**
   - Story 1.1 created `ThemeToggle` component - update to use `useSettingsStore`
   - `src/App.tsx` likely imports themeStore - update to settingsStore
   - Any other components using `useThemeStore` → `useSettingsStore`

**Learnings from Story 1.2 (Three-Panel Layout):**

Story 1.2 already references `settingsStore` in its implementation notes for panel width persistence.

**INTEGRATION POINTS:**

1. **settingsStore.panelWidths:**
   - Story 1.2's MainLayout component will use `useSettingsStore((state) => state.panelWidths)`
   - `react-resizable-panels` onLayout callback calls `setPanelWidths()`

2. **uiStore.activeCategory:**
   - Story 1.2's Sidebar component should use `useUIStore` for category state
   - Remove local `useState` from Sidebar.tsx, use store instead

**Code Pattern from Story 1.2 to Update:**

```typescript
// BEFORE (Story 1.2 placeholder - if implemented)
import { useState } from 'react';

export function Sidebar() {
  const [activeCategory, setActiveCategory] = useState<Category>('personas');
  // ...
}

// AFTER (Story 1.3 - use uiStore)
import { useUIStore } from '@/stores';

export function Sidebar() {
  const activeCategory = useUIStore((state) => state.activeCategory);
  const setActiveCategory = useUIStore((state) => state.setActiveCategory);
  // ...
}
```

### Git Intelligence Summary

**Recent Commits (Last 5):**
1. **7662be0** - Merge PR #4: test design, implementation readiness check, sprint status
2. **2ad96b2** - Finalize design: test strategy, implementation readiness check, generate sprint status
3. **4fec2ac** - Upgrade BMAD to v6 alpha.22
4. **1d5517d** - Merge PR #3: architecture specs
5. **8c880c7** - Generate architecture document, create epics and stories

**Code Patterns Established (Continue Following):**

1. **Zustand Store Pattern (from Story 1.1):**
   ```typescript
   // Pattern: create<State>()(middleware((set, get) => ({ ... })))
   export const useStore = create<State>()(
     persist(
       (set, get) => ({ /* state */ }),
       { name: 'storage-key' }
     )
   );
   ```

2. **TypeScript Interface Exports:**
   ```typescript
   // Export types for testing and component usage
   export interface Snippet { /* ... */ }
   export type { Snippet };
   ```

3. **Testing with Vitest:**
   ```typescript
   // Pattern: beforeEach reset, getState() for direct access
   beforeEach(() => {
     useStore.setState({ /* reset */ });
   });
   
   it('should...', () => {
     const { action } = useStore.getState();
     action();
     expect(useStore.getState().value).toBe(expected);
   });
   ```

4. **Import Alias:**
   ```typescript
   // Use @/ for src/ imports
   import { useSnippetStore } from '@/stores';
   ```

### Latest Technical Information

**Zustand v4.5.x (Latest Stable as of 2026-01-01):**

**Key Features:**
- **TypeScript-first:** Fully typed, no `@types` package needed
- **Middleware:** `persist` (localStorage), `devtools` (Redux DevTools), `immer` (immutable updates - optional)
- **Selective Subscriptions:** `useStore((state) => state.field)` only re-renders when `field` changes
- **No Provider Wrapper:** Unlike Context API, no `<Provider>` needed in App.tsx

**Breaking Changes from v3.x:**
- **NONE** - v4.5 is backward compatible with v4.0+
- If upgrading from v3.x: Middleware API changed (see migration guide), but this is a new project on v4.x

**Performance Characteristics:**
- **Bundle Size:** ~1KB gzipped (core), +500 bytes per middleware
- **Update Speed:** <1ms for typical state updates
- **Render Optimization:** Shallow equality checks by default (use `shallow` from `zustand/shallow` for deep comparisons if needed)

**Devtools Middleware (Development Only):**

```typescript
import { devtools } from 'zustand/middleware';

export const useStore = create<State>()(
  devtools(
    (set) => ({ /* state */ }),
    { name: 'StoreName' } // Shows in Redux DevTools
  )
);
```

**Benefits:**
- Time-travel debugging (rewind/forward state changes)
- Action history tracking
- State snapshots for debugging

**Production Build:**
- Devtools middleware is tree-shaken in production (0 bytes)
- No performance impact in production

**Persist Middleware (localStorage):**

```typescript
import { persist } from 'zustand/middleware';

export const useStore = create<State>()(
  persist(
    (set) => ({ /* state */ }),
    {
      name: 'storage-key',
      onRehydrateStorage: () => (state) => {
        // Callback after state restored from localStorage
        console.log('Rehydrated:', state);
      },
    }
  )
);
```

**Common Pitfalls to Avoid:**

1. **Don't nest objects unnecessarily:**
   ```typescript
   // ❌ BAD: Nested state makes updates verbose
   interface State {
     user: {
       profile: {
         name: string;
       };
     };
   }
   
   // ✅ GOOD: Flat state is easier to update
   interface State {
     userName: string;
   }
   ```

2. **Don't use getState() in render:**
   ```typescript
   // ❌ BAD: Won't trigger re-renders
   function Component() {
     const snippets = useSnippetStore.getState().snippets; // Static!
   }
   
   // ✅ GOOD: Use hook for reactive updates
   function Component() {
     const snippets = useSnippetStore((state) => state.snippets);
   }
   ```

3. **Don't over-persist (performance impact):**
   ```typescript
   // ❌ BAD: Persisting ephemeral UI state is wasteful
   persist(
     (set) => ({ isModalOpen: false }),
     { name: 'ui-storage' } // Don't persist modal state!
   );
   
   // ✅ GOOD: Only persist meaningful user preferences
   persist(
     (set) => ({ theme: 'mocha' }),
     { name: 'settings-storage' } // Theme is a preference
   );
   ```

**Testing Best Practices:**

```typescript
// Direct store access for testing (no Provider needed)
import { useSnippetStore } from './snippetStore';

it('should add snippet', () => {
  const { addSnippet, snippets } = useSnippetStore.getState();
  
  addSnippet({ name: 'Test', type: 'persona', content: 'Test', tags: [] });
  
  expect(useSnippetStore.getState().snippets).toHaveLength(1);
});

// Reset store before each test
beforeEach(() => {
  useSnippetStore.setState({ snippets: [], isLoading: false, error: null });
});
```

**Mocking Stores in Component Tests:**

```typescript
import { vi } from 'vitest';

vi.mock('@/stores/snippetStore', () => ({
  useSnippetStore: vi.fn(() => ({
    snippets: [
      { id: '1', name: 'Mock Snippet', type: 'persona', content: 'Mock', tags: [], metadata: {} },
    ],
    addSnippet: vi.fn(),
  })),
}));

// Now components using useSnippetStore will get mock data
render(<SnippetList />);
```

### Cross-Cutting Concerns

**Error Handling:**
- snippetStore CRUD operations are synchronous (errors handled in Story 1.4 Tauri IPC layer)
- settingsStore persist middleware fails silently if localStorage is disabled (acceptable fallback: use defaults)
- uiStore has no async operations (no error handling needed)

**Performance Optimization:**
- **Selective Subscriptions:** Always use `useStore((state) => state.field)` not `useStore()` (entire state)
- **Shallow Equality:** Zustand uses `Object.is()` by default (sufficient for primitive values)
- **Immer Middleware:** NOT recommended for this project (adds 10KB, unnecessary for simple updates)

**Security Considerations:**
- localStorage persistence is safe (user's own machine, no server transmission)
- crypto.randomUUID() for snippet IDs is cryptographically secure (prevents ID collisions)
- No XSS risk: Zustand stores JavaScript objects, not HTML strings

**Future Extensibility:**
- Story 1.4 will add Tauri IPC calls to snippetStore (`loadSnippets()`, `saveSnippets()`)
- Story 1.6 will use `windowState` from settingsStore for window position/size persistence
- Epic 2 will add more snippet store actions (search, filter, export)
- Epic 3 will add composition store for prompt framework state

### Code Anti-Patterns to Avoid

**❌ DON'T: Use Context API instead of Zustand**
```typescript
// BAD: Context API requires Provider wrappers and causes re-render issues
const ThemeContext = createContext<ThemeState | undefined>(undefined);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState<Theme>('mocha');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

**✅ DO: Use Zustand stores (no Provider needed)**
```typescript
// GOOD: Clean, no wrappers, selective subscriptions
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({ theme: 'mocha', setTheme: (theme) => set({ theme }) }),
    { name: 'settings-storage' }
  )
);
```

**❌ DON'T: Subscribe to entire store (causes unnecessary re-renders)**
```typescript
// BAD: Component re-renders whenever ANY store field changes
function Component() {
  const store = useSnippetStore(); // ALL state subscribed!
  return <div>{store.snippets.length}</div>;
}
```

**✅ DO: Use selective subscriptions**
```typescript
// GOOD: Only re-renders when snippets array changes
function Component() {
  const snippets = useSnippetStore((state) => state.snippets);
  return <div>{snippets.length}</div>;
}
```

**❌ DON'T: Mutate state directly**
```typescript
// BAD: Direct mutation doesn't trigger re-renders
const { snippets } = useSnippetStore.getState();
snippets.push(newSnippet); // WRONG!
```

**✅ DO: Use set() with immutable updates**
```typescript
// GOOD: Immutable update triggers re-renders
set((state) => ({
  snippets: [...state.snippets, newSnippet],
}));
```

**❌ DON'T: Create multiple stores for related state**
```typescript
// BAD: Theme and panel widths are both settings, should be one store
export const useThemeStore = create(/* ... */);
export const usePanelStore = create(/* ... */);
export const useWindowStore = create(/* ... */);
```

**✅ DO: Group related state in one store**
```typescript
// GOOD: All settings in one place
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'mocha',
      panelWidths: { /* ... */ },
      windowState: { /* ... */ },
      // All related settings together
    }),
    { name: 'settings-storage' }
  )
);
```

### Developer Checklist

Before marking this story complete, verify:

- [ ] `src/stores/snippetStore.ts` created with CRUD actions and devtools middleware
- [ ] `src/stores/settingsStore.ts` created with persist middleware
- [ ] `src/stores/uiStore.ts` created for ephemeral UI state
- [ ] `src/stores/index.ts` barrel export created for clean imports
- [ ] Story 1.1 `themeStore.ts` **deleted** (theme migrated to settingsStore)
- [ ] Story 1.1 `ThemeToggle` component updated to use settingsStore
- [ ] Story 1.2 `Sidebar` component updated to use uiStore (if already created)
- [ ] Story 1.2 `MainLayout` component updated to use settingsStore (if already created)
- [ ] Unit tests pass: 80%+ coverage for all three stores
- [ ] Devtools functional: Open Redux DevTools, verify stores visible (dev mode only)
- [ ] Bundle size check: `npm run build` confirms Zustand <2KB gzipped
- [ ] Selective subscriptions tested: Component re-renders only when subscribed field changes
- [ ] localStorage persistence tested: settingsStore persists across page refresh
- [ ] Theme application tested: `data-theme` attribute updates on setTheme()
- [ ] Type checking passes: `npm run check` confirms all store types are correct

### Integration with Previous Stories

**Story 1.1 (Catppuccin Theme System) → Story 1.3:**
- **Theme logic migrated:** settingsStore now owns theme state
- **ThemeToggle component updated:** Uses `useSettingsStore` not `useThemeStore`
- **System preference detection:** Moved to settingsStore initialization

**Story 1.2 (Three-Panel Layout) → Story 1.3:**
- **Panel widths persisted:** settingsStore.panelWidths used by MainLayout
- **Sidebar category state:** uiStore.activeCategory used by Sidebar component
- **Integration point:** react-resizable-panels calls setPanelWidths() on resize

**Combined Result After Story 1.3:**
✅ **Unified State Management:** All global state managed through three Zustand stores (snippet, settings, ui)  
✅ **Theme System Complete:** settingsStore handles theme with localStorage persistence  
✅ **Layout System Complete:** settingsStore handles panel widths with persistence  
✅ **Foundation Ready:** Story 1.4 will add Tauri IPC to snippetStore for JSON file persistence

## Dev Agent Record

### Agent Model Used

_To be filled by DEV agent_

### Debug Log References

_To be filled by DEV agent_

### Completion Notes List

_To be filled by DEV agent_

### File List

_To be filled by DEV agent_
