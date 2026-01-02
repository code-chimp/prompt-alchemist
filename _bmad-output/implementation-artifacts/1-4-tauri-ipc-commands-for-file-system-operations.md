# Story 1.4: Tauri IPC Commands for File System Operations

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want to implement type-safe Tauri commands for file I/O,
So that the frontend can read/write library JSON files and access platform-specific config directories.

## Acceptance Criteria

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

## Tasks / Subtasks

- [ ] Task 1: Create config directory command (AC: get_config_dir returns platform path)
  - [ ] Subtask 1.1: Implement `get_config_dir()` Rust command with platform detection
  - [ ] Subtask 1.2: Add directory creation logic using `std::fs::create_dir_all()`
  - [ ] Subtask 1.3: Handle permissions errors gracefully
  - [ ] Subtask 1.4: Write unit tests for path resolution on all platforms

- [ ] Task 2: Implement read_library command (AC: Reads and parses JSON)
  - [ ] Subtask 2.1: Create Rust struct `Library` with serde deserialization
  - [ ] Subtask 2.2: Implement `read_library()` command to read `library.json`
  - [ ] Subtask 2.3: Handle file-not-found case (return default empty library)
  - [ ] Subtask 2.4: Add JSON parsing error handling with clear messages
  - [ ] Subtask 2.5: Write tests for valid/invalid/missing library files

- [ ] Task 3: Implement atomic write_library command (AC: Atomic writes prevent corruption)
  - [ ] Subtask 3.1: Create `write_library(data: Library)` command
  - [ ] Subtask 3.2: Implement atomic write pattern (write to .tmp → rename)
  - [ ] Subtask 3.3: Add error handling for disk full, permissions denied
  - [ ] Subtask 3.4: Verify performance: <100ms for 500 snippets
  - [ ] Subtask 3.5: Write tests for atomic operations and error scenarios

- [ ] Task 4: Implement clipboard command (AC: Cross-platform clipboard)
  - [ ] Subtask 4.1: Research Tauri clipboard plugin vs manual implementation
  - [ ] Subtask 4.2: Implement `copy_to_clipboard(text: String)` command
  - [ ] Subtask 4.3: Test clipboard operations on macOS, Windows, Linux
  - [ ] Subtask 4.4: Handle clipboard access denied errors

- [ ] Task 5: Create TypeScript bindings (AC: Type-safe IPC)
  - [ ] Subtask 5.1: Create `src/lib/tauri-commands.ts` with typed wrappers
  - [ ] Subtask 5.2: Define TypeScript interfaces matching Rust structs
  - [ ] Subtask 5.3: Add JSDoc comments for command documentation
  - [ ] Subtask 5.4: Export command functions and types

- [ ] Task 6: Integrate with Zustand stores (AC: Snippets persist to disk)
  - [ ] Subtask 6.1: Update `snippetStore.ts` to call `write_library()` on CRUD
  - [ ] Subtask 6.2: Call `loadLibrary()` on app initialization
  - [ ] Subtask 6.3: Add debouncing to prevent excessive writes (200ms)
  - [ ] Subtask 6.4: Handle async errors in store actions

- [ ] Task 7: Write comprehensive E2E tests (AC: All platforms validated)
  - [ ] Subtask 7.1: E2E test: Create snippet → verify JSON file written
  - [ ] Subtask 7.2: E2E test: App restart → library data persists
  - [ ] Subtask 7.3: E2E test: Copy to clipboard → paste works in external app
  - [ ] Subtask 7.4: Run E2E tests on macOS, Windows, Linux CI runners

## Dev Notes

### Architecture Context

**IPC Bridge Overview:**
- **Implementation:** Tauri v2 commands with serde JSON serialization
- **Security:** Capability-based permissions in `src-tauri/capabilities/default.json`
- **Error Handling:** Result<T, String> pattern for all commands
- **Performance Target:** <100ms for library operations, instant clipboard

**Key Files to Create:**
1. `src-tauri/src/commands.rs` - Tauri command implementations
2. `src-tauri/src/models.rs` - Rust structs for Library, Snippet, etc.
3. `src-tauri/src/fs_utils.rs` - File system utilities (atomic write, path resolution)
4. `src/lib/tauri-commands.ts` - TypeScript bindings for type-safe IPC
5. `tests/e2e/file-operations.spec.ts` - E2E tests for file I/O

**Key Files to Modify:**
- `src-tauri/src/lib.rs` - Register new commands in invoke_handler
- `src-tauri/capabilities/default.json` - Add fs:read-all, fs:write-all permissions
- `src/stores/snippetStore.ts` - Integrate write_library() calls
- `src/App.tsx` - Call loadLibrary() on mount

### Technical Requirements from Architecture

