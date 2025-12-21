# Development Guide

This guide covers common development patterns, best practices, and conventions used in this project.

## Code Style & Conventions

### TypeScript Conventions

#### Naming Conventions

```typescript
// PascalCase for components, types, interfaces
interface UserData { }
type Status = 'active' | 'inactive';
function MyComponent() { }

// camelCase for variables, functions
const userName = 'John';
function getUserData() { }

// UPPER_SNAKE_CASE for constants
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRIES = 3;
```

#### Type Annotations

Always prefer explicit types for function parameters and return types:

```typescript
// ✅ GOOD
function processData(input: string): number {
  return input.length;
}

// ❌ AVOID (implicit return type)
function processData(input: string) {
  return input.length;
}
```

#### Array Types

Use `Type[]` syntax instead of `Array<Type>`:

```typescript
// ✅ GOOD
const items: string[] = [];
const users: User[] = [];

// ❌ AVOID
const items: Array<string> = [];
```

### React Conventions

#### Component Structure

Organize components in this order:

```typescript
// 1. Imports
import { useState } from 'react';
import { Button } from '@/components/ui/button';

// 2. Types/Interfaces
interface MyComponentProps {
  title: string;
  onSubmit: (value: string) => void;
}

// 3. Component
export function MyComponent({ title, onSubmit }: MyComponentProps) {
  // 4. Hooks
  const [value, setValue] = useState('');

  // 5. Event handlers
  function handleSubmit() {
    onSubmit(value);
  }

  // 6. Render
  return (
    <div>
      <h1>{title}</h1>
      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  );
}
```

#### Props Destructuring

Always destructure props in the function signature:

```typescript
// ✅ GOOD
function Card({ title, children }: CardProps) {
  return <div>{title}{children}</div>;
}

// ❌ AVOID
function Card(props: CardProps) {
  return <div>{props.title}{props.children}</div>;
}
```

#### React Compiler Friendly Code

With React Compiler enabled, avoid manual memoization:

```typescript
// ✅ GOOD - Compiler handles optimization
function ExpensiveComponent({ data }: Props) {
  const processed = processData(data); // Auto-memoized by compiler
  return <div>{processed}</div>;
}

// ❌ AVOID - Manual memoization not needed
function ExpensiveComponent({ data }: Props) {
  const processed = useMemo(() => processData(data), [data]);
  return <div>{processed}</div>;
}
```

### Rust Conventions

#### Command Naming

Use snake_case for Rust functions, map to camelCase in TypeScript:

```rust
// Rust: snake_case
#[tauri::command]
fn get_user_data(user_id: i32) -> String {
    // ...
}
```

```typescript
// TypeScript: camelCase
export async function getUserData(userId: number): Promise<string> {
  return invokeCmd<string>(commands.getUserData, { userId });
}
```

#### Error Handling

Return `Result<T, E>` for operations that can fail:

```rust
#[tauri::command]
fn read_file(path: String) -> Result<String, String> {
    std::fs::read_to_string(path)
        .map_err(|e| e.to_string())
}
```

Handle errors in TypeScript:

```typescript
try {
  const content = await readFile(path);
  toast.success('File loaded');
} catch (error) {
  toast.error(`Failed to load file: ${error}`);
}
```

