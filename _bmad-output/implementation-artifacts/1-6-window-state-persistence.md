# Story 1.6: Window State Persistence

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want the application to remember my window size, position, and panel layout,
So that I don't have to resize or reposition the window every time I launch the app.

## Acceptance Criteria

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

## Tasks / Subtasks

- [ ] Task 1: Create settings.json schema and TypeScript types (AC: Settings persisted to JSON)
  - [ ] Subtask 1.1: Define `Settings` interface in `src/types/settings.ts`
  - [ ] Subtask 1.2: Create Zod schema for validation in `src/lib/schemas.ts`
  - [ ] Subtask 1.3: Add version field for future schema migrations ("1.0.0")
  - [ ] Subtask 1.4: Document JSON structure with example in code comments
  - [ ] Subtask 1.5: Write unit tests for schema validation

- [ ] Task 2: Implement Rust IPC commands for settings persistence (AC: Atomic writes)
  - [ ] Subtask 2.1: Add `load_settings()` command in `src-tauri/src/commands.rs`
  - [ ] Subtask 2.2: Add `save_settings()` command with atomic write pattern
  - [ ] Subtask 2.3: Implement .tmp → rename pattern like library.json (from Story 1.4)
  - [ ] Subtask 2.4: Handle missing settings.json gracefully (return defaults)
  - [ ] Subtask 2.5: Add Rust unit tests for settings commands
  - [ ] Subtask 2.6: Register commands in `src-tauri/src/lib.rs`

- [ ] Task 3: Create Zustand settings store with persistence (AC: Store tracks window state)
  - [ ] Subtask 3.1: Create `src/stores/settingsStore.ts` with Zustand
  - [ ] Subtask 3.2: Add window state fields (width, height, x, y)
  - [ ] Subtask 3.3: Add panel width fields (sidebarWidth, libraryWidth, previewWidth)
  - [ ] Subtask 3.4: Implement loadSettings() action calling Tauri IPC
  - [ ] Subtask 3.5: Implement saveSettings() action with debounce (500ms)
  - [ ] Subtask 3.6: Add setPanelWidths() action (immediate save, no debounce)
  - [ ] Subtask 3.7: Write unit tests for store actions

- [ ] Task 4: Implement window event listeners with Tauri API (AC: Window resize/move tracked)
  - [ ] Subtask 4.1: Use `@tauri-apps/api/window` to listen to 'resized' event
  - [ ] Subtask 4.2: Use `@tauri-apps/api/window` to listen to 'moved' event
  - [ ] Subtask 4.3: Debounce event handlers (500ms) to prevent excessive saves
  - [ ] Subtask 4.4: Update settings store on window events
  - [ ] Subtask 4.5: Clean up event listeners on unmount
  - [ ] Subtask 4.6: Add error handling for event listener failures

- [ ] Task 5: Apply saved window state on app initialization (AC: Window restores position/size)
  - [ ] Subtask 5.1: Load settings in App.tsx useEffect on mount
  - [ ] Subtask 5.2: Use `@tauri-apps/api/window` to set window size if saved
  - [ ] Subtask 5.3: Use `@tauri-apps/api/window` to set window position if saved
  - [ ] Subtask 5.4: Detect if saved position is off-screen (negative coords, exceeds display bounds)
  - [ ] Subtask 5.5: Center window on primary monitor if off-screen
  - [ ] Subtask 5.6: Apply default values (1200×800, centered) if no settings exist

- [ ] Task 6: Integrate panel width persistence with resizable panels (AC: Panel widths restored)
  - [ ] Subtask 6.1: Update panel divider onDragEnd to call setPanelWidths()
  - [ ] Subtask 6.2: Read panel widths from settings store on mount
  - [ ] Subtask 6.3: Apply saved widths to panel flex basis or width styles
  - [ ] Subtask 6.4: Ensure minimum widths are enforced (sidebar: 60px, library: 280px, preview: 400px)
  - [ ] Subtask 6.5: Test panel persistence across app restarts

- [ ] Task 7: Write comprehensive E2E tests for window persistence (AC: Full persistence verified)
  - [ ] Subtask 7.1: E2E test: Window size persists across restarts
  - [ ] Subtask 7.2: E2E test: Window position persists across restarts
  - [ ] Subtask 7.3: E2E test: Panel widths persist across restarts
  - [ ] Subtask 7.4: E2E test: Off-screen window centers on primary monitor
  - [ ] Subtask 7.5: E2E test: First launch uses default values
  - [ ] Subtask 7.6: E2E test: settings.json created in correct config directory

