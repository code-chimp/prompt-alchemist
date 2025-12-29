# Documentation Index - Prompt Alchemist

**Generated:** 2025-12-21  
**Scan Level:** Quick  
**Project Type:** Desktop Application (Monolith)

---

## Project Overview

- **Type:** Monolith desktop application
- **Primary Language:** TypeScript + Rust
- **Architecture:** Hybrid (React + Tauri v2)
- **Framework:** React 19, Tauri v2
- **Version:** 0.1.0

---

## Quick Reference

**Tech Stack:**
- **Frontend:** React 19 + TypeScript + Vite + ShadCN UI + Tailwind CSS v4
- **Backend:** Rust 2021 + Tauri v2
- **Testing:** Vitest (unit) + Playwright (E2E)
- **Build:** Vite 7, Cargo

**Entry Points:**
- **Frontend:** `src/main.tsx`
- **Backend:** `src-tauri/src/main.rs`

**Architecture Pattern:** Hybrid Desktop (React frontend + Rust backend via IPC)

---

## Generated Documentation

### Core Documentation

- **[Project Overview](./project-overview.md)** - Executive summary, tech stack, capabilities, and project status
- **[Source Tree Analysis](./source-tree-analysis.md)** - Annotated directory structure with critical folders explained
- **[Development Guide](./development-guide.md)** - Setup, commands, testing, code quality, and troubleshooting
- **[Deployment Guide](./deployment-guide.md)** - Build configuration, platform-specific builds, and distribution

### Additional Documentation

_Note: These documents would typically be generated in a deep/exhaustive scan or as part of feature planning:_

- [Component Inventory](./component-inventory.md) - UI component catalog
- [API Contracts](./api-contracts.md) - Tauri IPC commands and handlers
- [Data Models](./data-models.md) _(To be generated)_ - Application data structures

---

## Existing Documentation

The project has comprehensive existing documentation in the `docs/` folder:

### Getting Started & Setup
- **[Getting Started](../docs/0-getting-started.md)** - Detailed setup and installation guide
- **[Personalizing](../docs/6-personalizing.md)** - Template personalization guide

### Architecture & Design
- **[Architecture](../docs/1-architecture.md)** - Complete system architecture documentation
  - High-level architecture diagrams
  - Frontend/backend communication patterns
  - Directory structure deep-dive
  - Design decisions and patterns
  
- **[Tech Stack](../docs/2-tech-stack.md)** - Detailed technology stack breakdown
  - Frontend technologies (React, TypeScript, Vite)
  - Backend technologies (Rust, Tauri)
  - Development tools and libraries

### Development Practices
- **[Development Guide](../docs/3-development-guide.md)** - Extended development workflows
  - Local development setup
  - Common development tasks
  - Code organization patterns
  - Best practices
  
- **[Testing Guide](../docs/4-testing-guide.md)** - Testing strategy and practices
  - Unit testing with Vitest
  - E2E testing with Playwright
  - Rust testing
  - Coverage requirements and best practices
  
- **[Contributing](../docs/5-contributing.md)** - Contribution guidelines
  - Code style conventions
  - Pull request process
  - Commit message standards
  - Testing requirements

### Specialized Topics
- **[Rust Tooling](../docs/rust-tooling.md)** - Rust-specific setup and configuration
  - Rust installation and updates
  - Cargo workflows
  - Clippy and rustfmt configuration
  - Debugging Rust code

### Project Root
- **[Main README](../README.md)** - Project introduction, quick start, and overview
- **[Agent Guidelines](../AGENTS.md)** - Instructions for AI agents working with this codebase
- **[Technical Debt](../TECH_DEBT.md)** - Known issues and future improvements

---

## Getting Started

### For New Developers

1. **Start here:** [Getting Started Guide](../docs/0-getting-started.md)
2. **Understand the architecture:** [Architecture](../docs/1-architecture.md)
3. **Set up your environment:** [Development Guide](./development-guide.md)
4. **Run the app:** `npm run tauri:dev`

