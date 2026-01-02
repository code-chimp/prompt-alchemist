# Story 1.2: Three-Panel Layout with Resizable Panels

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want to see a side-by-side layout with sidebar, library panel, and preview panel,
So that I can navigate categories, browse snippets, and compose prompts in a single view.

## Acceptance Criteria

**Given** the application is launched
**When** the main window renders
**Then** three panels are visible: sidebar (5% ~60px), library (28% min 280px), preview (67% min 400px)
**And** the sidebar displays category icons (P, C, G) vertically aligned
**And** the library panel is scrollable when content exceeds viewport height
**And** the preview panel is scrollable when content exceeds viewport height

**Given** the user hovers over the divider between library and preview panels
**When** the cursor changes to a resize indicator
**Then** the user can click and drag to adjust panel widths
**And** the library panel respects minimum width of 280px
**And** the preview panel respects minimum width of 400px

**Given** the user has resized the panels
**When** the user closes and reopens the application
**Then** the custom panel widths are restored from saved preferences

**Given** the application window is resized below 800px width
**When** the layout is constrained
**Then** the panels scale proportionally while respecting minimum widths
**And** horizontal scrolling is NOT introduced (layout remains functional)

**Given** the user navigates using Tab key
**When** focus moves between panels
**Then** focus order follows left-to-right: sidebar → library → preview
**And** focus indicators are visible (3px Mauve outline)

## Tasks / Subtasks

- [ ] Task 1: Create main layout container with CSS Grid (AC: Panel visibility and proportions)
  - [ ] Subtask 1.1: Create `src/components/Layout/MainLayout.tsx` with CSS Grid (5% + 28% + 67% columns)
  - [ ] Subtask 1.2: Add responsive min-width constraints (sidebar: none, library: 280px, preview: 400px)
  - [ ] Subtask 1.3: Implement overflow-y: auto for scrollable panels
  
- [ ] Task 2: Implement sidebar navigation component (AC: Category icons display)
  - [ ] Subtask 2.1: Create `src/components/Layout/Sidebar.tsx` with category buttons (P, C, G)
  - [ ] Subtask 2.2: Style icons with Catppuccin Mauve on active state
  - [ ] Subtask 2.3: Add keyboard navigation (Tab, Enter, Arrow keys)
  
- [ ] Task 3: Build resizable panel divider (AC: Drag-to-resize functionality)
  - [ ] Subtask 3.1: Install `react-resizable-panels` library (recommended by React ecosystem)
  - [ ] Subtask 3.2: Replace CSS Grid with ResizablePanelGroup + ResizablePanel components
  - [ ] Subtask 3.3: Add resize handle with visual indicator (col-resize cursor)
  - [ ] Subtask 3.4: Implement min-size constraints (library: 280px, preview: 400px)
  
- [ ] Task 4: Add panel width persistence to settings store (AC: Custom widths restore on reopen)
  - [ ] Subtask 4.1: Extend `src/stores/settingsStore.ts` with panelWidths state
  - [ ] Subtask 4.2: Add persist middleware to save layout preferences to localStorage
  - [ ] Subtask 4.3: Restore panelWidths on app initialization
  
- [ ] Task 5: Implement keyboard focus management (AC: Tab navigation order, focus indicators)
  - [ ] Subtask 5.1: Add tabIndex attributes to sidebar buttons, library items, preview sections
  - [ ] Subtask 5.2: Style focus states with 3px Mauve outline (from theme system)
  - [ ] Subtask 5.3: Test keyboard navigation flow (Tab, Shift+Tab)
  
- [ ] Task 6: Write unit tests for layout components (AC: All)
  - [ ] Subtask 6.1: Test MainLayout renders three panels with correct widths
  - [ ] Subtask 6.2: Test Sidebar renders category buttons and handles clicks
  - [ ] Subtask 6.3: Test resize functionality (mock react-resizable-panels)
  - [ ] Subtask 6.4: Test settings persistence (mock localStorage)
  
- [ ] Task 7: Write E2E tests for layout and navigation (AC: All)
  - [ ] Subtask 7.1: Test panels visible on app launch
  - [ ] Subtask 7.2: Test drag-to-resize changes panel widths
  - [ ] Subtask 7.3: Test panel widths persist across app restart
  - [ ] Subtask 7.4: Test keyboard focus order (Tab navigation)

## Dev Notes

### Architecture Context