- [ ] Task 8: Update documentation and troubleshooting guides (AC: User docs updated)
  - [ ] Subtask 8.1: Document window state behavior in README.md
  - [ ] Subtask 8.2: Add settings.json format to development guide
  - [ ] Subtask 8.3: Create troubleshooting section for window positioning issues
  - [ ] Subtask 8.4: Document how to reset window state (delete settings.json)

## Dev Notes

### Architecture Context

**From Architecture Document (architecture.md):**

**State Management Architecture:**
- Using Zustand v4.x for global state (~1KB gzipped)
- Settings store will follow the same pattern as library/composition stores
- Zustand's `persist` middleware considered but NOT RECOMMENDED (localStorage has size limits and isn't suitable for desktop apps)
- Instead: Custom persistence via Tauri IPC commands to settings.json file

**IPC Communication Layer:**
- All file operations go through Rust Tauri commands
- Type-safe serialization with serde JSON
- Error handling: `Result<T, String>` with descriptive messages
- Pattern established in Story 1.4: atomic writes with .tmp → rename

**File System Patterns:**
- Config directory: `~/.config/prompt-alchemist/` (macOS/Linux) or `%LOCALAPPDATA%\prompt-alchemist\` (Windows)
- Atomic write pattern: Write to `.settings.json.tmp`, then rename to `settings.json`
- This prevents corruption if app crashes during save
- Pattern already implemented for library.json in Story 1.4

**Window Configuration from tauri.conf.json:**
```json
{
  "app": {
    "windows": [{
      "title": "Prompt Alchemist",
      "width": 800,
      "height": 600
    }]
  }
}
```

**IMPORTANT:** These are just the initial defaults. Our story will override these dynamically at runtime using saved settings.

### Technical Requirements

**Tauri Window API:**
```typescript
import { getCurrentWindow } from '@tauri-apps/api/window';

const window = getCurrentWindow();

// Listen to events
const unlistenResize = await window.listen('resized', (event) => {
  const { width, height } = event.payload;
  // Update settings store (debounced)
});

const unlistenMove = await window.listen('moved', (event) => {
  const { x, y } = event.payload;
  // Update settings store (debounced)
});

// Set window properties
await window.setSize(new PhysicalSize(1200, 800));
await window.setPosition(new PhysicalPosition(100, 100));

// Get current state
const size = await window.innerSize();
const position = await window.outerPosition();
```

**Debounce Implementation:**
```typescript
import { debounce } from 'lodash-es'; // Already in package.json

const debouncedSave = debounce((settings: Settings) => {
  saveSettings(settings);
}, 500);
```

**Settings Type Definition:**
```typescript
// src/types/settings.ts
export interface WindowState {
  width: number;
  height: number;
  x: number;
  y: number;
}

export interface PanelWidths {
  sidebar: number; // percentage (5)
  library: number; // percentage (28)
  preview: number; // percentage (67)
}

export interface Settings {
  version: string; // "1.0.0"
  windowState: WindowState;
  panelWidths: PanelWidths;
  metadata: {
    created: string; // ISO 8601
    lastModified: string; // ISO 8601
  };
}

export const DEFAULT_SETTINGS: Settings = {
  version: "1.0.0",
  windowState: {
    width: 1200,
    height: 800,
    x: -1, // -1 means "center on primary monitor"
    y: -1,
  },
  panelWidths: {
    sidebar: 5,
    library: 28,
    preview: 67,
  },
  metadata: {
    created: new Date().toISOString(),
    lastModified: new Date().toISOString(),
  },
};
```

**Zod Schema:**
```typescript
// src/lib/schemas.ts (add to existing schemas)
import { z } from 'zod';

export const windowStateSchema = z.object({
  width: z.number().min(800).max(10000),
  height: z.number().min(600).max(10000),
  x: z.number().int(),
  y: z.number().int(),
});

export const panelWidthsSchema = z.object({
  sidebar: z.number().min(3).max(10),
  library: z.number().min(20).max(50),
  preview: z.number().min(40).max(80),
});