### For Contributors

1. **Read:** [Contributing Guidelines](../docs/5-contributing.md)
2. **Review:** [Testing Guide](../docs/4-testing-guide.md)
3. **Validate your changes:** `npm run validate`

### For AI Agents

1. **Read:** [Agent Guidelines](../AGENTS.md)
2. **Reference:** This index for comprehensive project context
3. **Use:** [Source Tree Analysis](./source-tree-analysis.md) for code navigation

---

## Key Commands

```bash
# Development
npm run tauri:dev         # Start desktop app with hot reload
npm run dev               # Start Vite dev server (web mode)

# Building
npm run build             # Build frontend
npm run tauri:build       # Build desktop app

# Testing
npm test                  # Run unit tests
npm run test:e2e          # Run E2E tests
npm run test:rust         # Run Rust tests

# Code Quality
npm run lint              # Run all linters
npm run fix               # Auto-fix issues
npm run check             # Type check + validate
npm run validate          # Full validation (check + lint + test)

# Utilities
npm run clean             # Clean build artifacts
npm run clean:all         # Clean everything including node_modules
```

---

## Project Structure at a Glance

```
prompt-alchemist/
├── src/                  # React frontend
│   ├── components/       # UI components (ShadCN UI)
│   ├── lib/              # Utilities (Tauri IPC wrappers)
│   └── main.tsx          # Frontend entry point
├── src-tauri/            # Rust backend
│   ├── src/              # Rust source code
│   └── tauri.conf.json   # Tauri configuration
├── docs/                 # Existing project documentation
├── tests/                # E2E tests (Playwright)
├── _bmad-output/         # Generated documentation (you are here!)
└── package.json          # npm configuration and scripts
```

---

## Documentation Coverage

### ✅ Covered in Generated Docs
- Project overview and quick start
- Technology stack details
- Source tree structure
- Development commands and workflow
- Build and deployment process
- Testing approach

### ✅ Covered in Existing Docs
- Detailed architecture patterns
- Technology choices and rationale
- Contribution process
- Rust-specific tooling
- Comprehensive testing guide

### 📋 Additional Documentation Available Upon Request
- Component inventory (deep scan)
- Tauri IPC API contracts
- Data models and state management
- CI/CD pipeline setup
- Security configuration details

---

## BMad Method Workflow Status

This project is following the **BMad Method** for structured development:

**Current Phase:** Analysis/Documentation ✅  
**Next Phase:** Discovery (brainstorm + research)

**Workflow Tracking:** `_bmad-output/bmm-workflow-status.yaml`

**Completed Workflows:**
- ✅ Workflow initialization
- ✅ Project documentation (this output)

**Upcoming Workflows:**
- 🔄 Brainstorm session
- 🔄 Research (market/competitive/technical)
- 📋 Product Requirements Document (PRD)
- 📋 UX Design
- 📋 Architecture planning
- 📋 Epic and story breakdown

---

## Quick Links

### Essential Reading
1. [Project Overview](./project-overview.md) - Start here for high-level understanding
2. [Main README](../README.md) - Project vision and quick start
3. [Architecture](../docs/1-architecture.md) - System design and patterns

### Development Resources
- [Development Guide](./development-guide.md) - Commands and workflows
- [Source Tree](./source-tree-analysis.md) - Navigate the codebase
- [Testing Guide](../docs/4-testing-guide.md) - Testing practices

### Deployment & Operations
- [Deployment Guide](./deployment-guide.md) - Build and distribution
- [Tech Stack](../docs/2-tech-stack.md) - Technology details

---

## Notes

- **Scan Level:** Quick (pattern-based, minimal file reading)
- **Single Part:** Monolith application (no multi-part structure)
- **Documentation Quality:** High (existing docs are comprehensive)
- **Next Steps:** Consider deep scan for component inventory and IPC contracts

---

_This documentation index was automatically generated by the BMad Method document-project workflow._  
_Last Updated: 2025-12-21_
