---
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - _bmad-output/prd.md
  - _bmad-output/architecture.md
  - _bmad-output/ux-design-specification.md
validationComplete: true
readyForDevelopment: true
---

# prompt-alchemist - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for prompt-alchemist, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

**Snippet Library Management (FR1-FR6):**
- FR1: Users can create new snippets with a name, type (persona/guardrail/constraint), and content
- FR2: Users can edit existing snippets (modify name, type, or content)
- FR3: Users can delete snippets from their library
- FR4: Users can organize snippets by type/category (personas, guardrails, constraints)
- FR5: Users can view their complete snippet library in a browsable list
- FR6: System stores snippet library in JSON format in platform-specific config directories

**Framework Management (FR7-FR12):**
- FR7: Users can select from three framework templates (RTF, CODER, Co-Star)
- FR8: Users can view framework descriptions explaining each framework's purpose and sections
- FR9: System displays RTF framework with 3 sections (Role, Task, Format)
- FR10: System displays CODER framework with 5 sections (Context, Objective, Details, Examples, Response)
- FR11: System displays Co-Star framework with 6 sections (Context, Objective, Style, Tone, Audience, Response)
- FR12: Users can switch between frameworks during prompt composition

**Prompt Composition (FR13-FR18):**
- FR13: Users can compose prompts using a side-by-side layout (library panel + preview panel)
- FR14: Users can drag and drop snippets from library into preview panel
- FR15: Users can manually edit prompt content directly in preview panel (freeform text editing)
- FR16: Users can see selected framework sections displayed in preview panel
- FR17: Users can combine structured framework sections with freeform editing
- FR18: System displays composed prompt content in real-time as users add snippets or type

**Search & Discovery (FR19-FR23):**
- FR19: Users can search snippets using Cmd+K global search shortcut
- FR20: System performs fuzzy matching on snippet names during search
- FR21: Users can navigate search results using arrow keys
- FR22: Users can insert selected snippet from search results into prompt by pressing Enter
- FR23: System filters library by snippet type/category when browsing

**Clipboard & Export (FR24-FR26):**
- FR24: Users can copy composed prompts to system clipboard with Cmd+C or copy button
- FR25: System exports prompts as plain text markdown format for LLM compatibility
- FR26: Users can paste copied prompts into external LLM tools (Cursor, ChatGPT, Claude Desktop)

**Cross-Platform Desktop Functionality (FR27-FR36):**
- FR27: Application runs natively on macOS (10.15 Catalina or later)
- FR28: Application runs natively on Windows (10 64-bit or later)
- FR29: Application runs natively on Linux (via AppImage, .deb, or .rpm)
- FR30: System maps Cmd shortcuts on macOS to Ctrl shortcuts on Windows/Linux automatically
- FR31: System stores library in `~/.config/prompt-alchemist/` on macOS/Linux
- FR32: System stores library in `%LOCALAPPDATA%\prompt-alchemist\` on Windows
- FR33: Application functions completely offline without internet connectivity
- FR34: Users can manually copy config directory to move libraries between machines
- FR35: System persists window size, position, and layout preferences across sessions
- FR36: Application starts and becomes usable within 2 seconds (cold start target)

**Keyboard-First Navigation (FR37-FR42):**
- FR37: Users can trigger global search with Cmd+K (macOS) or Ctrl+K (Windows/Linux)
- FR38: Users can copy composed prompt with Cmd+C (macOS) or Ctrl+C (Windows/Linux)
- FR39: Users can save prompt template with Cmd+S (macOS) or Ctrl+S (Windows/Linux)
- FR40: Users can navigate between UI panels using Tab and Shift+Tab keys
- FR41: Users can navigate search results using Up/Down arrow keys
- FR42: Users can perform all core actions without mouse interaction

### NonFunctional Requirements

**Performance (NFR-P1 to NFR-P8):**
- NFR-P1: Snippet search returns results within 100ms for libraries up to 1,000 snippets
- NFR-P2: Fuzzy matching algorithm completes within 50ms on average user libraries (50-100 snippets)
- NFR-P3: Application cold start completes within 2 seconds from launch to usable state
- NFR-P4: Snippet drag-and-drop insertion responds within 50ms (perceived as instant)
- NFR-P5: Framework switching updates UI within 200ms
- NFR-P6: Keyboard shortcuts (Cmd+K, Cmd+C, Tab navigation) respond within 100ms
- NFR-P7: Application baseline memory usage remains under 100MB during idle state
- NFR-P8: Application memory usage remains under 200MB during active composition with large libraries (500+ snippets)

**Reliability (NFR-R1 to NFR-R9):**
- NFR-R1: Library changes are saved immediately upon user action (no manual save required)
- NFR-R2: Application recovers unsaved prompt composition content after unexpected crash or restart
- NFR-R3: JSON library files maintain integrity across application crashes (atomic writes, no corruption)
- NFR-R4: Library format versioning prevents data loss when upgrading to newer application versions
- NFR-R5: Library exported from one platform (e.g., macOS) imports with zero data loss on another platform (e.g., Windows, Linux)
- NFR-R6: All core functional requirements (FR1-FR42) behave identically across macOS, Windows, and Linux
- NFR-R7: E2E test suite passes on all three platforms (Mac, Windows, Linux) before every release
- NFR-R8: Application handles file system errors gracefully (missing config directory, read/write permissions) without crashing
- NFR-R9: Application displays clear, actionable error messages when operations fail

**Usability (NFR-U1 to NFR-U8):**
- NFR-U1: All core user workflows (create snippet, search, compose, copy) are completable without mouse interaction
- NFR-U2: Keyboard shortcuts follow platform conventions (Cmd on macOS maps to Ctrl on Windows/Linux)
- NFR-U3: Keyboard shortcut discoverability: All shortcuts displayed in tooltips, menus, or help documentation
- NFR-U4: New users can create their first snippet and compose a prompt within 5 minutes of first launch
- NFR-U5: Framework selection provides clear descriptions explaining purpose and use cases (RTF vs CODER vs Co-Star)
- NFR-U6: Search results display snippet type/category to aid selection during composition
- NFR-U7: Power users can compose prompts in under 30 seconds using Cmd+K search and keyboard insertion (vs 2-5 minutes manual typing)
- NFR-U8: Application does not require mode switching between structured framework composition and freeform editing

**Accessibility (NFR-A1 to NFR-A21):**
- NFR-A1: All interactive elements are keyboard-accessible using Tab, Shift+Tab, Enter, Escape, and Arrow keys
- NFR-A2: Keyboard focus indicators are visible and meet WCAG 2.1 AA contrast requirements (3:1 minimum)
- NFR-A3: Focus order follows logical visual flow (left-to-right, top-to-bottom in Western locales)
- NFR-A4: Keyboard shortcuts do not conflict with screen reader shortcuts (avoid single-key shortcuts without modifier keys)
- NFR-A5: All UI elements have appropriate ARIA labels, roles, and states for screen reader compatibility
- NFR-A6: Dynamic content changes (search results, snippet insertion, framework switching) announce to screen readers using ARIA live regions
- NFR-A7: Application is navigable and usable with VoiceOver (macOS), NVDA (Windows), and Orca (Linux)
- NFR-A8: Snippet library items announce type/category and content when focused by screen readers
- NFR-A9: All text meets WCAG 2.1 AA contrast ratio requirements (4.5:1 for normal text, 3:1 for large text)
- NFR-A10: UI does not rely solely on color to convey information (use icons, labels, or patterns as secondary indicators)
- NFR-A11: User interface supports browser/OS zoom up to 200% without loss of functionality
- NFR-A12: Framework sections and snippet categories are distinguishable through visual hierarchy beyond color alone
- NFR-A13: All clickable targets meet minimum size requirements (44x44px for touch, 24x24px for pointer as per WCAG 2.1 AA)
- NFR-A14: Drag-and-drop functionality has keyboard-equivalent alternatives (e.g., select snippet + Enter to insert)
- NFR-A15: Search filtering provides clear feedback on number of results and current selection state
- NFR-A16: Error messages and validation feedback are announced to screen readers and visible in UI
- NFR-A17: Application respects `prefers-reduced-motion` system setting, disabling non-essential animations
- NFR-A18: Framework switching and snippet insertion transitions are optional or instantaneous when reduced motion is enabled
- NFR-A19: Application passes automated accessibility testing (e.g., axe-core, Lighthouse accessibility audits) with zero critical violations
- NFR-A20: Manual keyboard-only navigation testing completed for all core workflows before each release
- NFR-A21: Screen reader testing with at least one platform's screen reader (VoiceOver, NVDA, or Orca) completed before major releases

**Compatibility (NFR-C1 to NFR-C10):**
- NFR-C1: UI components render visually identically across macOS, Windows, and Linux using ShadCN UI and Tailwind CSS
- NFR-C2: Application respects platform-specific window management conventions (title bar, menus, close behavior)
- NFR-C3: Library files stored in JSON format are human-readable and Git-compatible (version control friendly)
- NFR-C4: Config directory locations follow platform standards (macOS/Linux: `~/.config/prompt-alchemist/`, Windows: `%LOCALAPPDATA%\prompt-alchemist\`)
- NFR-C5: Library JSON schema is backward compatible (older libraries work with newer app versions)
- NFR-C6: Copied prompts are plain text markdown format compatible with all major LLM interfaces (Cursor, ChatGPT, Claude Desktop, VSCode)
- NFR-C7: Clipboard operations work identically across all supported platforms
- NFR-C8: Application runs on macOS 10.15 (Catalina) or later, supporting both Intel and Apple Silicon
- NFR-C9: Application runs on Windows 10 (64-bit) or later, including Windows 11
- NFR-C10: Application runs on Linux distributions via AppImage, .deb (Ubuntu/Debian), and .rpm (Fedora/RHEL)

### Additional Requirements

**Architecture & Technology Stack:**
- **Starter Template:** tauri2-react-starter (brownfield project extending existing foundation)
- **Frontend:** React 19 + TypeScript 5.9.3 + Vite 7.3.0 + ShadCN UI + Tailwind CSS v4
- **Backend:** Rust 2021 + Tauri v2 for native capabilities
- **State Management:** Zustand v4.x for global state (~1KB gzipped)
- **Search Implementation:** fuse.js v7.x (fuzzy matching library, ~10KB gzipped) in TypeScript frontend
- **Data Storage:** Single JSON file (`library.json`) with versioned schema (v1.0.0) in platform-specific config directories
- **IPC Layer:** Type-safe Tauri commands for file I/O, clipboard, config management
- **Testing:** Vitest 4.0.16 (unit tests) + Playwright 1.57.0 (E2E tests)
- **Atomic Writes:** Write to `.library.json.tmp`, rename to `library.json` to prevent corruption
- **Data Migration:** Version field in JSON root for schema detection, migration functions for upgrades

**UX & Interaction Patterns:**
- **Search-Enabled Tab Stops:** Novel UX pattern combining VSCode tab stops with Raycast-style inline search
- **Frecency Ranking:** Search results ranked by formula: (frequency × 10) + (days_since_last_use × -1)
- **Template Gallery:** Pre-filled example prompts (code refactoring, bug fixes, documentation) for learning by example
- **Framework Comparison:** First-launch modal educating users about RTF/CODER/Co-Star (easily dismissed)
- **Starter Library:** Pre-populated with common snippets demonstrating atomic composition patterns
- **Ghost Text Completions:** Gray italic suggestions that disappear when user continues typing
- **Context-Aware Search:** Tab stops filter library by snippet type (personas at Role section, constraints at Task section)

**Visual Design System:**
- **Color Palette:** Catppuccin Mocha (dark, default) and Latte (light) themes
- **Primary Accent:** Mauve (`#cba6f7` Mocha, `#8839ef` Latte) for focus states, primary buttons
- **Typography:** System font stack for UI (-apple-system, BlinkMacSystemFont, Segoe UI), JetBrains Mono/Fira Code for code/snippets
- **Type Scale:** 14px body (desktop standard), 12px captions, 13px code, 16-20px headings
- **Spacing:** Tailwind 4px base unit, compact spacing (8-16px padding) for information density
- **Border Radius:** Subtle (6px buttons, 8px cards), professional not playful
- **Shadows:** Minimal (shadow-sm for cards, shadow-md for popovers, shadow-lg for modals)
- **Transitions:** Fast (100-150ms hover/focus), medium (200ms theme switching), no animations >300ms