export const settingsSchema = z.object({
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  windowState: windowStateSchema,
  panelWidths: panelWidthsSchema,
  metadata: z.object({
    created: z.string().datetime(),
    lastModified: z.string().datetime(),
  }),
});
```

**Rust Command Implementations:**
```rust
// src-tauri/src/commands.rs (add to existing commands)

use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

#[derive(Serialize, Deserialize, Clone)]
pub struct WindowState {
    pub width: u32,
    pub height: u32,
    pub x: i32,
    pub y: i32,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct PanelWidths {
    pub sidebar: u8,
    pub library: u8,
    pub preview: u8,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct SettingsMetadata {
    pub created: String,
    pub last_modified: String,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct Settings {
    pub version: String,
    pub window_state: WindowState,
    pub panel_widths: PanelWidths,
    pub metadata: SettingsMetadata,
}

#[tauri::command]
pub fn load_settings() -> Result<Settings, String> {
    let config_dir = get_config_dir()?;
    let settings_path = PathBuf::from(config_dir).join("settings.json");

    if !settings_path.exists() {
        // Return default settings on first launch
        return Ok(get_default_settings());
    }

    let contents = fs::read_to_string(&settings_path)
        .map_err(|e| format!("Failed to read settings: {}", e))?;

    let settings: Settings = serde_json::from_str(&contents)
        .map_err(|e| format!("Failed to parse settings: {}", e))?;

    Ok(settings)
}

#[tauri::command]
pub fn save_settings(settings: Settings) -> Result<(), String> {
    let config_dir = get_config_dir()?;
    let settings_path = PathBuf::from(&config_dir).join("settings.json");
    let temp_path = PathBuf::from(&config_dir).join(".settings.json.tmp");

    // Ensure config directory exists
    fs::create_dir_all(&config_dir)
        .map_err(|e| format!("Failed to create config directory: {}", e))?;

    // Serialize settings
    let json = serde_json::to_string_pretty(&settings)
        .map_err(|e| format!("Failed to serialize settings: {}", e))?;

    // Atomic write: write to temp file, then rename
    fs::write(&temp_path, json)
        .map_err(|e| format!("Failed to write settings temp file: {}", e))?;

    fs::rename(&temp_path, &settings_path)
        .map_err(|e| format!("Failed to finalize settings file: {}", e))?;

    Ok(())
}

fn get_default_settings() -> Settings {
    let now = chrono::Utc::now().to_rfc3339();
    Settings {
        version: "1.0.0".to_string(),
        window_state: WindowState {
            width: 1200,
            height: 800,
            x: -1,
            y: -1,
        },
        panel_widths: PanelWidths {
            sidebar: 5,
            library: 28,
            preview: 67,
        },
        metadata: SettingsMetadata {
            created: now.clone(),
            last_modified: now,
        },
    }
}
```

**Zustand Settings Store:**
```typescript
// src/stores/settingsStore.ts
import { create } from 'zustand';
import { invoke } from '@tauri-apps/api/core';
import { debounce } from 'lodash-es';
import type { Settings } from '@/types/settings';
import { DEFAULT_SETTINGS } from '@/types/settings';

interface SettingsState {
  settings: Settings;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadSettings: () => Promise<void>;
  saveSettings: (settings: Settings) => Promise<void>;
  updateWindowState: (state: Partial<WindowState>) => void;
  setPanelWidths: (widths: PanelWidths) => void;
}

// Debounced save function (shared across all store instances)
const debouncedSave = debounce(async (settings: Settings) => {
  try {
    await invoke('save_settings', { settings });
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}, 500);

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  isLoading: false,
  error: null,

  loadSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      const settings = await invoke<Settings>('load_settings');
      set({ settings, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load settings',
        isLoading: false,
      });
    }
  },

  saveSettings: async (settings: Settings) => {
    try {
      await invoke('save_settings', { settings });
      set({ settings });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to save settings',
      });
    }
  },

  updateWindowState: (state: Partial<WindowState>) => {
    const currentSettings = get().settings;
    const updatedSettings = {
      ...currentSettings,
      windowState: {
        ...currentSettings.windowState,
        ...state,
      },
      metadata: {
        ...currentSettings.metadata,
        lastModified: new Date().toISOString(),
      },
    };
    set({ settings: updatedSettings });
    debouncedSave(updatedSettings); // Debounced save
  },

  setPanelWidths: (widths: PanelWidths) => {
    const currentSettings = get().settings;
    const updatedSettings = {
      ...currentSettings,
      panelWidths: widths,
      metadata: {
        ...currentSettings.metadata,
        lastModified: new Date().toISOString(),
      },
    };
    set({ settings: updatedSettings });
    // Immediate save (no debounce for panel widths)
    get().saveSettings(updatedSettings);
  },
}));
```

**Window Event Listeners in App.tsx:**
```typescript
// src/App.tsx (add to existing useEffect)
import { useEffect } from 'react';
import { getCurrentWindow, PhysicalSize, PhysicalPosition } from '@tauri-apps/api/window';
import { useSettingsStore } from '@/stores/settingsStore';