#### Rust Tooling & Quality
 
 Rust tooling is wired so you can run all checks from the project root using npm scripts:
 
 - `npm run fix:rust` formats Rust code in `src-tauri` using `cargo fmt`.
 - `npm run lint:rust:format` verifies Rust formatting without writing changes.
 - `npm run lint:rust:clippy` runs Clippy and treats any warning as an error.
 - `npm run rust:test` or `npm run test:rust` runs `cargo test` for the Tauri crate.
 - `npm run check:rust` runs the Rust formatting check and Clippy in sequence.
  
 ### Testing commands
 
 - `npm test` runs **frontend unit tests** via Vitest. This is the default fast feedback loop.
 - `npm run test:unit:watch` runs unit tests in watch mode during development.
 - `npm run test:e2e` runs **Playwright E2E tests** against the Vite dev server on `http://localhost:1420`.
 - `npm run test:rust` runs Rust tests for the `src-tauri` crate. This is optional and mainly relevant if you add custom Rust commands.
 
 E2E tests are intentionally kept separate from unit tests to keep `npm test` fast and focused on app logic. Rust tests are not part of the default test pipeline because most of the Rust code comes from the Tauri framework; enable them as needed for your own Rust additions.
 
 
 Pre-commit hooks use `lint-staged` to run the Rust formatting check on staged Rust files under `src-tauri/src/`, so commits will fail if Rust code is not formatted.
 
 See `docs/rust-tooling.md` for a deeper overview of the Rust project layout and tooling.
 
 #### Rust Quality Checklist


For any pull request that changes Rust code under `src-tauri`:
 
- [ ] `npm run lint:rust:format` passes (no formatting diffs).
- [ ] `npm run lint:rust:clippy` passes with zero warnings.
- [ ] `npm run rust:test` (or `npm run test:rust`) passes.
- [ ] New commands follow the naming and error-handling conventions above.
- [ ] New behavior is covered by tests (Rust and/or TypeScript, as appropriate).


## Common Patterns

### Pattern 1: Form Handling

```typescript
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface FormData {
  name: string;
  email: string;
}

export function MyForm() {
  const [data, setData] = useState<FormData>({ name: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // await submitForm(data);
      toast.success('Form submitted!');
    } catch (error) {
      toast.error(`Submission failed: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        value={data.name}
        onChange={(e) => setData({ ...data, name: e.target.value })}
        placeholder="Name"
      />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </Button>
    </form>
  );
}
```

### Pattern 2: Loading States

```typescript
import { useState, useEffect } from 'react';

export function DataLoader() {
  const [data, setData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const result = await fetchData();
        setData(result);
      } catch (err) {
        setError(String(err));
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data</div>;

  return <div>{data}</div>;
}
```

### Pattern 3: Tauri Event Listeners

For features that need backend → frontend communication:

```typescript
import { useEffect } from 'react';
import { listen } from '@tauri-apps/api/event';

export function EventListener() {
  useEffect(() => {
    const unlisten = listen<string>('my-event', (event) => {
      console.info('Received:', event.payload);
    });

    return () => {
      unlisten.then(fn => fn());
    };
  }, []);

  return <div>Listening for events...</div>;
}
```

```rust
// Emit from Rust
use tauri::Manager;

#[tauri::command]
fn trigger_event(app: tauri::AppHandle) {
    app.emit_all("my-event", "Hello from Rust!").unwrap();
}
```

### Pattern 4: Custom Hooks

Extract reusable logic into custom hooks:

```typescript
// hooks/useTauriCommand.ts
import { useState } from 'react';
import { toast } from 'sonner';

export function useTauriCommand<T, Args extends unknown[]>(
  command: (...args: Args) => Promise<T>
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function execute(...args: Args): Promise<T | null> {
    setIsLoading(true);
    setError(null);

    try {
      const result = await command(...args);
      return result;
    } catch (err) {
      const message = String(err);
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  return { execute, isLoading, error };
}

// Usage
import { greet } from '@/lib/tauri';

function MyComponent() {
  const { execute, isLoading } = useTauriCommand(greet);

  async function handleGreet() {
    const result = await execute('World');
    if (result) {
      toast.success(result);
    }
  }

  return <button onClick={handleGreet} disabled={isLoading}>Greet</button>;
}
```

## Styling Patterns

### Tailwind Best Practices

#### Use `cn()` for Conditional Classes

```typescript
import { cn } from '@/lib/utils';

function Button({ variant, className }: ButtonProps) {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded',
        variant === 'primary' && 'bg-blue-500 text-white',
        variant === 'secondary' && 'bg-gray-200 text-gray-800',
        className
      )}
    >
      Click me
    </button>
  );
}
```

#### Component Variants with CVA

```typescript
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-red-500 text-white hover:bg-red-600',
        outline: 'border border-input bg-background hover:bg-accent',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface ButtonProps extends VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
}