**Layout System Overview:**
- **Implementation:** CSS Grid initially, migrate to `react-resizable-panels` for drag-to-resize
- **State Management:** Zustand settingsStore for panel width persistence
- **Performance Target:** <16ms layout calculations (60fps), smooth resize without lag
- **Accessibility:** WCAG 2.1 AA keyboard navigation, visible focus indicators

**Key Files to Create/Modify:**
1. `src/components/Layout/MainLayout.tsx` - Main 3-panel container
2. `src/components/Layout/Sidebar.tsx` - Category navigation sidebar
3. `src/components/Layout/LibraryPanel.tsx` - Snippet library display (placeholder for Epic 2)
4. `src/components/Layout/PreviewPanel.tsx` - Prompt composition area (placeholder for Epic 3)
5. `src/stores/settingsStore.ts` - Panel width persistence
6. `src/App.tsx` - Replace existing content with MainLayout

### Technical Requirements from Architecture

**React Resizable Panels Library Pattern (from Architecture Doc):**

The architecture document recommends `react-resizable-panels` by Brian Vaughn (creator of React DevTools) as the de facto standard for resizable layouts in React apps.

```typescript
// src/components/Layout/MainLayout.tsx
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

export function MainLayout() {
  return (
    <PanelGroup direction="horizontal" className="h-screen">
      {/* Sidebar - Fixed 5% width */}
      <Panel defaultSize={5} minSize={5} maxSize={5} className="bg-mantle">
        <Sidebar />
      </Panel>

      {/* Library Panel - Resizable, min 280px */}
      <Panel defaultSize={28} minSize={20} className="bg-base">
        <LibraryPanel />
      </Panel>

      {/* Resize Handle */}
      <PanelResizeHandle className="w-1 bg-surface0 hover:bg-mauve cursor-col-resize" />

      {/* Preview Panel - Resizable, min 400px */}
      <Panel defaultSize={67} minSize={30} className="bg-base">
        <PreviewPanel />
      </Panel>
    </PanelGroup>
  );
}
```

**Why `react-resizable-panels`?**
- **Accessibility Built-In:** Keyboard-accessible resize handles (Arrow keys + Enter)
- **Performance:** Uses CSS transforms, not layout recalculation (60fps smooth resize)
- **Persistence API:** Easy integration with Zustand via onLayout callback
- **Minimal Bundle:** ~5KB gzipped (acceptable for this feature)
- **Battle-Tested:** Used in VSCode for Web, StackBlitz, CodeSandbox

**Settings Store Pattern (from Architecture Doc):**

```typescript
// src/stores/settingsStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  panelWidths: {
    sidebar: number;
    library: number;
    preview: number;
  };
  setPanelWidths: (widths: Partial<SettingsState['panelWidths']>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      panelWidths: {
        sidebar: 5,
        library: 28,
        preview: 67,
      },
      
      setPanelWidths: (widths) =>
        set((state) => ({
          panelWidths: { ...state.panelWidths, ...widths },
        })),
    }),
    {
      name: 'settings-storage',
      // Persist only panelWidths, not entire store
      partialize: (state) => ({ panelWidths: state.panelWidths }),
    }
  )
);
```

**Integration with react-resizable-panels:**

```typescript
// In MainLayout.tsx
import { useSettingsStore } from '@/stores/settingsStore';

export function MainLayout() {
  const { panelWidths, setPanelWidths } = useSettingsStore();

  const handleLayout = (sizes: number[]) => {
    // sizes = [sidebar%, library%, preview%]
    setPanelWidths({
      sidebar: sizes[0],
      library: sizes[1],
      preview: sizes[2],
    });
  };

  return (
    <PanelGroup direction="horizontal" onLayout={handleLayout}>
      <Panel defaultSize={panelWidths.sidebar} minSize={5} maxSize={5}>
        <Sidebar />
      </Panel>
      {/* ... rest of panels */}
    </PanelGroup>
  );
}
```

**Sidebar Component Pattern (from UX Spec):**

