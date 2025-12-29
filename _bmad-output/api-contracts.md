# API Contracts - Tauri IPC Commands

**Generated:** 2025-12-21  
**Total Commands:** 1  
**IPC Layer:** Tauri v2  
**Type Safety:** TypeScript (frontend) + Rust (backend)

---

## Overview

This document describes the **Inter-Process Communication (IPC)** layer between the React frontend and Rust backend. Communication is handled via Tauri's `invoke()` API, which provides type-safe, asynchronous message passing.

**Architecture:**
- **Frontend:** TypeScript wrappers in `src/lib/tauri.ts`
- **Backend:** Rust command handlers in `src-tauri/src/lib.rs`
- **Type Safety:** Command names centralized to prevent typos
- **Error Handling:** Centralized logging and error propagation

---

## IPC Commands

### greet

Demonstration command that returns a greeting message.

#### Frontend API

**File:** `src/lib/tauri.ts`

```typescript
export async function greet(name: string): Promise<string>
```

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `name` | `string` | Yes | Name of the person to greet |

**Returns:** `Promise<string>` - Greeting message from Rust

**Example Usage:**
```typescript
import { greet } from '@/lib/tauri';

const message = await greet('Alice');
console.log(message);
// Output: "Hello, Alice! You've been greeted from Rust!"
```

**Error Handling:**
- Throws on IPC failure
- Logs error via `@/lib/logger`
- Error context includes: command name, arguments, source

#### Backend Implementation

**File:** `src-tauri/src/lib.rs`

```rust
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `name` | `&str` | Name to include in greeting |

**Returns:** `String` - Formatted greeting message

**Registration:**
```rust
.invoke_handler(tauri::generate_handler![greet])
```

---

## IPC Layer Architecture

### Frontend Wrapper (`src/lib/tauri.ts`)

**Purpose:** Centralized, type-safe command invocation with error handling

**Key Features:**

1. **Centralized Command Names:**
```typescript
export const commands = {
  greet: 'greet',
} as const;
```
- Prevents typos
- Enables IDE autocomplete
- Single source of truth

2. **Generic Invoke Wrapper:**
```typescript
async function invokeCmd<T>(
  cmd: CommandName, 
  args?: Record<string, unknown>
): Promise<T>
```
- Type-safe responses
- Automatic error logging
- Consistent error handling

3. **Typed Command Wrappers:**
```typescript
export async function greet(name: string): Promise<string> {
  return invokeCmd<string>(commands.greet, { name });
}
```
- Function-style API
- Parameter validation
- Return type safety

### Backend Handlers (`src-tauri/src/lib.rs`)

**Command Macro:** `#[tauri::command]`
- Automatically generates IPC bindings
- Handles serialization/deserialization
- Enables async functions (if needed)

**Handler Registration:**
```rust
.invoke_handler(tauri::generate_handler![greet])
```
- Registers all commands at startup
- Type-checked at compile time

---

## Error Handling

### Frontend Errors

**Error Flow:**
1. Command invocation fails
2. `invokeCmd()` catches error
3. Error logged via `logError()` with context:
   - `source: 'tauri-command'`
   - `cmd: string` (command name)
   - `args: Record<string, unknown>` (parameters)
4. Error re-thrown for caller handling

**Error Context Example:**
```typescript
{
  source: 'tauri-command',
  cmd: 'greet',
  args: { name: 'Alice' }
}
```

### Backend Errors

**Error Types:**
- **Rust panics** - Caught by Tauri, sent to frontend as error
- **Result<T, E>** - Can return custom error types
- **String errors** - Simple error messages

**Error Propagation:**
Backend errors are serialized and sent to frontend as rejected promises.

---

## Security

### Content Security Policy (CSP)

**Configured in:** `src-tauri/tauri.conf.json`

```
default-src 'self'; 
script-src 'self'; 
style-src 'self' 'unsafe-inline'; 
connect-src 'self'
```

- IPC commands only accessible from same-origin
- No external network access for commands (unless explicitly allowed)

### Capabilities

**File:** `src-tauri/capabilities/default.json`

Defines which Tauri APIs the frontend can access:
- **opener plugin** - Open URLs in default browser
- **log plugin** - Write logs to file system

**IPC Security:**
- Commands must be explicitly registered
- No dynamic command invocation
- Type safety prevents injection attacks

---

## Tauri Plugins

### Installed Plugins

#### tauri-plugin-log
**Version:** 2.x  
**Purpose:** Logging to file system and console

**Configuration:**
```rust
tauri_plugin_log::Builder::new()
    .targets([
        Target::new(TargetKind::Stdout),      // Console output
        Target::new(TargetKind::LogDir { file_name: None }),  // Log files
        Target::new(TargetKind::Webview),     // Browser console
    ])
    .build()
```