function Button({ variant, size, children }: ButtonProps) {
  return <button className={buttonVariants({ variant, size })}>{children}</button>;
}
```

### Dark Mode Support

```typescript
import { useTheme } from 'next-themes';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle Theme
    </button>
  );
}
```

```tsx
// Use dark: prefix for dark mode styles
<div className="bg-white dark:bg-zinc-800 text-black dark:text-white">
  Content
</div>
```

## Testing Patterns

### Unit Testing Components

```typescript
// MyComponent.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders with title', () => {
    render(<MyComponent title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('calls onSubmit when button clicked', async () => {
    const onSubmit = vi.fn();
    render(<MyComponent onSubmit={onSubmit} />);

    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(onSubmit).toHaveBeenCalledOnce();
  });
});
```

### Mocking Tauri Commands

```typescript
import { vi } from 'vitest';

// Mock the entire module
vi.mock('@/lib/tauri', () => ({
  greet: vi.fn().mockResolvedValue('Hello, Test!'),
}));

// Or mock invoke directly
vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn().mockResolvedValue('mocked result'),
}));
```

## Performance Optimization

### Code Splitting (Dynamic Imports)

```typescript
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### Debouncing User Input

```typescript
import { useState, useEffect } from 'react';

function SearchInput() {
  const [value, setValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, 300);

    return () => clearTimeout(timer);
  }, [value]);

  useEffect(() => {
    if (debouncedValue) {
      // Perform search with debouncedValue
    }
  }, [debouncedValue]);

  return <input value={value} onChange={(e) => setValue(e.target.value)} />;
}
```

## Error Handling

### Global Error Boundary

The app uses a global error boundary to prevent white screens from unexpected React errors.

- Implementation: `src/components/AppErrorBoundary.tsx`
- Wiring: `src/main.tsx` wraps `<App />` with `<AppErrorBoundary>` and keeps `<Toaster />` outside so notifications still work if the app tree fails.

Usage example:

```tsx
import { AppErrorBoundary } from '@/components/AppErrorBoundary';

<AppErrorBoundary>
  <MyPage />
</AppErrorBoundary>;
```

The boundary logs errors via the shared logger (`logError`) with `source: 'react-boundary'` and shows a user-friendly fallback screen. In development it also shows the error message in a small `<pre>`.

### Logging & Observability

All frontend logging flows through `src/lib/logger.ts`:

- In development, logs are printed to the browser console.
- In production, logs are printed to the console and sent to Tauri's log plugin, which writes to per-app log files in the OS log directory.

Typical log locations (managed by `tauri-plugin-log`):
- macOS: `~/Library/Logs/<app-name>/`
- Linux: `~/.local/share/<app-name>/logs/`
- Windows: `%LOCALAPPDATA%\\<app-name>\\logs\\`

```typescript
import { logInfo, logWarn, logError } from '@/lib/logger';

logInfo('User opened settings', { source: 'ui' });
logWarn('Slow operation detected', { source: 'ui', durationMs: 1200 });
logError(error, { source: 'tauri-command', cmd: 'read_file' });
```

- In **development**, logs are printed as structured payloads to the browser console.
- In **production**, logs are printed to the console and forwarded to Tauri's log plugin, which writes them to the platform log directory.

On the backend, `src-tauri/src/lib.rs` configures `tauri-plugin-log` with three targets:

- `Stdout` – for terminal logs while developing.
- `LogDir` – persistent log files per app.
- `Webview` – optional streaming to the browser console.

### Global Browser Error Handlers

The app attaches global handlers for runtime errors and unhandled promise rejections in `src/lib/global-errors.ts`:

