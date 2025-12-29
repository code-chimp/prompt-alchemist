# Project Overview - Prompt Alchemist

**Generated:** 2025-12-21  
**Project Type:** Desktop Application  
**Repository Type:** Monolith  
**Version:** 0.1.0

---

## Executive Summary

**Prompt Alchemist** is a lightweight, cross-platform desktop application that helps developers and prompt engineers craft precise, reusable prompts for Large Language Models (LLMs). Built with Tauri v2 and React 19, it provides a native desktop experience for managing libraries of expert personas, architectural patterns, and guardrails that can be composed into consistent, high-quality prompts.

**Current Status:** Early-stage prototype demonstrating Tauri's capabilities

**Key Value Proposition:**
- 📚 Reusable component library for LLM prompts
- 🎯 Template-based composition system
- 💾 Local-first, privacy-focused (no cloud dependencies)
- ⚡ Fast, lightweight native desktop performance (~3-5MB binaries)

---

## Technology Stack Summary

| Category | Technology | Version |
|----------|------------|---------|
| **Frontend Framework** | React | 19.2.3 |
| **Language** | TypeScript | 5.9.3 |
| **Desktop Framework** | Tauri | v2 |
| **Backend Language** | Rust | 2021 edition |
| **Build Tool** | Vite | 7.3.0 |
| **UI Library** | ShadCN UI | Latest |
| **Styling** | Tailwind CSS | 4.1.18 |
| **Unit Testing** | Vitest | 4.0.16 |
| **E2E Testing** | Playwright | 1.57.0 |

---

## Architecture Classification

**Type:** Hybrid Desktop Architecture

**Pattern:** React frontend + Rust backend communicating via Tauri IPC

**Key Characteristics:**
- **Frontend:** Component-based React UI with ShadCN components
- **Backend:** Rust for native system integration and performance
- **Communication:** Type-safe IPC layer (`src/lib/tauri.ts`)
- **Security:** Capability-based permissions system
- **Distribution:** Native installers for Windows, macOS, Linux

---

## Repository Structure

**Type:** Monolith (single cohesive application)

**Primary Sections:**
- `src/` - React frontend application
- `src-tauri/` - Rust backend and Tauri configuration
- `docs/` - Comprehensive project documentation
- `tests/` - End-to-end test suites
- `_bmad/` - BMad Method development workflow framework
- `_bmad-output/` - Generated planning and documentation artifacts

**Entry Points:**
- **Frontend:** `src/main.tsx`
- **Backend:** `src-tauri/src/main.rs`

---

## Core Capabilities (Planned)

| Feature | Status |
| ------- | ------ |
| **Persona Library** | 🚧 Planned |
| **Architecture Templates** | 🚧 Planned |
| **Guardrails** | 🚧 Planned |
| **Prompt Composition** | 🚧 Planned |
| **Search & Organization** | 🚧 Planned |
| **Export/Import** | 🚧 Planned |
| **Real-Time Preview** | 🚧 Planned |

---

## Quick Start

### Prerequisites
- Node.js v24.12.0
- Rust (latest stable)
- npm >=10.0.0

### Development

```bash
# Install dependencies
npm install

# Start desktop app with hot reload
npm run tauri:dev

# Run tests
npm test
npm run test:e2e
```

### Build

```bash
# Build for production
npm run tauri:build
```

---

## Documentation Index

### Generated Documentation (BMad Output)

- **[Source Tree Analysis](./ source-tree-analysis.md)** - Annotated directory structure
- **[Development Guide](./development-guide.md)** - Setup, commands, and workflows
- **[Deployment Guide](./deployment-guide.md)** - Build and deployment configuration
- **[This Document](./project-overview.md)** - Project overview

### Existing Project Documentation

- **[Getting Started](../docs/0-getting-started.md)** - Detailed setup guide
- **[Architecture](../docs/1-architecture.md)** - System architecture documentation
- **[Tech Stack](../docs/2-tech-stack.md)** - Detailed technology stack information
- **[Development Guide](../docs/3-development-guide.md)** - Extended development practices
- **[Testing Guide](../docs/4-testing-guide.md)** - Testing strategy and best practices
- **[Contributing](../docs/5-contributing.md)** - Contribution guidelines
- **[Personalizing](../docs/6-personalizing.md)** - Template personalization guide
- **[Rust Tooling](../docs/rust-tooling.md)** - Rust-specific setup and configuration
- **[Main README](../README.md)** - Project README

---

## Development Workflow

### Code Quality Tools

- **Linting:** ESLint (TypeScript), Clippy (Rust), Stylelint (CSS)
- **Formatting:** Prettier (TypeScript/CSS), rustfmt (Rust)
- **Type Checking:** TypeScript strict mode
- **Git Hooks:** Husky (pre-commit, pre-push validation)

### Testing Strategy

- **Unit Tests:** Vitest with jsdom, 80%+ coverage target
- **E2E Tests:** Playwright for desktop app testing
- **Rust Tests:** Cargo test for backend logic

### Key Commands

```bash
npm run tauri:dev    # Desktop app development
npm test             # Run unit tests
npm run lint         # Run all linters
npm run fix          # Auto-fix issues
npm run validate     # Full validation (types + lint + tests)
```

---

## Project Status

### Current Phase

**Phase:** Analysis/Planning (BMad Method)
- ✅ **Workflow initialized** (brownfield track)
- ✅ **Project documented** (this output)
- 🔄 **Next:** Discovery workflows (brainstorm, research)

**See:** `_bmad-output/bmm-workflow-status.yaml` for full workflow tracking

### Known Technical Debt

See `TECH_DEBT.md` in project root for tracked issues.

---

## License & Attribution

**License:** BSD-3-Clause  
**Author:** Tim Goshinski (tim@code-chimp.com)  
**Repository:** https://github.com/code-chimp/prompt-alchemist  
**Homepage:** https://code-chimp.com

---

## Key Features in Detail

### Local-First Architecture

- All data stored locally on user's machine
- No cloud dependencies or data sharing
- Privacy-focused design
- Portable: Export/import data as JSON/YAML

### Component Library System

Planned feature set for managing reusable prompt components:

1. **Personas** - Expert profiles with specialized knowledge domains
2. **Architecture Templates** - Design patterns (DDD, Microservices, Clean Architecture, etc.)
3. **Guardrails** - Constraints, output formats, ethical guidelines
4. **Tagging & Organization** - Quick retrieval and categorization
5. **Version Control** - JSON/YAML export for git versioning

### Target Use Cases

- **Developers:** Consistent prompts for code generation, reviews, refactoring
- **Prompt Engineers:** Library management and template composition
- **Teams:** Share prompt libraries via version control
- **AI-Assisted Development:** Better results through structured, reusable prompts

---

## Technology Choices Rationale

### Why Tauri over Electron?

- **Size:** 3-5MB vs 120+ MB
- **Performance:** Native Rust backend vs Node.js
- **Security:** Rust memory safety + capability-based permissions
- **Resources:** Lower memory footprint

### Why React 19?

- React Compiler for automatic optimization
- Modern hooks and concurrent features
- Large ecosystem of components (ShadCN UI)

### Why TypeScript Strict Mode?

- Type safety reduces runtime errors
- Better IDE support and refactoring
- Self-documenting code

---

## Getting Help

- **Documentation:** See `docs/` directory
- **Issues:** https://github.com/code-chimp/prompt-alchemist/issues
- **Email:** tim@code-chimp.com

---

_This document was automatically generated by the BMad Method document-project workflow._