**Layout & Navigation:**
- **Panel Structure:** 5% sidebar (~60px) + 28% library (min 280px) + 67% preview (min 400px)
- **Sidebar Navigation:** VSCode-inspired icon-based sidebar for categories (P=Personas, C=Constraints, G=Guardrails)
- **Dense Layout:** 32px snippet item height, 4px gaps between items, maximum information density
- **Resizable Panels:** User can drag divider between library and preview, preference saved
- **Minimum Width:** 800px (functional but cramped), optimal 1200px+

**Keyboard Shortcuts:**
- **Cmd+K (Ctrl+K):** Global search for snippets/templates/commands
- **Cmd+C (Ctrl+C):** Copy composed prompt to clipboard
- **Cmd+S (Ctrl+S):** Save prompt template (future enhancement)
- **Cmd+Z (Ctrl+Z):** Undo snippet insertion or edits
- **Tab:** Open inline search at tab stop, navigate between UI elements
- **Shift+Tab:** Navigate backward between UI elements
- **Enter:** Select search result and insert snippet
- **Esc:** Universal dismiss (close search, modal, popover)
- **Arrow Keys:** Navigate search results, list items
- **Cmd+1/2/3 (Ctrl+1/2/3):** Switch between sidebar categories

**Error Handling & Recovery:**
- **Graceful Degradation:** Handle missing permissions, file system errors without crashes
- **Clear Error Messages:** Format: "<Operation> failed: <reason>" (e.g., "Failed to load library: File not found")
- **Undo/Redo:** Cmd+Z undos snippet insertions, framework section edits
- **Escape Hatches:** Esc key closes any modal/popover, manual typing always possible at tab stops
- **Crash Recovery:** Unsaved prompt composition content recovers on restart

### FR Coverage Map

