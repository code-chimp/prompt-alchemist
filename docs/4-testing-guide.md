# Testing Guide

This guide covers testing strategies, tools, and best practices for unit tests and E2E tests in this Tauri + React application.

## Testing Stack

### Unit Testing
- **Vitest 4.0.16** - Fast unit test runner (Vite-native)
- **@testing-library/react** - React component testing utilities
- **@testing-library/user-event** - User interaction simulation
- **@testing-library/jest-dom** - Custom matchers for DOM assertions
- **jsdom** - DOM implementation for Node.js
- **@vitest/coverage-v8** - Code coverage reporting

### E2E Testing
- **Playwright 1.57.0** - End-to-end testing framework
- **Chromium** - Single browser target for consistency

## Running Tests

### Unit Tests

```bash
# Run all unit tests
npm run test:unit

# Run in watch mode
npm run test:unit -- --watch

# Run specific test file
npm run test:unit src/App.test.tsx

# Run with coverage
npm run test:unit -- --coverage
```

### E2E Tests

```bash
# Install browsers (first time only)
npm run e2e:install

# Run E2E suite
npm run e2e:test

# Run in UI mode
npm run e2e:ui

# Run specific test file
npm run e2e:test -- tests/app.greet.spec.ts

# Debug mode
npm run e2e:test -- --debug
```

## Unit Testing

### Test File Location

- **Pattern**: `src/**/*.test.ts?(x)`
- **Co-location**: Place test files next to the source files they test

```
src/
├── components/
│   ├── LoginForm.tsx
│   └── LoginForm.test.tsx       ← Test next to component
├── lib/
│   ├── utils.ts
│   └── utils.test.ts            ← Test next to utility
```

### Basic Component Test

```typescript
// Button.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies variant classes', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-red-500'); // or whatever class your variant applies
  });

  it('is disabled when prop is set', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Testing User Interactions

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  it('calls onSubmit with form data', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<LoginForm onSubmit={onSubmit} />);

    // Type into inputs
    await user.type(screen.getByLabelText(/username/i), 'john');
    await user.type(screen.getByLabelText(/password/i), 'secret123');

    // Click submit
    await user.click(screen.getByRole('button', { name: /submit/i }));

    // Verify callback
    expect(onSubmit).toHaveBeenCalledWith({
      username: 'john',
      password: 'secret123',
    });
  });

  it('shows validation errors', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByText(/username is required/i)).toBeInTheDocument();
  });
});
```

### Testing Async Operations

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DataLoader } from './DataLoader';