- `window.onerror` → logged with `source: 'window'`.
- `unhandledrejection` → logged with `source: 'unhandledrejection'`.

These handlers only log; they do not show toasts directly to avoid noisy UX.

### Toast Notifications

```typescript
import { toast } from 'sonner';

// Success
toast.success('Operation completed');

// Error
toast.error('Operation failed');

// Info
toast.info('Processing...');

// Loading
const toastId = toast.loading('Uploading...');
// Later:
toast.success('Upload complete!', { id: toastId });

// Custom action
toast('File ready', {
  action: {
    label: 'Download',
    onClick: () => downloadFile(),
  },
});
```

## Accessibility (a11y)

### Semantic HTML

```typescript
// ✅ GOOD
<button onClick={handleClick}>Click me</button>
<nav><a href="/about">About</a></nav>

// ❌ AVOID
<div onClick={handleClick}>Click me</div>
<div><span onClick={() => navigate('/about')}>About</span></div>
```

### ARIA Labels

```typescript
<button aria-label="Close dialog" onClick={onClose}>
  <X /> {/* Icon only */}
</button>

<input aria-describedby="email-help" />
<span id="email-help">We'll never share your email</span>
```

### Keyboard Navigation

```typescript
function handleKeyDown(e: React.KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ' ') {
    handleAction();
  }
}

<div role="button" tabIndex={0} onKeyDown={handleKeyDown} onClick={handleAction}>
  Interactive element
</div>
```

## Import Organization

ESLint automatically enforces import order:

```typescript
// 1. Built-in modules (if any)
import path from 'path';

// 2. External dependencies
import { useState } from 'react';
import { toast } from 'sonner';

// 3. Internal modules (with @/ alias)
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { greet } from '@/lib/tauri';

// 4. Relative imports
import { helper } from './utils';
import styles from './styles.module.css';
```

## Magic Numbers

Avoid magic numbers (ESLint will warn):

```typescript
// ❌ AVOID
const timeout = 5000;
const maxItems = 50;

// ✅ GOOD
const TIMEOUT_MS = 5000;
const MAX_ITEMS = 50;
```

Exceptions: -1, 0, 1, 2, 10, 100, 1000 are allowed.

## Console Usage

Only `console.error`, `console.info`, and `console.warn` are allowed:

```typescript
// ✅ GOOD
console.error('Critical error:', error);
console.info('User logged in:', userId);
console.warn('Deprecated API used');

// ❌ AVOID (ESLint error)
console.log('Debug message');
console.debug('Verbose output');
```

## Git Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add user authentication
fix: resolve crash on startup
docs: update README with installation steps
style: format code with prettier
refactor: extract helper function
test: add unit tests for login
chore: update dependencies
```

## File Organization Tips

### Group Related Files

```
components/
├── LoginForm/
│   ├── LoginForm.tsx
│   ├── LoginForm.test.tsx
│   ├── useLogin.ts
│   └── index.ts  # Re-export
```

### Barrel Exports

```typescript
// components/index.ts
export { LoginForm } from './LoginForm';
export { Dashboard } from './Dashboard';

// Usage
import { LoginForm, Dashboard } from '@/components';
```

## VS Code Snippets

Add to `.vscode/snippets.code-snippets` for productivity:

```json
{
  "React Functional Component": {
    "prefix": "rfc",
    "body": [
      "interface ${1:Component}Props {",
      "  $2",
      "}",
      "",
      "export function ${1:Component}({ $3 }: ${1:Component}Props) {",
      "  return (",
      "    <div>",
      "      $0",
      "    </div>",
      "  );",
      "}"
    ]
  }
}
```

## Next Steps

- Review the [Architecture Documentation](./1-architecture.md) for system design
- Check [Testing Guide](./4-testing-guide.md) for comprehensive testing strategies
- Read [Contributing Guidelines](./5-contributing.md) before submitting PRs