**Epic 1 - Foundation & Application Shell:**
- FR27: Application runs natively on macOS (10.15 Catalina or later)
- FR28: Application runs natively on Windows (10 64-bit or later)
- FR29: Application runs natively on Linux (via AppImage, .deb, or .rpm)
- FR30: System maps Cmd shortcuts on macOS to Ctrl shortcuts on Windows/Linux automatically
- FR31: System stores library in `~/.config/prompt-alchemist/` on macOS/Linux
- FR32: System stores library in `%LOCALAPPDATA%\prompt-alchemist\` on Windows
- FR33: Application functions completely offline without internet connectivity
- FR35: System persists window size, position, and layout preferences across sessions
- FR36: Application starts and becomes usable within 2 seconds (cold start target)

**Epic 2 - Snippet Library Management:**
- FR1: Users can create new snippets with a name, type (persona/guardrail/constraint), and content
- FR2: Users can edit existing snippets (modify name, type, or content)
- FR3: Users can delete snippets from their library
- FR4: Users can organize snippets by type/category (personas, guardrails, constraints)
- FR5: Users can view their complete snippet library in a browsable list
- FR6: System stores snippet library in JSON format in platform-specific config directories

**Epic 3 - Basic Prompt Composition:**
- FR7: Users can select from three framework templates (RTF, CODER, Co-Star)
- FR8: Users can view framework descriptions explaining each framework's purpose and sections
- FR9: System displays RTF framework with 3 sections (Role, Task, Format)
- FR10: System displays CODER framework with 5 sections (Context, Objective, Details, Examples, Response)
- FR11: System displays Co-Star framework with 6 sections (Context, Objective, Style, Tone, Audience, Response)
- FR12: Users can switch between frameworks during prompt composition
- FR13: Users can compose prompts using a side-by-side layout (library panel + preview panel)
- FR15: Users can manually edit prompt content directly in preview panel (freeform text editing)
- FR16: Users can see selected framework sections displayed in preview panel
- FR17: Users can combine structured framework sections with freeform editing
- FR18: System displays composed prompt content in real-time as users add snippets or type
- FR24: Users can copy composed prompts to system clipboard with Cmd+C or copy button
- FR25: System exports prompts as plain text markdown format for LLM compatibility
- FR26: Users can paste copied prompts into external LLM tools (Cursor, ChatGPT, Claude Desktop)

**Epic 4 - Search & Discovery:**
- FR19: Users can search snippets using Cmd+K global search shortcut
- FR20: System performs fuzzy matching on snippet names during search
- FR21: Users can navigate search results using arrow keys
- FR22: Users can insert selected snippet from search results into prompt by pressing Enter
- FR23: System filters library by snippet type/category when browsing

**Epic 5 - Advanced Composition Interactions:**
- FR14: Users can drag and drop snippets from library into preview panel
- UX-REQ: Search-enabled tab stops (VSCode tab stops + Raycast inline search pattern)
- UX-REQ: Context-aware search filtering at tab stops (personas at Role, constraints at Task)
- UX-REQ: Ghost text completions (gray italic suggestions)

**Epic 6 - Keyboard-First Navigation & Power User Features:**
- FR37: Users can trigger global search with Cmd+K (macOS) or Ctrl+K (Windows/Linux)
- FR38: Users can copy composed prompt with Cmd+C (macOS) or Ctrl+C (Windows/Linux)
- FR39: Users can save prompt template with Cmd+S (macOS) or Ctrl+S (Windows/Linux)
- FR40: Users can navigate between UI panels using Tab and Shift+Tab keys
- FR41: Users can navigate search results using Up/Down arrow keys
- FR42: Users can perform all core actions without mouse interaction

**Coverage Summary:**
- Total FRs: 42
- FRs mapped to epics: 42
- Coverage: 100% ✅

## Epic List

### Epic 1: Foundation & Application Shell
Users can launch a cross-platform desktop application with professional visual design, platform-specific configuration, and sub-2-second startup times. The application provides the foundational UI shell (sidebar navigation, resizable panels, Catppuccin themes) and architectural infrastructure (Zustand state, Tauri IPC, JSON persistence) that all subsequent epics build upon.

**FRs covered:** FR27, FR28, FR29, FR30, FR31, FR32, FR33, FR35, FR36

**Implementation notes:**
- Extends tauri2-react-starter brownfield template
- Implements Catppuccin Mocha (dark) and Latte (light) themes with CSS custom properties
- Creates 3-panel layout: sidebar (5% ~60px) + library (28% min 280px) + preview (67% min 400px)
- Sets up Zustand stores for global state (snippets, settings, UI state)
- Implements Tauri IPC commands for file I/O and config directory access
- Configures platform-specific paths (~/.config on Mac/Linux, %LOCALAPPDATA% on Windows)

---

### Epic 2: Snippet Library Management
Users can create, edit, delete, organize, and persist their reusable snippet library across application sessions. Snippets are categorized by type (personas, constraints, guardrails) and stored in JSON format with atomic writes to prevent corruption.

**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6

**Implementation notes:**
- JSON schema v1.0.0 with version field for future migrations
- Atomic writes via `.library.json.tmp` → `library.json` rename pattern
- CRUD operations trigger immediate auto-save (no manual Cmd+S required)
- Sidebar category icons (P/C/G) filter library by type
- Library panel displays snippets as 32px-height cards with metadata (usage count, last used)
- Snippet creation dialog with name, type dropdown, content textarea

---

### Epic 3: Basic Prompt Composition
Users can compose effective prompts by selecting framework templates (RTF/CODER/Co-Star), manually editing sections, and copying to clipboard for use in external LLM tools. This delivers the core 30-second composition workflow enabling immediate time savings.

**FRs covered:** FR7, FR8, FR9, FR10, FR11, FR12, FR13, FR15, FR16, FR17, FR18, FR24, FR25, FR26

**Implementation notes:**
- Framework selector dropdown in preview panel header
- Framework templates render appropriate sections (RTF: 3, CODER: 5, Co-Star: 6)
- Each section is a textarea with placeholder text and framework-specific descriptions
- Real-time preview updates as user types (controlled React inputs)
- Copy button triggers clipboard API with "Copied ✓" visual feedback (2-second display)
- Plain text markdown export format compatible with Cursor/Claude/ChatGPT
- Hybrid editing: users can type freely or insert snippets (prepared for Epic 4)

---

### Epic 4: Search & Discovery
Users can instantly find snippets via Cmd+K global search with fuzzy matching and frecency ranking. Search results are navigable via keyboard, enabling power users to compose prompts in under 30 seconds.

**FRs covered:** FR19, FR20, FR21, FR22, FR23

**Implementation notes:**
- Cmd+K (Ctrl+K on Windows/Linux) opens command palette overlay (ShadCN Command component)
- fuse.js v7.x implements fuzzy matching on snippet names (<100ms response target)
- Frecency ranking formula: (frequency × 10) + (days_since_last_use × -1)
- Arrow keys navigate results, Enter inserts selected snippet at cursor position
- Search results grouped by category (Personas, Constraints, Guardrails)
- Context-aware filtering: sidebar category selection filters search scope
- Search state managed in Zustand store, persists usage metadata for frecency

---

### Epic 5: Advanced Composition Interactions
Users can drag-and-drop snippets from library into composition areas and use search-enabled tab stops for seamless keyboard-first composition. This delivers the novel UX innovation where structured frameworks feel as fast as freeform typing.

**FRs covered:** FR14, plus UX requirements for search-enabled tab stops, context-aware filtering, ghost text completions

**Implementation notes:**
- React DnD or native drag events for library → preview drag-and-drop
- Tab stops in framework sections trigger inline search popovers (custom component)
- Tab stop search filters by section context (Role section → only personas shown)
- Ghost text (gray italic) suggests completions based on partial input
- Inline search uses same fuse.js + frecency logic as Cmd+K global search
- Esc key closes inline search, allows manual typing (no commitment required)
- Visual tab stop markers (subtle pills) indicate where Tab opens search

---

### Epic 6: Keyboard-First Navigation & Power User Features
Users can navigate the entire application via keyboard shortcuts, achieving flow state with 8-second composition times. All core actions are completable without mouse interaction, with focus management following predictable patterns.

**FRs covered:** FR37, FR38, FR39, FR40, FR41, FR42

**Implementation notes:**
- Global keyboard event listeners for Cmd+K, Cmd+C, Cmd+S, Cmd+Z (with Cmd↔Ctrl platform mapping)
- Tab/Shift+Tab cycles through focusable elements in logical order (sidebar → library → preview)
- Focus indicators meet WCAG 2.1 AA contrast (3px Mauve outline)
- Cmd+1/2/3 switches between sidebar categories (Personas/Constraints/Guardrails)
- Predictable focus progression: after snippet insertion, focus moves to next section
- Undo/redo stack (Cmd+Z) for snippet insertions and text edits
- All shortcuts displayed in tooltips and help documentation
- Screen reader announcements for dynamic changes (ARIA live regions)

## Epic 1: Foundation & Application Shell

Users can launch a cross-platform desktop application with professional visual design, platform-specific configuration, and sub-2-second startup times. The application provides the foundational UI shell (sidebar navigation, resizable panels, Catppuccin themes) and architectural infrastructure (Zustand state, Tauri IPC, JSON persistence) that all subsequent epics build upon.

### Story 1.1: Catppuccin Theme System Implementation

As a developer,
I want to implement the Catppuccin theme system with Mocha (dark) and Latte (light) variants,
So that the application has a professional, accessible visual design with proper contrast and color semantics.

**Acceptance Criteria:**

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

---

### Story 1.2: Three-Panel Layout with Resizable Panels

As a user,
I want to see a side-by-side layout with sidebar, library panel, and preview panel,
So that I can navigate categories, browse snippets, and compose prompts in a single view.

**Acceptance Criteria:**

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

---

### Story 1.3: Zustand State Management Setup

As a developer,
I want to set up Zustand stores for global application state,
So that state is managed predictably, performantly, and accessible across all components.

**Acceptance Criteria:**

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

---

### Story 1.4: Tauri IPC Commands for File System Operations

As a developer,
I want to implement type-safe Tauri commands for file I/O,
So that the frontend can read/write library JSON files and access platform-specific config directories.

**Acceptance Criteria:**

**Given** the Tauri backend is running
**When** the frontend calls `invoke('get_config_dir')`
**Then** the command returns the platform-specific config directory path:
  - macOS/Linux: `~/.config/prompt-alchemist/`
  - Windows: `%LOCALAPPDATA%\prompt-alchemist\`
**And** the directory is created if it doesn't exist

**Given** the config directory exists
**When** the frontend calls `invoke('read_library')`
**Then** the command reads `library.json` from the config directory
**And** returns the parsed JSON content as a typed object
**And** returns an empty library structure if file doesn't exist (first launch)

**Given** snippet data has been modified in Zustand store
**When** the frontend calls `invoke('write_library', { data: libraryData })`
**Then** the command writes to `.library.json.tmp` first
**And** renames `.library.json.tmp` to `library.json` atomically
**And** the operation completes within 100ms for libraries up to 500 snippets

**Given** the file system encounters an error (permissions, disk full)
**When** a Tauri command fails
**Then** the command returns a typed error object
**And** the error message follows format: "<Operation> failed: <reason>"
**And** the application displays the error to the user without crashing

**Given** the frontend calls `invoke('copy_to_clipboard', { text: promptText })`
**When** the command executes
**Then** the text is copied to the system clipboard
**And** the operation works identically on macOS, Windows, and Linux

**Given** the Tauri commands are defined
**When** running TypeScript type checking
**Then** all command invocations are type-safe (parameters and return types validated)

---

### Story 1.5: Platform-Specific Configuration and Path Resolution

As a user,
I want my snippet library stored in the correct platform-specific location,
So that my data follows OS conventions and is easy to back up or migrate.

**Acceptance Criteria:**

**Given** the application is launched on macOS
**When** the config directory is initialized
**Then** the library is stored in `~/.config/prompt-alchemist/library.json`
**And** Cmd key is mapped to primary keyboard shortcuts

**Given** the application is launched on Linux
**When** the config directory is initialized
**Then** the library is stored in `~/.config/prompt-alchemist/library.json`
**And** Ctrl key is mapped to primary keyboard shortcuts (Ctrl+K, Ctrl+C, etc.)

**Given** the application is launched on Windows
**When** the config directory is initialized
**Then** the library is stored in `%LOCALAPPDATA%\prompt-alchemist\library.json` (e.g., `C:\Users\Username\AppData\Local\prompt-alchemist\`)
**And** Ctrl key is mapped to primary keyboard shortcuts

**Given** the user has an existing library on one platform (e.g., macOS)
**When** the user manually copies the `prompt-alchemist` config directory to another platform (e.g., Windows)
**Then** the application loads the library successfully without data loss
**And** all snippets are accessible and editable

**Given** the application needs to resolve paths
**When** constructing file paths
**Then** platform-specific path separators are used (/ on Unix, \ on Windows)
**And** paths are normalized to prevent directory traversal vulnerabilities

**Given** the config directory doesn't exist on first launch
**When** the application initializes
**Then** the directory is created with appropriate permissions (755 on Unix, default on Windows)
**And** no error is displayed to the user (silent initialization)

---

### Story 1.6: Window State Persistence

As a user,
I want the application to remember my window size, position, and panel layout,
So that I don't have to resize or reposition the window every time I launch the app.

**Acceptance Criteria:**

**Given** the user resizes the application window
**When** the window size changes
**Then** the new dimensions (width, height) are debounced and saved to settings store
**And** the save operation triggers within 500ms after resize stops

**Given** the user moves the application window
**When** the window position changes
**Then** the new position (x, y coordinates) is debounced and saved to settings store
**And** the save operation triggers within 500ms after move stops

**Given** the user has adjusted panel widths (library vs preview)
**When** the divider is released
**Then** the panel width percentages are saved to settings store immediately

**Given** the user closes the application
**When** the settings store is persisted
**Then** window state (size, position, panel widths) is written to `settings.json` in config directory
**And** the write uses atomic operations (.tmp → rename pattern)

**Given** the user reopens the application
**When** the app initializes
**Then** the window restores to the last saved size and position
**And** the panel widths restore to the last saved values
**And** if saved position is off-screen (monitor disconnected), the window opens centered on primary monitor

**Given** the application is launched for the first time
**When** no saved window state exists
**Then** the window opens with default size (1200×800px)
**And** the window is centered on the primary monitor
**And** default panel widths are applied (5% sidebar, 28% library, 67% preview)

---

### Story 1.7: Cold Start Performance Optimization

As a user,
I want the application to launch and become usable within 2 seconds,
So that I can quickly access the tool without waiting for slow startup times.

**Acceptance Criteria:**

**Given** the application is not running
**When** the user launches the app from cold start
**Then** the window appears within 1 second
**And** the UI is fully interactive (clickable, keyboard-responsive) within 2 seconds
**And** the library data is loaded and displayed within 2 seconds

**Given** the application is measuring startup performance
**When** running on a typical developer machine (M1 Mac, Ryzen 5, i5-equivalent)
**Then** cold start time averages <2 seconds across 10 launches
**And** warm start time (app recently closed) averages <1 second

**Given** the library contains 500 snippets
**When** the application loads
**Then** startup time remains under 2 seconds (performance scales with library size)

**Given** the application is bundling assets
**When** building for production
**Then** Vite code-splitting is configured to lazy-load non-critical components
**And** Tailwind CSS is purged to remove unused utility classes
**And** total bundle size is <500KB gzipped (excluding Tauri runtime)

**Given** the application initializes Zustand stores
**When** mounting the React app
**Then** stores are initialized synchronously without async blocking
**And** library data is loaded asynchronously (doesn't block initial render)

**Given** the application is tested on all platforms
**When** measuring cold start time
**Then** performance targets are met on macOS (Intel + Apple Silicon), Windows 10/11, and Linux (Ubuntu 22.04)
**And** no platform-specific startup delays exceed 2.5 seconds


## Epic 2: Snippet Library Management

Users can create, edit, delete, organize, and persist their reusable snippet library across application sessions. Snippets are categorized by type (personas, constraints, guardrails) and stored in JSON format with atomic writes to prevent corruption.

### Story 2.1: JSON Schema v1.0.0 with Versioning

As a developer,
I want to define a versioned JSON schema for library storage,
So that snippet data is structured, validatable, and supports future migrations without data loss.

**Acceptance Criteria:**

**Given** the library schema is defined
**When** a new library is created
**Then** the JSON structure follows this format:
```json
{
  "version": "1.0.0",
  "snippets": [
    {
      "id": "uuid-v4",
      "name": "string",
      "type": "persona" | "constraint" | "guardrail",
      "content": "string",
      "createdAt": "ISO 8601 timestamp",
      "updatedAt": "ISO 8601 timestamp",
      "usageCount": 0,
      "lastUsed": "ISO 8601 timestamp | null"
    }
  ]
}
```

**Given** the application reads a library file
**When** parsing the JSON
**Then** the version field is validated first
**And** if version is "1.0.0", the current schema is applied
**And** if version is missing or unrecognized, the app displays a clear error message
**And** the app does not crash on schema validation errors

**Given** a snippet is created
**When** generating the snippet object
**Then** a unique UUID v4 is assigned as the id
**And** createdAt and updatedAt are set to the current ISO 8601 timestamp
**And** usageCount is initialized to 0
**And** lastUsed is initialized to null

**Given** the schema includes metadata fields (usageCount, lastUsed)
**When** these fields are used in future epics
**Then** they support frecency ranking without schema changes (forward compatibility)

**Given** the library file is committed to version control
**When** viewing the JSON in a text editor or Git diff
**Then** the format is human-readable with proper indentation (2 spaces)
**And** snippets are sorted by createdAt for consistent diffs

---

### Story 2.2: Snippet Creation with Dialog and Validation

As a user,
I want to create new snippets with a name, type, and content,
So that I can build a library of reusable prompt components.

**Acceptance Criteria:**

**Given** the user wants to create a snippet
**When** the user clicks the "New Snippet" button in the library panel
**Then** a modal dialog opens with three fields:
  - Name (text input, required, max 100 characters)
  - Type (dropdown: Persona, Constraint, Guardrail, required)
  - Content (textarea, required, max 5000 characters)
**And** the dialog has "Create" and "Cancel" buttons
**And** focus is automatically set to the Name field

**Given** the user fills out the form
**When** the user submits with empty required fields
**Then** validation errors are displayed inline below each empty field
**And** the dialog remains open (does not close)
**And** errors are announced to screen readers

**Given** the user enters valid data
**When** the user clicks "Create" or presses Enter
**Then** a new snippet is created with a unique UUID
**And** the snippet is added to the Zustand store
**And** the snippet appears immediately in the library panel
**And** the dialog closes
**And** a success notification displays: "Snippet created: [Name]"

**Given** the snippet is created
**When** the store is updated
**Then** the `write_library` Tauri command is invoked automatically
**And** the snippet is persisted to library.json within 100ms
**And** no manual save action is required (auto-save)

**Given** the user presses Escape or clicks "Cancel"
**When** the dialog is open
**Then** the dialog closes without creating a snippet
**And** no data is saved

**Given** the user creates a snippet with the same name as an existing snippet
**When** submitting the form
**Then** the snippet is created (duplicate names are allowed)
**And** snippets are differentiated by their unique UUIDs

---

### Story 2.3: Display Snippet Library in Browsable List

As a user,
I want to view my complete snippet library in a browsable list,
So that I can see all my snippets and filter by category.

**Acceptance Criteria:**

**Given** the application has loaded the library
**When** the library panel renders
**Then** all snippets are displayed as 32px-height cards
**And** each card shows:
  - Snippet name (14px, truncated with ellipsis if >25 characters)
  - Snippet type badge (persona/constraint/guardrail icon or label)
  - Usage count (small gray text, e.g., "Used 12 times")
**And** cards have 4px gaps between them for information density

**Given** the library contains 100+ snippets
**When** the panel content exceeds viewport height
**Then** the panel is scrollable with smooth scrolling
**And** scroll performance is smooth (60fps) without lag

**Given** the user clicks on the sidebar category icons (P, C, G)
**When** a category is selected
**Then** the library panel filters to show only snippets of that type
**And** the active category icon is highlighted with Mauve accent color
**And** the filter updates within 50ms (perceived as instant)

**Given** the user clicks "All" or deselects the active category
**When** the filter is cleared
**Then** all snippets are displayed regardless of type

**Given** the library is empty (first launch)
**When** the library panel renders
**Then** an empty state message is displayed: "No snippets yet. Click 'New Snippet' to get started."
**And** the "New Snippet" button is prominently visible

**Given** snippets are displayed
**When** hovering over a snippet card
**Then** the card has a subtle hover state (background color lightens slightly)
**And** the cursor changes to pointer to indicate interactivity

---

### Story 2.4: Snippet Editing Functionality

As a user,
I want to edit existing snippets,
So that I can update content, fix typos, or change categorization.

**Acceptance Criteria:**

**Given** the user wants to edit a snippet
**When** the user clicks on a snippet card in the library panel
**Then** an edit modal opens pre-filled with the snippet's current data:
  - Name field (populated with current name)
  - Type dropdown (pre-selected with current type)
  - Content textarea (populated with current content)
**And** the modal has "Save" and "Cancel" buttons

**Given** the user modifies any field
**When** the user clicks "Save" or presses Cmd+Enter (Ctrl+Enter on Windows/Linux)
**Then** the snippet is updated in the Zustand store
**And** the updatedAt timestamp is refreshed to the current time
**And** the changes appear immediately in the library panel
**And** the modal closes
**And** a success notification displays: "Snippet updated: [Name]"

**Given** the snippet is updated
**When** the store is modified
**Then** the `write_library` Tauri command is invoked automatically
**And** the updated library is persisted to library.json within 100ms

**Given** the user edits a snippet's type
**When** changing from "Persona" to "Constraint"
**Then** the snippet's type is updated
**And** if the current category filter is active, the snippet moves to the correct category view
**And** the sidebar category counts update accordingly

**Given** the user clears required fields in the edit modal
**When** attempting to save
**Then** validation errors are displayed (same as creation)
**And** the modal remains open until valid data is provided or user cancels

**Given** the user presses Escape or clicks "Cancel"
**When** the modal is open
**Then** the modal closes without saving changes
**And** the original snippet data is preserved

---

### Story 2.5: Snippet Deletion with Confirmation

As a user,
I want to delete snippets I no longer need,
So that I can keep my library organized and relevant.

**Acceptance Criteria:**

**Given** the user wants to delete a snippet
**When** the user right-clicks on a snippet card (or clicks a delete icon button)
**Then** a context menu or delete button is displayed
**And** the option "Delete Snippet" is available

**Given** the user clicks "Delete Snippet"
**When** the action is triggered
**Then** a confirmation dialog appears with the message:
  "Are you sure you want to delete '[Snippet Name]'? This action cannot be undone."
**And** the dialog has "Delete" (destructive style, red) and "Cancel" buttons

**Given** the user confirms deletion
**When** clicking "Delete"
**Then** the snippet is removed from the Zustand store immediately
**And** the snippet disappears from the library panel
**And** the dialog closes
**And** a success notification displays: "Snippet deleted: [Name]"

**Given** the snippet is deleted
**When** the store is updated
**Then** the `write_library` Tauri command is invoked automatically
**And** the updated library (without the deleted snippet) is persisted to library.json
**And** the deletion is permanent (cannot be undone via UI)

**Given** the user clicks "Cancel" or presses Escape
**When** the confirmation dialog is open
**Then** the dialog closes without deleting the snippet
**And** the snippet remains in the library

**Given** the user deletes the last snippet in a filtered category
**When** the deletion completes
**Then** the empty state message is displayed for that category
**And** the sidebar category count updates to 0

---

### Story 2.6: Auto-Save with Atomic Writes

As a user,
I want my library changes saved automatically,
So that I never lose data due to forgetting to save or application crashes.

**Acceptance Criteria:**

**Given** a snippet is created, edited, or deleted
**When** the Zustand store is updated
**Then** the `write_library` Tauri command is invoked automatically within 100ms
**And** no manual "Save" action is required from the user

**Given** the `write_library` command is invoked
**When** writing to disk
**Then** the data is written to `.library.json.tmp` first
**And** the file is flushed to disk (fsync)
**And** `.library.json.tmp` is renamed to `library.json` atomically
**And** the entire operation completes within 100ms for libraries up to 500 snippets

**Given** the write operation is interrupted (crash, power loss)
**When** the application restarts
**Then** either the old `library.json` exists (rename didn't complete) or the new one exists (rename completed)
**And** the library is never corrupted (no partial writes, no empty files)

**Given** multiple rapid changes occur (e.g., user creates 5 snippets quickly)
**When** the store updates multiple times
**Then** write operations are debounced to prevent excessive disk I/O
**And** all changes are batched into a single write within 200ms
**And** the final write contains all changes

**Given** the write operation fails (disk full, permissions error)
**When** the Tauri command returns an error
**Then** an error notification is displayed to the user: "Failed to save library: [reason]"
**And** the application remains functional (does not crash)
**And** the user can retry the operation or fix the underlying issue

**Given** the library file is saved
**When** checking file integrity
**Then** the JSON is valid and parseable
**And** the file size is reasonable (<5MB for 1000 snippets)
**And** the version field is present and correct ("1.0.0")


## Epic 3: Basic Prompt Composition

Users can compose effective prompts by selecting framework templates (RTF/CODER/Co-Star), manually editing sections, and copying to clipboard for use in external LLM tools. This delivers the core 30-second composition workflow enabling immediate time savings.

### Story 3.1: Framework Templates with Section Definitions

As a developer,
I want to define three framework templates with their sections,
So that users can select structured frameworks that guide prompt composition.

**Acceptance Criteria:**

**Given** the framework templates are defined
**When** the application initializes
**Then** three framework templates are available:
  - **RTF**: 3 sections (Role, Task, Format)
  - **CODER**: 5 sections (Context, Objective, Details, Examples, Response)
  - **Co-Star**: 6 sections (Context, Objective, Style, Tone, Audience, Response)

**Given** each framework template is defined
**When** accessing template data
**Then** each section includes:
  - Section name (e.g., "Role", "Context")
  - Placeholder text (e.g., "Describe the role or persona for the AI...")
  - Description (tooltip/help text explaining the section's purpose)
  - Order (sections render in the correct sequence)

**Given** the RTF framework is selected
**When** rendering sections
**Then** 3 sections are displayed in order:
  1. Role: "Define the role or persona the AI should adopt"
  2. Task: "Describe what you want the AI to do"
  3. Format: "Specify the desired output format or structure"

**Given** the CODER framework is selected
**When** rendering sections
**Then** 5 sections are displayed in order:
  1. Context: "Provide background information"
  2. Objective: "State the goal or outcome"
  3. Details: "Specify requirements and constraints"
  4. Examples: "Provide examples of desired output"
  5. Response: "Describe the expected response format"

**Given** the Co-Star framework is selected
**When** rendering sections
**Then** 6 sections are displayed in order:
  1. Context: "Set the scene or background"
  2. Objective: "Define what you want to achieve"
  3. Style: "Specify the writing or communication style"
  4. Tone: "Indicate the desired tone (formal, casual, etc.)"
  5. Audience: "Describe who the output is for"
  6. Response: "Describe the expected response format"

**Given** framework templates are stored in code
**When** adding new frameworks in the future
**Then** the template structure is extensible without breaking existing frameworks

---

### Story 3.2: Framework Selector Dropdown with Descriptions

As a user,
I want to select a framework template from a dropdown,
So that I can choose the structure that best fits my prompt needs.

**Acceptance Criteria:**

**Given** the preview panel is rendered
**When** the user views the panel header
**Then** a framework selector dropdown is visible
**And** the dropdown displays the currently selected framework (default: RTF)
**And** the dropdown is styled consistently with the Catppuccin theme

**Given** the user clicks the framework selector
**When** the dropdown opens
**Then** all three frameworks are listed:
  - RTF (Role, Task, Format) - Simple 3-section structure
  - CODER (Context, Objective, Details, Examples, Response) - Detailed 5-section structure
  - Co-Star (Context, Objective, Style, Tone, Audience, Response) - Comprehensive 6-section structure
**And** each option shows the framework name and a brief description
**And** the current selection is indicated with a checkmark or highlight

**Given** the user hovers over a framework option
**When** the cursor is over an option
**Then** a tooltip appears with a detailed description:
  - RTF: "Simple structure for quick prompts. Best for straightforward tasks."
  - CODER: "Structured approach for technical prompts. Ideal for coding tasks."
  - Co-Star: "Comprehensive framework for complex prompts. Best for nuanced communication."

**Given** the user selects a framework
**When** clicking on an option
**Then** the dropdown closes
**And** the selected framework is saved to UI state (Zustand store)
**And** the preview panel updates to show the new framework's sections (handled in Story 3.5)

**Given** the user navigates the dropdown with keyboard
**When** pressing Up/Down arrow keys
**Then** the focus moves between options
**And** pressing Enter selects the focused option
**And** pressing Escape closes the dropdown without changing selection

---

### Story 3.3: Render Framework Sections as Editable Textareas

As a user,
I want to see framework sections displayed as editable text areas,
So that I can type my prompt content directly into each section.

**Acceptance Criteria:**

**Given** a framework is selected
**When** the preview panel renders
**Then** each section is displayed as a separate textarea
**And** each textarea has:
  - Section label above (e.g., "Role", "Context") in 14px semibold text
  - Placeholder text in gray italic (e.g., "Describe the role or persona...")
  - Minimum height of 80px
  - Auto-expanding height as content grows
  - Consistent padding (12px) and border-radius (6px)

**Given** the user clicks on a textarea
**When** focusing the textarea
**Then** the border changes to Mauve accent color (3px outline)
**And** the placeholder text disappears
**And** the cursor is positioned at the start of existing content (or at the beginning if empty)

**Given** the user types in a textarea
**When** entering text
**Then** the text is displayed in 14px system font
**And** the textarea auto-expands vertically to fit content (no vertical scrollbar until >500px height)
**And** the text wraps naturally at textarea boundaries

**Given** multiple sections are rendered
**When** viewing the preview panel
**Then** sections are stacked vertically with 16px gaps between them
**And** the panel is scrollable if total content exceeds viewport height

**Given** a textarea contains content
**When** the user clears the content manually
**Then** the placeholder text reappears
**And** the textarea height resets to minimum (80px)

**Given** the user uses Tab key
**When** focused on a textarea
**Then** pressing Tab moves focus to the next section's textarea
**And** pressing Shift+Tab moves focus to the previous section's textarea
**And** focus order follows the section order (top to bottom)

---

### Story 3.4: Real-Time Preview Updates

As a user,
I want to see my composed prompt update in real-time as I type,
So that I can verify my content without switching views or copying first.

**Acceptance Criteria:**

**Given** the user types in any textarea
**When** text content changes
**Then** the section content updates in the Zustand UI store immediately (<50ms)
**And** the textarea re-renders with the new content
**And** the cursor position is preserved (typing is not interrupted)

**Given** multiple sections contain content
**When** viewing the composed prompt
**Then** a live preview area below the textareas shows the complete prompt
**And** the preview is formatted as markdown with section headers
**And** the preview updates within 100ms of any textarea change

**Given** the live preview is rendered
**When** displaying content
**Then** the format is:
```
# Role
[content from Role textarea]

