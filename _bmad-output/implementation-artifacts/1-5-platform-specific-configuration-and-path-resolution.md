# Story 1.5: Platform-Specific Configuration and Path Resolution

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want my snippet library stored in the correct platform-specific location,
So that my data follows OS conventions and is easy to back up or migrate.

## Acceptance Criteria

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

## Tasks / Subtasks

- [ ] Task 1: Implement platform detection and path resolution (AC: Platform-specific paths)
  - [ ] Subtask 1.1: Verify `dirs` crate is in Cargo.toml dependencies
  - [ ] Subtask 1.2: Audit get_config_dir() implementation from Story 1.4
  - [ ] Subtask 1.3: Add explicit platform detection logging for debugging
  - [ ] Subtask 1.4: Write unit tests for each platform path resolution
  - [ ] Subtask 1.5: Document expected paths in code comments

- [ ] Task 2: Implement keyboard shortcut platform mapping (AC: Cmd/Ctrl mapping)
  - [ ] Subtask 2.1: Create React hook `usePlatformShortcut()` for modifier key detection
  - [ ] Subtask 2.2: Detect OS via `navigator.platform` or `@tauri-apps/api/os`
  - [ ] Subtask 2.3: Map Cmd (Meta) on macOS to Ctrl on Windows/Linux
  - [ ] Subtask 2.4: Update existing keyboard shortcuts (Cmd+K, Cmd+C) to use hook
  - [ ] Subtask 2.5: Add unit tests for shortcut mapping logic
  - [ ] Subtask 2.6: Document shortcut mappings in AGENTS.md

- [ ] Task 3: Verify cross-platform library portability (AC: Copy library between platforms)
  - [ ] Subtask 3.1: Test library.json created on macOS loads on Windows
  - [ ] Subtask 3.2: Test library.json created on Windows loads on Linux
  - [ ] Subtask 3.3: Verify JSON schema remains consistent across platforms
  - [ ] Subtask 3.4: Test timestamp parsing (ISO8601) works cross-platform
  - [ ] Subtask 3.5: Document manual library migration process

- [ ] Task 4: Ensure path safety and validation (AC: Path traversal prevention)
  - [ ] Subtask 4.1: Audit all PathBuf::join() calls in commands.rs
  - [ ] Subtask 4.2: Verify no user input is used in path construction
  - [ ] Subtask 4.3: Add path canonicalization where needed
  - [ ] Subtask 4.4: Test with edge cases (special chars, Unicode, long paths)
  - [ ] Subtask 4.5: Add security review checklist item

- [ ] Task 5: Add directory creation with proper permissions (AC: Silent init with permissions)
  - [ ] Subtask 5.1: Verify create_dir_all() handles existing directories gracefully
  - [ ] Subtask 5.2: Test Unix permissions (755) applied correctly
  - [ ] Subtask 5.3: Test Windows default permissions work correctly
  - [ ] Subtask 5.4: Handle permission denied errors with clear messages
  - [ ] Subtask 5.5: Document first-launch behavior in user docs

- [ ] Task 6: Write comprehensive E2E tests for all platforms (AC: All platforms validated)
  - [ ] Subtask 6.1: E2E test: macOS config path created correctly
  - [ ] Subtask 6.2: E2E test: Windows config path created correctly
  - [ ] Subtask 6.3: E2E test: Linux config path created correctly
  - [ ] Subtask 6.4: E2E test: Keyboard shortcuts work on each platform
  - [ ] Subtask 6.5: E2E test: Library migration between platforms
  - [ ] Subtask 6.6: Run tests on GitHub Actions matrix (macOS, Windows, Ubuntu)

- [ ] Task 7: Update documentation and developer guidance (AC: Clear migration docs)
  - [ ] Subtask 7.1: Document platform-specific paths in README.md
  - [ ] Subtask 7.2: Create user guide for library backup/migration
  - [ ] Subtask 7.3: Add troubleshooting section for path issues
  - [ ] Subtask 7.4: Update AGENTS.md with platform testing requirements

## Dev Notes

### Architecture Context

**Platform-Specific Configuration Requirements:**

This story ensures Prompt Alchemist follows platform conventions for config storage and keyboard shortcuts. The architecture document specifies:

> **FR31:** System stores library in `~/.config/prompt-alchemist/` on macOS/Linux  
> **FR32:** System stores library in `%LOCALAPPDATA%\prompt-alchemist\` on Windows  
> **FR30:** System maps Cmd shortcuts on macOS to Ctrl shortcuts on Windows/Linux automatically

**Key Architectural Decisions:**

1. **Config Directory Resolution:** Use `dirs` crate for cross-platform path detection
2. **Keyboard Mapping:** Detect OS and map Meta key (Cmd) to Control dynamically
3. **Data Portability:** JSON format ensures zero data loss when copying between platforms
4. **Path Safety:** Use PathBuf operations to prevent directory traversal attacks

**Integration Points:**

- Story 1.4 already implemented `get_config_dir()` in `src-tauri/src/commands.rs`
- This story AUDITS and VALIDATES that implementation across all platforms
- This story ADDS keyboard shortcut platform mapping in React frontend
- This story VERIFIES data portability through cross-platform E2E tests

### Technical Requirements from Architecture

**1. Platform-Specific Path Resolution (Already Implemented in Story 1.4):**

The `get_config_dir()` command from Story 1.4 uses the `dirs` crate to resolve platform-specific paths:

```rust
use dirs::config_dir;
use std::fs;
use std::path::PathBuf;
use tauri::command;