function App() {
  const { loadSettings, updateWindowState, settings } = useSettingsStore();

  useEffect(() => {
    const window = getCurrentWindow();
    let unlistenResize: (() => void) | undefined;
    let unlistenMove: (() => void) | undefined;

    const initializeWindow = async () => {
      // Load settings first
      await loadSettings();

      // Apply saved window state
      const { windowState } = settings;
      
      // Set window size
      await window.setSize(new PhysicalSize(windowState.width, windowState.height));

      // Set window position (center if -1)
      if (windowState.x === -1 || windowState.y === -1) {
        await window.center();
      } else {
        // Check if position is off-screen (basic check)
        // TODO: Add proper display bounds detection
        if (windowState.x < -100 || windowState.y < -100) {
          await window.center();
        } else {
          await window.setPosition(new PhysicalPosition(windowState.x, windowState.y));
        }
      }

      // Listen to window events
      unlistenResize = await window.listen<{ width: number; height: number }>('resized', (event) => {
        updateWindowState({
          width: event.payload.width,
          height: event.payload.height,
        });
      });

      unlistenMove = await window.listen<{ x: number; y: number }>('moved', (event) => {
        updateWindowState({
          x: event.payload.x,
          y: event.payload.y,
        });
      });
    };

    initializeWindow().catch((error) => {
      console.error('Failed to initialize window:', error);
    });

    // Cleanup event listeners
    return () => {
      if (unlistenResize) unlistenResize();
      if (unlistenMove) unlistenMove();
    };
  }, [loadSettings, updateWindowState, settings]);

  // ... rest of App component
}
```

### Integration with Previous Stories

**Story 1.4: Tauri IPC Commands for File System Operations:**
- ✅ `get_config_dir()` command already implemented
- ✅ Atomic write pattern (.tmp → rename) established for library.json
- 🔄 REUSE: Same pattern for settings.json
- 🔄 REUSE: Same error handling strategy
- 🔄 REUSE: Same directory creation logic

**Story 1.5: Platform-Specific Configuration and Path Resolution:**
- ✅ Platform-specific config paths verified
- ✅ Path resolution tested across macOS/Windows/Linux
- 🔄 BENEFIT: settings.json will use same verified paths
- 🔄 BENEFIT: Cross-platform portability already validated

**Story 1.3: Zustand State Management Setup:**
- ✅ Zustand store pattern established
- ✅ libraryStore and compositionStore examples exist
- 🔄 REUSE: Follow same pattern for settingsStore
- 🔄 REUSE: Same testing approach with vi.mock

**Story 1.2: Three-Panel Layout with Resizable Panels:**
- ✅ Panel layout implemented with dividers
- 🔄 EXTEND: Add onDragEnd callback to save panel widths
- 🔄 EXTEND: Read panel widths from settings on mount
- 🔄 NOTE: Ensure panel resizing doesn't conflict with window resize events

### Testing Requirements

**Unit Tests:**

1. **Settings Schema Validation (src/lib/schemas.test.ts):**
   - Valid settings object passes validation
   - Invalid version format fails validation
   - Negative window dimensions fail validation
   - Panel widths outside range (0-100) fail validation
   - Missing required fields fail validation

2. **Settings Store (src/stores/settingsStore.test.ts):**
   - loadSettings() fetches from Tauri IPC
   - saveSettings() persists to Tauri IPC
   - updateWindowState() merges partial updates
   - updateWindowState() triggers debounced save
   - setPanelWidths() saves immediately (no debounce)
   - Error states are set on IPC failures

3. **Rust Commands (src-tauri/src/commands.rs):**
   - load_settings() returns defaults on first launch
   - load_settings() parses existing settings.json
   - save_settings() creates settings.json with correct structure
   - save_settings() uses atomic write (.tmp → rename)
   - save_settings() creates config directory if missing

**E2E Tests (tests/window-state.spec.ts):**

1. **First Launch Behavior:**
   - Window opens with default size (1200×800)
   - Window is centered on screen
   - Panel widths use defaults (5%, 28%, 67%)
   - settings.json is created in config directory

2. **Window State Persistence:**
   - Resize window → close app → reopen → size is restored
   - Move window → close app → reopen → position is restored
   - Resize and move → close app → reopen → both restored

3. **Panel Width Persistence:**
   - Drag library/preview divider → close app → reopen → width restored
   - Panel widths are saved immediately (no 500ms delay)

4. **Off-Screen Detection:**
   - Manually edit settings.json with negative coordinates → reopen → window centers
   - Manually edit settings.json with very large coordinates → reopen → window centers

5. **Cross-Platform Consistency:**
   - settings.json created in correct config directory (macOS/Windows/Linux)
   - Window state persists identically across platforms

**Manual Testing Checklist:**

- [ ] Verify debounce: Rapid window resizing doesn't cause excessive saves
- [ ] Verify off-screen: Disconnect second monitor → reopen app → window centers on primary
- [ ] Verify minimum sizes: Panel widths respect minimums (sidebar: 60px, library: 280px, preview: 400px)
- [ ] Verify first launch: Delete settings.json → reopen → defaults applied
- [ ] Verify corruption recovery: Corrupt settings.json → reopen → defaults applied with error message

### Git Intelligence

**Recent Commits (Last 10):**
1. `7662be0` - Merge pull request #4 (test design and gate check)
2. `2ad96b2` - Finalize design - test strategy - implementation readiness
3. `4fec2ac` - Upgrade BMAD to v6 alpha.22
4. `1d5517d` - Merge pull request #3 (architecture specs)
5. `8c880c7` - Architecture and planning - Generate architecture - Create epics
6. `5a7f060` - Merge pull request #2 (finish design phase)
7. `56452e9` - Finalize UX design - Generate UX specs - Generate UI mockups
8. `5dea522` - Merge pull request #1 (spec-driven kit)
9. `518fcca` - Add BMAD Method - Initialize - Run brainstorming - Generate PRD
10. `80750a8` - Initialize project from template

**Pattern Observations:**
- PRD → Architecture → UX → Implementation workflow
- No implementation commits yet (still in foundation phase)
- Story 1.6 will be among the first actual feature implementations
- Testing and gate checks are taken seriously (commit 2ad96b2)

### Latest Technical Information

**Tauri v2 Window API:**
- `getCurrentWindow()` is the correct API for Tauri v2 (not `appWindow` from v1)
- Event listeners return cleanup functions (`unlisten()`)
- Window position/size use `PhysicalSize` and `PhysicalPosition` structs
- Window centering: `window.center()` method available

**Debounce Best Practices:**
- Use `lodash-es` for tree-shakable imports (already in package.json)
- Debounce at 500ms for window events (balance between responsiveness and performance)
- No debounce for panel widths (user expects immediate save)

**Off-Screen Detection:**
- Basic check: negative coordinates or coordinates > 10000px
- Advanced: Use Tauri's `availableMonitors()` to get actual display bounds
- Fallback: `window.center()` if off-screen

**serde_json Field Naming:**
- Rust uses snake_case: `window_state`, `panel_widths`
- JSON/TypeScript uses camelCase: `windowState`, `panelWidths`
- serde automatically converts with `#[serde(rename_all = "camelCase")]` attribute
- IMPORTANT: Add this attribute to all Settings structs for correct serialization