# Task
[content from Task textarea]

# Format
[content from Format textarea]
```
**And** empty sections are omitted from the preview (only sections with content are shown)

**Given** the user types quickly (rapid keystrokes)
**When** content changes frequently
**Then** the preview updates are debounced to avoid excessive re-renders
**And** the final update occurs within 100ms after typing stops
**And** performance remains smooth (no input lag)

**Given** the preview area exceeds viewport height
**When** new content is added
**Then** the preview area is scrollable
**And** scroll position is maintained (doesn't jump to top on updates)

---

### Story 3.5: Framework Switching During Composition

As a user,
I want to switch frameworks while composing a prompt,
So that I can experiment with different structures without losing my work.

**Acceptance Criteria:**

**Given** the user has content in multiple sections of the current framework
**When** the user switches to a different framework
**Then** the preview panel updates to show the new framework's sections within 200ms
**And** any content in sections with matching names is preserved
**And** content in non-matching sections is temporarily stored (not lost)

**Given** the user switches from RTF to CODER
**When** the framework changes
**Then** the "Role" section content is NOT preserved (no matching section in CODER)
**And** the "Task" section content is NOT preserved (no matching section)
**And** the new CODER sections (Context, Objective, Details, Examples, Response) are empty
**And** the original RTF content is stored in UI state for potential restoration

**Given** the user switches from CODER to Co-Star
**When** the framework changes
**Then** the "Context" section content IS preserved (both frameworks have "Context")
**And** the "Objective" section content IS preserved (both frameworks have "Objective")
**And** the "Response" section content IS preserved (both frameworks have "Response")
**And** other sections (Details, Examples) are temporarily stored

**Given** the user switches back to a previously used framework
**When** returning to the original framework
**Then** all previously entered content is restored
**And** the user can continue editing from where they left off

**Given** the user switches frameworks multiple times
**When** experimenting with different structures
**Then** each framework's content is maintained in UI state independently
**And** switching feels instant (within 200ms)

**Given** the user has unsaved work
**When** switching frameworks
**Then** no confirmation dialog is shown (content is never lost, just reorganized)
**And** the live preview updates to reflect the new framework structure

---

### Story 3.6: Clipboard Copy with Visual Feedback

As a user,
I want to copy my composed prompt to the clipboard,
So that I can paste it into Cursor, ChatGPT, or other LLM tools.

**Acceptance Criteria:**

**Given** the user has composed a prompt
**When** the user clicks the "Copy" button in the preview panel
**Then** the composed prompt is copied to the system clipboard as plain text
**And** the clipboard API operation completes within 100ms

**Given** the copy operation succeeds
**When** the prompt is copied
**Then** the "Copy" button text changes to "Copied ✓" with a checkmark icon
**And** the button color changes to green (success state)
**And** after 2 seconds, the button reverts to "Copy" with original styling

**Given** the user uses the keyboard shortcut
**When** pressing Cmd+C (macOS) or Ctrl+C (Windows/Linux) while focused on the preview panel
**Then** the composed prompt is copied to clipboard
**And** the same visual feedback is shown ("Copied ✓" for 2 seconds)

**Given** the composed prompt has multiple sections
**When** copying to clipboard
**Then** the format matches the live preview (markdown with section headers)
**And** empty sections are omitted from the copied text
**And** the copied text is plain text (no rich formatting, no HTML)

**Given** the copy operation fails (clipboard permissions denied)
**When** the operation returns an error
**Then** an error notification is displayed: "Failed to copy: [reason]"
**And** the button remains in the default "Copy" state (doesn't show "Copied ✓")

**Given** the user pastes the copied prompt into an external tool
**When** pasting into Cursor, ChatGPT, Claude Desktop, or VSCode
**Then** the prompt appears correctly formatted
**And** markdown headers are preserved
**And** line breaks and spacing are maintained

---

### Story 3.7: Markdown Export Format for LLM Compatibility

As a user,
I want my composed prompts exported as clean markdown,
So that they work seamlessly with all major LLM interfaces.

**Acceptance Criteria:**

**Given** a prompt is composed using the RTF framework
**When** the prompt is copied to clipboard
**Then** the format is:
```markdown
# Role
[Role content]

