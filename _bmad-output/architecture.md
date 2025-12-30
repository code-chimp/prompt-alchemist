---
stepsCompleted: [1, 2, 3, 4, 5, 6]
inputDocuments:
  - _bmad-output/prd.md
  - _bmad-output/ux-design-specification.md
  - _bmad-output/project-overview.md
  - _bmad-output/index.md
  - AGENTS.md
workflowType: 'architecture'
lastStep: 6
project_name: 'prompt-alchemist'
user_name: 'Timothygoshinski'
date: '2025-12-29'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**

Prompt Alchemist has **42 functional requirements** organized into 7 capability areas:

1. **Snippet Library Management (FR1-FR6):** CRUD operations for atomic snippets (personas, guardrails, constraints) with JSON storage in platform-specific config directories
2. **Framework Management (FR7-FR12):** Three framework templates (RTF 3-section, CODER 5-section, Co-Star 6-section) with runtime switching
3. **Prompt Composition (FR13-FR18):** Side-by-side layout with drag-and-drop + inline editing hybrid workflow
4. **Search & Discovery (FR19-FR23):** Cmd+K global search with fuzzy matching, frecency ranking, and context-aware filtering
5. **Clipboard & Export (FR24-FR26):** One-click copy to system clipboard in markdown format for LLM compatibility
6. **Cross-Platform Desktop (FR27-FR36):** Native support for macOS 10.15+, Windows 10+, Linux via AppImage/deb/rpm with offline operation
7. **Keyboard-First Navigation (FR37-FR42):** Complete keyboard control with VSCode-style shortcuts (Cmd+K, Tab, Arrow keys, Enter, Esc)

**Architecturally Significant Requirements:**
- FR19-FR23: Search system must support <100ms response time with frecency ranking algorithm
- FR27-FR36: Cross-platform file system abstraction layer required for config directory management
- FR37-FR42: Keyboard event handling must work identically across platforms (Cmd↔Ctrl mapping)
- FR13-FR18: Novel search-enabled tab stops require custom React component with inline popover positioning

**Non-Functional Requirements:**

**Performance (NFR-P1 to NFR-P8):**
- Search response: <100ms for libraries up to 1,000 snippets
- Cold start: <2 seconds to usable state
- UI feedback: <50ms for drag-and-drop, <100ms for keyboard shortcuts
- Memory footprint: <100MB idle, <200MB active with 500+ snippets

**Reliability (NFR-R1 to NFR-R9):**
- Immediate auto-save on library changes (no manual save)
- Crash recovery for unsaved prompt composition
- Atomic writes to prevent JSON corruption
- Cross-platform data portability (zero data loss when moving libraries)
- Library format versioning for backward compatibility

**Usability (NFR-U1 to NFR-U8):**
- 100% keyboard-accessible workflows (no mouse required)
- 5-minute time-to-first-prompt for new users
- 30-second composition time for power users (vs 2-5 minutes manual typing)
- VSCode keyboard pattern compatibility (Cmd+K, Tab stops familiar)

**Accessibility (NFR-A1 to NFR-A21):**
- WCAG 2.1 AA compliance minimum (4.5:1 contrast ratio)
- Full screen reader support (VoiceOver, NVDA, Orca)
- Keyboard focus indicators always visible (3px Mauve outline)
- Motion reduction support (`prefers-reduced-motion` system setting)

**Compatibility (NFR-C1 to NFR-C10):**
- Identical UI rendering across macOS/Windows/Linux via ShadCN UI
- JSON library format Git-compatible for version control
- Markdown clipboard format compatible with all LLM interfaces

### Scale & Complexity

**Project Classification:**
- **Type:** Desktop Application (Developer Tool)
- **Complexity Level:** Medium-High
- **Primary Domain:** Full-stack (React 19 frontend + Rust 2021 backend + Tauri v2 IPC)
- **Project Context:** Brownfield (extending tauri2-react-starter template)

**Complexity Drivers:**

1. **Novel UX Pattern:** Search-enabled tab stops combine VSCode snippet tab stops with Raycast-style inline search—requires custom React component with precise keyboard event handling and positioning logic

2. **Cross-Platform Desktop:** Three OS targets (macOS/Windows/Linux) with platform-specific file system conventions, clipboard APIs, and keyboard shortcuts (Cmd↔Ctrl mapping)

3. **Performance-Critical Search:** Frecency ranking algorithm must deliver <100ms response across 1,000-snippet libraries while typing—requires pre-indexing, debounced input, and virtual scrolling

4. **Dual-Theme Management:** Catppuccin Mocha/Latte themes with system preference detection and <200ms switching without flicker—affects all 20+ ShadCN components

5. **Data Integrity Guarantees:** Atomic writes, crash recovery, format versioning across three platforms with different file system behaviors

**Estimated Architectural Components:**
- **Frontend:** 15-20 React components (8 from ShadCN, 7-12 custom)
- **Backend:** 5-8 Rust Tauri commands (file I/O, clipboard, config management)
- **State Management:** Local state + persistence layer (no global state initially)
- **IPC Bridge:** Type-safe command layer between React and Rust
- **Storage:** JSON file system adapter with platform abstraction

### Technical Constraints & Dependencies

**Foundation Constraints (Inherited from tauri2-react-starter):**
- React 19.2.3 with TypeScript 5.9.3 strict mode
- Tauri v2 (Rust 2021 edition) for native capabilities
- Vite 7.3.0 build system
- ShadCN UI + Radix primitives for accessible components
- Tailwind CSS v4 with `@tailwindcss/vite` plugin
- Vitest 4.0.16 (unit) + Playwright 1.57.0 (E2E) testing

**Architectural Constraints:**
- **No external dependencies:** Offline-first requirement prohibits network-dependent libraries
- **No cloud services:** All storage local, no authentication, no telemetry
- **No database:** JSON files only for simplicity and Git compatibility
- **Single-window app:** No multi-window support (simplifies state management)
- **No global hotkeys:** App must be focused for keyboard shortcuts (avoids OS permission complexity)

**Platform-Specific Constraints:**
- **macOS:** Code signing required for distribution (post-MVP)
- **Windows:** MSI/NSIS installer format preferred (post-MVP)
- **Linux:** AppImage primary, .deb/.rpm secondary (glibc compatibility considerations)

**Performance Constraints:**
- Search indexing must complete during app initialization (<2s cold start budget)
- Fuzzy search algorithm must handle 1,000 snippets in <100ms (may require Rust implementation)
- Virtual scrolling required for snippet lists >100 items (React windowing)

**UX Constraints from Design Spec:**
- Catppuccin palette mandatory (Mocha/Latte themes)
- System font stack only (no custom fonts to preserve <2s startup)
- 3px Mauve focus indicators non-negotiable (accessibility)
- Esc key as universal dismiss (established pattern)

### Cross-Cutting Concerns Identified

**1. Performance Optimization:**
- Frecency ranking calculation (frequency × 10 + days_since_last_use × -1)
- Virtual scrolling for large snippet libraries
- Debounced search input (300ms)
- Memoized React components to prevent re-renders
- Lazy-loading of heavy UI (template gallery, settings dialogs)

**2. Keyboard Accessibility:**
- Tab order management across side-by-side panels
- Focus trap in modal dialogs
- Skip links ("Skip to preview", "Skip to library")
- Keyboard shortcut discovery via tooltips
- Screen reader announcements for dynamic content (ARIA live regions)