```typescript
// src/components/Layout/Sidebar.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';

type Category = 'personas' | 'constraints' | 'guardrails';

interface SidebarProps {
  onCategoryChange?: (category: Category) => void;
}

export function Sidebar({ onCategoryChange }: SidebarProps) {
  const [activeCategory, setActiveCategory] = useState<Category>('personas');

  const handleCategoryClick = (category: Category) => {
    setActiveCategory(category);
    onCategoryChange?.(category);
  };

  return (
    <nav className="flex flex-col items-center gap-4 py-4" aria-label="Category navigation">
      <Button
        variant="ghost"
        size="icon"
        className={activeCategory === 'personas' ? 'bg-mauve/20 text-mauve' : 'text-subtext1'}
        onClick={() => handleCategoryClick('personas')}
        aria-label="Personas"
        aria-pressed={activeCategory === 'personas'}
      >
        <span className="text-2xl font-bold">P</span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className={activeCategory === 'constraints' ? 'bg-mauve/20 text-mauve' : 'text-subtext1'}
        onClick={() => handleCategoryClick('constraints')}
        aria-label="Constraints"
        aria-pressed={activeCategory === 'constraints'}
      >
        <span className="text-2xl font-bold">C</span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className={activeCategory === 'guardrails' ? 'bg-mauve/20 text-mauve' : 'text-subtext1'}
        onClick={() => handleCategoryClick('guardrails')}
        aria-label="Guardrails"
        aria-pressed={activeCategory === 'guardrails'}
      >
        <span className="text-2xl font-bold">G</span>
      </Button>
    </nav>
  );
}
```

**Placeholder Panel Components (Epic 2/3 will replace):**

```typescript
// src/components/Layout/LibraryPanel.tsx
export function LibraryPanel() {
  return (
    <div className="h-full p-4 overflow-y-auto">
      <h2 className="text-xl font-semibold text-text mb-4">Snippet Library</h2>
      <p className="text-subtext1">
        Library panel placeholder. Epic 2 will implement snippet CRUD and display.
      </p>
    </div>
  );
}

// src/components/Layout/PreviewPanel.tsx
export function PreviewPanel() {
  return (
    <div className="h-full p-4 overflow-y-auto">
      <h2 className="text-xl font-semibold text-text mb-4">Prompt Composer</h2>
      <p className="text-subtext1">
        Preview panel placeholder. Epic 3 will implement framework templates and composition.
      </p>
    </div>
  );
}
```

**Focus Management Pattern (from Architecture Doc):**

```css
/* Add to src/index.css (after theme variables from Story 1.1) */

/* WCAG 2.1 AA Focus Indicators (3px Mauve outline) */
*:focus-visible {
  outline: 3px solid var(--mauve);
  outline-offset: 2px;
}

/* Remove default focus styles that don't meet accessibility standards */
*:focus:not(:focus-visible) {
  outline: none;
}
```

**Keyboard Navigation Implementation:**

```typescript
// In Sidebar.tsx - Arrow key navigation between category buttons
import { useEffect, useRef } from 'react';

export function Sidebar({ onCategoryChange }: SidebarProps) {
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = (focusedIndex + 1) % buttonRefs.current.length;
        buttonRefs.current[nextIndex]?.focus();
        setFocusedIndex(nextIndex);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = (focusedIndex - 1 + buttonRefs.current.length) % buttonRefs.current.length;
        buttonRefs.current[prevIndex]?.focus();
        setFocusedIndex(prevIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedIndex]);

  // ... rest of component with refs
}
```

### Library and Framework Requirements

**New Dependencies to Install:**

```bash
npm install react-resizable-panels
```

**Version Recommendation:** `^3.0.0` (latest stable as of 2026-01-01)

**Dependency Justification:**
- **react-resizable-panels**: Industry standard for resizable layouts in React, used by VSCode for Web and major code editors
- **Bundle Impact:** ~5KB gzipped (acceptable for core UX feature)
- **Alternatives Considered:**
  - `react-split-pane` (deprecated, no longer maintained)
  - Custom CSS resize implementation (high complexity, accessibility concerns, poor browser support for `:resize` CSS property)

**No ShadCN UI Components Needed for Layout:**
- Layout uses native CSS Grid and `react-resizable-panels`
- Sidebar uses existing ShadCN `Button` component (already installed in Story 1.1)

### File Structure Requirements from Architecture

**New Files to Create:**

```
src/components/Layout/
├── MainLayout.tsx              # Main 3-panel container with ResizablePanelGroup
├── MainLayout.test.tsx         # Unit tests for layout rendering
├── Sidebar.tsx                 # Category navigation sidebar
├── Sidebar.test.tsx            # Unit tests for sidebar interaction
├── LibraryPanel.tsx            # Placeholder for Epic 2
├── PreviewPanel.tsx            # Placeholder for Epic 3
└── index.ts                    # Barrel export (export { MainLayout, Sidebar, ... })

src/stores/
└── settingsStore.ts            # New Zustand store for panel widths
└── settingsStore.test.ts       # Unit tests for settings persistence
```