**Tauri Command Pattern (from Architecture Doc):**

The architecture document specifies a type-safe IPC layer with Rust commands for file I/O, clipboard, and config management. This story implements the file system and clipboard commands that enable snippet persistence and prompt copying.

**1. Config Directory Command (`src-tauri/src/commands.rs`):**

```rust
use tauri::command;
use std::path::PathBuf;
use std::fs;

#[command]
pub fn get_config_dir() -> Result<String, String> {
    let config_dir = dirs::config_dir()
        .ok_or("Failed to determine config directory")?
        .join("prompt-alchemist");
    
    // Create directory if it doesn't exist
    fs::create_dir_all(&config_dir)
        .map_err(|e| format!("Failed to create config directory: {}", e))?;
    
    config_dir
        .to_str()
        .ok_or("Invalid UTF-8 in config path")
        .map(|s| s.to_string())
}
```

**Platform-Specific Paths:**
- **macOS/Linux:** `~/.config/prompt-alchemist/` (via `dirs::config_dir()`)
- **Windows:** `%LOCALAPPDATA%\prompt-alchemist\` (e.g., `C:\Users\Username\AppData\Local\prompt-alchemist\`)

**2. Library Data Models (`src-tauri/src/models.rs`):**

```rust
use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Library {
    pub version: String,
    pub metadata: LibraryMetadata,
    pub snippets: Vec<Snippet>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LibraryMetadata {
    pub created: DateTime<Utc>,
    pub last_modified: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Snippet {
    pub id: String,
    pub name: String,
    #[serde(rename = "type")]
    pub snippet_type: SnippetType,
    pub content: String,
    pub tags: Vec<String>,
    pub metadata: SnippetMetadata,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum SnippetType {
    Persona,
    Guardrail,
    Constraint,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SnippetMetadata {
    pub created: DateTime<Utc>,
    pub last_used: DateTime<Utc>,
    pub use_count: u32,
}

impl Default for Library {
    fn default() -> Self {
        let now = Utc::now();
        Library {
            version: "1.0.0".to_string(),
            metadata: LibraryMetadata {
                created: now,
                last_modified: now,
            },
            snippets: Vec::new(),
        }
    }
}
```

**3. Read Library Command (`src-tauri/src/commands.rs`):**

```rust
use crate::models::Library;
use std::path::Path;
use std::fs;

#[command]
pub fn read_library() -> Result<Library, String> {
    let config_dir = get_config_dir()?;
    let library_path = Path::new(&config_dir).join("library.json");
    
    // If file doesn't exist, return default empty library (first launch)
    if !library_path.exists() {
        return Ok(Library::default());
    }
    
    // Read and parse JSON
    let json_content = fs::read_to_string(&library_path)
        .map_err(|e| format!("Failed to read library: {}", e))?;
    
    serde_json::from_str::<Library>(&json_content)
        .map_err(|e| format!("Failed to parse library JSON: {}", e))
}
```

**4. Atomic Write Library Command (`src-tauri/src/commands.rs`):**

**CRITICAL:** Atomic write pattern prevents JSON corruption on crashes.

```rust
use std::io::Write;
use std::fs::{File, rename};

#[command]
pub fn write_library(data: Library) -> Result<(), String> {
    let config_dir = get_config_dir()?;
    let library_path = Path::new(&config_dir).join("library.json");
    let temp_path = Path::new(&config_dir).join(".library.json.tmp");
    
    // Update last_modified timestamp
    let mut data = data;
    data.metadata.last_modified = Utc::now();
    
    // Serialize to JSON with pretty formatting
    let json_content = serde_json::to_string_pretty(&data)
        .map_err(|e| format!("Failed to serialize library: {}", e))?;
    
    // Write to temporary file first
    let mut temp_file = File::create(&temp_path)
        .map_err(|e| format!("Failed to create temp file: {}", e))?;
    
    temp_file.write_all(json_content.as_bytes())
        .map_err(|e| format!("Failed to write temp file: {}", e))?;
    
    // Ensure data is flushed to disk before rename
    temp_file.sync_all()
        .map_err(|e| format!("Failed to sync temp file: {}", e))?;
    
    // Atomic rename (replaces existing file if present)
    rename(&temp_path, &library_path)
        .map_err(|e| format!("Failed to rename temp file: {}", e))?;
    
    Ok(())
}
```

**Why Atomic Writes Matter:**
- **Crash Safety:** If app crashes during write, either old file exists OR new file exists (never corrupted)
- **Power Loss Protection:** OS guarantees rename is atomic (can't be interrupted mid-operation)
- **Performance:** Rename is fast (~1ms), no blocking writes to main file

**5. Clipboard Command (`src-tauri/src/commands.rs`):**

**Option A: Use Tauri Plugin (Recommended):**

Add to `src-tauri/Cargo.toml`:
```toml
[dependencies]
tauri-plugin-clipboard-manager = "2.0.0-beta"
```

Register plugin in `src-tauri/src/lib.rs`:
```rust
.plugin(tauri_plugin_clipboard_manager::init())
```

Frontend usage (no custom command needed):
```typescript
import { writeText } from '@tauri-apps/plugin-clipboard-manager';
await writeText('prompt content');
```

**Option B: Custom Command (If plugin not available):**

```rust
use tauri::ClipboardManager;

#[command]
pub fn copy_to_clipboard(app_handle: tauri::AppHandle, text: String) -> Result<(), String> {
    app_handle
        .clipboard_manager()
        .write_text(text)
        .map_err(|e| format!("Failed to copy to clipboard: {}", e))
}
```

**Recommendation:** Use Option A (tauri-plugin-clipboard-manager) for better cross-platform support.

**6. Register Commands in `src-tauri/src/lib.rs`:**

```rust
mod commands;
mod models;
mod fs_utils;

use commands::{get_config_dir, read_library, write_library};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::new().targets([...]).build())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_clipboard_manager::init())  // Add clipboard plugin
        .invoke_handler(tauri::generate_handler![
            greet,  // Existing command from starter
            get_config_dir,
            read_library,
            write_library,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

**7. TypeScript Bindings (`src/lib/tauri-commands.ts`):**

**Type-Safe IPC Wrapper Pattern:**

```typescript
import { invoke } from '@tauri-apps/api/core';

/**
 * Snippet type matching Rust enum
 */
export type SnippetType = 'persona' | 'guardrail' | 'constraint';

/**
 * Snippet interface matching Rust struct
 */
export interface Snippet {
  id: string;
  name: string;
  type: SnippetType;
  content: string;
  tags: string[];
  metadata: {
    created: string; // ISO8601 timestamp
    lastUsed: string;
    useCount: number;
  };
}

/**
 * Library structure matching Rust struct
 */
export interface Library {
  version: string;
  metadata: {
    created: string;
    lastModified: string;
  };
  snippets: Snippet[];
}

/**
 * Get platform-specific config directory path
 * @returns Config directory path (e.g., ~/.config/prompt-alchemist/)
 * @throws Error if config directory cannot be determined or created
 */
export async function getConfigDir(): Promise<string> {
  try {
    return await invoke<string>('get_config_dir');
  } catch (error) {
    throw new Error(`Get config directory failed: ${error}`);
  }
}

/**
 * Read library from disk
 * @returns Library object (or default empty library on first launch)
 * @throws Error if file system read fails or JSON parsing fails
 */
export async function readLibrary(): Promise<Library> {
  try {
    return await invoke<Library>('read_library');
  } catch (error) {
    throw new Error(`Read library failed: ${error}`);
  }
}

/**
 * Write library to disk with atomic operations
 * @param data - Library object to persist
 * @throws Error if write fails (disk full, permissions denied, etc.)
 */
export async function writeLibrary(data: Library): Promise<void> {
  try {
    await invoke<void>('write_library', { data });
  } catch (error) {
    throw new Error(`Write library failed: ${error}`);
  }
}

/**
 * Copy text to system clipboard (uses tauri-plugin-clipboard-manager)
 * @param text - Text to copy
 * @throws Error if clipboard access denied
 */
export async function copyToClipboard(text: string): Promise<void> {
  try {
    // Using tauri-plugin-clipboard-manager
    const { writeText } = await import('@tauri-apps/plugin-clipboard-manager');
    await writeText(text);
  } catch (error) {
    throw new Error(`Copy to clipboard failed: ${error}`);
  }
}
```

**8. Integration with Zustand Stores (`src/stores/snippetStore.ts`):**

**Update from Story 1.3 to add persistence:**

```typescript
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { readLibrary, writeLibrary, type Library, type Snippet } from '@/lib/tauri-commands';

interface SnippetStoreState {
  snippets: Snippet[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadSnippets: () => Promise<void>;
  saveSnippets: () => Promise<void>;
  addSnippet: (snippet: Omit<Snippet, 'id' | 'metadata'>) => void;
  updateSnippet: (id: string, updates: Partial<Snippet>) => void;
  deleteSnippet: (id: string) => void;
  incrementUseCount: (id: string) => void;
}

// Debounce helper for save operations
let saveDebounceTimer: NodeJS.Timeout | null = null;
const SAVE_DEBOUNCE_MS = 200;

export const useSnippetStore = create<SnippetStoreState>()(
  devtools(
    (set, get) => ({
      snippets: [],
      isLoading: false,
      error: null,

      loadSnippets: async () => {
        set({ isLoading: true, error: null });
        try {
          const library = await readLibrary();
          set({ snippets: library.snippets, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to load snippets',
            isLoading: false,
          });
        }
      },

      saveSnippets: async () => {
        // Debounce rapid saves (prevents excessive disk writes)
        if (saveDebounceTimer) {
          clearTimeout(saveDebounceTimer);
        }

        saveDebounceTimer = setTimeout(async () => {
          const { snippets } = get();
          const library: Library = {
            version: '1.0.0',
            metadata: {
              created: new Date().toISOString(),
              lastModified: new Date().toISOString(),
            },
            snippets,
          };

          try {
            await writeLibrary(library);
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to save snippets',
            });
          }
        }, SAVE_DEBOUNCE_MS);
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
        get().saveSnippets(); // Auto-save after mutation
      },

      updateSnippet: (id, updates) => {
        set((state) => ({
          snippets: state.snippets.map((snippet) =>
            snippet.id === id ? { ...snippet, ...updates } : snippet
          ),
        }));
        get().saveSnippets(); // Auto-save
      },

      deleteSnippet: (id) => {
        set((state) => ({
          snippets: state.snippets.filter((snippet) => snippet.id !== id),
        }));
        get().saveSnippets(); // Auto-save
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
        get().saveSnippets(); // Auto-save
      },
    }),
    { name: 'SnippetStore' }
  )
);
```

**9. App Initialization (`src/App.tsx`):**

```typescript
import { useEffect } from 'react';
import { useSnippetStore } from '@/stores';

function App() {
  const loadSnippets = useSnippetStore((state) => state.loadSnippets);

  useEffect(() => {
    // Load library from disk on app mount
    loadSnippets();
  }, [loadSnippets]);

  return (
    <div className="app">
      {/* Rest of app */}
    </div>
  );
}
```

### Library and Framework Requirements

**New Dependencies (Rust - `src-tauri/Cargo.toml`):**

```toml
[dependencies]
tauri = { version = "2.1", features = [] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
dirs = "5.0"  # For cross-platform config directory resolution
chrono = { version = "0.4", features = ["serde"] }  # For timestamps
tauri-plugin-clipboard-manager = "2.0.0-beta"  # For clipboard operations
```

**No New Frontend Dependencies Required** ✅

**Existing Dependencies (Already in Project):**
- `@tauri-apps/api` - Tauri IPC invoke functions
- `zustand` - State management (already added in Story 1.3)

**Tauri Capabilities (`src-tauri/capabilities/default.json`):**

**CRITICAL SECURITY:** Must explicitly grant file system permissions.

```json
{
  "identifier": "default",
  "description": "Capability for the main window",
  "windows": ["main"],
  "permissions": [
    "core:default",
    "fs:allow-config-read-recursive",
    "fs:allow-config-write-recursive",
    "fs:allow-app-read",
    "clipboard-manager:default"
  ]
}
```

### File Structure Requirements from Architecture

**New Files to Create:**

```
src-tauri/src/
├── commands.rs              # Tauri command implementations
├── models.rs                # Rust structs (Library, Snippet, etc.)
└── fs_utils.rs              # File system utilities (atomic write helpers)

src/lib/
└── tauri-commands.ts        # TypeScript IPC bindings

tests/e2e/
└── file-operations.spec.ts  # E2E tests for file I/O and clipboard
```

**Files to Modify:**

```
src-tauri/src/lib.rs         # Register new commands in invoke_handler
src-tauri/Cargo.toml         # Add deps: dirs, chrono, clipboard-manager
src-tauri/capabilities/default.json  # Add fs permissions
src/stores/snippetStore.ts   # Integrate read/write commands
src/App.tsx                  # Call loadSnippets() on mount
```

### Testing Requirements

**Unit Tests (Rust - `src-tauri/src/commands.rs`):**

```rust
#[cfg(test)]
mod tests {
    use super::*;
    use std::fs;
    use tempfile::TempDir;

    #[test]
    fn test_get_config_dir_creates_directory() {
        let result = get_config_dir();
        assert!(result.is_ok());
        let path = PathBuf::from(result.unwrap());
        assert!(path.exists());
        assert!(path.is_dir());
    }

    #[test]
    fn test_read_library_returns_default_when_missing() {
        // This test may need mocking since it uses real config dir
        let library = read_library().unwrap();
        assert_eq!(library.version, "1.0.0");
        assert_eq!(library.snippets.len(), 0);
    }

    #[test]
    fn test_atomic_write_creates_and_renames() {
        let temp_dir = TempDir::new().unwrap();
        let library = Library::default();
        
        // Mock config_dir to use temp directory
        // (This requires refactoring commands to accept optional config_dir param)
        
        let result = write_library(library);
        assert!(result.is_ok());
        
        let library_path = temp_dir.path().join("library.json");
        assert!(library_path.exists());
        
        // Verify .tmp file doesn't exist after successful write
        let temp_path = temp_dir.path().join(".library.json.tmp");
        assert!(!temp_path.exists());
    }

    #[test]
    fn test_write_then_read_roundtrip() {
        let library = Library {
            version: "1.0.0".to_string(),
            metadata: LibraryMetadata {
                created: Utc::now(),
                last_modified: Utc::now(),
            },
            snippets: vec![
                Snippet {
                    id: "test-id".to_string(),
                    name: "Test Snippet".to_string(),
                    snippet_type: SnippetType::Persona,
                    content: "Test content".to_string(),
                    tags: vec!["test".to_string()],
                    metadata: SnippetMetadata {
                        created: Utc::now(),
                        last_used: Utc::now(),
                        use_count: 0,
                    },
                },
            ],
        };

        write_library(library.clone()).unwrap();
        let read_library = read_library().unwrap();

        assert_eq!(read_library.version, library.version);
        assert_eq!(read_library.snippets.len(), 1);
        assert_eq!(read_library.snippets[0].name, "Test Snippet");
    }
}
```

**E2E Tests (Playwright - `tests/e2e/file-operations.spec.ts`):**

```typescript
import { test, expect } from '@playwright/test';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import os from 'os';

test.describe('File System Operations', () => {
  const getConfigPath = () => {
    const platform = os.platform();
    if (platform === 'darwin' || platform === 'linux') {
      return join(os.homedir(), '.config', 'prompt-alchemist', 'library.json');
    } else {
      return join(process.env.LOCALAPPDATA!, 'prompt-alchemist', 'library.json');
    }
  };

  test('should create library file on first snippet creation', async ({ page }) => {
    // Navigate to app
    await page.goto('/');

    // Create a new snippet via UI
    await page.click('button:has-text("New Snippet")');
    await page.fill('input[name="name"]', 'Test Persona');
    await page.selectOption('select[name="type"]', 'persona');
    await page.fill('textarea[name="content"]', 'You are a test persona');
    await page.click('button:has-text("Create")');

    // Wait for auto-save (200ms debounce + write time)
    await page.waitForTimeout(500);

    // Verify library.json was created
    const libraryPath = getConfigPath();
    expect(existsSync(libraryPath)).toBe(true);

    // Verify JSON structure
    const libraryContent = JSON.parse(readFileSync(libraryPath, 'utf-8'));
    expect(libraryContent.version).toBe('1.0.0');
    expect(libraryContent.snippets).toHaveLength(1);
    expect(libraryContent.snippets[0].name).toBe('Test Persona');
  });

  test('should persist library across app restarts', async ({ page }) => {
    // Create snippet
    await page.goto('/');
    await page.click('button:has-text("New Snippet")');
    await page.fill('input[name="name"]', 'Persistent Snippet');
    await page.selectOption('select[name="type"]', 'constraint');
    await page.fill('textarea[name="content"]', 'Must persist');
    await page.click('button:has-text("Create")');
    await page.waitForTimeout(500);

    // Simulate app restart by reloading
    await page.reload();

    // Verify snippet still exists in UI
    await expect(page.locator('text=Persistent Snippet')).toBeVisible();
  });

  test('should handle atomic writes during rapid operations', async ({ page }) => {
    await page.goto('/');

    // Rapidly create multiple snippets (tests debouncing and atomic writes)
    for (let i = 0; i < 5; i++) {
      await page.click('button:has-text("New Snippet")');
      await page.fill('input[name="name"]', `Snippet ${i}`);
      await page.selectOption('select[name="type"]', 'persona');
      await page.fill('textarea[name="content"]', `Content ${i}`);
      await page.click('button:has-text("Create")');
      // Don't wait - rapid fire to test atomic writes
    }

    // Wait for all saves to complete
    await page.waitForTimeout(1000);

    // Verify all 5 snippets in JSON
    const libraryPath = getConfigPath();
    const libraryContent = JSON.parse(readFileSync(libraryPath, 'utf-8'));
    expect(libraryContent.snippets).toHaveLength(5);
  });
});

test.describe('Clipboard Operations', () => {
  test('should copy composed prompt to clipboard', async ({ page, context }) => {
    await page.goto('/');

    // Grant clipboard permissions (required for Playwright)
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    // Compose a simple prompt
    await page.fill('textarea[placeholder="Role"]', 'You are a helpful assistant');
    await page.fill('textarea[placeholder="Task"]', 'Generate test code');

    // Click copy button
    await page.click('button:has-text("Copy")');

    // Verify clipboard content
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toContain('You are a helpful assistant');
    expect(clipboardText).toContain('Generate test code');
  });
});
```

### Accessibility Requirements (WCAG 2.1 AA)

**No Direct Accessibility Impact:**
- Tauri commands are backend-only (no UI components)
- Error messages from commands displayed via existing error handling UI (covered in Stories 1.1, 1.2)

**Indirect Benefits for Accessibility:**
- Auto-save prevents data loss (benefits users with motor impairments who may close app unexpectedly)
- Clipboard command enables keyboard-only workflows (copy without mouse)

### Previous Story Intelligence

**Learnings from Story 1.3 (Zustand State Management):**

Story 1.3 created `snippetStore` with CRUD operations but placeholder comments for Tauri IPC:

```typescript
// Story 1.4 will implement Tauri IPC for loading
// For now, initialize with empty array or mock data
```

**INTEGRATION POINTS:**

1. **snippetStore.loadSnippets():**
   - Replace placeholder with `readLibrary()` call
   - Handle async errors (display in UI via error state)

2. **snippetStore CRUD actions:**
   - Add `saveSnippets()` call after `addSnippet()`, `updateSnippet()`, `deleteSnippet()`
   - Use debouncing (200ms) to prevent excessive disk writes

3. **App.tsx initialization:**
   - Call `loadSnippets()` in useEffect on mount
   - Handle loading state (show spinner while reading from disk)

**Code Pattern from Story 1.3 to Update:**

```typescript
// BEFORE (Story 1.3 placeholder)
loadSnippets: async () => {
  set({ isLoading: true, error: null });
  try {
    // Story 1.4 will implement Tauri IPC for loading
    // For now, initialize with empty array or mock data
    set({ snippets: [], isLoading: false });
  } catch (error) {
    set({ error: 'Failed to load snippets', isLoading: false });
  }
},

// AFTER (Story 1.4 - integrate Tauri IPC)
loadSnippets: async () => {
  set({ isLoading: true, error: null });
  try {
    const library = await readLibrary();
    set({ snippets: library.snippets, isLoading: false });
  } catch (error) {
    set({
      error: error instanceof Error ? error.message : 'Failed to load snippets',
      isLoading: false,
    });
  }
},
```

### Git Intelligence Summary

**Recent Commits (Last 5):**
1. **7662be0** - Merge PR #4: test design, implementation readiness check, sprint status
2. **2ad96b2** - Finalize design: test strategy, implementation readiness check, generate sprint status
3. **4fec2ac** - Upgrade BMAD to v6 alpha.22
4. **1d5517d** - Merge PR #3: architecture specs
5. **8c880c7** - Generate architecture document, create epics and stories

**Code Patterns Established (Continue Following):**

1. **Rust Module Pattern:**
   ```rust
   // Create separate modules for organization
   mod commands;
   mod models;
   mod fs_utils;
   
   // Use pub fn for commands, pub struct for models
   pub fn get_config_dir() -> Result<String, String>
   pub struct Library { /* ... */ }
   ```

2. **Error Handling Pattern:**
   ```rust
   // Return Result<T, String> for all commands
   // Use descriptive error messages with context
   .map_err(|e| format!("Failed to read library: {}", e))
   ```

3. **Tauri Command Registration:**
   ```rust
   // Register all commands in lib.rs invoke_handler
   .invoke_handler(tauri::generate_handler![
       get_config_dir,
       read_library,
       write_library,
   ])
   ```

4. **TypeScript IPC Wrapper Pattern:**
   ```typescript
   // Wrap invoke() calls with typed functions
   export async function readLibrary(): Promise<Library> {
     try {
       return await invoke<Library>('read_library');
     } catch (error) {
       throw new Error(`Read library failed: ${error}`);
     }
   }
   ```

### Latest Technical Information

**Tauri v2.1.x (Latest Stable as of 2026-01-01):**

**Key Features:**
- **Capability-Based Security:** Explicit permissions required for file system access
- **Type-Safe IPC:** Rust serde + TypeScript types ensure end-to-end type safety
- **Cross-Platform APIs:** Unified file system abstractions (handles Windows/macOS/Linux differences)
- **Plugin System:** Official plugins for common tasks (clipboard, shell, updater)

**Breaking Changes from Tauri v1.x:**
- **Permissions:** Must explicitly grant `fs:allow-*` permissions in capabilities file
- **API Module:** `@tauri-apps/api` namespace changed (use `@tauri-apps/api/core` for invoke)
- **Plugin Names:** New naming convention (e.g., `tauri-plugin-clipboard-manager` not `tauri-plugin-clipboard`)

**File System Best Practices:**

**1. Use `dirs` Crate for Cross-Platform Paths:**

```rust
use dirs::config_dir;

let config = config_dir()  // Returns platform-appropriate path
    .ok_or("Config dir not found")?
    .join("prompt-alchemist");
```

**Platform Results:**
- **macOS:** `~/.config/prompt-alchemist/`
- **Windows:** `C:\Users\{user}\AppData\Local\prompt-alchemist\`
- **Linux:** `~/.config/prompt-alchemist/`

**2. Atomic Write Pattern (Industry Standard):**

```rust
// Write to .tmp file first
fs::write(&temp_path, &data)?;

// Flush to disk (prevents data loss on crash)
File::open(&temp_path)?.sync_all()?;

// Atomic rename (guaranteed by OS)
fs::rename(&temp_path, &final_path)?;
```

**Why This Matters:**
- Rename is atomic on all major OS (POSIX standard, Windows NTFS)
- Prevents corruption: crash during write leaves old file intact
- No partial writes: rename succeeds OR fails completely

**3. Error Handling with Context:**

```rust
// ❌ BAD: Generic error, hard to debug
fs::read_to_string(&path)
    .map_err(|e| e.to_string())?;

// ✅ GOOD: Contextual error with operation and path
fs::read_to_string(&path)
    .map_err(|e| format!("Failed to read library at {:?}: {}", path, e))?;
```

**Tauri Clipboard Plugin (tauri-plugin-clipboard-manager):**

**Installation:**

```toml
# Cargo.toml
tauri-plugin-clipboard-manager = "2.0.0-beta"
```

```rust
// lib.rs
.plugin(tauri_plugin_clipboard_manager::init())
```

**Frontend Usage:**

```typescript
import { writeText, readText } from '@tauri-apps/plugin-clipboard-manager';

// Write to clipboard
await writeText('composed prompt content');

// Read from clipboard (if needed later)
const text = await readText();
```

**Benefits Over Manual Implementation:**
- Cross-platform handling (macOS, Windows, Linux quirks handled)
- Permission management built-in
- Async/await friendly API
- Well-tested by Tauri core team

**Common Pitfalls to Avoid:**

1. **Don't use synchronous file operations in Tauri commands:**
   ```rust
   // ❌ BAD: Blocks async runtime
   #[command]
   fn read_library() -> Result<Library, String> {
       std::fs::read_to_string(&path)?;  // Blocks!
   }
   
   // ✅ GOOD: Use async operations (or accept blocking for small files)
   // For MVP, blocking is acceptable since files are small (<500 snippets ~100KB)
   // Phase 2 can migrate to tokio::fs for true async
   ```

2. **Don't forget to create parent directories:**
   ```rust
   // ❌ BAD: Fails if parent doesn't exist
   fs::write(&library_path, &data)?;
   
   // ✅ GOOD: Ensure parent directories exist
   fs::create_dir_all(&config_dir)?;
   fs::write(&library_path, &data)?;
   ```

3. **Don't use unwrap() in production commands:**
   ```rust
   // ❌ BAD: Panics crash the app
   let path = config_dir().unwrap().join("library.json");
   
   // ✅ GOOD: Return errors to frontend
   let path = config_dir()
       .ok_or("Failed to determine config directory")?
       .join("library.json");
   ```

**Performance Characteristics:**

**File I/O:**
- **Read 500 snippets (~100KB JSON):** <10ms on SSD, <50ms on HDD
- **Write with atomic rename:** <20ms on SSD, <100ms on HDD
- **Target:** <100ms for all operations (includes serialization + I/O)

**Optimization Tips:**
- Debounce writes (200ms) to prevent excessive disk I/O during rapid edits
- Use serde_json pretty formatting only for development (compact for production if needed)
- Consider compression for very large libraries (>1000 snippets in Phase 2)

**Testing Strategy:**

```rust
// Mock file system for unit tests
#[cfg(test)]
mod tests {
    use tempfile::TempDir;
    
    #[test]
    fn test_with_temp_dir() {
        let temp = TempDir::new().unwrap();
        let library_path = temp.path().join("library.json");
        
        // Test operations with temp_dir
        // Automatically cleaned up when test completes
    }
}
```

**Cross-Platform Testing:**
- Run `npm run test:rust` locally on your platform
- Use GitHub Actions matrix for Windows/macOS/Linux CI
- E2E tests with Playwright Desktop on all platforms

### Cross-Cutting Concerns

**Error Handling:**
- All Tauri commands return `Result<T, String>` for consistent error handling
- Frontend displays errors via Zustand error state (snippetStore.error)
- Graceful degradation: App continues working even if save fails (shows error notification)

**Performance Optimization:**
- **Debouncing:** 200ms debounce on write_library() prevents excessive disk writes
- **Async Loading:** read_library() called once on app mount, subsequent reads from Zustand store
- **Atomic Writes:** Prevents file corruption but adds ~5ms overhead (acceptable trade-off)

**Security Considerations:**
- **Capability-Based Permissions:** Only grant fs:allow-config-* (not blanket fs access)
- **Path Validation:** Use `dirs` crate (vetted by Rust community) for safe path resolution
- **No User Input in Paths:** All paths generated by app, not user-supplied (prevents directory traversal)

**Future Extensibility:**
- Story 2.1 will add JSON schema versioning (version field in Library struct ready)
- Story 2.6 will add auto-save debouncing (debounce helper already in snippetStore)
- Epic 3 will need new Tauri commands for template/framework persistence (similar pattern)

### Code Anti-Patterns to Avoid

**❌ DON'T: Use path string concatenation**
```rust
// BAD: Breaks on Windows (forward slash vs backslash)
let path = format!("{}/.config/prompt-alchemist/library.json", home_dir);
```

**✅ DO: Use PathBuf::join()**
```rust
// GOOD: Cross-platform path handling
let path = config_dir()?.join("prompt-alchemist").join("library.json");
```

**❌ DON'T: Ignore file system errors**
```rust
// BAD: Silently fails, hard to debug
let _ = fs::write(&path, &data);
```

**✅ DO: Return errors to frontend**
```rust
// GOOD: Frontend can display error to user
fs::write(&path, &data)
    .map_err(|e| format!("Failed to write library: {}", e))?;
```

**❌ DON'T: Use blocking operations without considering performance**
```rust
// BAD: Blocks for 1 second on slow disk
let library = read_library()?;
```

**✅ DO: Use async operations for large files (Phase 2) or accept blocking for MVP**
```rust
// GOOD for MVP: Small files (<100KB), blocking acceptable
// PHASE 2: Migrate to tokio::fs::read_to_string() for true async
```

### Developer Checklist

Before marking this story complete, verify:

- [ ] `src-tauri/src/commands.rs` created with all 4 commands implemented
- [ ] `src-tauri/src/models.rs` created with Library, Snippet, SnippetType structs
- [ ] `src-tauri/src/fs_utils.rs` created with atomic write helpers (if needed)
- [ ] `src/lib/tauri-commands.ts` created with typed IPC wrappers
- [ ] `src-tauri/src/lib.rs` updated: commands registered in invoke_handler
- [ ] `src-tauri/Cargo.toml` updated: deps added (dirs, chrono, clipboard-manager)
- [ ] `src-tauri/capabilities/default.json` updated: fs permissions granted
- [ ] `src/stores/snippetStore.ts` updated: read/write integrated, debouncing added
- [ ] `src/App.tsx` updated: loadSnippets() called on mount
- [ ] Unit tests pass: `npm run test:rust` confirms Rust command tests pass
- [ ] E2E tests pass: file-operations.spec.ts passes on local platform
- [ ] Cross-platform verification: E2E tests pass on macOS, Windows, Linux (CI)
- [ ] Config directory creation tested: App creates ~/.config/prompt-alchemist/ on first launch
- [ ] Atomic write verified: .library.json.tmp created and renamed correctly
- [ ] Error handling tested: Permissions denied, disk full scenarios handled gracefully
- [ ] Clipboard tested: Copy button successfully copies to system clipboard
- [ ] Type safety verified: `npm run check` confirms TypeScript types match Rust structs
- [ ] Performance validated: write_library() completes <100ms for 500 snippets

### Integration with Previous Stories

**Story 1.1 (Catppuccin Theme System) → Story 1.4:**
- **No Direct Integration:** Theme state managed in settingsStore, no file persistence yet
- **Future:** Story 1.6 will add settings.json persistence (similar pattern to library.json)

**Story 1.2 (Three-Panel Layout) → Story 1.4:**
- **No Direct Integration:** Panel widths in settingsStore, localStorage persistence (not file)
- **Future:** Story 1.6 will add window state persistence to settings.json

**Story 1.3 (Zustand State Management) → Story 1.4:**
- **Direct Integration:** snippetStore CRUD actions now call write_library()
- **Initialization:** loadSnippets() called in App.tsx on mount
- **Auto-Save:** Debounced save after every mutation (add, update, delete)

**Combined Result After Story 1.4:**
✅ **Full Persistence Stack:** Snippets persist to disk, survive app restarts  
✅ **Atomic Operations:** No data corruption on crashes or power loss  
✅ **Cross-Platform Config:** Platform-appropriate config directories used  
✅ **Clipboard Integration:** Composed prompts copy to system clipboard  
✅ **Foundation Complete:** Epic 1 infrastructure done, ready for Epic 2 (Snippet Library Management)

## Dev Agent Record

### Agent Model Used

_To be filled by DEV agent_

### Debug Log References

_To be filled by DEV agent_

### Completion Notes List

_To be filled by DEV agent_

### File List

_To be filled by DEV agent_