**3. Theme Management:**
- CSS custom property architecture for Catppuccin colors
- System preference detection (`prefers-color-scheme`)
- <200ms theme switching without flicker
- Persistent theme choice in local config
- High contrast mode support for accessibility

**4. Error Recovery:**
- Graceful degradation when file system access denied
- Clear error messages with actionable recovery steps
- Undo/redo for snippet insertions (Cmd+Z)
- Auto-save prevents data loss, manual recovery if corrupted
- Cross-platform error handling differences (Windows vs POSIX)

**5. Data Persistence:**
- Atomic file writes (write to temp, rename on success)
- JSON schema versioning for backward compatibility
- Config directory creation on first launch
- Migration strategy for schema changes
- Backup recommendations (manual config directory copy)

**6. Testing Strategy:**
- Unit tests: 80%+ coverage target (Vitest with jsdom)
- E2E tests: Critical paths on all platforms (Playwright)
- Visual regression: Theme switching, component rendering
- Accessibility audits: axe-core + manual screen reader testing
- Performance benchmarks: Search response time, cold start duration

## Starter Template Evaluation

### Primary Technology Domain

**Desktop Application (Developer Tool)** - Cross-platform native app with offline-first design

### Project Foundation Status

**✅ BROWNFIELD PROJECT - Extending Existing Starter**

This project is built on the **tauri2-react-starter** template, which has already established the foundational architecture. We are **extending and customizing** this foundation rather than starting from scratch.

**Starter Repository:** `tauri2-react-starter` (private/internal template)

### Architectural Decisions Provided by Starter

**Language & Runtime:**
- **Frontend:** TypeScript 5.9.3 with strict mode configuration
  - Enforces type safety (`noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`)
  - Array notation preference (`string[]` over `Array<string>`)
  - Path aliases configured (`@/` → `src/`)
- **Backend:** Rust 2021 edition with Tauri v2
  - Memory safety guarantees
  - Native system integration (file system, clipboard, OS APIs)
  - Cross-platform binary compilation
- **Runtime:** Node.js v24.12.0 for development, native binaries for distribution

**Styling Solution:**
- **Primary:** Tailwind CSS v4 with `@tailwindcss/vite` plugin
  - Utility-first CSS with JIT compilation
  - Automatic class sorting via `prettier-plugin-tailwindcss`
  - CSS custom properties for theme management
- **Component Library:** ShadCN UI (Radix primitives + Tailwind)
  - Copy/paste architecture (components in `src/components/ui/`, not `node_modules`)
  - Accessible by default (WCAG 2.1 AA compliant)
  - Fully customizable (no framework lock-in)
- **Configuration:** 95-column width, single quotes, trailing commas, no arrow parens, 2-space indent

**Build Tooling:**
- **Frontend Build:** Vite 7.3.0
  - Lightning-fast HMR (<100ms updates)
  - Optimized production bundles with code splitting
  - TypeScript type checking in parallel
- **Backend Build:** Cargo (Rust package manager)
  - Optimized release profiles (`lto = true`, `codegen-units = 1`)
  - Clippy linting with strict rules (`clippy::all`, `clippy::pedantic`)
- **Desktop Bundling:** Tauri CLI
  - Single command builds for macOS/Windows/Linux
  - Native installers (.dmg, .msi, .deb, .rpm, AppImage)
  - Automatic binary signing configuration (post-MVP)

**Testing Framework:**
- **Unit Tests:** Vitest 4.0.16 with jsdom
  - `npm run test:unit` (all tests), `npm run test:unit -- <pattern>` (single file)
  - Vitest globals (no import needed for `describe`, `it`, `expect`)
  - `@testing-library/jest-dom` matchers
  - Coverage reporting: `npm run test:unit:coverage`
- **E2E Tests:** Playwright 1.57.0
  - `npm run test:e2e` (CLI), `npm run e2e:ui` (Playwright UI)
  - Desktop app testing (not browser-based)
  - Page object pattern in `tests/pages/`
- **Rust Tests:** Cargo test
  - `npm run test:rust` for backend unit tests
  - `npm run lint:rust:*` for Clippy validation

**Code Organization:**
```
prompt-alchemist/
├── src/                          # React frontend
│   ├── components/
│   │   ├── ui/                   # ShadCN UI components (customizable)
│   │   ├── AppErrorBoundary.tsx  # Global error boundary
│   │   └── *.test.tsx            # Component unit tests
│   ├── lib/
│   │   ├── tauri.ts              # Type-safe Tauri IPC wrappers
│   │   ├── logger.ts             # Centralized logging utility
│   │   └── utils.ts              # Shared helpers (cn() className merger)
│   ├── App.tsx                   # Root component
│   └── main.tsx                  # Frontend entry point
├── src-tauri/                    # Rust backend
│   ├── src/
│   │   ├── main.rs               # Tauri app initialization
│   │   └── lib.rs                # Shared Rust modules
│   ├── capabilities/
│   │   └── default.json          # Tauri security permissions
│   ├── Cargo.toml                # Rust dependencies
│   ├── tauri.conf.json           # Tauri configuration
│   ├── clippy.toml               # Rust linting rules
│   └── rustfmt.toml              # Rust formatting rules
├── tests/                        # E2E tests (Playwright)
│   └── pages/                    # Page object models
├── docs/                         # Project documentation
├── _bmad-output/                 # Generated planning docs
└── package.json                  # npm scripts and dependencies
```

**Development Experience:**
- **Hot Reload:** `npm run tauri:dev` (desktop with HMR), `npm run dev` (web mode)
- **Type Checking:** `npm run check` (TypeScript + lockfile validation + Rust types)
- **Linting:** `npm run lint` (ESLint + Stylelint + Clippy all at once)
- **Auto-Fix:** `npm run fix` (Prettier + ESLint auto-fix + Clippy suggestions)
- **Git Hooks:** Husky + lint-staged (pre-commit validation, no manual enforcement needed)
- **Validation:** `npm run check` runs TypeScript, lockfile, and Rust validation before commits

**Architectural Patterns:**
- **Hybrid Desktop Architecture:** React frontend communicates with Rust backend via Tauri IPC
- **Type-Safe IPC:** `src/lib/tauri.ts` provides typed wrappers around Tauri commands
- **Component-Based UI:** React function components with hooks, ShadCN UI primitives
- **Error Boundaries:** Global `AppErrorBoundary` catches React errors
- **Capability-Based Security:** Tauri permissions explicitly defined (no blanket access)
- **Testing Strategy:** Unit tests colocated with components, E2E tests in `tests/` directory

**What This Means for Prompt Alchemist:**

✅ **Foundation Established** - Core tooling, build pipeline, and development workflow already decided  
✅ **Quality Standards Set** - Linting, formatting, testing, and git hooks enforced  
✅ **Cross-Platform Ready** - Tauri configuration supports macOS/Windows/Linux builds  
⚠️ **Customization Required** - Need to add Prompt Alchemist-specific components and Rust commands  
⚠️ **Architectural Decisions Ahead** - Still need to decide: state management, data persistence layer, search algorithm implementation, IPC command structure

**Next Implementation Focus:**