**Log Location:**
- **macOS:** `~/Library/Logs/com.code-chimp.prompt-alchemist/`
- **Windows:** `C:\Users\<user>\AppData\Local\com.code-chimp.prompt-alchemist\logs\`
- **Linux:** `~/.local/share/com.code-chimp.prompt-alchemist/logs/`

#### tauri-plugin-opener
**Version:** 2.x  
**Purpose:** Open URLs in default browser

**Usage (from frontend):**
```typescript
import { open } from '@tauri-apps/plugin-opener';

await open('https://example.com');
```

**Security:** Respects CSP, requires user interaction for external links

---

## Command Patterns

### Synchronous Commands

Current pattern (e.g., `greet`):
- Returns value immediately
- No async operations
- Simple request/response

```rust
#[tauri::command]
fn simple_command(input: String) -> String {
    // Synchronous processing
    format!("Result: {}", input)
}
```

### Asynchronous Commands (Future)

For async operations (file I/O, network, etc.):

```rust
#[tauri::command]
async fn async_command(input: String) -> Result<String, String> {
    // Async processing
    let result = some_async_operation(input).await?;
    Ok(result)
}
```

### State Management (Future)

For shared state between commands:

```rust
struct AppState {
    data: Mutex<HashMap<String, String>>,
}

#[tauri::command]
fn stateful_command(
    state: tauri::State<AppState>,
    key: String
) -> Option<String> {
    let data = state.data.lock().unwrap();
    data.get(&key).cloned()
}
```

---

## Testing

### Frontend Testing

**Test File:** `src/lib/tauri.test.ts`

**Mock Strategy:**
```typescript
import { vi } from 'vitest';

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(),
}));
```

**Test Coverage:**
- Command wrapper functions
- Error handling
- Type safety

### Backend Testing

**Test Location:** `src-tauri/src/lib.rs`

**Rust Tests:**
```bash
npm run test:rust
# or
cargo test --manifest-path src-tauri/Cargo.toml
```

**Test Pattern:**
```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_greet() {
        let result = greet("Test");
        assert!(result.contains("Test"));
    }
}
```

---

## Adding New Commands

### Step-by-Step

1. **Define Rust Handler** (`src-tauri/src/lib.rs`):
```rust
#[tauri::command]
fn new_command(param: String) -> String {
    // Implementation
    format!("Result: {}", param)
}
```

2. **Register Handler** (`src-tauri/src/lib.rs`):
```rust
.invoke_handler(tauri::generate_handler![
    greet,
    new_command  // Add here
])
```

3. **Add Command Name** (`src/lib/tauri.ts`):
```typescript
export const commands = {
  greet: 'greet',
  newCommand: 'new_command',  // Add here
} as const;
```

4. **Create TypeScript Wrapper** (`src/lib/tauri.ts`):
```typescript
export async function newCommand(param: string): Promise<string> {
  return invokeCmd<string>(commands.newCommand, { param });
}
```

5. **Test Both Sides:**
- Rust unit tests
- TypeScript unit tests with mocks
- Integration test in E2E suite

---

## Future API Surface

Based on Prompt Alchemist's feature roadmap, potential future commands:

### File System Operations
- `save_persona(data: Persona) -> Result<(), Error>`
- `load_persona(id: string) -> Result<Persona, Error>`
- `list_personas() -> Result<Vec<PersonaMetadata>, Error>`
- `delete_persona(id: string) -> Result<(), Error>`

### Export/Import
- `export_library(path: string) -> Result<(), Error>`
- `import_library(path: string) -> Result<Library, Error>`

### Search/Query
- `search_components(query: string) -> Result<Vec<Component>, Error>`
- `get_tags() -> Result<Vec<Tag>, Error>`

### Settings
- `get_settings() -> Result<Settings, Error>`
- `update_settings(settings: Settings) -> Result<(), Error>`

---

## Performance Considerations

### IPC Overhead

- **Latency:** ~1-5ms per command (local, in-process)
- **Serialization:** Automatic via Serde (Rust) + JSON
- **Best Practices:**
  - Batch operations when possible
  - Avoid chatty IPC (many small calls)
  - Use events for streaming data

### Large Data Transfers

For large payloads:
- Consider chunking
- Use Tauri events for streaming
- Store in shared memory (advanced)

---

## Resources

- **Tauri IPC Guide:** https://v2.tauri.app/develop/calling-rust/
- **Tauri Commands:** https://v2.tauri.app/reference/javascript/api/core/#invoke
- **Frontend Wrapper:** `src/lib/tauri.ts`
- **Backend Handlers:** `src-tauri/src/lib.rs`
- **Capabilities:** `src-tauri/capabilities/default.json`

---

## Command Summary

| Command | Purpose | Parameters | Returns | Status |
|---------|---------|------------|---------|--------|
| `greet` | Demo greeting | `name: string` | `string` | ✅ Implemented |

**Total Commands:** 1 (demonstration only)

**Production Commands:** None yet - this is a starter template ready for feature implementation.

---

_This API contract documentation was generated by analyzing the Tauri IPC layer implementation._