# Task
[Task content]

# Format
[Format content]
```
**And** there are exactly two newlines between sections

**Given** a prompt is composed using the CODER framework
**When** the prompt is copied
**Then** section headers use the CODER section names:
  - # Context
  - # Objective
  - # Details
  - # Examples
  - # Response

**Given** a prompt is composed using the Co-Star framework
**When** the prompt is copied
**Then** section headers use the Co-Star section names:
  - # Context
  - # Objective
  - # Style
  - # Tone
  - # Audience
  - # Response

**Given** a section is empty
**When** exporting the prompt
**Then** that section is omitted entirely (no header, no empty space)

**Given** section content contains user-entered line breaks
**When** exporting
**Then** line breaks are preserved exactly as entered
**And** no additional formatting is added or removed

**Given** section content contains special characters (*, _, #, `, etc.)
**When** exporting
**Then** characters are exported as-is (no escaping, no transformation)
**And** markdown renderers interpret them correctly

**Given** the exported prompt is pasted into different LLM tools
**When** testing compatibility
**Then** the prompt works identically in:
  - Cursor (VSCode-based editor)
  - ChatGPT web interface
  - Claude Desktop app
  - VSCode Copilot chat
  - Any tool accepting plain text markdown

---

### Story 3.8: Hybrid Editing (Structured Sections + Freeform Text)