### Cross-Cutting Concerns

**Performance:**
- Debounce window events (500ms) to prevent excessive file writes
- Atomic writes prevent corruption but add ~5ms overhead (acceptable)
- Settings file size: ~500 bytes (negligible read/write time)
- Load settings once on mount, not on every window event

**Error Handling:**
- Graceful degradation: If settings load fails, use defaults
- Clear error messages: "Failed to load settings: File not found"
- Don't crash app if settings.json is corrupted (just use defaults and log error)
- User can always reset by deleting settings.json

**Security:**
- Settings file is local only (no network exposure)
- No sensitive data in settings (just window state)
- Path traversal not a concern (config directory is fixed)

**Accessibility:**
- Window persistence improves UX for users with specific monitor setups
- Off-screen detection helps users with changing monitor configurations
- Panel width persistence respects user's preferred information density

### Anti-Patterns to Avoid

❌ **Don't use localStorage for persistence:**
- localStorage has size limits (5-10MB)
- Not suitable for desktop apps with file system access
- Zustand's persist middleware would use localStorage (not appropriate here)

❌ **Don't save on every window event:**
- Window resize fires 10-30 times per second during drag
- Use debounce to batch updates

❌ **Don't assume saved position is valid:**
- User might disconnect monitor
- Check for off-screen coordinates and center if needed

