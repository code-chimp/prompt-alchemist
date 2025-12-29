# Source Tree Analysis - Prompt Alchemist

**Generated:** 2025-12-21  
**Project Type:** Desktop Application (Tauri v2)  
**Architecture:** Hybrid (React Frontend + Rust Backend)

---

## Annotated Directory Structure

```
prompt-alchemist/
├── src/                          # React frontend source code
│   ├── components/               # React components
│   │   ├── ui/                   # ShadCN UI components (Button, Card, Input, Sonner)
│   │   └── AppErrorBoundary.tsx  # Error boundary component
│   ├── lib/                      # Utility libraries and helpers
│   │   ├── tauri.ts              # Tauri IPC wrapper functions
│   │   ├── logger.ts             # Logging utilities
│   │   ├── utils.ts              # General utilities (cn() for className merging)
│   │   └── global-errors.ts      # Global error handling
│   ├── assets/                   # Static assets (images, icons)
│   ├── main.tsx                  # ⚡ Frontend entry point - React app initialization
│   ├── App.tsx                   # Main app component
│   ├── index.css                 # Global styles with Tailwind CSS
│   └── vite-env.d.ts             # Vite type declarations
│
├── src-tauri/                    # Rust backend (Tauri)
│   ├── src/
│   │   ├── main.rs               # ⚡ Backend entry point - Tauri app setup
│   │   └── lib.rs                # Library crate exports
│   ├── capabilities/             # Tauri capability definitions
│   │   └── default.json          # Default app capabilities/permissions
│   ├── icons/                    # Desktop app icons (multi-platform)
│   ├── Cargo.toml                # Rust dependencies and package config
│   ├── tauri.conf.json           # Tauri app configuration
│   ├── build.rs                  # Build script
│   ├── clippy.toml               # Rust linter configuration
│   └── rustfmt.toml              # Rust formatter configuration
│
├── docs/                         # 📚 Comprehensive project documentation
│   ├── 0-getting-started.md      # Setup and installation guide
│   ├── 1-architecture.md         # System architecture documentation
│   ├── 2-tech-stack.md           # Technology stack details
│   ├── 3-development-guide.md    # Development workflow and commands
│   ├── 4-testing-guide.md        # Testing strategy and practices
│   ├── 5-contributing.md         # Contribution guidelines
│   ├── 6-personalizing.md        # Template personalization guide
│   └── rust-tooling.md           # Rust-specific tooling setup
│
├── tests/                        # End-to-end tests (Playwright)
│   ├── pages/                    # Page object models
│   └── *.spec.ts                 # E2E test specifications
│
├── scripts/                      # Build and utility scripts
│   ├── validate-lockfile.ts      # npm lockfile validation
│   └── notify-lockfile-changed.ts # Lockfile change notifications
│
├── public/                       # Static assets served by Vite
│   ├── tauri.svg                 # Tauri logo
│   └── vite.svg                  # Vite logo
│
├── _bmad/                        # BMad Method framework (development workflow)
│   ├── bmm/                      # BMad Method module
│   ├── core/                     # Core framework components
│   └── _config/                  # Framework configuration
│
├── _bmad-output/                 # Generated BMad workflow artifacts
│   ├── bmm-workflow-status.yaml  # Workflow progress tracking
│   └── project-scan-report.json  # Project documentation scan state
│
├── .github/                      # GitHub-specific files
│   └── agents/                   # Custom agent definitions
│
├── .husky/                       # Git hooks (pre-commit, pre-push, etc.)
│
├── package.json                  # npm dependencies and scripts
├── package-lock.json             # Locked dependency versions
├── tsconfig.json                 # TypeScript configuration (root)
├── tsconfig.app.json             # TypeScript config for app code
├── tsconfig.node.json            # TypeScript config for Node scripts
├── vite.config.ts                # Vite build tool configuration
├── vitest.setup.ts               # Vitest test setup
├── vitest.globals.ts             # Vitest global setup
├── playwright.config.ts          # Playwright E2E test configuration
├── eslint.config.ts              # ESLint code quality rules
├── stylelint.config.mjs          # Stylelint CSS linting rules
├── tailwind.config.ts            # Tailwind CSS configuration
├── components.json               # ShadCN UI components configuration
├── index.html                    # HTML entry point for Vite
├── README.md                     # Main project README
├── AGENTS.md                     # Agent guidelines for AI assistants
├── TECH_DEBT.md                  # Known technical debt tracking
└── LICENSE                       # BSD-3-Clause license
```

---

## Critical Directories Summary

| Directory | Purpose | Key Files |
|-----------|---------|-----------|
| **src/** | React frontend application code | main.tsx (entry), App.tsx, components/, lib/ |
| **src-tauri/** | Rust backend and Tauri configuration | main.rs (entry), tauri.conf.json, Cargo.toml |
| **src/components/** | React UI components | AppErrorBoundary.tsx, ui/* |
| **src/components/ui/** | ShadCN UI component library | button.tsx, card.tsx, input.tsx, sonner.tsx |
| **src/lib/** | Utility functions and helpers | tauri.ts (IPC), logger.ts, utils.ts |
| **docs/** | Comprehensive project documentation | Architecture, tech stack, development guides |
| **tests/** | End-to-end test suites | Playwright tests with page objects |
| **src-tauri/src/** | Rust application logic | Tauri commands and business logic |
| **src-tauri/capabilities/** | Tauri security capabilities | Permission definitions |
| **src-tauri/icons/** | Desktop app icons | Multi-platform icon assets |

---

## Entry Points

- **Frontend Entry:** `src/main.tsx` - Initializes React app, mounts to DOM
- **Backend Entry:** `src-tauri/src/main.rs` - Initializes Tauri app, sets up IPC handlers
- **HTML Entry:** `index.html` - Vite HTML template

---

## Integration Points

**Frontend ↔️ Backend Communication:**
- **Method:** Tauri IPC (Inter-Process Communication)
- **Wrapper:** `src/lib/tauri.ts` - Provides typed wrappers for Tauri commands
- **Security:** Capabilities defined in `src-tauri/capabilities/default.json`

---

## Test Structure

- **Unit Tests:** Co-located with source files (`*.test.ts`, `*.test.tsx`)
  - Framework: Vitest with jsdom
  - Pattern: `src/**/*.test.ts(x)`
  
- **E2E Tests:** `tests/` directory
  - Framework: Playwright
  - Pattern: `tests/*.spec.ts`
  - Page Objects: `tests/pages/`

---

## Configuration Files

- **TypeScript:** tsconfig.json (root), tsconfig.app.json (app), tsconfig.node.json (scripts)
- **Build:** vite.config.ts (frontend), Cargo.toml (backend)
- **Testing:** vitest.setup.ts, vitest.globals.ts, playwright.config.ts
- **Linting:** eslint.config.ts, stylelint.config.mjs, clippy.toml (Rust)
- **Formatting:** .prettierrc.json, rustfmt.toml
- **Styling:** tailwind.config.ts, components.json (ShadCN)
- **Tauri:** src-tauri/tauri.conf.json

---

## Development Tooling

- **Package Manager:** npm (with lockfile validation via scripts/)
- **Git Hooks:** Husky (.husky/) - pre-commit, pre-push validation
- **Node Version:** Managed by Volta (specified in package.json)
- **Build System:** Vite (frontend), Cargo (backend)