#[command]
pub fn get_config_dir() -> Result<String, String> {
    let config_dir = config_dir()
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

**THIS STORY'S TASK:** Verify this implementation works correctly on all platforms through E2E testing.

**Expected Platform Behavior:**

| Platform | Config Directory | Path Separator | Example |
|----------|------------------|----------------|---------|
| macOS | `~/.config/prompt-alchemist/` | `/` | `/Users/alice/.config/prompt-alchemist/` |
| Linux | `~/.config/prompt-alchemist/` | `/` | `/home/alice/.config/prompt-alchemist/` |
| Windows | `%LOCALAPPDATA%\prompt-alchemist\` | `\` | `C:\Users\Alice\AppData\Local\prompt-alchemist\` |

**Why `dirs::config_dir()` Works:**

The `dirs` crate uses platform-specific APIs to resolve standard directories:
- **macOS/Linux:** Checks `$XDG_CONFIG_HOME` env var, falls back to `~/.config/`
- **Windows:** Uses Windows API `SHGetFolderPathW(CSIDL_LOCAL_APPDATA)` to get `%LOCALAPPDATA%`

This ensures compliance with platform conventions (XDG Base Directory spec on Unix, Windows Known Folders).

**2. Keyboard Shortcut Platform Mapping (NEW IN THIS STORY):**

**Problem:** macOS uses Cmd (Meta key) for shortcuts, while Windows/Linux use Ctrl.

**Solution:** Create React hook to detect platform and map keyboard events correctly.

**Implementation: `src/lib/usePlatformShortcut.ts`**

```typescript
import { useEffect, useMemo } from 'react';
import { platform } from '@tauri-apps/plugin-os';

/**
 * Platform-specific modifier key for keyboard shortcuts
 */
export type ModifierKey = 'Meta' | 'Control';

/**
 * Detected platform
 */
export type Platform = 'macos' | 'windows' | 'linux';

/**
 * Hook to detect platform and return correct modifier key
 * 
 * @returns Object with platform info and modifier key
 * 
 * @example
 * const { modifierKey, isMac } = usePlatformShortcut();
 * 
 * // In keyboard event handler
 * if (event.key === 'k' && event[`${modifierKey.toLowerCase()}Key`]) {
 *   handleSearch();
 * }
 */
export function usePlatformShortcut() {
  const detectedPlatform = useMemo<Platform>(() => {
    // Use Tauri OS detection for accuracy
    const p = platform();
    if (p === 'macos') return 'macos';
    if (p === 'windows') return 'windows';
    return 'linux';
  }, []);

  const modifierKey = useMemo<ModifierKey>(() => {
    return detectedPlatform === 'macos' ? 'Meta' : 'Control';
  }, [detectedPlatform]);

  const modifierSymbol = useMemo(() => {
    return detectedPlatform === 'macos' ? '⌘' : 'Ctrl';
  }, [detectedPlatform]);

  return {
    platform: detectedPlatform,
    modifierKey,
    modifierSymbol,
    isMac: detectedPlatform === 'macos',
    isWindows: detectedPlatform === 'windows',
    isLinux: detectedPlatform === 'linux',
  };
}

/**
 * Utility to check if keyboard event matches platform-specific shortcut
 * 
 * @param event - Keyboard event
 * @param key - Key to match (e.g., 'k', 'c', 's')
 * @param modifierKey - Modifier key from usePlatformShortcut
 * @returns True if shortcut matches
 * 
 * @example
 * const { modifierKey } = usePlatformShortcut();
 * 
 * function handleKeyDown(event: KeyboardEvent) {
 *   if (isShortcut(event, 'k', modifierKey)) {
 *     event.preventDefault();
 *     openSearch();
 *   }
 * }
 */
export function isShortcut(
  event: KeyboardEvent | React.KeyboardEvent,
  key: string,
  modifierKey: ModifierKey
): boolean {
  const matchesKey = event.key.toLowerCase() === key.toLowerCase();
  const modifierPressed =
    modifierKey === 'Meta' ? event.metaKey : event.ctrlKey;
  
  return matchesKey && modifierPressed && !event.shiftKey && !event.altKey;
}
```

**3. Updating Existing Keyboard Shortcuts (Integration with Future Stories):**

**IMPORTANT:** Story 1.5 CREATES the platform shortcut hook, but doesn't implement keyboard shortcuts (that's Epic 6).

However, we MUST document how future stories should use this hook:

**Example Usage in Future Search Component (Epic 4):**

```typescript
import { usePlatformShortcut, isShortcut } from '@/lib/usePlatformShortcut';

function SearchDialog() {
  const { modifierKey, modifierSymbol } = usePlatformShortcut();

  useEffect(() => {
    function handleGlobalKeyDown(event: KeyboardEvent) {
      // Open search with Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if (isShortcut(event, 'k', modifierKey)) {
        event.preventDefault();
        openSearch();
      }
    }

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [modifierKey]);

  return (
    <Dialog>
      <DialogTitle>
        Search Snippets
        <span className="text-sm text-subtext0 ml-2">
          ({modifierSymbol}+K)
        </span>
      </DialogTitle>
      {/* Rest of dialog */}
    </Dialog>
  );
}
```

**4. Library Portability Verification:**

**JSON Schema Consistency (Already Implemented in Story 1.4):**

The `Library` struct uses serde with `rename_all = "camelCase"` to ensure consistent JSON format:

```rust
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Library {
    pub version: String,
    pub metadata: LibraryMetadata,
    pub snippets: Vec<Snippet>,
}
```

**THIS STORY'S TASK:** Verify that JSON files created on one platform load correctly on other platforms.

**Cross-Platform Compatibility Checklist:**

| Aspect | macOS | Windows | Linux | Notes |
|--------|-------|---------|-------|-------|
| JSON format | ✅ | ✅ | ✅ | serde camelCase consistent |
| Path separators | `/` | `\` | `/` | PathBuf handles transparently |
| Line endings | `\n` (LF) | `\r\n` (CRLF) | `\n` (LF) | serde handles both |
| Timestamps | ISO8601 | ISO8601 | ISO8601 | chrono::DateTime<Utc> |
| File permissions | 644 | Default | 644 | fs::write() handles |

**Testing Library Migration:**

```bash
# Test: Create library on macOS, copy to Windows

# 1. On macOS, create test library
npm run tauri:dev
# (Create some snippets in UI)
# Exit app

# 2. Find library file
ls -la ~/.config/prompt-alchemist/library.json

# 3. Copy to Windows machine (via USB, network, etc.)
# Windows destination: C:\Users\<Username>\AppData\Local\prompt-alchemist\

# 4. Launch app on Windows
npm run tauri:dev

# 5. Verify: All snippets appear in UI, no errors
```

**5. Path Safety and Security:**

**Security Principles:**

1. **No User Input in Paths:** All paths constructed by app, never from user-supplied strings
2. **PathBuf Operations:** Use `PathBuf::join()`, never string concatenation
3. **Canonicalization:** Resolve symlinks and normalize paths where needed
4. **Limited Scope:** Only access config directory, no arbitrary file system access

**Audit Checklist for commands.rs:**

```rust
// ✅ SAFE: Uses dirs crate for standard location
let config_dir = dirs::config_dir()
    .ok_or("Failed to determine config directory")?
    .join("prompt-alchemist");

// ✅ SAFE: PathBuf::join() handles path separators correctly
let library_path = config_dir.join("library.json");
let temp_path = config_dir.join(".library.json.tmp");

// ✅ SAFE: No user input involved
// All paths constructed by app logic

// ❌ UNSAFE EXAMPLE (Not in our code, but what to avoid):
// let user_path = get_user_input(); // Never do this!
// let library_path = PathBuf::from(user_path).join("library.json");
```

**Windows-Specific Path Considerations:**

```rust
// Windows path quirks handled by PathBuf:
// - Backslashes vs forward slashes: PathBuf::join() uses correct separator
// - UNC paths (\\server\share): dirs::config_dir() returns local path only
// - Drive letters (C:\): Handled transparently
// - Long path prefix (\\?\): Not needed for %LOCALAPPDATA% (max path < 260 chars)
```

**6. Directory Creation with Permissions:**

**Unix Permissions (macOS, Linux):**

```rust
// fs::create_dir_all() creates with default permissions (755 on Unix)
fs::create_dir_all(&config_dir)
    .map_err(|e| format!("Failed to create config directory: {}", e))?;

// Breakdown:
// 755 = rwxr-xr-x
// - Owner (user): read, write, execute
// - Group: read, execute
// - Others: read, execute
```

**Why 755 for Directories:**
- **Owner:** Full control (read, write, traverse)
- **Others:** Read-only access (can list files, but not modify)
- **Standard:** Matches ~/.config/ parent directory permissions

**Windows Permissions:**

Windows uses ACLs (Access Control Lists), not Unix permissions. `fs::create_dir_all()` creates directories with default user permissions (owner has full control, others have no access).

**Handling Permission Errors:**

```rust
// If permission denied, return clear error message
fs::create_dir_all(&config_dir).map_err(|e| {
    if e.kind() == std::io::ErrorKind::PermissionDenied {
        format!(
            "Permission denied creating config directory at {:?}. \
             Check folder permissions or run as administrator.",
            config_dir
        )
    } else {
        format!("Failed to create config directory: {}", e)
    }
})?;
```

### Library and Framework Requirements

**Existing Dependencies (No New Ones Needed):**

```toml
# src-tauri/Cargo.toml (Already added in Story 1.4)
[dependencies]
tauri = { version = "2.1", features = [] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
dirs = "5.0"  # For cross-platform config directory resolution
chrono = { version = "0.4", features = ["serde"] }
```

**Frontend Dependencies (Already in Project):**

```json
// package.json
{
  "dependencies": {
    "@tauri-apps/api": "^2.0.0",
    "@tauri-apps/plugin-os": "^2.0.0"  // For platform detection
  }
}
```

**Tauri Capabilities (Already Configured in Story 1.4):**

```json
// src-tauri/capabilities/default.json
{
  "identifier": "default",
  "description": "Capability for the main window",
  "windows": ["main"],
  "permissions": [
    "core:default",
    "fs:allow-config-read-recursive",
    "fs:allow-config-write-recursive",
    "os:default"  // Needed for platform detection
  ]
}
```

### File Structure Requirements from Architecture

**New Files to Create:**

```
src/lib/
└── usePlatformShortcut.ts     # React hook for platform detection and shortcuts
```

**New Test Files:**

```
src/lib/
└── usePlatformShortcut.test.ts  # Unit tests for platform hook

tests/e2e/
└── platform-config.spec.ts       # E2E tests for cross-platform paths
```

**Files to Audit (From Story 1.4):**

```
src-tauri/src/commands.rs       # Verify get_config_dir() implementation
src-tauri/src/lib.rs            # Ensure commands registered correctly
```

**Files to Update (Documentation):**

```
README.md                       # Document platform-specific paths
docs/3-development-guide.md     # Add cross-platform testing section
AGENTS.md                       # Document platform testing requirements
```

### Testing Requirements

**1. Unit Tests for Platform Hook (`src/lib/usePlatformShortcut.test.ts`):**

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePlatformShortcut, isShortcut } from './usePlatformShortcut';
import * as tauriOs from '@tauri-apps/plugin-os';

// Mock Tauri OS plugin
vi.mock('@tauri-apps/plugin-os', () => ({
  platform: vi.fn(),
}));

describe('usePlatformShortcut', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return Meta modifier key on macOS', () => {
    vi.mocked(tauriOs.platform).mockReturnValue('macos');

    const { result } = renderHook(() => usePlatformShortcut());

    expect(result.current.platform).toBe('macos');
    expect(result.current.modifierKey).toBe('Meta');
    expect(result.current.modifierSymbol).toBe('⌘');
    expect(result.current.isMac).toBe(true);
    expect(result.current.isWindows).toBe(false);
  });

  it('should return Control modifier key on Windows', () => {
    vi.mocked(tauriOs.platform).mockReturnValue('windows');

    const { result } = renderHook(() => usePlatformShortcut());

    expect(result.current.platform).toBe('windows');
    expect(result.current.modifierKey).toBe('Control');
    expect(result.current.modifierSymbol).toBe('Ctrl');
    expect(result.current.isWindows).toBe(true);
    expect(result.current.isMac).toBe(false);
  });

  it('should return Control modifier key on Linux', () => {
    vi.mocked(tauriOs.platform).mockReturnValue('linux');

    const { result } = renderHook(() => usePlatformShortcut());

    expect(result.current.platform).toBe('linux');
    expect(result.current.modifierKey).toBe('Control');
    expect(result.current.isLinux).toBe(true);
  });
});

describe('isShortcut', () => {
  it('should match Cmd+K on Mac', () => {
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      metaKey: true,
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
    });

    expect(isShortcut(event, 'k', 'Meta')).toBe(true);
  });

  it('should match Ctrl+K on Windows/Linux', () => {
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      metaKey: false,
      ctrlKey: true,
      shiftKey: false,
      altKey: false,
    });

    expect(isShortcut(event, 'k', 'Control')).toBe(true);
  });

  it('should not match if Shift is pressed', () => {
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      metaKey: true,
      shiftKey: true,
    });

    expect(isShortcut(event, 'k', 'Meta')).toBe(false);
  });

  it('should be case-insensitive', () => {
    const event = new KeyboardEvent('keydown', {
      key: 'K', // Uppercase
      metaKey: true,
    });

    expect(isShortcut(event, 'k', 'Meta')).toBe(true);
  });
});
```

**2. Rust Unit Tests for Path Resolution (Add to `src-tauri/src/commands.rs`):**

```rust
#[cfg(test)]
mod tests {
    use super::*;
    use std::path::Path;

    #[test]
    fn test_config_dir_returns_valid_path() {
        let config_dir = get_config_dir();
        assert!(config_dir.is_ok(), "get_config_dir() should succeed");
        
        let path_str = config_dir.unwrap();
        assert!(path_str.contains("prompt-alchemist"), "Path should contain app name");
        
        let path = Path::new(&path_str);
        assert!(path.exists(), "Config directory should be created");
        assert!(path.is_dir(), "Config directory should be a directory");
    }

    #[test]
    fn test_config_dir_is_platform_appropriate() {
        let config_dir = get_config_dir().unwrap();
        
        // Check platform-specific path conventions
        #[cfg(target_os = "macos")]
        assert!(config_dir.contains(".config"), "macOS should use .config");
        
        #[cfg(target_os = "linux")]
        assert!(config_dir.contains(".config"), "Linux should use .config");
        
        #[cfg(target_os = "windows")]
        assert!(config_dir.contains("AppData\\Local"), "Windows should use AppData\\Local");
    }

    #[test]
    fn test_config_dir_creates_nested_directory() {
        let config_dir = get_config_dir().unwrap();
        let path = Path::new(&config_dir);
        
        // Verify parent directory also exists (dirs crate should handle this)
        let parent = path.parent().unwrap();
        assert!(parent.exists(), "Parent directory should exist");
    }

    #[test]
    fn test_path_uses_correct_separators() {
        let config_dir = get_config_dir().unwrap();
        
        #[cfg(windows)]
        assert!(config_dir.contains('\\'), "Windows should use backslashes");
        
        #[cfg(unix)]
        assert!(config_dir.contains('/'), "Unix should use forward slashes");
    }
}
```

**3. E2E Tests for Cross-Platform Behavior (`tests/e2e/platform-config.spec.ts`):**

```typescript
import { test, expect } from '@playwright/test';
import { platform } from 'os';
import { existsSync } from 'fs';
import { join } from 'path';

test.describe('Platform-Specific Configuration', () => {
  test('should create config directory in platform-appropriate location', async ({ page }) => {
    await page.goto('/');
    
    // Trigger config directory creation (happens on app launch)
    await page.waitForTimeout(1000);
    
    // Verify config directory exists
    const configPath = getExpectedConfigPath();
    expect(existsSync(configPath)).toBe(true);
  });

  test('should display correct keyboard shortcut symbols', async ({ page }) => {
    await page.goto('/');
    
    // Future: When search dialog is implemented, verify shortcut display
    // For now, just verify app launches without errors
    const title = await page.title();
    expect(title).toBeTruthy();
  });

  test('should handle library migration from another platform', async ({ page }) => {
    // This test requires manual setup:
    // 1. Create library on Platform A
    // 2. Copy library.json to Platform B config directory
    // 3. Launch app on Platform B
    // 4. Verify library loads successfully

    // Mark as skipped in CI, requires manual cross-platform testing
    test.skip(process.env.CI === 'true', 'Manual cross-platform test');
    
    await page.goto('/');
    
    // Future: Verify snippets appear after migration
    // For now, verify no errors on launch
    const errors = await page.evaluate(() => {
      return (window as any).errors || [];
    });
    expect(errors).toHaveLength(0);
  });
});

function getExpectedConfigPath(): string {
  const p = platform();
  
  if (p === 'darwin') {
    return join(process.env.HOME!, '.config', 'prompt-alchemist');
  } else if (p === 'win32') {
    return join(process.env.LOCALAPPDATA!, 'prompt-alchemist');
  } else {
    return join(process.env.HOME!, '.config', 'prompt-alchemist');
  }
}
```

**4. Manual Cross-Platform Testing Checklist:**

Since automated cross-platform E2E testing requires CI matrix setup, manual testing is critical:

**Manual Test 1: Config Directory Creation**

| Platform | Expected Path | Verification Command | Expected Result |
|----------|---------------|----------------------|-----------------|
| macOS | `~/.config/prompt-alchemist/` | `ls -la ~/.config/prompt-alchemist/` | Directory exists, 755 permissions |
| Windows | `%LOCALAPPDATA%\prompt-alchemist\` | `dir %LOCALAPPDATA%\prompt-alchemist` | Directory exists |
| Linux | `~/.config/prompt-alchemist/` | `ls -la ~/.config/prompt-alchemist/` | Directory exists, 755 permissions |

**Manual Test 2: Library Migration**

```bash
# Step 1: Create library on macOS
# (Launch app, create 3 test snippets, close app)

# Step 2: Copy library to USB drive
cp ~/.config/prompt-alchemist/library.json /Volumes/USB/test-library.json

# Step 3: On Windows machine, copy to config directory
# (Create prompt-alchemist directory if it doesn't exist)
mkdir %LOCALAPPDATA%\prompt-alchemist
copy E:\test-library.json %LOCALAPPDATA%\prompt-alchemist\library.json

# Step 4: Launch app on Windows
npm run tauri:dev

# Step 5: Verify snippets appear
# - Check library panel shows 3 snippets
# - Edit one snippet, verify save works
# - Create new snippet, verify it's added to library.json
```

**Manual Test 3: Keyboard Shortcuts**

| Platform | Test Action | Expected Behavior |
|----------|-------------|-------------------|
| macOS | Press Cmd+K | (Future: Search opens) |
| macOS | Press Ctrl+K | (Nothing happens, Cmd required) |
| Windows | Press Ctrl+K | (Future: Search opens) |
| Windows | Press Win+K | (Nothing happens, Ctrl required) |
| Linux | Press Ctrl+K | (Future: Search opens) |

### Accessibility Requirements (WCAG 2.1 AA)

**No Direct Accessibility Impact:**

This story focuses on backend file system operations and platform detection, which don't directly affect UI accessibility.

**Indirect Benefits:**

1. **Platform Conventions:** Following OS-standard config locations makes the app more predictable for users relying on assistive technology.

2. **Keyboard Shortcuts:** Correct Cmd/Ctrl mapping ensures keyboard-only navigation works as expected for users with motor impairments.

3. **Data Portability:** Easy library migration benefits users who use multiple machines or assistive technology configurations.

**Future Accessibility Considerations:**

- When implementing keyboard shortcuts (Epic 6), ensure they don't conflict with screen reader shortcuts
- Document shortcut mappings for keyboard-only users
- Ensure keyboard shortcuts are discoverable (tooltips, help text)

### Previous Story Intelligence

**Learnings from Story 1.4 (Tauri IPC Commands):**

Story 1.4 implemented `get_config_dir()` command that uses `dirs::config_dir()` for platform-specific paths:

```rust
#[command]
pub fn get_config_dir() -> Result<String, String> {
    let config_dir = dirs::config_dir()
        .ok_or("Failed to determine config directory")?
        .join("prompt-alchemist");
    
    fs::create_dir_all(&config_dir)
        .map_err(|e| format!("Failed to create config directory: {}", e))?;
    
    config_dir
        .to_str()
        .ok_or("Invalid UTF-8 in config path")
        .map(|s| s.to_string())
}
```

**INTEGRATION POINTS FOR STORY 1.5:**

1. **Audit Implementation:**
   - ✅ Verify `dirs::config_dir()` usage is correct
   - ✅ Confirm `create_dir_all()` handles permissions properly
   - ✅ Test across all three platforms (macOS, Windows, Linux)

2. **Add Platform-Specific Tests:**
   - ❌ Story 1.4 did not include platform-specific E2E tests
   - ❌ Story 1.4 did not test library migration between platforms
   - ✅ **THIS STORY** adds comprehensive cross-platform validation

3. **Document Platform Behavior:**
   - ❌ Story 1.4 did not document expected paths per platform
   - ✅ **THIS STORY** adds documentation for users and developers

**Files Already Created by Story 1.4:**

```
src-tauri/src/commands.rs       # Contains get_config_dir() implementation
src-tauri/src/models.rs         # Contains Library struct with serde
src/lib/tauri-commands.ts       # Contains TypeScript bindings
src-tauri/Cargo.toml            # Contains dirs dependency
```

**NO MODIFICATIONS NEEDED** to existing files if Story 1.4 was implemented correctly. This story VALIDATES and TESTS that implementation.

### Git Intelligence Summary

**Recent Commits (Last 5):**

1. **7662be0** - Merge PR #4: test design, implementation readiness check, sprint status
2. **2ad96b2** - Finalize design: test strategy, implementation readiness check, generate sprint status
3. **4fec2ac** - Upgrade BMAD to v6 alpha.22
4. **1d5517d** - Merge PR #3: architecture specs
5. **8c880c7** - Generate architecture document, create epics and stories

**Project Patterns Established:**

1. **Tauri Command Pattern:**
   ```rust
   #[command]
   pub fn command_name() -> Result<T, String> {
       // Implementation
   }
   ```
   Continue using this pattern for any new commands.

2. **Error Handling Pattern:**
   ```rust
   .map_err(|e| format!("Operation failed: {}", e))?
   ```
   Descriptive error messages with context.

3. **TypeScript Wrapper Pattern:**
   ```typescript
   export async function commandName(): Promise<T> {
     try {
       return await invoke<T>('command_name');
     } catch (error) {
       throw new Error(`Command failed: ${error}`);
     }
   }
   ```

4. **Testing Pattern:**
   - Unit tests colocated with source files
   - E2E tests in `tests/` directory with page objects
   - Run `npm run test:unit` and `npm run test:e2e`

**Code Style from Existing Files:**

```rust
// Rust: Use snake_case for functions, PascalCase for structs
pub fn get_config_dir() -> Result<String, String>
pub struct Library { /* ... */ }

// TypeScript: Use camelCase for functions, PascalCase for interfaces
export async function getConfigDir(): Promise<string>
export interface Library { /* ... */ }
```

### Latest Technical Information

**Platform Detection APIs (Tauri v2.1+):**

**Recommended: Use `@tauri-apps/plugin-os`:**

```typescript
import { platform } from '@tauri-apps/plugin-os';

// Returns: 'macos' | 'windows' | 'linux' | 'ios' | 'android'
const p = platform();
```

**Why `@tauri-apps/plugin-os` vs `navigator.platform`:**

| Aspect | @tauri-apps/plugin-os | navigator.platform |
|--------|----------------------|-------------------|
| Accuracy | ✅ Accurate (native OS detection) | ⚠️ Deprecated, inaccurate |
| Type Safety | ✅ Typed return values | ❌ String, no types |
| Consistency | ✅ Works in Tauri apps | ⚠️ Browser API, may differ in Tauri |
| Recommendation | ✅ **ALWAYS USE THIS** | ❌ Avoid |

**Path Resolution Best Practices (dirs v5.0):**

The `dirs` crate follows XDG Base Directory specification on Unix and Windows Known Folders API:

```rust
use dirs::{config_dir, data_dir, cache_dir};

// Config directory (for settings, libraries)
let config = config_dir()  // ~/.config or %LOCALAPPDATA%
    .ok_or("Config dir not available")?;

// Data directory (for user-generated content)
let data = data_dir()      // ~/.local/share or %LOCALAPPDATA%
    .ok_or("Data dir not available")?;

// Cache directory (for temporary files)
let cache = cache_dir()    // ~/.cache or %LOCALAPPDATA%\Temp
    .ok_or("Cache dir not available")?;
```

**For Prompt Alchemist:**
- ✅ Use `config_dir()` for `library.json` (user configuration/data)
- ❌ Don't use `data_dir()` (not needed, config_dir is sufficient)
- ❌ Don't use `cache_dir()` (no temporary data in MVP)

**Keyboard Event Handling Best Practices:**

**Use `metaKey` for macOS Cmd, `ctrlKey` for Windows/Linux Ctrl:**

```typescript
function handleKeyDown(event: KeyboardEvent) {
  const { modifierKey } = usePlatformShortcut();
  
  // Check if modifier key is pressed
  const modifierPressed = modifierKey === 'Meta' 
    ? event.metaKey 
    : event.ctrlKey;
  
  if (event.key === 'k' && modifierPressed) {
    event.preventDefault();
    openSearch();
  }
}
```

**Common Pitfalls:**

1. **❌ Don't check both metaKey AND ctrlKey:**
   ```typescript
   // BAD: Doesn't work on Mac (Cmd is Meta, not Ctrl)
   if (event.key === 'k' && event.ctrlKey) { /* ... */ }
   ```

2. **❌ Don't use deprecated `navigator.platform`:**
   ```typescript
   // BAD: Deprecated, unreliable
   const isMac = navigator.platform.includes('Mac');
   ```

3. **✅ DO use platform-specific detection:**
   ```typescript
   // GOOD: Use Tauri OS plugin
   const { isMac } = usePlatformShortcut();
   ```

**Cross-Platform Path Testing:**

**Windows Path Quirks:**

```rust
// Windows uses backslashes, PathBuf handles automatically
let path = config_dir.join("prompt-alchemist").join("library.json");
// Result on Windows: C:\Users\Alice\AppData\Local\prompt-alchemist\library.json
// Result on Unix: /home/alice/.config/prompt-alchemist/library.json
```

**Unicode Path Support:**

```rust
// PathBuf handles Unicode correctly on all platforms
let config_dir = dirs::config_dir()
    .ok_or("Config dir not available")?
    .join("prompt-alchemist");

// Works with Unicode characters:
// ✅ /Users/José/.config/prompt-alchemist/
// ✅ C:\Users\김철수\AppData\Local\prompt-alchemist\
// ✅ /home/user_名前/.config/prompt-alchemist/
```

**Testing on Different Platforms:**

```bash
# Local testing (your platform only)
npm run test:unit
npm run test:e2e

# GitHub Actions matrix testing (all platforms)
# Add to .github/workflows/test.yml:

jobs:
  test:
    strategy:
      matrix:
        os: [macos-latest, windows-latest, ubuntu-latest]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '24'
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:e2e
```

### Cross-Cutting Concerns

**Error Handling:**

**Platform-Specific Error Messages:**

```rust
fs::create_dir_all(&config_dir).map_err(|e| {
    match e.kind() {
        std::io::ErrorKind::PermissionDenied => {
            #[cfg(windows)]
            return format!(
                "Permission denied creating config directory. \
                 Try running as administrator or check folder permissions."
            );
            
            #[cfg(unix)]
            return format!(
                "Permission denied creating config directory. \
                 Check folder permissions: chmod 755 {:?}",
                config_dir
            );
        },
        _ => format!("Failed to create config directory: {}", e),
    }
})?;
```

**Performance Optimization:**

**Platform Detection Caching:**

```typescript
// usePlatformShortcut uses useMemo to avoid repeated platform detection
export function usePlatformShortcut() {
  const detectedPlatform = useMemo<Platform>(() => {
    return platform(); // Only called once per component mount
  }, []);
  
  // Derived values also memoized
  const modifierKey = useMemo<ModifierKey>(() => {
    return detectedPlatform === 'macos' ? 'Meta' : 'Control';
  }, [detectedPlatform]);
  
  return { detectedPlatform, modifierKey };
}
```

**Security Considerations:**

**Path Traversal Prevention:**

```rust
// ✅ SAFE: Use standard library path operations
let config_dir = dirs::config_dir()
    .ok_or("Config dir not available")?
    .join("prompt-alchemist");  // Append, don't concatenate strings

// ❌ UNSAFE: String concatenation (DON'T DO THIS)
let config_str = format!("{}/.config/prompt-alchemist", home_dir);
```

**Principle:** Never construct paths from user input. Always use `PathBuf::join()` for appending path segments.

**Future Extensibility:**

**Story 1.6 (Window State Persistence):**

Will use similar platform-specific path resolution for `settings.json`:

```rust
// Future: settings.json in same config directory
let settings_path = config_dir.join("settings.json");
```

**Epic 2 (Snippet Library Management):**

Library portability verified in this story ensures users can safely backup/migrate their snippet collections.

**Epic 6 (Keyboard-First Navigation):**

`usePlatformShortcut` hook created in this story will be heavily used for all keyboard shortcuts (Cmd+K, Cmd+C, Cmd+S, etc.).

### Code Anti-Patterns to Avoid

**❌ DON'T: Hardcode platform-specific paths**

```rust
// BAD: Assumes Unix, breaks on Windows
let config_dir = PathBuf::from("/home/user/.config/prompt-alchemist");
```

**✅ DO: Use dirs crate for platform detection**

```rust
// GOOD: Works on all platforms
let config_dir = dirs::config_dir()
    .ok_or("Config dir not available")?
    .join("prompt-alchemist");
```

**❌ DON'T: Use string concatenation for paths**

```rust
// BAD: Wrong separator on Windows
let path = home_dir + "/.config/prompt-alchemist/library.json";
```

**✅ DO: Use PathBuf::join()**

```rust
// GOOD: Correct separator on all platforms
let path = config_dir.join("prompt-alchemist").join("library.json");
```

**❌ DON'T: Check metaKey and ctrlKey separately**

```typescript
// BAD: Requires checking both keys separately
if (isMac && event.metaKey) { /* ... */ }
if (!isMac && event.ctrlKey) { /* ... */ }
```

**✅ DO: Use abstraction via usePlatformShortcut**

```typescript
// GOOD: Single check, platform-agnostic
const { modifierKey } = usePlatformShortcut();
if (isShortcut(event, 'k', modifierKey)) { /* ... */ }
```

### Developer Checklist

Before marking this story complete, verify:

**Platform Path Resolution:**
- [ ] `get_config_dir()` command tested on macOS (returns `~/.config/prompt-alchemist/`)
- [ ] `get_config_dir()` command tested on Windows (returns `%LOCALAPPDATA%\prompt-alchemist\`)
- [ ] `get_config_dir()` command tested on Linux (returns `~/.config/prompt-alchemist/`)
- [ ] Config directory created with correct permissions (755 on Unix)
- [ ] Parent directories created if they don't exist

**Keyboard Shortcut Platform Mapping:**
- [ ] `usePlatformShortcut.ts` hook created in `src/lib/`
- [ ] Platform detection uses `@tauri-apps/plugin-os`
- [ ] Hook returns correct modifier key (Meta on macOS, Control on Windows/Linux)
- [ ] `isShortcut()` utility function handles keyboard events correctly
- [ ] Unit tests pass for all platform detection scenarios

**Cross-Platform Library Portability:**
- [ ] Library created on macOS loads correctly on Windows
- [ ] Library created on Windows loads correctly on Linux
- [ ] Library created on Linux loads correctly on macOS
- [ ] JSON format remains consistent (camelCase fields, ISO8601 timestamps)
- [ ] No data loss when migrating libraries between platforms

**Path Safety and Security:**
- [ ] All path operations use `PathBuf::join()` (no string concatenation)
- [ ] No user input involved in path construction
- [ ] Path traversal vulnerabilities prevented
- [ ] Edge cases tested (Unicode characters, long paths, special characters)

**Testing:**
- [ ] Rust unit tests pass: `npm run test:rust`
- [ ] TypeScript unit tests pass: `npm run test:unit`
- [ ] E2E tests pass on local platform: `npm run test:e2e`
- [ ] Manual cross-platform tests completed (macOS, Windows, Linux)
- [ ] CI pipeline configured for matrix testing (if available)

**Documentation:**
- [ ] Platform-specific paths documented in README.md
- [ ] Library migration guide added to docs
- [ ] Troubleshooting section added for path issues
- [ ] AGENTS.md updated with platform testing requirements
- [ ] Code comments added to `usePlatformShortcut.ts` explaining usage

**Integration with Previous Stories:**
- [ ] Story 1.4's `get_config_dir()` audited and verified
- [ ] No regressions in file I/O operations
- [ ] Zustand stores still save/load correctly on all platforms

### Integration with Previous Stories

**Story 1.1 (Catppuccin Theme System) → Story 1.5:**
- **No Direct Integration:** Theme preferences don't involve file system paths yet
- **Future:** Story 1.6 will persist theme to `settings.json` using same platform paths

**Story 1.2 (Three-Panel Layout) → Story 1.5:**
- **No Direct Integration:** Panel layout stored in localStorage, not file system
- **Future:** Story 1.6 may migrate to `settings.json` for consistency

**Story 1.3 (Zustand State Management) → Story 1.5:**
- **No Direct Integration:** Zustand stores manage state, not platform detection
- **Future:** Epic 6 keyboard shortcuts will use `usePlatformShortcut` hook from this story

**Story 1.4 (Tauri IPC Commands) → Story 1.5:**
- **Direct Dependency:** This story validates Story 1.4's `get_config_dir()` implementation
- **Integration Point:** E2E tests verify file paths work correctly on all platforms
- **Verification:** Manual testing confirms library.json created in correct locations

**Combined Result After Story 1.5:**
✅ **Cross-Platform Verified:** Config paths work on macOS, Windows, Linux  
✅ **Keyboard Shortcuts Ready:** Platform hook created for future use  
✅ **Data Portability Confirmed:** Libraries migrate between platforms with zero data loss  
✅ **Foundation Solid:** Epic 1 infrastructure validated across all target platforms

## Dev Agent Record

### Agent Model Used

_To be filled by DEV agent_

### Debug Log References

_To be filled by DEV agent_

### Completion Notes List

_To be filled by DEV agent_

### File List

_To be filled by DEV agent_