1. Extend Rust backend with file system commands (snippet CRUD, config management)
2. Build custom React components (search-enabled tab stops, framework section cards)
3. Implement frecency ranking search algorithm (TypeScript or Rust?)
4. Add Catppuccin theme system (CSS custom properties + localStorage)
5. Create Tauri IPC commands for clipboard, file I/O, and config directory management

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
1. ✅ Snippet storage format: Single JSON file with versioned schema
2. ✅ Search implementation: TypeScript + fuse.js (frontend)
3. ✅ State management: Zustand for global state + local state for UI
4. ✅ IPC command structure: Type-safe Rust commands for file I/O
5. ✅ Theme system: CSS custom properties + Zustand store

**Important Decisions (Already Made by Starter):**
- Frontend framework: React 19.2.3 + TypeScript 5.9.3
- Backend runtime: Rust 2021 + Tauri v2
- UI components: ShadCN UI + Radix primitives
- Styling: Tailwind CSS v4
- Testing: Vitest + Playwright

**Deferred Decisions (Post-MVP):**
- Multi-library support (single library for MVP)
- Cloud sync (offline-only for MVP)
- Plugin system (core features only for MVP)
- Advanced search filters (basic fuzzy search for MVP)
- Snippet templates/variables (static content for MVP)

### Data Architecture

**Decision: Single JSON File Storage**
- **File Location:** Platform-specific config directory
  - macOS/Linux: `~/.config/prompt-alchemist/library.json`
  - Windows: `%LOCALAPPDATA%\prompt-alchemist\library.json`
- **Rationale:** Atomic operations, simple backup, adequate performance for 1,000 snippets
- **Schema Version:** `1.0.0` with migration strategy for future changes

**JSON Schema Structure:**
```json
{
  "version": "1.0.0",
  "metadata": {
    "created": "ISO8601 timestamp",
    "lastModified": "ISO8601 timestamp"
  },
  "snippets": [
    {
      "id": "uuid-v4",
      "name": "Snippet display name",
      "type": "persona | guardrail | constraint",
      "content": "Snippet text content",
      "tags": ["array", "of", "strings"],
      "metadata": {
        "created": "ISO8601 timestamp",
        "lastUsed": "ISO8601 timestamp",
        "useCount": 0
      }
    }
  ]
}
```

**Data Validation:**
- Zod schema validation on load/save
- Type-safe TypeScript interfaces generated from schema
- Rust serde validation on IPC boundary

**Migration Strategy:**
- Version field in JSON root for schema detection
- Migration functions: `migrate_v1_to_v2()` when loading
- Backward compatibility: Always write current version, read any version
- Backup original file before migration: `library.json.backup.v1.0.0`

**Atomic Write Implementation:**
1. Serialize library to JSON string
2. Write to temporary file: `.library.json.tmp`
3. Atomic rename to `library.json` (prevents corruption on crash)
4. Delete temp file on success

### Search & Discovery Architecture

**Decision: Frontend Search with fuse.js**
- **Technology:** fuse.js v7.x (fuzzy matching library, ~10KB gzipped)
- **Location:** TypeScript implementation in React frontend
- **Rationale:** No IPC latency, <10ms for 1,000 items, easier iteration during MVP

**Search Algorithm:**
```typescript
// Fuzzy search configuration
const fuseOptions = {
  keys: ['name', 'content', 'tags'],
  threshold: 0.3, // 0 = exact, 1 = match anything
  ignoreLocation: true,
  minMatchCharLength: 2,
};

// Frecency ranking formula
const frecencyScore = (snippet) => {
  const frequency = snippet.metadata.useCount * 10;
  const daysSinceUse = daysBetween(now, snippet.metadata.lastUsed);
  const recency = daysSinceUse * -1;
  return frequency + recency;
};
```

**Search Flow:**
1. User types in search input (debounced 300ms)
2. Fuse.js performs fuzzy matching across name/content/tags
3. Results sorted by fuzzy score (relevance)
4. Frecency ranking applied as secondary sort
5. Virtual scrolling renders top 50 results initially

**Performance Optimizations:**
- Debounced input: 300ms delay before search triggers
- Memoized fuse instance: Only recreate when library changes
- Virtual scrolling: Render visible items only (react-window or @tanstack/react-virtual)
- Result limit: Cap at 100 results to prevent UI lag

**Fallback Plan:**
If search performance exceeds 100ms with 1,000+ snippets:
- Phase 2: Migrate to Rust with `fuzzy-matcher` crate
- API remains identical (Zustand store interface unchanged)
- IPC overhead mitigated by batching requests

### State Management Architecture

**Decision: Zustand for Global State + Local State for UI**
- **Technology:** Zustand v4.x (~1KB gzipped)
- **Rationale:** Superior testability vs Context API, selective subscriptions, minimal re-renders

**Store Structure:**

**1. Library Store (`src/stores/libraryStore.ts`):**
```typescript
interface LibraryState {
  snippets: Snippet[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadLibrary: () => Promise<void>;
  saveLibrary: () => Promise<void>;
  addSnippet: (snippet: Omit<Snippet, 'id' | 'metadata'>) => void;
  updateSnippet: (id: string, updates: Partial<Snippet>) => void;
  deleteSnippet: (id: string) => void;
  incrementUseCount: (id: string) => void;
}
```

**2. Composition Store (`src/stores/compositionStore.ts`):**
```typescript
interface CompositionState {
  framework: 'rtf' | 'coder' | 'costar';
  sections: Record<string, string>; // sectionId -> markdown content
  
  // Actions
  setFramework: (framework: Framework) => void;
  insertSnippet: (sectionId: string, snippet: Snippet) => void;
  updateSection: (sectionId: string, content: string) => void;
  clearComposition: () => void;
  generateMarkdown: () => string;
}
```

**3. Theme Store (`src/stores/themeStore.ts`):**
```typescript
interface ThemeState {
  theme: 'mocha' | 'latte';
  
  // Actions
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}
```

**Local Component State (useState):**
- Search input text (ephemeral, no persistence needed)
- Modal visibility (open/close state)
- Form inputs (snippet editor fields)
- Focus management (keyboard navigation state)
- Hover states (visual feedback)

**Testing Benefits:**
```typescript
// Mock Zustand stores in tests
vi.mock('@/stores/libraryStore', () => ({
  useLibraryStore: vi.fn(() => ({
    snippets: mockSnippets,
    addSnippet: vi.fn(),
  })),
}));

// No provider wrapping needed in test setup
render(<SnippetList />);
```

**Performance Optimizations:**
- Selective subscriptions: `useLibraryStore((state) => state.snippets)` only
- Shallow equality checks: Zustand compares by reference, not deep equality
- Middleware: `persist` for composition drafts (localStorage)

### IPC Communication Layer

**Decision: Type-Safe Tauri Commands**
- **Serialization:** serde JSON with TypeScript type generation
- **Error Handling:** Result<T, String> with descriptive error messages
- **Cross-Platform:** Tauri's `app_config_dir()` for platform-specific paths

**Rust Command Definitions:**