As a user,
I want to combine structured framework sections with freeform editing,
So that I have flexibility to customize prompts beyond framework constraints.

**Acceptance Criteria:**

**Given** the user is composing a prompt
**When** typing in any textarea
**Then** no mode switching or special actions are required
**And** the user can type freely without restrictions

**Given** the user wants to add custom sections
**When** typing in a textarea
**Then** the user can include custom markdown headers (##, ###) in the content
**And** the custom headers are preserved in the copied output
**And** custom sections appear in the live preview

**Given** the user wants to add emphasis
**When** typing in a textarea
**Then** the user can use markdown syntax (**bold**, *italic*, `code`)
**And** the syntax is preserved exactly as typed (not rendered as rich text in textareas)
**And** the syntax is copied as plain text to clipboard

**Given** the user wants to add lists or code blocks
**When** typing in a textarea
**Then** the user can use markdown list syntax (-, *, 1.) or code fences (```)
**And** the formatting is preserved in the copied output
**And** the live preview renders the markdown correctly (if preview supports rendering)

**Given** the user wants to ignore framework structure
**When** using only one section (e.g., only "Task" section in RTF)
**Then** the user can leave other sections empty
**And** only the populated section is copied to clipboard
**And** the output is valid (no empty headers or sections)

**Given** the user composes a very long prompt
**When** a single section exceeds 2000 characters
**Then** the textarea continues to auto-expand
**And** performance remains smooth (no lag when typing)
**And** the entire content is copied successfully to clipboard

**Given** the user switches between frameworks mid-composition
**When** content exists in the textareas
**Then** the transition is seamless (no data loss, as per Story 3.5)
**And** the hybrid editing capability works identically in all frameworks


## Epic 4: Search & Discovery

Users can instantly find snippets via Cmd+K global search with fuzzy matching and frecency ranking. Search results are navigable via keyboard, enabling power users to compose prompts in under 30 seconds.

### Story 4.1: Cmd+K Global Search Command Palette

As a user,
I want to trigger a global search with Cmd+K,
So that I can quickly find snippets without using the mouse or browsing the library.

**Acceptance Criteria:**

**Given** the application is focused
**When** the user presses Cmd+K (macOS) or Ctrl+K (Windows/Linux)
**Then** a command palette overlay opens centered on the screen
**And** the overlay dims the background content (modal backdrop with 50% opacity)
**And** focus is automatically set to the search input field

**Given** the command palette is open
**When** rendering the overlay
**Then** the palette displays:
  - Search input field at the top (prominent, large text)
  - Placeholder text: "Search snippets..."
  - Results area below the input (initially empty or showing recent snippets)
  - Footer with keyboard hints: "↑↓ to navigate, ⏎ to select, esc to close"

**Given** the command palette is open
**When** the user presses Escape
**Then** the palette closes immediately
**And** focus returns to the previously focused element
**And** no snippet is inserted

**Given** the command palette is open
**When** the user clicks outside the palette (on the backdrop)
**Then** the palette closes
**And** no snippet is inserted

**Given** the user opens the palette
**When** no search query is entered
**Then** the results area shows recent snippets (last 5 used, based on frecency)
**And** the recent snippets are labeled "Recently Used"

**Given** the palette is styled
**When** rendering in either theme
**Then** the palette uses Catppuccin colors with proper contrast
**And** the input field has a subtle border and shadow
**And** the palette has rounded corners (8px) and drop shadow (shadow-lg)

---

### Story 4.2: Fuse.js Fuzzy Matching Integration

As a user,
I want to search snippets using fuzzy matching,
So that I can find snippets even with typos or partial names.

**Acceptance Criteria:**

**Given** fuse.js is installed and configured
**When** the application initializes search
**Then** fuse.js is configured with:
  - Search keys: `["name", "content"]` (prioritize name, but also search content)
  - Threshold: 0.4 (moderate fuzziness)
  - Distance: 100 (allow some character distance)
  - Include score and matches for highlighting

**Given** the user types in the search input
**When** entering a query (e.g., "prsna")
**Then** fuse.js matches snippets with similar names (e.g., "persona")
**And** results are returned within 50ms for libraries up to 100 snippets
**And** results are returned within 100ms for libraries up to 1000 snippets

**Given** the user searches for "debug"
**When** snippets contain "debug" in the name or content
**Then** all matching snippets are returned
**And** snippets with "debug" in the name rank higher than those with it only in content

**Given** the user searches for an exact match
**When** typing "Code Review Expert" (exact snippet name)
**Then** the exact match appears as the first result
**And** the match score is highest (near 0)

**Given** the user searches with a typo
**When** typing "reviw" (missing 'e')
**Then** snippets with "review" in the name are still returned
**And** the fuzzy matching compensates for the typo

**Given** the search query is empty
**When** the input field is cleared
**Then** no fuzzy matching is performed
**And** recent snippets are displayed instead (default state)

**Given** no snippets match the query
**When** entering a query with no matches (e.g., "xyz123")
**Then** the results area shows "No snippets found"
**And** a suggestion is displayed: "Try a different search term"

---

### Story 4.3: Frecency Ranking Algorithm

As a user,
I want search results ranked by frecency (frequency + recency),
So that my most-used and recently-used snippets appear first.

**Acceptance Criteria:**

**Given** snippets have usage metadata
**When** calculating frecency score
**Then** the formula is: `(usageCount × 10) + (days_since_last_use × -1)`
**And** higher scores rank first (snippets used frequently and recently have highest scores)

**Given** a snippet was used 5 times and last used today
**When** calculating frecency
**Then** the score is: `(5 × 10) + (0 × -1) = 50`

**Given** a snippet was used 10 times but last used 30 days ago
**When** calculating frecency
**Then** the score is: `(10 × 10) + (-30) = 70`

**Given** a snippet was used 2 times and last used 5 days ago
**When** calculating frecency
**Then** the score is: `(2 × 10) + (-5) = 15`

**Given** multiple snippets match a search query
**When** displaying results
**Then** results are sorted by:
  1. Fuzzy match score (fuse.js relevance)
  2. Frecency score (for results with similar match scores)
**And** the most relevant AND frequently-used snippets appear at the top

**Given** a snippet has never been used (usageCount = 0, lastUsed = null)
**When** calculating frecency
**Then** the score is 0 (no usage bonus)
**And** the snippet ranks below used snippets with similar match scores

**Given** the user selects a snippet from search results
**When** the snippet is inserted
**Then** the snippet's `usageCount` increments by 1
**And** the snippet's `lastUsed` is updated to the current timestamp
**And** the library is auto-saved with the updated metadata

---

### Story 4.4: Keyboard Navigation Through Search Results

As a user,
I want to navigate search results using arrow keys,
So that I can select snippets without using the mouse.

**Acceptance Criteria:**

**Given** the command palette has search results
**When** results are displayed
**Then** the first result is highlighted by default
**And** the highlighted result has a distinct background color (Mauve with 20% opacity)

**Given** the user presses the Down arrow key
**When** navigating results
**Then** the highlight moves to the next result
**And** if at the bottom of the list, the highlight wraps to the first result
**And** the selected result scrolls into view if not visible

**Given** the user presses the Up arrow key
**When** navigating results
**Then** the highlight moves to the previous result
**And** if at the top of the list, the highlight wraps to the last result
**And** the selected result scrolls into view if not visible

**Given** the user types in the search input
**When** the query changes and results update
**Then** the highlight resets to the first result
**And** keyboard navigation starts from the top

**Given** there are 20+ results
**When** navigating with arrow keys
**Then** only 10 results are visible at a time (scrollable list)
**And** the scroll position updates smoothly as the highlight moves
**And** performance remains smooth (no lag during rapid arrow key presses)

**Given** the search returns only 1 result
**When** pressing Up or Down arrow keys
**Then** the highlight remains on the single result (no wrapping)

**Given** the search returns no results
**When** pressing arrow keys
**Then** nothing happens (no errors, no visual changes)

---

### Story 4.5: Snippet Insertion from Search Results

As a user,
I want to insert a selected snippet into my prompt,
So that I can quickly compose prompts using my library.

**Acceptance Criteria:**

**Given** the user has navigated to a snippet in the search results
**When** pressing Enter
**Then** the selected snippet's content is inserted at the current cursor position in the active textarea
**And** the command palette closes immediately
**And** focus returns to the textarea where the snippet was inserted
**And** the cursor is positioned after the inserted content

**Given** no textarea is focused (cursor not in any section)
**When** inserting a snippet via search
**Then** the snippet is inserted into the first empty section
**And** if all sections have content, the snippet is appended to the first section
**And** focus moves to that section after insertion

**Given** the user inserts a snippet
**When** the insertion completes
**Then** the snippet's usage metadata is updated:
  - `usageCount` increments by 1
  - `lastUsed` is set to the current timestamp
**And** the library is auto-saved with the updated metadata

**Given** the user inserts a snippet into a textarea with existing content
**When** the snippet is inserted
**Then** the snippet content is inserted at the cursor position (not replacing existing content)
**And** a newline is added before the snippet if the cursor is not at the start of a line
**And** existing text is preserved

**Given** the user hovers over a search result
**When** moving the mouse over a result
**Then** the result is highlighted (same style as keyboard navigation)
**And** clicking the result inserts the snippet (same behavior as pressing Enter)

**Given** the user inserts a snippet via search
**When** the snippet is inserted
**Then** the live preview updates immediately to reflect the new content
**And** the composed prompt (with inserted snippet) is ready to copy

**Given** the user selects a snippet with very long content (>1000 characters)
**When** inserting the snippet
**Then** the insertion completes within 100ms
**And** the textarea auto-expands to fit the content
**And** the scroll position adjusts to keep the inserted content visible


## Epic 5: Advanced Composition Interactions

Users can drag-and-drop snippets from library into composition areas and use search-enabled tab stops for seamless keyboard-first composition. This delivers the novel UX innovation where structured frameworks feel as fast as freeform typing.

### Story 5.1: Drag-and-Drop Snippets from Library to Preview

As a user,
I want to drag snippets from the library panel and drop them into the preview panel,
So that I can quickly add snippets to my prompt using mouse gestures.

**Acceptance Criteria:**

**Given** the user hovers over a snippet card in the library panel
**When** clicking and holding the mouse button
**Then** the snippet card becomes draggable
**And** a ghost image of the snippet appears under the cursor
**And** the cursor changes to a "grabbing" icon

**Given** the user is dragging a snippet
**When** moving the cursor over a textarea in the preview panel
**Then** the textarea displays a drop indicator (dashed border with Mauve accent)
**And** the cursor changes to indicate a valid drop target

**Given** the user drags a snippet over an invalid drop target (e.g., sidebar, panel divider)
**When** hovering over the invalid area
**Then** no drop indicator is shown
**And** the cursor changes to a "no-drop" icon

**Given** the user releases the mouse button while over a valid textarea
**When** dropping the snippet
**Then** the snippet content is inserted at the textarea's cursor position (or end if no cursor)
**And** the drop indicator disappears
**And** the snippet's usage metadata is updated (usageCount++, lastUsed = now)
**And** visual feedback appears: the inserted text briefly highlights with a fade-out animation (200ms)

**Given** the user drops a snippet into a textarea with existing content
**When** the drop completes
**Then** the snippet is inserted at the drop position (not replacing existing content)
**And** a newline is added before the snippet if not at the start of a line
**And** existing text is preserved

**Given** the drag operation responds
**When** measuring performance
**Then** the drag-and-drop interaction feels instant (<50ms response time)
**And** no frame drops occur during dragging

**Given** the user presses Escape while dragging
**When** canceling the drag operation
**Then** the drag is canceled
**And** the snippet is not inserted
**And** the ghost image disappears

**Given** the user drops a snippet
**When** the insertion completes
**Then** the library is auto-saved with updated usage metadata
**And** the live preview updates immediately to reflect the new content

---

### Story 5.2: Search-Enabled Tab Stops in Framework Sections

As a user,
I want to press Tab in a textarea to open an inline search,
So that I can quickly find and insert snippets without leaving the composition flow.

**Acceptance Criteria:**

**Given** the user is typing in a framework section textarea
**When** the user presses the Tab key
**Then** a small inline search popover opens directly below the cursor position
**And** the popover contains a search input field (auto-focused)
**And** the popover displays "Search snippets..." placeholder text

**Given** the inline search popover is open
**When** rendering the popover
**Then** the popover is styled as a compact dropdown (max-width 320px)
**And** the popover has a subtle drop shadow and border
**And** the popover displays up to 5 search results (scrollable if more)

**Given** the user types in the inline search input
**When** entering a query
**Then** fuzzy matching is performed using the same fuse.js configuration as Cmd+K global search
**And** results are filtered and displayed within 50ms
**And** results are ranked by frecency (same algorithm as global search)

**Given** search results are displayed in the popover
**When** results update
**Then** the first result is highlighted by default
**And** the user can navigate results with Up/Down arrow keys
**And** pressing Enter inserts the highlighted snippet at the cursor position

**Given** the user selects a snippet from the inline search
**When** pressing Enter or clicking a result
**Then** the snippet content is inserted at the cursor position in the textarea
**And** the popover closes immediately
**And** focus returns to the textarea
**And** the cursor is positioned after the inserted content

**Given** the inline search popover is open
**When** the user presses Escape
**Then** the popover closes without inserting a snippet
**And** focus remains in the textarea
**And** the user can continue typing manually

**Given** the inline search popover is open
**When** the user clicks outside the popover
**Then** the popover closes without inserting a snippet

**Given** the user presses Tab in an empty textarea
**When** no content exists yet
**Then** the inline search opens at the top-left of the textarea
**And** the behavior is identical to pressing Tab mid-composition

---

### Story 5.3: Context-Aware Search Filtering at Tab Stops

As a user,
I want tab stop searches to filter by relevant snippet types,
So that I only see personas in Role sections and constraints in Task sections.

**Acceptance Criteria:**

**Given** the user presses Tab in a "Role" section (RTF framework)
**When** the inline search popover opens
**Then** only snippets with type "persona" are shown in the results
**And** the popover shows a filter indicator: "Filtering: Personas"

**Given** the user presses Tab in a "Task" section (RTF framework)
**When** the inline search popover opens
**Then** only snippets with type "constraint" are shown in the results
**And** the popover shows a filter indicator: "Filtering: Constraints"

**Given** the user presses Tab in a "Format" section (RTF framework)
**When** the inline search popover opens
**Then** only snippets with type "guardrail" are shown in the results
**And** the popover shows a filter indicator: "Filtering: Guardrails"

**Given** the user presses Tab in a "Context" section (CODER or Co-Star frameworks)
**When** the inline search popover opens
**Then** snippets with type "persona" OR "constraint" are shown (flexible context)
**And** the popover shows: "Filtering: Personas & Constraints"

**Given** the user presses Tab in an "Objective" section (CODER or Co-Star)
**When** the inline search popover opens
**Then** only snippets with type "constraint" are shown
**And** the popover shows: "Filtering: Constraints"

**Given** the user presses Tab in a "Style", "Tone", or "Audience" section (Co-Star)
**When** the inline search popover opens
**Then** only snippets with type "guardrail" are shown
**And** the popover shows: "Filtering: Guardrails"

**Given** the filtered search returns no results
**When** the user types a query with no matching snippets in the filtered category
**Then** the popover displays: "No [type] snippets found"
**And** a suggestion is shown: "Press Cmd+K for global search"

**Given** the user wants to bypass the filter
**When** the inline search is open
**Then** a small button appears: "Search all" or "Remove filter"
**And** clicking the button shows all snippet types (same as Cmd+K global search)

---

### Story 5.4: Ghost Text Completions Based on Snippet Suggestions

As a user,
I want to see ghost text suggestions as I type,
So that I can quickly autocomplete with commonly used snippets.

**Acceptance Criteria:**

**Given** the user is typing in a textarea
**When** entering text that partially matches a snippet name (e.g., typing "cod" and a snippet named "Code Review Expert" exists)
**Then** a ghost text completion appears in gray italic after the cursor
**And** the ghost text shows the remaining characters: "e Review Expert"

**Given** ghost text is displayed
**When** the user continues typing
**Then** the ghost text updates in real-time to match the partial input
**And** if the input no longer matches any snippets, the ghost text disappears

**Given** ghost text is displayed
**When** the user presses Tab or Right Arrow
**Then** the ghost text is accepted and inserted at the cursor
**And** the full snippet name is inserted (e.g., "Code Review Expert")
**And** the ghost text disappears

**Given** ghost text is displayed
**When** the user continues typing (ignoring the suggestion)
**Then** the ghost text disappears
**And** the user's manual input is preserved (no interference)

**Given** multiple snippets match the partial input
**When** ghost text is calculated
**Then** the snippet with the highest frecency score is suggested
**And** only one ghost text suggestion is shown at a time (not multiple options)

**Given** the user types very quickly
**When** entering characters in rapid succession
**Then** ghost text updates are debounced (calculated every 100ms)
**And** typing performance is not impacted (no input lag)

**Given** the ghost text suggestion is accepted
**When** the user presses Tab
**Then** the snippet's usage metadata is updated (usageCount++, lastUsed = now)
**And** the library is auto-saved with the updated metadata

**Given** the user has `prefers-reduced-motion` enabled
**When** ghost text appears or disappears
**Then** no animation or transition is applied (instant appearance/disappearance)

**Given** ghost text is displayed
**When** the user presses Escape
**Then** the ghost text disappears immediately
**And** the cursor remains at the current position
**And** the user can continue typing without the suggestion


## Epic 6: Keyboard-First Navigation & Power User Features

Users can navigate the entire application via keyboard shortcuts, achieving flow state with 8-second composition times. All core actions are completable without mouse interaction, with focus management following predictable patterns.

### Story 6.1: Global Keyboard Shortcuts with Platform Mapping

As a user,
I want keyboard shortcuts that follow platform conventions,
So that shortcuts feel native on macOS (Cmd) and Windows/Linux (Ctrl).

**Acceptance Criteria:**

**Given** the application detects the operating system
**When** initializing keyboard event listeners
**Then** the modifier key is mapped correctly:
  - macOS: Cmd (Meta key)
  - Windows/Linux: Ctrl (Control key)

**Given** the user presses Cmd+K on macOS
**When** the key combination is detected
**Then** the global search command palette opens
**And** the shortcut responds within 100ms

**Given** the user presses Ctrl+K on Windows or Linux
**When** the key combination is detected
**Then** the global search command palette opens
**And** the behavior is identical to Cmd+K on macOS

**Given** the user presses Cmd+C (Ctrl+C on Windows/Linux) while the preview panel is focused
**When** the shortcut is detected
**Then** the composed prompt is copied to clipboard
**And** visual feedback is displayed ("Copied ✓")

**Given** the user presses Cmd+S (Ctrl+S on Windows/Linux)
**When** the shortcut is detected
**Then** the current prompt is saved as a template (future enhancement placeholder)
**And** for now, a notification displays: "Template saving coming soon!"

**Given** the user presses Cmd+Z (Ctrl+Z on Windows/Linux)
**When** the shortcut is detected
**Then** the last edit action is undone (handled in Story 6.5)

**Given** global shortcuts are active
**When** the user is typing in a textarea
**Then** shortcuts do NOT interfere with normal text input
**And** typing "k" or "c" inserts the character (shortcuts require modifier keys)

**Given** shortcuts are implemented
**When** testing cross-platform compatibility
**Then** all shortcuts work identically on macOS (Cmd), Windows (Ctrl), and Linux (Ctrl)
**And** no platform-specific bugs exist

---

### Story 6.2: Tab/Shift+Tab Focus Management Across Panels

As a user,
I want to navigate between UI elements using Tab and Shift+Tab,
So that I can move through the interface without using the mouse.

**Acceptance Criteria:**

**Given** the application is loaded
**When** the user presses Tab
**Then** focus moves to the next focusable element in logical order:
  1. Sidebar category icons (P, C, G)
  2. Library panel (New Snippet button, then snippet cards)
  3. Preview panel (framework selector, then textareas)
**And** the focus order follows left-to-right, top-to-bottom

**Given** the user presses Shift+Tab
**When** navigating backward
**Then** focus moves to the previous focusable element
**And** the order is reversed (preview → library → sidebar)

**Given** focus is on the last focusable element (last textarea in preview)
**When** the user presses Tab
**Then** focus wraps to the first focusable element (first sidebar icon)

**Given** focus is on the first focusable element (first sidebar icon)
**When** the user presses Shift+Tab
**Then** focus wraps to the last focusable element (last textarea in preview)

**Given** a modal or popover is open (e.g., snippet creation dialog, command palette)
**When** the user presses Tab
**Then** focus is trapped within the modal (does not escape to background elements)
**And** focus cycles through only the modal's focusable elements

**Given** the user closes a modal
**When** the modal dismisses
**Then** focus returns to the element that triggered the modal
**And** the user can continue navigating from where they left off

**Given** a snippet card has focus
**When** the user presses Enter
**Then** the snippet edit modal opens
**And** focus moves to the first field in the modal (Name input)

**Given** the library panel is scrollable
**When** a snippet card receives focus via Tab navigation
**Then** the panel auto-scrolls to bring the focused element into view
**And** the scroll is smooth (not jarring)

---

### Story 6.3: WCAG-Compliant Focus Indicators

As a user,
I want visible focus indicators on all interactive elements,
So that I always know where keyboard focus is located.

**Acceptance Criteria:**

**Given** any interactive element receives focus
**When** navigating with Tab or Shift+Tab
**Then** a visible focus indicator is displayed
**And** the indicator is a 3px outline in Mauve accent color (#cba6f7 on Mocha, #8839ef on Latte)

**Given** the focus indicator is displayed
**When** measuring contrast
**Then** the indicator meets WCAG 2.1 AA requirements (minimum 3:1 contrast ratio against background)
**And** the indicator is visible in both Mocha (dark) and Latte (light) themes

**Given** a textarea receives focus
**When** the user clicks into the textarea or navigates to it via Tab
**Then** the textarea displays the 3px Mauve outline
**And** the outline does not obstruct the text content
**And** the outline is clearly distinguishable from the textarea border

**Given** a button receives focus
**When** tabbing to the button
**Then** the button displays the 3px Mauve outline
**And** the button's hover state does not replace the focus indicator (both can coexist)

**Given** a snippet card receives focus
**When** navigating the library panel
**Then** the card displays the 3px Mauve outline
**And** the outline is visible even when the card is in its hover state

**Given** the sidebar category icon receives focus
**When** navigating with Tab
**Then** the icon displays the focus indicator
**And** the indicator is clearly visible around the icon boundary

**Given** a modal or popover element receives focus
**When** tabbing within the modal
**Then** focus indicators are displayed consistently
**And** all elements within the modal follow the same indicator style

**Given** the user is using a screen reader
**When** focus moves between elements
**Then** the screen reader announces the focused element type and label
**And** ARIA attributes (role, aria-label, aria-describedby) are present where appropriate

---

### Story 6.4: Cmd+1/2/3 Sidebar Category Switching

As a user,
I want to switch between sidebar categories using Cmd+1/2/3,
So that I can quickly filter the library without clicking sidebar icons.

**Acceptance Criteria:**

**Given** the user presses Cmd+1 (Ctrl+1 on Windows/Linux)
**When** the shortcut is detected
**Then** the "Personas" category is selected
**And** the library panel filters to show only persona snippets
**And** the Personas icon in the sidebar is highlighted with Mauve accent

**Given** the user presses Cmd+2 (Ctrl+2 on Windows/Linux)
**When** the shortcut is detected
**Then** the "Constraints" category is selected
**And** the library panel filters to show only constraint snippets
**And** the Constraints icon is highlighted

**Given** the user presses Cmd+3 (Ctrl+3 on Windows/Linux)
**When** the shortcut is detected
**Then** the "Guardrails" category is selected
**And** the library panel filters to show only guardrail snippets
**And** the Guardrails icon is highlighted

**Given** a category is already selected
**When** the user presses the same shortcut again (e.g., Cmd+1 when Personas is active)
**Then** the category filter is cleared
**And** all snippets are displayed (unfiltered view)
**And** no sidebar icon is highlighted

**Given** the user switches categories
**When** the filter updates
**Then** the library panel updates within 50ms (perceived as instant)
**And** the scroll position resets to the top of the filtered list

**Given** the user is typing in a textarea
**When** pressing Cmd+1/2/3
**Then** the category switch still occurs (shortcut is not blocked by textarea focus)
**And** no characters are inserted into the textarea

**Given** the inline search popover is open (tab stop search)
**When** pressing Cmd+1/2/3
**Then** the category shortcut is ignored (modal context takes precedence)
**And** the popover remains open

**Given** the global command palette (Cmd+K) is open
**When** pressing Cmd+1/2/3
**Then** the category shortcut is ignored
**And** the command palette remains open

---

### Story 6.5: Undo/Redo Stack (Cmd+Z/Cmd+Shift+Z)

As a user,
I want to undo and redo my edits,
So that I can experiment with prompts without fear of losing work.

**Acceptance Criteria:**

**Given** the user types text in a textarea
**When** the content changes
**Then** the change is added to the undo stack
**And** the stack stores: (textarea ID, previous content, new content, cursor position)

**Given** the user inserts a snippet via search or drag-and-drop
**When** the snippet is inserted
**Then** the insertion is added to the undo stack as a single atomic action
**And** undoing removes the entire snippet (not character by character)

**Given** the user presses Cmd+Z (Ctrl+Z on Windows/Linux)
**When** the undo action is triggered
**Then** the last change is reverted
**And** the textarea content is restored to the previous state
**And** the cursor position is restored to where it was before the change

**Given** the user has undone one or more actions
**When** pressing Cmd+Shift+Z (Ctrl+Shift+Z on Windows/Linux) for redo
**Then** the last undone action is reapplied
**And** the textarea content and cursor position are restored to the "after" state

**Given** the undo stack is empty (no previous changes)
**When** the user presses Cmd+Z
**Then** nothing happens (no error)
**And** a subtle notification may display: "Nothing to undo"

**Given** the redo stack is empty (no undone actions)
**When** the user presses Cmd+Shift+Z
**Then** nothing happens (no error)

**Given** the user makes a new change after undoing
**When** typing or inserting a snippet
**Then** the redo stack is cleared
**And** the new change becomes the latest entry in the undo stack

**Given** the undo stack has 50+ entries
**When** adding new changes
**Then** the oldest entries are removed to limit memory usage (max 100 entries)
**And** recent changes remain accessible

**Given** the user switches frameworks
**When** framework content is preserved/restored (as per Story 3.5)
**Then** undo/redo works within each framework independently
**And** switching frameworks does NOT add entries to the undo stack

**Given** the user undoes a snippet insertion
**When** the snippet is removed via Cmd+Z
**Then** the snippet's usage metadata is NOT decremented (usageCount remains)
**And** only the content change is reverted (metadata changes are permanent)

---

### Story 6.6: Keyboard Shortcut Documentation and Tooltips

As a user,
I want to discover available keyboard shortcuts,
So that I can learn and use the application more efficiently.

**Acceptance Criteria:**

**Given** the user hovers over the "Copy" button
**When** the tooltip appears
**Then** the tooltip displays: "Copy to clipboard (Cmd+C / Ctrl+C)"
**And** the tooltip includes both macOS and Windows/Linux shortcut notations

**Given** the user hovers over the framework selector dropdown
**When** the tooltip appears
**Then** the tooltip displays: "Select framework template"
**And** no keyboard shortcut is shown (interaction requires clicking)

**Given** the user hovers over a sidebar category icon
**When** the tooltip appears
**Then** the tooltip displays the category name and shortcut:
  - Personas (Cmd+1 / Ctrl+1)
  - Constraints (Cmd+2 / Ctrl+2)
  - Guardrails (Cmd+3 / Ctrl+3)

**Given** the user opens a help menu or shortcuts panel (accessible via ? key or Help menu)
**When** the panel is displayed
**Then** all keyboard shortcuts are listed in a table format:
  - Shortcut | Action | Description
  - Cmd+K | Global Search | Open command palette to search snippets
  - Cmd+C | Copy Prompt | Copy composed prompt to clipboard
  - Cmd+S | Save Template | Save current prompt as template (coming soon)
  - Cmd+Z | Undo | Undo last edit action
  - Cmd+Shift+Z | Redo | Redo last undone action
  - Cmd+1/2/3 | Switch Category | Filter library by category
  - Tab | Next Field | Move focus to next element or open inline search
  - Shift+Tab | Previous Field | Move focus to previous element
  - Esc | Dismiss | Close modal, popover, or command palette

**Given** the shortcuts panel is displayed
**When** viewing on different platforms
**Then** the shortcuts automatically display the correct modifier:
  - macOS: Shows "Cmd" (⌘ symbol)
  - Windows/Linux: Shows "Ctrl"

**Given** the user presses ? (question mark) anywhere in the app
**When** not focused in a textarea
**Then** the shortcuts help panel opens
**And** focus moves to the panel (can be closed with Esc)

**Given** the command palette footer is displayed
**When** the Cmd+K search is open
**Then** keyboard hints are shown: "↑↓ to navigate, ⏎ to select, esc to close"
**And** the hints use symbols (arrows, enter key symbol) for clarity

**Given** tooltips are displayed
**When** the user has `prefers-reduced-motion` enabled
**Then** tooltips appear instantly without fade-in animation

**Given** the application is used by a screen reader user
**When** interactive elements are focused
**Then** ARIA labels include keyboard shortcut information
**And** screen readers announce: "[Element name], [Shortcut], [Description]"