**Existing Files to Modify:**

```
src/App.tsx                     # Replace content with MainLayout
src/App.test.tsx                # Update tests for new layout structure
src/index.css                   # Add focus indicator styles (already has theme from Story 1.1)
package.json                    # Add react-resizable-panels dependency
```

**File Organization Rationale:**
- **Feature-based structure**: All layout components in `src/components/Layout/` directory
- **Colocated tests**: `.test.tsx` files next to source files for easy discovery
- **Barrel exports**: `index.ts` simplifies imports (`import { MainLayout } from '@/components/Layout'`)
- **Placeholder components**: LibraryPanel and PreviewPanel exist as stubs to be replaced in Epic 2/3

### Testing Requirements

**Unit Tests (80%+ coverage target):**

1. **MainLayout.test.tsx**:
   - Test three panels render with correct default widths (5%, 28%, 67%)
   - Test resize handle exists between library and preview panels
   - Test panel widths persist to settingsStore on resize
   - Test panel widths restore from settingsStore on mount
   - Test minimum width constraints enforced (library: 280px, preview: 400px)

2. **Sidebar.test.tsx**:
   - Test three category buttons render (P, C, G)
   - Test clicking category button triggers onCategoryChange callback
   - Test active category has Mauve accent styling
   - Test keyboard navigation (Arrow Up/Down moves focus)
   - Test aria-label and aria-pressed attributes for accessibility

3. **settingsStore.test.ts**:
   - Test setPanelWidths updates store state
   - Test panelWidths persist to localStorage via Zustand persist middleware
   - Test store rehydrates panelWidths from localStorage on initialization
   - Test partial updates merge with existing panelWidths

**E2E Tests (Playwright):**

```typescript
// tests/layout.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Three-Panel Layout', () => {
  test('renders three panels on app launch', async ({ page }) => {
    await page.goto('/');
    
    // Verify all panels visible
    await expect(page.locator('[aria-label="Category navigation"]')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Snippet Library' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Prompt Composer' })).toBeVisible();
  });

  test('resize library panel with drag', async ({ page }) => {
    await page.goto('/');
    
    // Get initial library panel width
    const libraryPanel = page.locator('.panel-library');
    const initialWidth = await libraryPanel.boundingBox();
    
    // Drag resize handle
    const resizeHandle = page.locator('[data-panel-resize-handle-id]');
    await resizeHandle.dragTo(resizeHandle, { targetPosition: { x: 100, y: 0 } });
    
    // Verify library panel width changed
    const newWidth = await libraryPanel.boundingBox();
    expect(newWidth?.width).not.toBe(initialWidth?.width);
  });

  test('panel widths persist across app restart', async ({ page }) => {
    await page.goto('/');
    
    // Resize panel
    const resizeHandle = page.locator('[data-panel-resize-handle-id]');
    await resizeHandle.dragTo(resizeHandle, { targetPosition: { x: 100, y: 0 } });
    
    // Get resized width
    const libraryPanel = page.locator('.panel-library');
    const resizedWidth = await libraryPanel.evaluate(el => el.clientWidth);
    
    // Reload page
    await page.reload();
    
    // Verify width restored
    const restoredWidth = await libraryPanel.evaluate(el => el.clientWidth);
    expect(restoredWidth).toBe(resizedWidth);
  });

  test('keyboard focus order: sidebar → library → preview', async ({ page }) => {
    await page.goto('/');
    
    // Focus first element
    await page.keyboard.press('Tab');
    
    // Verify focus on sidebar category button
    await expect(page.locator('[aria-label="Personas"]')).toBeFocused();
    
    // Tab to library panel
    await page.keyboard.press('Tab');
    // (Verify focus in library - specific element depends on Epic 2 implementation)
    
    // Tab to preview panel
    await page.keyboard.press('Tab');
    // (Verify focus in preview - specific element depends on Epic 3 implementation)
  });
});
```

### Accessibility Requirements (WCAG 2.1 AA)