```rust
// src-tauri/src/lib.rs

#[derive(Serialize, Deserialize, Clone)]
pub struct Library {
    pub version: String,
    pub metadata: LibraryMetadata,
    pub snippets: Vec<Snippet>,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct Snippet {
    pub id: String,
    pub name: String,
    pub r#type: SnippetType,
    pub content: String,
    pub tags: Vec<String>,
    pub metadata: SnippetMetadata,
}

// Commands
#[tauri::command]
fn load_library() -> Result<Library, String> { /* ... */ }

#[tauri::command]
fn save_library(library: Library) -> Result<(), String> { /* ... */ }

#[tauri::command]
fn get_config_dir() -> Result<String, String> { /* ... */ }

#[tauri::command]
fn copy_to_clipboard(text: String) -> Result<(), String> { /* ... */ }

#[tauri::command]
fn export_library(path: String, library: Library) -> Result<(), String> { /* ... */ }

#[tauri::command]
fn import_library(path: String) -> Result<Library, String> { /* ... */ }
```

**TypeScript Wrappers:**

```typescript
// src/lib/tauri.ts (extends existing starter wrappers)

import { invoke } from '@tauri-apps/api/core';

export async function loadLibrary(): Promise<Library> {
  return invoke<Library>('load_library');
}

export async function saveLibrary(library: Library): Promise<void> {
  return invoke('save_library', { library });
}

export async function copyToClipboard(text: string): Promise<void> {
  return invoke('copy_to_clipboard', { text });
}
```

**Error Handling Strategy:**
```typescript
// In Zustand store
loadLibrary: async () => {
  set({ isLoading: true, error: null });
  try {
    const library = await loadLibrary();
    set({ snippets: library.snippets, isLoading: false });
  } catch (error) {
    set({ 
      error: error instanceof Error ? error.message : 'Failed to load library',
      isLoading: false 
    });
  }
}
```

**Cross-Platform File Paths:**
- Use Tauri's `app_config_dir()` (respects OS conventions)
- macOS/Linux: `~/.config/prompt-alchemist/`
- Windows: `%LOCALAPPDATA%\prompt-alchemist\`
- Directory created automatically on first launch

**Atomic Write Implementation (Rust):**
```rust
use std::fs;
use tauri::api::path::app_config_dir;

fn save_library(library: Library) -> Result<(), String> {
    let config_dir = app_config_dir(&config)
        .ok_or("Failed to get config directory")?;
    
    // Ensure directory exists
    fs::create_dir_all(&config_dir)
        .map_err(|e| format!("Failed to create config dir: {}", e))?;
    
    let temp_path = config_dir.join(".library.json.tmp");
    let final_path = config_dir.join("library.json");
    
    // Serialize with pretty formatting
    let json = serde_json::to_string_pretty(&library)
        .map_err(|e| format!("Serialization error: {}", e))?;
    
    // Write to temp file
    fs::write(&temp_path, json)
        .map_err(|e| format!("Write error: {}", e))?;
    
    // Atomic rename (prevents corruption)
    fs::rename(temp_path, final_path)
        .map_err(|e| format!("Rename error: {}", e))?;
    
    Ok(())
}
```

### Theme System Architecture

**Decision: CSS Custom Properties + Zustand**
- **Theme Palette:** Catppuccin Mocha (dark) / Latte (light)
- **Implementation:** CSS custom properties for instant switching (<10ms)
- **Persistence:** localStorage + Zustand middleware

**CSS Architecture:**

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

**Tailwind Integration:**

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

**Theme Store Implementation:**

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

**System Preference Detection:**

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

**Performance Characteristics:**
- Theme switch: <10ms (pure CSS, no re-renders)
- No flicker: `data-theme` applied before first paint
- ShadCN components: Automatically inherit CSS custom properties
- Accessibility: High contrast preserved (Catppuccin WCAG 2.1 AA compliant)

**Motion Reduction Support:**

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Decision Impact Analysis

**Implementation Sequence:**

1. **Phase 1: Foundation (Week 1)**
   - Set up Zustand stores (library, composition, theme)
   - Implement Rust IPC commands (load/save library, clipboard)
   - Create JSON schema and validation (Zod)
   - Implement theme system (CSS custom properties + store)

2. **Phase 2: Core Features (Week 2)**
   - Build snippet library UI (list, CRUD forms)
   - Implement search with fuse.js + frecency ranking
   - Framework selection and section cards
   - Search-enabled tab stops component

3. **Phase 3: Composition & Polish (Week 3)**
   - Drag-and-drop snippet insertion
   - Markdown preview panel
   - Keyboard shortcuts (Cmd+K, Tab navigation)
   - Clipboard copy functionality

4. **Phase 4: Testing & Performance (Week 4)**
   - Unit tests for stores and components (80%+ coverage)
   - E2E tests for critical paths (Playwright)
   - Performance benchmarks (search <100ms, cold start <2s)
   - Accessibility audit (WCAG 2.1 AA)

**Cross-Component Dependencies:**

- **Library Store → Search:** Search depends on library data, frecency metadata
- **Composition Store → Clipboard:** Copy functionality reads from composition state
- **Theme Store → All UI:** Theme changes affect all components (CSS custom properties)
- **IPC Commands → Library Store:** Store actions trigger Rust commands for persistence
- **Search → Virtual Scrolling:** Large result sets require windowing for performance

**Testing Dependencies:**

- Zustand stores must be mockable (unit tests)
- IPC commands must be mockable (Tauri API mocked)
- Theme store must work without DOM (jsdom environment)
- Search must be benchmarkable (performance tests)

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:**
15 areas where AI agents could make different choices without explicit guidance

### Naming Patterns

**TypeScript/React Naming Conventions:**
- **Components:** PascalCase files and exports (`SnippetCard.tsx`, `export function SnippetCard()`)
- **Hooks:** camelCase with `use` prefix (`useLibraryStore`, `useSearch`, `useTheme`)
- **Functions/Variables:** camelCase (`addSnippet`, `searchQuery`, `frecencyScore`)
- **Types/Interfaces:** PascalCase (`Snippet`, `Library`, `SnippetType`, `Framework`)
- **Constants:** SCREAMING_SNAKE_CASE for immutable values (`MAX_SEARCH_RESULTS`, `DEBOUNCE_MS`)
- **CSS Classes:** kebab-case for custom classes (though Tailwind utilities preferred)

**Rust Naming Conventions:**
- **Structs/Enums:** PascalCase (`Snippet`, `Library`, `SnippetType`)
- **Functions:** snake_case (`load_library`, `save_library`, `get_config_dir`)
- **Variables:** snake_case (`config_dir`, `temp_path`, `final_path`)
- **Tauri Commands:** snake_case (`#[tauri::command] fn load_library()`)
- **Modules:** snake_case (`commands`, `models`, `utils`)

**File Naming Conventions:**
- **React Components:** PascalCase (`SnippetCard.tsx`, `SearchDialog.tsx`, `FrameworkSelector.tsx`)
- **Utilities/Libraries:** camelCase (`tauri.ts`, `search.ts`, `frecency.ts`, `schemas.ts`)
- **Zustand Stores:** camelCase with `Store` suffix (`libraryStore.ts`, `compositionStore.ts`, `themeStore.ts`)
- **TypeScript Types:** camelCase (`library.ts`, `composition.ts` in `src/types/`)
- **Tests:** Match source file with `.test.ts(x)` suffix (`SnippetCard.test.tsx`)
- **Rust Files:** snake_case (`library.rs`, `clipboard.rs`, `fs.rs`)

**ID Generation:**
- Use UUID v4 for all entity IDs (snippets, compositions)
- Library: `import { v4 as uuid } from 'uuid';` (add to dependencies)
- Format: Lowercase with hyphens (`550e8400-e29b-41d4-a716-446655440000`)