describe('DataLoader', () => {
  it('shows loading state initially', () => {
    render(<DataLoader />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders data after loading', async () => {
    render(<DataLoader />);

    await waitFor(() => {
      expect(screen.getByText(/data loaded/i)).toBeInTheDocument();
    });
  });

  it('shows error message on failure', async () => {
    // Mock failed API call
    vi.mock('@/lib/api', () => ({
      fetchData: vi.fn().mockRejectedValue(new Error('Network error')),
    }));

    render(<DataLoader />);

    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
  });
});
```

### Testing Custom Hooks

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('initializes with default value', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it('increments count', () => {
    const { result } = renderHook(() => useCounter());

    result.current.increment();

    expect(result.current.count).toBe(1);
  });

  it('decrements count', () => {
    const { result } = renderHook(() => useCounter(5));

    result.current.decrement();

    expect(result.current.count).toBe(4);
  });
});
```

### Mocking Tauri Commands

#### Method 1: Mock the Wrapper Module

```typescript
// MyComponent.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MyComponent } from './MyComponent';

// Mock the entire tauri module
vi.mock('@/lib/tauri', () => ({
  greet: vi.fn().mockResolvedValue('Hello, Test!'),
  getUserData: vi.fn().mockResolvedValue({ name: 'John', age: 30 }),
}));

describe('MyComponent', () => {
  it('displays greeting from Tauri', async () => {
    render(<MyComponent />);

    expect(await screen.findByText('Hello, Test!')).toBeInTheDocument();
  });
});
```

#### Method 2: Mock Tauri Core

```typescript
import { vi } from 'vitest';

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn((cmd, args) => {
    if (cmd === 'greet') {
      return Promise.resolve(`Hello, ${args.name}!`);
    }
    return Promise.reject('Unknown command');
  }),
}));
```

#### Method 3: Mock Per Test

```typescript
import { describe, it, expect, vi } from 'vitest';
import * as tauri from '@/lib/tauri';

describe('MyComponent', () => {
  it('handles error from Tauri', async () => {
    vi.spyOn(tauri, 'greet').mockRejectedValue('Network error');

    render(<MyComponent />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
```

### Testing Components with Theme

```typescript
import { render } from '@testing-library/react';
import { ThemeProvider } from 'next-themes';

function renderWithTheme(ui: React.ReactElement) {
  return render(
    <ThemeProvider attribute="class" defaultTheme="light">
      {ui}
    </ThemeProvider>
  );
}

describe('ThemedComponent', () => {
  it('renders with theme', () => {
    renderWithTheme(<ThemedComponent />);
    // assertions...
  });
});
```

### Snapshot Testing

```typescript
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Card } from './Card';

describe('Card', () => {
  it('matches snapshot', () => {
    const { container } = render(
      <Card title="Test" description="Description">
        Content
      </Card>
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
```

## E2E Testing

### Strategy for Tauri

For this template, E2E tests use **Playwright against the Vite dev server** (default at `http://localhost:1420`). This is the primary, recommended way to test features end-to-end:

- Exercises the real React UI and routing.
- Can hit real Tauri commands (or mocked ones) through the browser context.
- Easy to run locally and in CI without packaging the app.

If your app relies heavily on desktop-specific features (system tray, menus, global shortcuts, native dialogs), you can add a **small number of “desktop E2E” tests** that drive the actual Tauri window (for example via `tauri-driver` or a similar harness). Keep this layer minimal and focused on OS integration; use browser-based E2E + unit tests for most regression coverage.

### Test File Location

- **Pattern**: `tests/**/*.spec.ts?(x)`
- **Structure**: Organize by feature or flow

```
tests/
├── app.greet.spec.ts
├── app.navigation.spec.ts
└── pages/
    └── HomePage.ts
```

### Basic E2E Test with Page Object

```typescript
// tests/pages/HomePage.ts
import type { Locator, Page } from '@playwright/test';

export class HomePage {
  readonly heading: Locator;
  readonly nameInput: Locator;
  readonly greetButton: Locator;
  readonly toast: Locator;

  constructor(private page: Page) {
    this.heading = page.getByText('Welcome to Tauri + React');
    this.nameInput = page.getByPlaceholder(/enter a name/i);
    this.greetButton = page.getByRole('button', { name: /greet/i });
    this.toast = page.locator('[data-sonner-toast]');
  }


  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async greet(name: string): Promise<void> {
    await this.nameInput.fill(name);
    await this.greetButton.click();
  }
}

// tests/app.greet.spec.ts
import { expect, test } from '@playwright/test';
import { HomePage } from './pages/HomePage';

test('shows toast when greeting via button', async ({ page }) => {
  const home = new HomePage(page);

  await home.goto();
  await home.greet('Playwright');

  await expect(home.toast).toContainText('Failed to greet. Please try again.');
});
```

Keep selectors encapsulated inside page objects and prefer accessible queries (`getByRole`, `getByPlaceholder`) over brittle CSS selectors.


### Testing Tauri-Specific Features

```typescript
test('opens external link in system browser', async ({ page }) => {
  await page.goto('http://localhost:1420');

  // Mock the Tauri API
  await page.addInitScript(() => {
    window.__TAURI__ = {
      tauri: {
        invoke: async (cmd: string, args?: any) => {
          if (cmd === 'plugin:opener|open_url') {
            console.info('Would open:', args.url);
            return Promise.resolve();
          }

          throw new Error(`Unknown command: ${cmd}`);
        },
      },
    };
  });

  await page.click('a[href^="https://"]');

  // Verify Tauri command was called
  const logs = await page.evaluate(() => {
    return (window as any).__tauri_logs || [];
  });
  expect(logs).toContain('Would open: https://example.com');
});
```

### Stubbing Tauri APIs in E2E tests

In E2E tests, stub Tauri APIs using `page.addInitScript` so you can verify
that commands are invoked without performing real OS-level actions. For
example, to simulate a successful `greet` command:

```typescript
await page.addInitScript(() => {
  (window as any).__TAURI__ = {
    tauri: {
      invoke: async (cmd: string, args?: any) => {
        if (cmd === 'greet') {
          return `Hello, ${args?.name ?? 'World'}!`;
        }

        throw new Error(`Unknown command: ${cmd}`);
      },
    },
  };
});
```

This pattern lets you test app behavior when Tauri commands succeed or fail
while still running tests in a regular browser context. It is used in
`tests/app.greet.spec.ts` and the opener example above.

### Page Object Model

Organize complex E2E tests with page objects:

```typescript
// tests/pages/LoginPage.ts
import type { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('http://localhost:1420/login');
  }

  async login(username: string, password: string) {
    await this.page.getByLabel(/username/i).fill(username);
    await this.page.getByLabel(/password/i).fill(password);
    await this.page.getByRole('button', { name: /submit/i }).click();
  }

  async getErrorMessage() {
    return this.page.locator('.error-message').textContent();
  }
}

// tests/login.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

test('login with invalid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login('invalid', 'wrong');

  const error = await loginPage.getErrorMessage();
  expect(error).toContain('Invalid credentials');
});
```

### Visual Regression Testing

```typescript
test('matches visual snapshot', async ({ page }) => {
  await page.goto('http://localhost:1420');

  // Full page screenshot
  await expect(page).toHaveScreenshot('homepage.png');

  // Element screenshot
  const card = page.locator('.card');
  await expect(card).toHaveScreenshot('card-component.png');
});
```

## Coverage Configuration

Coverage is configured but disabled by default. It is enabled automatically when you
run tests with the `--coverage` flag (for example via `npm run test:unit:coverage`).

The configuration in `vite.config.ts` looks like this:

```typescript
coverage: {
  enabled: false,
  reporter: ['text', 'json', 'cobertura', 'lcov', 'html'],
  include: ['src/**/*.ts?(x)'],
  exclude: [
    'src/**/*.d.ts',
    'src/**/*.test.ts?(x)',
    'src/**/index.ts',
    'src/main.tsx',
    'src/constants/**',
    'src/components/ui/button.tsx',
    'src/components/ui/card.tsx',
    'src/components/ui/input.tsx',
  ],
  thresholds: {
    branches: 65,
    functions: 80,
    statements: 80,
  }
}
```

- Thresholds are enforced globally. The current baseline keeps us in the
  ~80 coverage range for functions and statements across `src/`.
- We exclude most ShadCN UI primitives from coverage (`button.tsx`, `card.tsx`,
  `input.tsx`) and validate them indirectly through higher-level components.
- The `Toaster` wrapper in `src/components/ui/sonner.tsx` is included in
  coverage because it contains our theming and configuration logic.

View coverage report:

```bash
npm run test:unit:coverage
open coverage/index.html
```


View coverage report:

```bash
npm run test:unit -- --coverage
open coverage/index.html
```

## Best Practices

### ✅ DO

- **Write descriptive test names** that explain what is being tested
  ```typescript
  it('displays error message when API call fails', () => {});
  ```

- **Use Testing Library queries** in this order of preference:
  1. `getByRole` (most accessible)
  2. `getByLabelText` (forms)
  3. `getByPlaceholderText` (inputs)
  4. `getByText` (non-interactive content)
  5. `getByTestId` (last resort)

- **Test behavior, not implementation**
  ```typescript
  // ✅ GOOD - Tests user-facing behavior
  await user.click(screen.getByRole('button'));
  expect(screen.getByText('Success')).toBeInTheDocument();

  // ❌ AVOID - Tests implementation details
  expect(component.state.isLoading).toBe(false);
  ```

- **Use `userEvent` over `fireEvent`**
  ```typescript
  // ✅ GOOD - Simulates real user interaction
  await userEvent.click(button);

  // ❌ AVOID - Low-level event firing
  fireEvent.click(button);
  ```

- **Clean up after tests**
  ```typescript
  import { afterEach, vi } from 'vitest';

  afterEach(() => {
    vi.clearAllMocks();
  });
  ```

### ❌ DON'T

- **Don't test library code** (React, Tailwind, shadcn components)
- **Don't use `waitFor` for everything** - use `findBy` queries when possible
  ```typescript
  // ✅ GOOD
  expect(await screen.findByText('Loaded')).toBeInTheDocument();

  // ❌ AVOID
  await waitFor(() => {
    expect(screen.getByText('Loaded')).toBeInTheDocument();
  });
  ```

- **Don't test styles** - leave that to visual regression tests
- **Don't make tests dependent on each other** - each test should be independent

## Debugging Tests

### Vitest

```typescript
import { describe, it } from 'vitest';

describe('MyComponent', () => {
  it.only('runs only this test', () => {
    // Focused test
  });

  it.skip('skips this test', () => {
    // Skipped
  });
});
```

Use `screen.debug()` to see the DOM:

```typescript
import { screen } from '@testing-library/react';

test('debug example', () => {
  render(<MyComponent />);
  screen.debug(); // Prints entire DOM
  screen.debug(screen.getByRole('button')); // Prints specific element
});
```

### Playwright

```bash
# Run in debug mode
npm run e2e:test -- --debug

# Run in UI mode (interactive)
npm run e2e:ui

# Generate test code (recorder)
npx playwright codegen http://localhost:1420
```

## Common Testing Scenarios


### Testing Form Validation

```typescript
test('validates required fields', async () => {
  const user = userEvent.setup();
  render(<Form />);

  // Submit without filling
  await user.click(screen.getByRole('button', { name: /submit/i }));

  // Check error messages
  expect(screen.getByText(/name is required/i)).toBeInTheDocument();
  expect(screen.getByText(/email is required/i)).toBeInTheDocument();
});
```

### Testing Loading States

```typescript
test('shows loading spinner during fetch', async () => {
  render(<DataComponent />);

  expect(screen.getByRole('status')).toBeInTheDocument(); // Loading spinner

  await waitForElementToBeRemoved(() => screen.queryByRole('status'));

  expect(screen.getByText(/data loaded/i)).toBeInTheDocument();
});
```

### Testing Error Boundaries

```typescript
test('error boundary catches errors', () => {
  const ThrowError = () => {
    throw new Error('Test error');
  };

  render(
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>
  );

  expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
});
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/)
- [Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Next Steps

- Set up continuous integration with automated tests
- Add visual regression testing for critical UI
- Integrate test coverage into PR checks
- Write E2E tests for main user flows