❌ **Don't forget cleanup:**
- Event listeners must be unlistened on unmount
- Memory leaks if listeners persist

❌ **Don't modify tauri.conf.json window config:**
- Those are just initial defaults
- Runtime window state should be managed via API, not config file

### Developer Checklist

Before marking this story as complete, verify:

**Code Quality:**
- [ ] All TypeScript types match Rust structs exactly
- [ ] Zod schemas validate all Settings fields
- [ ] Error handling covers all IPC failure cases
- [ ] Debounce is applied correctly (500ms window events, 0ms panel widths)
- [ ] Event listeners are cleaned up on unmount
- [ ] Atomic write pattern is used (.tmp → rename)

**Testing:**
- [ ] Unit tests pass for settings store and schema
- [ ] Rust unit tests pass for load/save commands
- [ ] E2E tests verify window state persistence
- [ ] E2E tests verify panel width persistence
- [ ] E2E tests verify off-screen detection
- [ ] E2E tests verify first launch defaults

**Integration:**
- [ ] Commands registered in src-tauri/src/lib.rs
- [ ] Settings store used in App.tsx
- [ ] Panel resizing integrated with setPanelWidths()
- [ ] Window listeners don't conflict with panel listeners

**Documentation:**
- [ ] README.md documents window state behavior
- [ ] Development guide includes settings.json format
- [ ] Troubleshooting section added for window issues
- [ ] Code comments explain off-screen detection logic

**Cross-Platform:**
- [ ] Tested on macOS (Intel and Apple Silicon if possible)
- [ ] Tested on Windows 10/11
- [ ] Tested on Linux (Ubuntu/Debian via AppImage)
- [ ] settings.json created in correct platform-specific directory

**UX Polish:**
- [ ] Window restoration feels instant (no visible re-positioning)
- [ ] Panel widths restore before first render (no flash of default widths)
- [ ] Defaults are sensible (1200×800, centered)
- [ ] Off-screen windows center gracefully (no error shown to user)

**Performance:**
- [ ] No excessive file writes during window resize
- [ ] Settings load time < 50ms (measured)
- [ ] No memory leaks from event listeners
- [ ] Debounce works correctly (verify with debug logging)

---

## Notes for Dev Agent

**Story Complexity: Medium**
- 8 tasks, ~50 subtasks
- New Tauri window API usage (not covered in previous stories)
- Debounce timing critical for performance
- Off-screen detection requires careful logic

**Estimated Effort: 4-6 hours**
- TypeScript types and schemas: 1 hour
- Rust commands: 1 hour
- Zustand store: 1 hour
- Window event integration: 1 hour
- Testing: 1-2 hours
- Documentation: 30 minutes

**Key Risks:**
1. **Off-screen detection edge cases:** May need multiple iterations to handle all monitor configurations correctly
2. **Event listener cleanup:** Easy to introduce memory leaks if cleanup is missed
3. **Debounce timing:** 500ms might feel too slow or too fast, may need tuning
4. **Panel width timing:** Coordinate with Story 1.2 implementation (might not exist yet)

**Dependencies:**
- Story 1.2 (panel layout) must be implemented first
- Story 1.3 (Zustand stores) must be implemented first
- Story 1.4 (Tauri IPC commands) must be implemented first
- Story 1.5 (platform paths) should be complete for proper cross-platform testing

**Success Criteria:**
- Window state persists reliably across app restarts
- No performance issues (excessive file writes, memory leaks)
- Off-screen detection works for all monitor configurations
- E2E tests cover all acceptance criteria