### Structure Patterns

**Frontend Directory Organization (Feature-Based):**
```
src/
├── components/
│   ├── library/         # Snippet library features
│   │   ├── SnippetCard.tsx
│   │   ├── SnippetCard.test.tsx
│   │   ├── SnippetList.tsx
│   │   ├── SnippetEditor.tsx
│   │   └── SnippetDialog.tsx
│   ├── composition/     # Prompt composition features
│   │   ├── FrameworkSelector.tsx
│   │   ├── SectionCard.tsx
│   │   ├── SearchTabStop.tsx
│   │   └── MarkdownPreview.tsx
│   ├── search/          # Global search features
│   │   ├── SearchDialog.tsx
│   │   ├── SearchInput.tsx
│   │   └── SearchResults.tsx
│   └── ui/              # ShadCN UI primitives (DO NOT modify structure)
│       ├── button.tsx
│       ├── card.tsx
│       └── ... (from ShadCN)
├── stores/              # Zustand global state
│   ├── libraryStore.ts
│   ├── compositionStore.ts
│   └── themeStore.ts
├── lib/                 # Utilities and shared logic
│   ├── tauri.ts         # Tauri IPC wrappers (extend, don't replace)
│   ├── search.ts        # Fuse.js search + frecency
│   ├── schemas.ts       # Zod validation schemas
│   ├── logger.ts        # Logging (existing from starter)
│   └── utils.ts         # Helpers (existing cn(), extend as needed)
├── types/               # Shared TypeScript interfaces
│   ├── library.ts       # Library, Snippet, SnippetType, SnippetMetadata
│   └── composition.ts   # Framework, Section, CompositionDraft
├── App.tsx              # Root component
└── main.tsx             # Entry point
```

**Backend Directory Organization (Rust):**
```
src-tauri/src/
├── main.rs              # Tauri app initialization (DO NOT modify heavily)
├── lib.rs               # Module exports
├── commands/            # Tauri IPC command implementations
│   ├── mod.rs
│   ├── library.rs       # load_library, save_library
│   └── clipboard.rs     # copy_to_clipboard
├── models/              # Rust data structures (matches TypeScript types)
│   ├── mod.rs
│   └── library.rs       # Library, Snippet, SnippetMetadata structs
└── utils/               # Rust utility functions
    ├── mod.rs
    └── fs.rs            # File system helpers (atomic writes, path resolution)
```

**Test Organization:**
- **Unit Tests:** Colocated with source files (`SnippetCard.test.tsx` next to `SnippetCard.tsx`)
- **E2E Tests:** `tests/` directory with page objects (existing Playwright structure, DO NOT change)
- **Rust Tests:** Inline `#[cfg(test)]` modules within source files

**Import Alias Usage:**
```typescript
// ✅ ALWAYS use @/ alias for src imports
import { useLibraryStore } from '@/stores/libraryStore';
import { SnippetCard } from '@/components/library/SnippetCard';
import { cn } from '@/lib/utils';

// ❌ NEVER use relative imports for cross-directory imports
import { useLibraryStore } from '../../stores/libraryStore'; // WRONG
```

### Format Patterns

**JSON Data Format:**
- **Field Naming:** camelCase (matches TypeScript, not snake_case)
- **Dates:** ISO 8601 strings with milliseconds (`"2025-12-29T12:34:56.789Z"`)
- **IDs:** UUID v4 strings, lowercase with hyphens
- **Booleans:** JSON `true`/`false` (not `1`/`0` or `"true"`/`"false"`)
- **Arrays:** Always arrays, even for single items (e.g., `tags: []` not `tags: null`)
- **Null Handling:** Omit optional fields rather than storing `null` (keep JSON compact)

**Library JSON Schema:**
```json
{
  "version": "1.0.0",
  "metadata": {
    "created": "2025-12-29T12:34:56.789Z",
    "lastModified": "2025-12-30T08:15:30.123Z"
  },
  "snippets": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Senior C# Developer",
      "type": "persona",
      "content": "You are a senior C# developer with 10+ years...",
      "tags": ["c#", "senior", "backend"],
      "metadata": {
        "created": "2025-12-29T12:34:56.789Z",
        "lastUsed": "2025-12-30T08:15:30.123Z",
        "useCount": 47
      }
    }
  ]
}
```

