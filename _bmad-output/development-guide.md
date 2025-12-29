# Development Guide - Prompt Alchemist

**Generated:** 2025-12-21  
**Based on:** Existing documentation and project analysis

---

## Prerequisites

### Required Software

- **Node.js:** v24.12.0 (managed via Volta or nvm)
- **npm:** >=10.0.0
- **Rust:** Latest stable (for Tauri backend)
- **System Dependencies:** See Tauri prerequisites for your OS

### Verify Installation

```bash
node --version    # Should show v24.12.0
npm --version     # Should be >=10.0.0
rustc --version   # Should show latest stable
cargo --version   # Should match Rust version
```

---

## Installation

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/code-chimp/prompt-alchemist.git
cd prompt-alchemist
npm install
```

### 2. Node Version Management

**Using Volta (recommended):**
```bash
# Volta automatically uses the version specified in package.json
volta install node@24.12.0
```

**Using nvm:**
```bash
nvm use  # Uses version from .nvmrc (v24.12.0)
```

---

## Development Commands

### Frontend Development

```bash
# Start Vite dev server only (web mode)
npm run dev

# Open browser at http://localhost:1420
```

### Desktop Development (Tauri)

```bash
# Start Tauri in development mode (hot reload)
npm run tauri:dev

# This starts both:
# - Vite dev server (frontend)
# - Tauri app (desktop window)
```

### Build Commands

```bash
# Build frontend only
npm run build

# Build desktop application (production)
npm run tauri:build

# Preview production build (web)
npm run preview
```

### Clean Commands

```bash
# Clean build artifacts
npm run clean

# Clean everything including node_modules
npm run clean:all
```

---

## Testing

### Unit Tests (Vitest)

```bash
# Run all unit tests
npm run test:unit
# or
npm test

# Watch mode for TDD
npm run test:unit:watch

# Generate coverage report
npm run test:unit:coverage
```

**Coverage Thresholds:**
- Branches: 65%
- Functions: 80%
- Statements: 80%

**Test Patterns:**
- Location: Co-located with source (`src/**/*.test.ts(x)`)
- Framework: Vitest with jsdom environment
- Globals: Available without imports (describe, it, expect, vi)

### E2E Tests (Playwright)

```bash
# Install Playwright browsers (first time only)
npm run e2e:install

# Run E2E tests (headless)
npm run test:e2e

# Run E2E tests (headed - see browser)
npm run test:e2e:headed

# Open Playwright UI for debugging
npm run e2e:ui
```

**Test Location:** `tests/*.spec.ts`

### Rust Tests

```bash
# Run Rust tests
npm run test:rust
# or
npm run rust:test
```

---

## Code Quality

### Linting

```bash
# Run all linters (TypeScript + Rust)
npm run lint

# Individual linters
npm run lint:code      # ESLint
npm run lint:format    # Prettier check
npm run lint:styles    # Stylelint (CSS)
npm run lint:rust:clippy    # Rust Clippy
npm run lint:rust:format    # Rust format check
```

### Auto-Fix

```bash
# Fix all auto-fixable issues
npm run fix

# Individual fixers
npm run fix:code       # ESLint --fix
npm run fix:format     # Prettier --write
npm run fix:styles     # Stylelint --fix
npm run fix:rust       # cargo fmt
```

### Type Checking

```bash
# Check TypeScript types without emitting
npm run check:types

# Check everything (types + lockfile + Rust)
npm run check
```

### Full Validation

```bash
# Run checks, linting, and unit tests
npm run validate
```

---

## Git Workflow

### Git Hooks (Husky)

Automated checks run via Husky:

**pre-commit:**
- Runs lint-staged on changed files
- Formats code with Prettier
- Lints with ESLint
- Validates CSS with Stylelint

**pre-push:**
- Runs unit tests
- Type checks
- Validates lockfile

**post-checkout / post-merge:**
- Notifies if package-lock.json changed
- Reminds to run `npm install`

---

## Environment Setup

### Environment Variables

Currently no `.env` files required. Configuration is in:
- `src-tauri/tauri.conf.json` - Tauri app config
- `vite.config.ts` - Vite build config
- `package.json` - npm scripts and metadata

### Development Server Configuration

**Vite Dev Server:**
- Port: 1420 (strict)
- HMR Port: 1421
- Host: localhost (can be overridden with `TAURI_DEV_HOST`)

---

## Project Structure Conventions

### Import Alias

Use `@/` for src imports:

```typescript
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
```

**Configured in:**
- `tsconfig.json` (TypeScript)
- `vite.config.ts` (Vite resolver)

### Code Style

**TypeScript/React:**
- **Quotes:** Single quotes
- **Line Width:** 95 columns
- **Trailing Commas:** ES5
- **Arrow Parens:** Avoid where possible
- **Indent:** 2 spaces
- **Import Order:** Enforced by ESLint (builtin → external → internal → parent → sibling → index)

**Tailwind Classes:**
- Auto-sorted via `prettier-plugin-tailwindcss`

**Naming Conventions:**
- Components: PascalCase (`App.tsx`, `AppErrorBoundary.tsx`)
- Functions/Variables: camelCase
- CSS Custom Properties: kebab-case
- Rust: snake_case

### File Patterns

- **Components:** `*.tsx` in `src/components/`
- **Tests:** `*.test.ts(x)` co-located with source
- **E2E Tests:** `tests/*.spec.ts`
- **Styles:** `*.css` with Tailwind utilities

---

## Troubleshooting

### Common Issues

**1. Port 1420 already in use**
```bash
# Kill process using port 1420
lsof -ti:1420 | xargs kill -9
```

**2. Rust compilation errors**
```bash
# Update Rust toolchain
rustup update stable

# Clean Rust build cache
cd src-tauri && cargo clean
```

**3. npm install failures**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
npm run clean:all && npm install
```

**4. Husky hooks not running**
```bash
# Reinstall Husky hooks
npm run prepare
```

---

## Additional Resources

See project documentation in `docs/`:
- `docs/0-getting-started.md` - Detailed setup guide
- `docs/1-architecture.md` - System architecture
- `docs/2-tech-stack.md` - Technology details
- `docs/3-development-guide.md` - Extended development guide
- `docs/4-testing-guide.md` - Testing best practices
- `docs/5-contributing.md` - Contribution guidelines
- `docs/rust-tooling.md` - Rust-specific setup

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Vite dev server (web) |
| `npm run tauri:dev` | Start Tauri desktop app (with hot reload) |
| `npm run build` | Build frontend |
| `npm run tauri:build` | Build desktop app |
| `npm test` | Run unit tests |
| `npm run test:e2e` | Run E2E tests |
| `npm run lint` | Run all linters |
| `npm run fix` | Auto-fix all issues |
| `npm run check` | Type check + lockfile + Rust |
| `npm run validate` | Full validation (check + lint + test) |
