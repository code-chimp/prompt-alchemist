# Tech Stack

## Overview

This project is a desktop application built using **Tauri v2** with a **React 19** frontend and **Rust** backend. The stack emphasizes modern tooling, type safety, developer experience, and performance.

## Frontend Stack

### Core Framework
- **React 19.2.3** - Latest version with React Compiler support
  - Uses `StrictMode` for development checks
  - Configured with React Compiler via Babel plugin for automatic optimization
- **TypeScript 5.9.3** - Strict type checking enabled
- **Vite 7.3.0** - Fast build tool and dev server
  - Custom port configuration (1420) for Tauri integration
  - HMR (Hot Module Replacement) support

### UI Framework & Styling
- **Tailwind CSS 4.1.18** - Utility-first CSS framework
  - Configured with dark mode support (`class` strategy)
  - Custom animations (accordion, spin-slow, pulse-slow)
- **shadcn/ui Components** - High-quality, accessible component library
  - Located in `src/components/ui/`
  - Built on Radix UI primitives
  - Components: Button, Card, Input, Sonner (toast notifications)
- **Radix UI** - Unstyled, accessible component primitives
- **Lucide React 0.561.0** - Icon library
- **next-themes 0.4.6** - Theme management for dark/light mode
- **class-variance-authority** - Type-safe variant management for components
- **clsx & tailwind-merge** - Conditional class management

### State & Notifications
- **Sonner 2.0.7** - Toast notification system

### Tauri Integration
- **@tauri-apps/api v2** - JavaScript API for Tauri commands
- **@tauri-apps/plugin-opener v2** - Plugin for opening URLs/files

## Backend Stack

### Runtime & Framework
- **Rust Edition 2021** - Systems programming language
- **Tauri 2** - Framework for building desktop apps
  - Security-first architecture
  - Native OS integration
  - Small bundle size
- **tauri-plugin-opener** - Opens URLs in system browser

### Serialization
- **serde 1.x** - Serialization/deserialization framework
- **serde_json 1.x** - JSON support for Rust

## Development Tools

### Code Quality
- **ESLint 9.39.2** - Linting with flat config
  - Plugins: React Hooks, React Compiler, jsx-a11y, import
  - TypeScript ESLint integration
  - JSON and Markdown linting support
- **Prettier 3.7.4** - Code formatting
  - Tailwind CSS class sorting plugin
- **Stylelint 16.26.1** - CSS linting
  - Tailwind CSS configuration
- **TypeScript ESLint 8.50.0** - TypeScript-specific linting

### Testing
- **Vitest 4.0.16** - Unit testing framework
  - jsdom environment for React component testing
  - Coverage reporting (v8)
  - Test files: `src/**/*.test.ts?(x)`
- **Playwright 1.57.0** - E2E testing
  - Chromium-only configuration
  - Test files: `tests/**/*.spec.ts?(x)`
- **Testing Library** - React component testing utilities
  - @testing-library/react 16.3.1
  - @testing-library/user-event 14.6.1
  - @testing-library/jest-dom 6.9.1

### Git Workflow
- **Husky 9.1.7** - Git hooks
- **lint-staged 16.2.7** - Run linters on staged files
- **npm-run-all** - Run multiple npm scripts in parallel/serial

### Build & Utilities
- **cross-env 10.1.0** - Cross-platform environment variables
- **rimraf 6.1.2** - Cross-platform file deletion
- **tsx 4.21.0** - TypeScript execution
- **jiti 2.6.1** - Runtime TypeScript and ESM loader

## Node.js Version Management
- **Volta** - Pins Node.js to version 24.12.0
- Alternative: Use `.nvmrc` for nvm users

## Path Aliases
TypeScript path alias `@/*` maps to `./src/*` for cleaner imports:

```typescript
import { Button } from '@/components/ui/button';
```

## Bundle Configuration
- **License**: BSD 3-Clause (permissive open source)
- **Identifier**: com.code-chimp.tauri2-react-starter
- **Target**: All platforms (Windows, macOS, Linux)
- **Window**: 800x600 default size

## Key Design Decisions

### Why Tauri?
- Smaller bundle size than Electron
- Better performance (Rust backend)
- Enhanced security model
- Native OS integration
- Multi-platform support

### Why React 19 with Compiler?
- Automatic memoization and optimization
- Better performance without manual `useMemo`/`useCallback`
- Future-proof for React's direction

### Why Vite?
- Fast dev server with instant HMR
- Optimized builds
- Native ESM support
- Excellent TypeScript integration

### Why shadcn/ui?
- Copy-paste components (no package dependency bloat)
- Full control and customization
- Built on accessible Radix UI primitives
- Seamless Tailwind integration

### Why Strict TypeScript?
- Catch errors at compile time
- Better IDE support
- Self-documenting code
- Safer refactoring