**Tauri IPC Error Format:**
- **Rust:** Always return `Result<T, String>` with descriptive error messages
- **Error Message Format:** `"<Operation> failed: <reason>"` (e.g., `"Failed to load library: File not found"`)
- **TypeScript:** Catch and display Rust error messages directly (don't transform)

**TypeScript Type Definitions:**
- **Rust structs MUST have matching TypeScript interfaces** in `src/types/`
- **Field names MUST match exactly** (camelCase on both sides)
- **Use Zod schemas for runtime validation** (in `src/lib/schemas.ts`)

### Communication Patterns

**Zustand Store Action Naming:**
- **CRUD Operations:** `addSnippet`, `updateSnippet`, `deleteSnippet` (not `createSnippet`, `removeSnippet`)
- **Async Load/Save:** `loadLibrary`, `saveLibrary` (async actions)
- **State Updates:** `setTheme`, `setFramework`, `clearComposition`
- **Counters:** `incrementUseCount` (not `incrementUsage` or `addUseCount`)

**Zustand State Update Pattern:**
```typescript
// ✅ ALWAYS use immutable updates (Zustand default)
addSnippet: (snippet) => set((state) => ({
  snippets: [...state.snippets, {
    ...snippet,
    id: uuid(),
    metadata: {
      created: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
      useCount: 0,
    },
  }],
})),

// ❌ NEVER mutate state directly
addSnippet: (snippet) => {
  state.snippets.push(snippet); // WRONG - mutation
}
```

**Zustand Store Access Pattern:**
```typescript
// ✅ PREFERRED - Selective subscription (prevents unnecessary re-renders)
const snippets = useLibraryStore((state) => state.snippets);
const addSnippet = useLibraryStore((state) => state.addSnippet);

// ❌ AVOID - Full store destructure (subscribes to ALL state changes)
const { snippets, addSnippet, updateSnippet, ... } = useLibraryStore();
```

**Tauri IPC Communication Pattern:**
```typescript
// ✅ ALWAYS use wrapped commands from src/lib/tauri.ts
import { loadLibrary, saveLibrary, copyToClipboard } from '@/lib/tauri';

const library = await loadLibrary();
await saveLibrary(library);
await copyToClipboard(markdownText);

// ❌ NEVER call invoke directly in components or stores
import { invoke } from '@tauri-apps/api/core';
const library = await invoke('load_library'); // WRONG - no type safety
```

### Process Patterns

**Error Handling in Zustand Stores:**
```typescript
// Pattern: isLoading + error state for async actions
loadLibrary: async () => {
  set({ isLoading: true, error: null });
  try {
    const library = await loadLibrary();
    set({ snippets: library.snippets, isLoading: false });
  } catch (error) {
    set({ 
      error: error instanceof Error ? error.message : 'Failed to load library',
      isLoading: false,
    });
  }
}
```

**Loading State Management:**
```typescript
// Per-store loading state
const isLoading = useLibraryStore((state) => state.isLoading);

{isLoading ? (
  <div className="flex items-center gap-2">
    <Loader2 className="h-4 w-4 animate-spin" />
    <span>Loading library...</span>
  </div>
) : (
  <SnippetList snippets={snippets} />
)}
```

**Form Validation Pattern:**
```typescript
// Define Zod schemas in src/lib/schemas.ts
export const snippetSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  type: z.enum(['persona', 'guardrail', 'constraint']),
  content: z.string().min(1, 'Content is required'),
  tags: z.array(z.string()).default([]),
});

// Validate on form submit, not on every keystroke
function handleSubmit(data: unknown) {
  try {
    const validData = snippetSchema.parse(data);
    addSnippet(validData);
  } catch (error) {
    if (error instanceof z.ZodError) {
      setFormErrors(error.format());
    }
  }
}
```

**File System Operations (Rust):**
```rust
// ALWAYS use atomic writes for data persistence
fn save_library(library: Library) -> Result<(), String> {
    let temp_path = config_dir.join(".library.json.tmp");
    let final_path = config_dir.join("library.json");
    
    // Write to temp file
    fs::write(&temp_path, json)?;
    
    // Atomic rename (prevents corruption)
    fs::rename(temp_path, final_path)?;
    
    Ok(())
}
```

### Enforcement Guidelines

**All AI Agents MUST:**

1. **Use the `@/` import alias** for all `src/` imports (enforced by ESLint)
2. **Colocate unit tests** with source files (`SnippetCard.test.tsx` next to `SnippetCard.tsx`)
3. **Wrap all Tauri commands** in `src/lib/tauri.ts` (never call `invoke()` directly in components/stores)
4. **Use selective Zustand subscriptions** to prevent unnecessary re-renders
5. **Implement atomic file writes** for all data persistence in Rust
6. **Match TypeScript interfaces exactly** to Rust structs (field names, types, structure)
7. **Use camelCase for JSON fields** (not snake_case, even though Rust uses snake_case internally)
8. **Handle errors in Zustand stores** (set `error` state, display in components)
9. **Follow existing starter patterns** (don't reinvent error boundaries, logging, utils)
10. **Use PascalCase for component files** and camelCase for utility files

**Pattern Verification:**
- **Linting:** `npm run lint` catches import order, naming violations
- **Type Checking:** `npm run check` verifies TypeScript and Rust type alignment
- **Tests:** Unit tests must mock Zustand stores correctly (no provider wrapping)
- **Code Review:** Check for direct `invoke()` calls, mutation in Zustand, relative imports

**Pattern Updates:**
- Propose changes in architecture document first
- Update this section before implementing pattern changes
- Communicate pattern changes to all agents working on the project

### Pattern Examples

**Good Example - Zustand Store:**
```typescript
// src/stores/libraryStore.ts
import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import { loadLibrary, saveLibrary } from '@/lib/tauri';
import type { Snippet, Library } from '@/types/library';

interface LibraryState {
  snippets: Snippet[];
  isLoading: boolean;
  error: string | null;
  
  loadLibrary: () => Promise<void>;
  addSnippet: (snippet: Omit<Snippet, 'id' | 'metadata'>) => void;
  incrementUseCount: (id: string) => void;
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
  snippets: [],
  isLoading: false,
  error: null,
  
  loadLibrary: async () => {
    set({ isLoading: true, error: null });
    try {
      const library = await loadLibrary();
      set({ snippets: library.snippets, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load library',
        isLoading: false,
      });
    }
  },
  
  addSnippet: (snippet) => set((state) => ({
    snippets: [...state.snippets, {
      ...snippet,
      id: uuid(),
      metadata: {
        created: new Date().toISOString(),
        lastUsed: new Date().toISOString(),
        useCount: 0,
      },
    }],
  })),
}));
```

**Anti-Patterns (What to AVOID):**

**❌ Direct invoke() in components:**
```typescript
// WRONG - No type safety
const library = await invoke('load_library');

// CORRECT - Type-safe wrapper
const library = await loadLibrary();
```

**❌ Mutating Zustand state:**
```typescript
// WRONG - Direct mutation
addSnippet: (snippet) => {
  get().snippets.push(snippet);
}

// CORRECT - Immutable update
addSnippet: (snippet) => set((state) => ({
  snippets: [...state.snippets, snippet],
}))
```

**❌ Relative imports across directories:**
```typescript
// WRONG
import { useLibraryStore } from '../../../stores/libraryStore';

// CORRECT
import { useLibraryStore } from '@/stores/libraryStore';
```

## Project Structure & Boundaries

### Complete Project Directory Structure

```
prompt-alchemist/
├── README.md
├── LICENSE
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.ts
├── components.json          # ShadCN UI configuration
├── eslint.config.ts
├── .prettierrc.json
├── .prettierignore
├── stylelint.config.mjs
├── vitest.config.ts
├── vitest.globals.ts
├── vitest.setup.ts
├── playwright.config.ts
├── .nvmrc                   # Node v24.12.0
├── .gitignore
├── .hintrc
├── .lintstagedrc.json
├── AGENTS.md                # AI agent guidelines (existing)
├── TECH_DEBT.md
├── index.html
│
├── .husky/                  # Git hooks
│   ├── pre-commit
│   ├── pre-push
│   ├── post-checkout
│   └── post-merge
│
├── .github/                 # GitHub configuration
│   └── agents/              # GitHub agent definitions
│
├── docs/                    # Project documentation
│   ├── 0-getting-started.md
│   ├── 1-architecture.md
│   ├── 2-tech-stack.md
│   ├── 3-development-guide.md
│   ├── 4-testing-guide.md
│   ├── 5-contributing.md
│   ├── 6-personalizing.md
│   ├── rust-tooling.md
│   └── README.md
│
├── _bmad-output/            # Generated planning docs
│   ├── prd.md
│   ├── ux-design-specification.md
│   ├── architecture.md      # This document
│   └── ... (other planning artifacts)
│
├── scripts/                 # Build/development scripts
│   ├── notify-lockfile-changed.ts
│   └── validate-lockfile.ts
│
├── public/                  # Static assets
│   ├── tauri.svg
│   └── vite.svg
│
├── src/                     # React frontend
│   ├── main.tsx             # Frontend entry point
│   ├── App.tsx              # Root component
│   ├── App.test.tsx
│   ├── App.css
│   ├── index.css            # Global styles + Catppuccin theme
│   ├── vite-env.d.ts
│   │
│   ├── components/          # React components (feature-based)
│   │   ├── library/         # Snippet library management
│   │   │   ├── SnippetCard.tsx
│   │   │   ├── SnippetCard.test.tsx
│   │   │   ├── SnippetList.tsx
│   │   │   ├── SnippetList.test.tsx
│   │   │   ├── SnippetEditor.tsx
│   │   │   ├── SnippetEditor.test.tsx
│   │   │   ├── SnippetDialog.tsx
│   │   │   └── SnippetDialog.test.tsx
│   │   │
│   │   ├── composition/     # Prompt composition features
│   │   │   ├── FrameworkSelector.tsx
│   │   │   ├── FrameworkSelector.test.tsx
│   │   │   ├── SectionCard.tsx
│   │   │   ├── SectionCard.test.tsx
│   │   │   ├── SearchTabStop.tsx
│   │   │   ├── SearchTabStop.test.tsx
│   │   │   ├── MarkdownPreview.tsx
│   │   │   └── MarkdownPreview.test.tsx
│   │   │
│   │   ├── search/          # Global search features
│   │   │   ├── SearchDialog.tsx
│   │   │   ├── SearchDialog.test.tsx
│   │   │   ├── SearchInput.tsx
│   │   │   ├── SearchInput.test.tsx
│   │   │   ├── SearchResults.tsx
│   │   │   └── SearchResults.test.tsx
│   │   │
│   │   ├── ui/              # ShadCN UI primitives (existing)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ... (other ShadCN components)
│   │   │
│   │   ├── AppErrorBoundary.tsx     # Global error boundary (existing)
│   │   └── AppErrorBoundary.test.tsx
│   │
│   ├── stores/              # Zustand global state
│   │   ├── libraryStore.ts
│   │   ├── libraryStore.test.ts
│   │   ├── compositionStore.ts
│   │   ├── compositionStore.test.ts
│   │   ├── themeStore.ts
│   │   └── themeStore.test.ts
│   │
│   ├── lib/                 # Utilities and shared logic
│   │   ├── tauri.ts         # Tauri IPC wrappers (extend existing)
│   │   ├── tauri.test.ts
│   │   ├── search.ts        # Fuse.js + frecency algorithm
│   │   ├── search.test.ts
│   │   ├── schemas.ts       # Zod validation schemas
│   │   ├── schemas.test.ts
│   │   ├── logger.ts        # Logging utility (existing)
│   │   ├── logger.test.ts
│   │   ├── utils.ts         # Shared helpers (existing cn())
│   │   ├── utils.test.ts
│   │   └── global-errors.ts # Global error handling (existing)
│   │
│   ├── types/               # Shared TypeScript interfaces
│   │   ├── library.ts       # Library, Snippet, SnippetType, SnippetMetadata
│   │   └── composition.ts   # Framework, Section, CompositionDraft
│   │
│   └── assets/              # Frontend assets
│       └── react.svg
│
├── src-tauri/               # Rust backend
│   ├── Cargo.toml           # Rust dependencies
│   ├── Cargo.lock
│   ├── tauri.conf.json      # Tauri configuration
│   ├── build.rs             # Build script
│   ├── clippy.toml          # Rust linting rules
│   ├── rustfmt.toml         # Rust formatting rules
│   ├── .gitignore
│   │
│   ├── capabilities/        # Tauri security permissions
│   │   └── default.json
│   │
│   ├── icons/               # Application icons
│   │   ├── 32x32.png
│   │   ├── 128x128.png
│   │   ├── 128x128@2x.png
│   │   ├── icon.icns
│   │   ├── icon.ico
│   │   ├── icon.png
│   │   └── ... (platform-specific icons)
│   │
│   └── src/                 # Rust source code
│       ├── main.rs          # Tauri app initialization
│       ├── lib.rs           # Module exports
│       │
│       ├── commands/        # Tauri IPC command implementations
│       │   ├── mod.rs
│       │   ├── library.rs   # load_library, save_library
│       │   └── clipboard.rs # copy_to_clipboard
│       │
│       ├── models/          # Rust data structures (matches TypeScript)
│       │   ├── mod.rs
│       │   └── library.rs   # Library, Snippet, SnippetMetadata structs
│       │
│       └── utils/           # Rust utility functions
│           ├── mod.rs
│           └── fs.rs        # File system helpers (atomic writes, paths)
│
└── tests/                   # E2E tests (Playwright)
    ├── app.greet.spec.ts    # Example test (existing)
    ├── app.navigation.spec.ts
    │
    └── pages/               # Page object models
        └── HomePage.ts      # Example page object (existing)
```

### Architectural Boundaries

**IPC Boundary (React ↔ Rust):**
- **Frontend:** `src/lib/tauri.ts` - Type-safe wrappers around Tauri commands
- **Backend:** `src-tauri/src/commands/` - Tauri command implementations
- **Communication:** JSON serialization via `serde` (Rust) and `@tauri-apps/api/core` (TypeScript)
- **Error Handling:** `Result<T, String>` in Rust, thrown errors in TypeScript

**State Management Boundary (Zustand):**
- **Stores:** `src/stores/` - Global application state (library, composition, theme)
- **Components:** Subscribe selectively via `useLibraryStore((state) => state.snippets)`
- **IPC Integration:** Stores call `src/lib/tauri.ts` wrappers for persistence
- **No Context API:** Zustand replaces Context for global state

**Component Boundary (React):**
- **UI Primitives:** `src/components/ui/` - ShadCN UI components (DO NOT modify structure)
- **Feature Components:** `src/components/{library,composition,search}/` - Feature-specific UI
- **Props:** Type-safe interfaces, no prop drilling (use Zustand for shared state)
- **Testing:** Colocated `.test.tsx` files, mock Zustand stores

**File System Boundary (Rust):**
- **Config Directory:** Platform-specific paths via `tauri::api::path::app_config_dir()`
  - macOS/Linux: `~/.config/prompt-alchemist/`
  - Windows: `%LOCALAPPDATA%\prompt-alchemist\`
- **Atomic Writes:** Write to `.library.json.tmp`, rename to `library.json`
- **Permissions:** Tauri capabilities in `src-tauri/capabilities/default.json`

### Requirements to Structure Mapping

**FR1-FR6: Snippet Library Management**
- **Frontend Components:** `src/components/library/`
  - `SnippetCard.tsx` - Display individual snippet
  - `SnippetList.tsx` - Display library with virtual scrolling
  - `SnippetEditor.tsx` - CRUD form for snippet
  - `SnippetDialog.tsx` - Modal wrapper for editor
- **State Management:** `src/stores/libraryStore.ts`
  - `addSnippet`, `updateSnippet`, `deleteSnippet` actions
  - `loadLibrary`, `saveLibrary` async actions
- **Backend:** `src-tauri/src/commands/library.rs`
  - `load_library() -> Result<Library, String>`
  - `save_library(library: Library) -> Result<(), String>`
- **Types:** `src/types/library.ts` - `Library`, `Snippet`, `SnippetType`, `SnippetMetadata`
- **Validation:** `src/lib/schemas.ts` - Zod schemas for runtime validation

**FR7-FR12: Framework Management**
- **Frontend Components:** `src/components/composition/`
  - `FrameworkSelector.tsx` - Radio group for RTF/CODER/Co-Star
  - `SectionCard.tsx` - Framework section with tab stops
- **State Management:** `src/stores/compositionStore.ts`
  - `setFramework` action
  - Framework templates hardcoded (RTF 3-section, CODER 5-section, Co-Star 6-section)
- **Types:** `src/types/composition.ts` - `Framework`, `Section`

**FR13-FR18: Prompt Composition**
- **Frontend Components:** `src/components/composition/`
  - `SearchTabStop.tsx` - Novel search-enabled tab stop component
  - `MarkdownPreview.tsx` - Live preview of assembled prompt
- **State Management:** `src/stores/compositionStore.ts`
  - `insertSnippet`, `updateSection`, `generateMarkdown` actions
- **IPC:** No backend needed (composition is ephemeral, not persisted)

**FR19-FR23: Search & Discovery**
- **Frontend Components:** `src/components/search/`
  - `SearchDialog.tsx` - Cmd+K global search modal
  - `SearchInput.tsx` - Debounced search input
  - `SearchResults.tsx` - Fuzzy + frecency ranked results
- **Search Logic:** `src/lib/search.ts`
  - Fuse.js configuration and wrapper
  - Frecency ranking algorithm
- **State Management:** `src/stores/libraryStore.ts`
  - `incrementUseCount` action (updates frecency metadata)
- **Dependencies:** `fuse.js` (~10KB), `@tanstack/react-virtual` (virtual scrolling)

**FR24-FR26: Clipboard & Export**
- **Frontend Components:** `src/components/composition/MarkdownPreview.tsx`
  - Copy button triggers clipboard IPC
- **Backend:** `src-tauri/src/commands/clipboard.rs`
  - `copy_to_clipboard(text: String) -> Result<(), String>`
- **IPC Wrapper:** `src/lib/tauri.ts` - `copyToClipboard(text: string)`

**FR27-FR36: Cross-Platform Desktop**
- **Backend:** `src-tauri/src/utils/fs.rs`
  - `get_config_dir() -> Result<PathBuf, String>` (platform-specific)
  - Atomic write helper functions
- **Configuration:** `src-tauri/tauri.conf.json`
  - Window settings, bundle settings, capabilities
- **Icons:** `src-tauri/icons/` - Platform-specific app icons

**FR37-FR42: Keyboard-First Navigation**
- **Frontend Components:** All components in `src/components/`
  - `onKeyDown` handlers for Tab, Arrow keys, Enter, Esc
  - Cmd/Ctrl mapping handled by React events
- **Global Shortcuts:** `SearchDialog.tsx`
  - Cmd+K listener in `useEffect`
- **Accessibility:** ARIA attributes, focus management, ShadCN primitives

### Cross-Cutting Concerns Mapping

**Theme Management:**
- **CSS:** `src/index.css` - Catppuccin color variables
- **Store:** `src/stores/themeStore.ts` - Theme toggle, system preference detection
- **Tailwind:** `tailwind.config.ts` - Map CSS variables to Tailwind utilities
- **Persistence:** localStorage via Zustand persist middleware

**Error Handling:**
- **Global Boundary:** `src/components/AppErrorBoundary.tsx` (React errors only)
- **Store Errors:** `src/stores/*.ts` - `error` state for async operations
- **IPC Errors:** `src-tauri/src/commands/*.rs` - `Result<T, String>` pattern
- **Display:** ShadCN `Alert` component in feature components

**Logging:**
- **Frontend:** `src/lib/logger.ts` (existing)
  - `console.error`, `console.info`, `console.warn` (NO `console.log` in app code)
- **Backend:** Rust `log` crate with Tauri plugin (post-MVP)

**Testing Infrastructure:**
- **Unit Tests:** Colocated with source (`.test.ts(x)`)
  - Vitest + jsdom + `@testing-library/react`
  - Mock Zustand stores via `vi.mock`
  - Mock Tauri IPC via `vi.mock('@tauri-apps/api/core')`
- **E2E Tests:** `tests/` directory
  - Playwright with page objects
  - Desktop app testing (not browser)
- **Rust Tests:** Inline `#[cfg(test)]` modules

### Integration Points

**Internal Communication Flow:**

1. **Component → Zustand Store:**
   - Components call store actions via selective subscriptions
   - Example: `const addSnippet = useLibraryStore((state) => state.addSnippet);`

2. **Zustand Store → Tauri IPC:**
   - Stores call `src/lib/tauri.ts` wrappers for persistence
   - Example: `await saveLibrary(library);` in `libraryStore.saveLibrary` action

3. **Tauri IPC → Rust Commands:**
   - TypeScript `invoke()` serializes to JSON
   - Rust deserializes via `serde`
   - Example: `invoke<Library>('load_library')` → `#[tauri::command] fn load_library()`

4. **Rust Commands → File System:**
   - Commands use `src-tauri/src/utils/fs.rs` helpers
   - Atomic writes prevent corruption

**Data Flow Diagrams:**

```
User Interaction (Component)
  ↓
Zustand Store Action
  ↓
Tauri IPC Wrapper (src/lib/tauri.ts)
  ↓
Rust Command (src-tauri/src/commands/)
  ↓
File System (atomic write to ~/.config/prompt-alchemist/library.json)
```

```
App Initialization (src/main.tsx)
  ↓
Load Library (libraryStore.loadLibrary())
  ↓
Tauri IPC (loadLibrary())
  ↓
Rust Command (load_library())
  ↓
File System (read ~/.config/prompt-alchemist/library.json)
  ↓
Return Library to Store
  ↓
Component Renders with Data
```

**External Integrations:**
- **None for MVP** (offline-only, no cloud services, no network dependencies)
- **Post-MVP:** Potential cloud sync, plugin system

### File Organization Patterns

**Configuration Files (Root):**
- Package management: `package.json`, `package-lock.json`
- TypeScript: `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
- Build tools: `vite.config.ts`, `tailwind.config.ts`, `components.json`
- Code quality: `eslint.config.ts`, `.prettierrc.json`, `stylelint.config.mjs`
- Testing: `vitest.config.ts`, `playwright.config.ts`
- Git: `.gitignore`, `.lintstagedrc.json`, `.husky/`
- Node version: `.nvmrc` (v24.12.0)

**Source Organization:**
- **Entry Point:** `src/main.tsx` → mounts React, initializes theme, loads library
- **Feature-Based:** `src/components/{library,composition,search}/` - Group by feature, not type
- **Shared Logic:** `src/lib/` - Utilities, IPC wrappers, search, schemas
- **Global State:** `src/stores/` - Zustand stores
- **Type Definitions:** `src/types/` - Shared TypeScript interfaces

**Test Organization:**
- **Unit Tests:** Colocated (same directory as source)
  - Example: `SnippetCard.tsx` + `SnippetCard.test.tsx`
- **E2E Tests:** `tests/` directory
  - Page objects in `tests/pages/`
  - Specs in `tests/*.spec.ts`
- **Test Utilities:** `vitest.setup.ts`, `vitest.globals.ts`

**Asset Organization:**
- **Public Assets:** `public/` - Static files served by Vite
- **Component Assets:** `src/assets/` - Imported by components
- **App Icons:** `src-tauri/icons/` - Platform-specific (macOS .icns, Windows .ico, Linux .png)

### Development Workflow Integration

**Development Server:**
```bash
npm run tauri:dev   # Desktop app with HMR
npm run dev         # Web mode (for rapid UI iteration, no Tauri features)
```

**File Watching:**
- Vite watches `src/` for frontend changes (HMR <100ms)
- Tauri CLI watches `src-tauri/src/` for Rust changes (rebuild ~2-5s)
- ESLint/Prettier run on save (IDE integration)

**Build Process:**
```bash
npm run build          # Frontend only (dist/)
npm run tauri:build    # Full desktop app (src-tauri/target/release/)
```

**Build Artifacts:**
- Frontend: `dist/` (Vite output)
- Rust: `src-tauri/target/` (Cargo output)
- Desktop bundles: `src-tauri/target/release/bundle/` (.dmg, .msi, .deb, .rpm, AppImage)

**Deployment Structure:**
- **macOS:** `.dmg` (code signing required for distribution)
- **Windows:** `.msi` (NSIS installer)
- **Linux:** AppImage (primary), `.deb`, `.rpm`