**Keyboard Navigation:**
- **Tab/Shift+Tab**: Navigate between panels and interactive elements
- **Arrow Up/Down**: Navigate between sidebar category buttons
- **Enter/Space**: Activate sidebar category buttons
- **Escape**: (Future) Close modals or return focus to main content

**Focus Indicators:**
- **3px Mauve outline** on all interactive elements (`:focus-visible`)
- **2px offset** from element boundary for clarity
- **High contrast**: Mauve (#cba6f7 Mocha, #8839ef Latte) meets WCAG AA on all backgrounds

**ARIA Attributes:**
```typescript
// Sidebar navigation
<nav aria-label="Category navigation">
  <Button
    aria-label="Personas"
    aria-pressed={activeCategory === 'personas'}
  >
    P
  </Button>
</nav>

// Resizable panels
<PanelGroup aria-label="Application layout">
  <Panel aria-label="Sidebar navigation" />
  <Panel aria-label="Snippet library" />
  <Panel aria-label="Prompt composer" />
</PanelGroup>
```

**Screen Reader Announcements:**
- Sidebar category changes announce: "Personas selected" / "Constraints selected"
- Panel resize announces: "Library panel width: 35%" (optional, may be verbose)

**Reduced Motion Support:**
```css
/* Already included in Story 1.1 theme system */
@media (prefers-reduced-motion: reduce) {
  .panel-transition {
    transition-duration: 0.01ms !important;
  }
}
```

**Clickable Target Sizes:**
- Sidebar category buttons: **48x48px** (exceeds WCAG 2.1 AA minimum of 44x44px)
- Resize handle: **16px width** (touch-friendly, exceeds 8px minimum for desktop)

### Previous Story Intelligence

**Learnings from Story 1.1 (Catppuccin Theme System Implementation):**

Story 1.1 established the theme system that Story 1.2 will use extensively. Key integration points:

1. **CSS Custom Properties Available:**
   - Background colors: `--base`, `--mantle`, `--surface-0`, `--surface-1`
   - Text colors: `--text`, `--subtext-1`, `--subtext-0`
   - Accent colors: `--mauve`, `--blue`, `--green`, `--yellow`, `--red`

2. **Theme Store Pattern:**
   - Zustand store with persist middleware for localStorage
   - `setTheme()` and `toggleTheme()` actions available
   - Theme applies instantly via `data-theme` attribute on `<html>`

3. **Tailwind Integration:**
   - CSS variables mapped to Tailwind utilities (`bg-base`, `text-text`, `text-mauve`, etc.)
   - Use Tailwind classes for consistent styling: `className="bg-mantle text-subtext1"`

4. **Focus Indicators Already Styled:**
   - 3px Mauve outline defined in `src/index.css` from Story 1.1
   - No additional CSS needed for focus states (already WCAG compliant)

**Implementation Patterns to Follow:**

```typescript
// From Story 1.1: Zustand store structure
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Story 1.2 follows same pattern for settingsStore
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({ /* state */ }),
    { name: 'settings-storage' }
  )
);
```

**Files Modified in Story 1.1 (Don't Duplicate):**
- `src/index.css` - Theme variables already defined, only add focus indicators if not present
- `tailwind.config.ts` - Color mappings already configured
- `src/main.tsx` - System preference listener already added

**Dependency Overlap:**
- Zustand already installed (don't reinstall)
- ShadCN Button component already available (use for sidebar)

### Git Intelligence Summary

**Recent Commits (Last 5):**
1. **7662be0** - Merge PR #4: test design, implementation readiness check, sprint status
2. **2ad96b2** - Finalize design: test strategy, implementation readiness check, generate sprint status
3. **4fec2ac** - Upgrade BMAD to v6 alpha.22
4. **1d5517d** - Merge PR #3: architecture specs
5. **8c880c7** - Generate architecture document, create epics and stories

**Code Patterns Established (Continue Following):**

1. **React 19 Function Components:**
   ```typescript
   // Pattern: Named exports, TypeScript interfaces for props
   interface ComponentProps {
     prop: string;
   }
   
   export function Component({ prop }: ComponentProps) {
     return <div>{prop}</div>;
   }
   ```

2. **Import Alias:**
   ```typescript
   // Use @/ alias for src/ imports
   import { Button } from '@/components/ui/button';
   import { useThemeStore } from '@/stores/themeStore';
   ```

3. **ESLint Import Order:**
   ```typescript
   // Order: builtin → external → internal → parent → sibling → index
   import { useState } from 'react';                    // builtin
   import { Panel, PanelGroup } from 'react-resizable-panels'; // external
   import { Button } from '@/components/ui/button';      // internal
   ```

4. **Tailwind Class Merging:**
   ```typescript
   import { cn } from '@/lib/utils';
   
   <div className={cn('base-classes', conditionalClasses)} />
   ```

5. **Test File Naming:**
   ```
   Component.tsx       → Component.test.tsx
   store.ts            → store.test.ts
   ```

**Architecture Decisions Implemented (from Commits):**
- ✅ Zustand for state management (not Context API)
- ✅ ShadCN UI for accessible components
- ✅ Tailwind CSS v4 with CSS custom properties
- ✅ Vitest + Playwright for testing
- ✅ Feature-based component organization

**Testing Strategy (from commit 2ad96b2):**
- Unit tests: 80%+ coverage target
- E2E tests: Critical paths only (not exhaustive)
- Accessibility audits: axe-core + manual screen reader testing

### Latest Technical Information

**react-resizable-panels v3.0.x (Latest as of 2026-01-01):**

**Breaking Changes from v2.x:**
- **NONE** - v3.0 is backward compatible with v2.x API
- Recommended upgrade for performance improvements and bug fixes

**Key Features for This Story:**
- **Imperative API:** `panelRef.resize(size)` for programmatic control (future use)
- **Keyboard Accessibility:** Built-in Arrow key navigation for resize handles
- **RTL Support:** Automatic right-to-left layout support (future use)
- **Server-Side Rendering:** Compatible with Next.js/Remix (not relevant for Tauri, but good to know)

**Installation:**
```bash
npm install react-resizable-panels@^3.0.0
```

**TypeScript Types:**
- Fully typed, no need for `@types/react-resizable-panels`
- Export types: `PanelProps`, `PanelGroupProps`, `PanelResizeHandleProps`

**Performance Best Practices:**
- Use `onLayout` callback sparingly (debounce if persisting on every resize)
- Avoid re-renders during resize: `PanelGroup` uses CSS transforms, not React state
- Use `defaultSize` instead of `size` for uncontrolled panels (better performance)

**Common Pitfalls to Avoid:**
1. **Don't use `size` prop for controlled panels unless necessary** - `defaultSize` is sufficient for persistence use case
2. **Don't persist on every resize event** - Debounce `onLayout` callback by 500ms to reduce localStorage writes
3. **Don't set `minSize` in pixels** - Use percentages (library converts internally based on container size)

**Debounced Persistence Pattern:**

```typescript
import { debounce } from 'lodash-es'; // or implement custom debounce

const handleLayout = debounce((sizes: number[]) => {
  setPanelWidths({
    sidebar: sizes[0],
    library: sizes[1],
    preview: sizes[2],
  });
}, 500); // Wait 500ms after resize stops before persisting
```

**Security Considerations:**
- No XSS risk: `react-resizable-panels` does not accept user HTML
- No injection risk: Panel sizes validated internally (numbers only)
- localStorage persistence is safe (user's own machine, no server transmission)

### Cross-Cutting Concerns

**Error Handling:**
- `react-resizable-panels` does not throw errors in normal operation
- If localStorage is disabled/full, Zustand persist middleware fails silently (acceptable fallback: default widths)
- If panelWidths in localStorage are corrupted, Zustand resets to default values (safe recovery)

**Performance Optimization:**
- Resize handle uses CSS transforms (GPU-accelerated, 60fps smooth)
- Debounce persistence to reduce localStorage writes (500ms delay)
- Virtual scrolling for library/preview panels (handled in Epic 2/3)

**Browser Compatibility:**
- `react-resizable-panels` supports all modern browsers (Chrome 90+, Firefox 88+, Safari 14+)
- Tauri uses system webview (Chromium on Windows/Linux, WebKit on macOS)
- No IE11 support needed (Tauri doesn't support IE)

**Theming Integration:**
- Panels use CSS custom properties from Story 1.1: `bg-base`, `bg-mantle`, `bg-surface-0`
- Resize handle uses Mauve accent: `hover:bg-mauve`
- Theme switching automatically applies to panels (no additional code needed)

**Future Extensibility:**
- Story 1.2 lays foundation for Epic 2 (Library Panel) and Epic 3 (Preview Panel)
- Placeholder components ensure layout structure is stable before content implementation
- Settings store extensible for future preferences (font size, compact mode, etc.)

### Code Anti-Patterns to Avoid

**❌ DON'T: Use CSS Grid with manual resize implementation**
```typescript
// BAD: High complexity, poor accessibility, browser inconsistencies
<div className="grid grid-cols-3" onMouseMove={handleResize}>
  {/* Manual resize logic is error-prone */}
</div>
```

**✅ DO: Use react-resizable-panels library**
```typescript
// GOOD: Accessible, performant, battle-tested
<PanelGroup direction="horizontal">
  <Panel defaultSize={28} minSize={20}>...</Panel>
</PanelGroup>
```

**❌ DON'T: Persist panel widths on every resize event**
```typescript
// BAD: Excessive localStorage writes, performance impact
<PanelGroup onLayout={(sizes) => setPanelWidths(sizes)}>
```

**✅ DO: Debounce persistence to reduce writes**
```typescript
// GOOD: Wait 500ms after resize stops before persisting
const handleLayout = debounce((sizes) => setPanelWidths(sizes), 500);
<PanelGroup onLayout={handleLayout}>
```

**❌ DON'T: Hardcode pixel widths in components**
```typescript
// BAD: Not responsive, breaks on different screen sizes
<Panel style={{ width: '300px' }}>
```

**✅ DO: Use percentage-based widths with min-size**
```typescript
// GOOD: Responsive, maintains proportions
<Panel defaultSize={28} minSize={20}>
```

**❌ DON'T: Forget focus indicators for keyboard navigation**
```typescript
// BAD: Fails WCAG 2.1 AA accessibility standards
<button className="sidebar-button">P</button>
```

**✅ DO: Use focus-visible for WCAG-compliant focus indicators**
```typescript
// GOOD: 3px Mauve outline on focus (already defined in Story 1.1)
<Button className="focus-visible:outline-mauve">P</Button>
```

**❌ DON'T: Mix layout state in multiple stores**
```typescript
// BAD: Layout state split across themeStore and uiStore
const { panelWidths } = useThemeStore(); // Wrong store!
```

**✅ DO: Use dedicated settingsStore for layout preferences**
```typescript
// GOOD: Clear separation of concerns
const { panelWidths } = useSettingsStore(); // Correct store
```

### Developer Checklist

Before marking this story complete, verify:

- [ ] `react-resizable-panels` installed via `npm install`
- [ ] MainLayout renders three panels with correct default widths (5%, 28%, 67%)
- [ ] Sidebar displays category buttons (P, C, G) with Mauve accent on active
- [ ] Resize handle between library and preview panels works via drag
- [ ] Minimum width constraints enforced (library: 280px, preview: 400px)
- [ ] Panel widths persist to localStorage via settingsStore
- [ ] Panel widths restore from localStorage on app launch
- [ ] Keyboard navigation works: Tab moves focus left-to-right across panels
- [ ] Focus indicators visible: 3px Mauve outline on all interactive elements
- [ ] Unit tests pass: 80%+ coverage for MainLayout, Sidebar, settingsStore
- [ ] E2E tests pass: Panel rendering, resize, persistence, keyboard navigation
- [ ] Accessibility audit: No critical violations (run `npm run test:a11y` or manual axe-core check)
- [ ] Visual regression: Layout looks correct in both Mocha (dark) and Latte (light) themes
- [ ] Performance check: Resize is smooth (60fps), no janky frame drops

### Integration with Story 1.1

This story builds directly on Story 1.1 (Catppuccin Theme System):

**What Story 1.1 Provided:**
- CSS custom properties for colors (`--base`, `--mantle`, `--mauve`, etc.)
- Tailwind integration (`bg-base`, `text-mauve`, etc.)
- Theme store with `setTheme()` and `toggleTheme()` actions
- Focus indicator styles (3px Mauve outline)

**What Story 1.2 Adds:**
- Three-panel layout structure
- Resizable panel dividers
- Settings store for layout preferences
- Sidebar navigation component
- Keyboard focus management

**Combined Result:**
Users now have a functional, themed, accessible application shell ready for snippet library (Epic 2) and prompt composition (Epic 3) features.

## Dev Agent Record

### Agent Model Used

_To be filled by DEV agent_

### Debug Log References

_To be filled by DEV agent_

### Completion Notes List

_To be filled by DEV agent_

### File List

_To be filled by DEV agent_
