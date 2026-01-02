# GitHub Actions CI/CD Implementation Plan
## prompt-alchemist - Tauri Desktop Application

**Project:** prompt-alchemist  
**Created:** 2025-12-31  
**Created By:** BMad Master  
**Status:** Planning - Not Yet Implemented  

---

## Executive Summary

This document outlines a comprehensive CI/CD pipeline implementation plan for the **prompt-alchemist** Tauri desktop application using GitHub Actions. The plan establishes two distinct workflows for the `integration` (QA) and `main` (release) branches, ensuring code quality, automated testing, and reliable builds for macOS, Windows, and Linux platforms.

### Key Objectives

1. **Automated Quality Gates** - Enforce linting, type checking, and testing on every commit
2. **Multi-Platform Builds** - Build and test on macOS, Windows, and Linux
3. **Branch-Specific Workflows** - Different CI/CD strategies for integration vs. release
4. **Fast Feedback Loops** - Parallel job execution for quick results
5. **Release Automation** - Automated artifact generation and GitHub releases for production deployments

---

## Table of Contents

1. [Project Analysis](#project-analysis)
2. [Branch Strategy](#branch-strategy)
3. [CI/CD Architecture](#cicd-architecture)
4. [Workflow Specifications](#workflow-specifications)
5. [Implementation Plan](#implementation-plan)
6. [Security Considerations](#security-considerations)
7. [Monitoring & Maintenance](#monitoring--maintenance)
8. [Rollout Strategy](#rollout-strategy)
9. [Appendix: Complete Workflow Files](#appendix-complete-workflow-files)

---

## Project Analysis

### Technology Stack

| Component | Technology | CI/CD Implications |
|-----------|-----------|-------------------|
| **Frontend** | React 19 + Vite | Fast build, TypeScript compilation required |
| **Backend** | Rust (Tauri 2) | Rust toolchain setup, Cargo build + test |
| **Package Manager** | npm | Node 24.12.0 required (via Volta) |
| **Testing** | Vitest (unit) + Playwright (e2e) | Parallel test execution possible |
| **Linting** | ESLint, Prettier, Stylelint, Clippy | Multiple linters to coordinate |
| **Build Tool** | Vite + Tauri CLI | Multi-stage build process |

### Current Quality Gates (Local)

From `package.json` analysis:

```bash
# Pre-commit (via Husky + lint-staged)
- Stylelint (CSS)
- ESLint (JS/TS)
- Rust fmt
- Prettier

# Pre-push (via Husky)
- Lockfile validation

# Available npm scripts
npm run check      # Type check + lockfile + Rust lint
npm run lint       # All linters (ESLint, Prettier, Stylelint, Clippy, Rust fmt)
npm run test:unit  # Vitest unit tests
npm run test:e2e   # Playwright e2e tests
npm run test:rust  # Cargo tests
npm run validate   # check + lint + test:unit (comprehensive)
npm run build      # TypeScript + Vite build
npm run tauri:build # Full Tauri application build
```

### Existing Git Setup

- **Branches:** `main` (release), `integration` (QA)
- **Remote:** `origin` (GitHub)
- **Commit Style:** Conventional commits (`chore:`, `task:`, etc.)
- **No existing GitHub Actions workflows**

---

## Branch Strategy

### Integration Branch (QA/Development)

**Purpose:** Pre-release testing and validation

**Triggers:**
- Push to `integration`
- Pull requests targeting `integration`

**Quality Gates:**
1. ✅ Linting (all linters)
2. ✅ Type checking
3. ✅ Unit tests (JavaScript/TypeScript + Rust)
4. ✅ E2E tests (Playwright)
5. ✅ Build verification (no artifacts)

**Build Targets:** macOS only (fast feedback, representative platform)

**Success Criteria:** All checks pass, no artifacts generated

---

### Main Branch (Production Release)

**Purpose:** Production deployment and release

**Triggers:**
- Push to `main`
- Manual workflow dispatch (for hotfixes)

**Quality Gates:**
1. ✅ All integration checks (inherited)
2. ✅ Multi-platform builds (macOS, Windows, Linux)
3. ✅ Artifact generation
4. ✅ Release creation (on version tag)

**Build Targets:** macOS, Windows, Linux (full cross-platform build)

**Success Criteria:** All checks pass + release artifacts generated

---

## CI/CD Architecture

### High-Level Pipeline Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    INTEGRATION BRANCH                        │
├─────────────────────────────────────────────────────────────┤
│  Trigger: Push/PR → integration                              │
│                                                              │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌──────────┐│
│  │   Lint    │  │   Types   │  │   Tests   │  │  Build   ││
│  │  (fast)   │  │  (fast)   │  │ (parallel)│  │  (macOS) ││
│  └───────────┘  └───────────┘  └───────────┘  └──────────┘│
│       ↓              ↓              ↓              ↓        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         ✅ Pass → Ready for main merge               │   │
│  │         ❌ Fail → Block merge                        │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      MAIN BRANCH                             │
├─────────────────────────────────────────────────────────────┤
│  Trigger: Push → main (merge/tag)                            │
│                                                              │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐               │
│  │   Lint    │  │   Types   │  │   Tests   │               │
│  │  (fast)   │  │  (fast)   │  │ (parallel)│               │
│  └───────────┘  └───────────┘  └───────────┘               │
│       ↓              ↓              ↓                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │      Multi-Platform Build Matrix                     │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │   │
│  │  │  macOS   │  │ Windows  │  │  Linux   │          │   │
│  │  │  (ARM64  │  │ (x64)    │  │ (x64)    │          │   │
│  │  │  +x64)   │  │          │  │          │          │   │
│  │  └──────────┘  └──────────┘  └──────────┘          │   │
│  └─────────────────────────────────────────────────────┘   │
│       ↓              ↓              ↓                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  If tagged (v*): Create GitHub Release               │   │
│  │  - Upload macOS .dmg/.app                            │   │
│  │  - Upload Windows .exe/.msi                          │   │
│  │  - Upload Linux .deb/.AppImage                       │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Job Dependencies & Parallelization

```yaml
# Integration Branch
jobs:
  lint:           # Runs independently (fast: ~1-2 min)
  typecheck:      # Runs independently (fast: ~1 min)
  test-unit:      # Runs independently (medium: ~2-3 min)
  test-e2e:       # Runs independently (slow: ~3-5 min)
  test-rust:      # Runs independently (medium: ~2-3 min)
  build-check:    # Depends on: lint, typecheck, test-* (slow: ~5-7 min)

# Main Branch
jobs:
  lint:           # Runs independently
  typecheck:      # Runs independently
  test-unit:      # Runs independently
  test-e2e:       # Runs independently
  test-rust:      # Runs independently
  build-matrix:   # Depends on: all tests passing
    - macos-latest
    - windows-latest
    - ubuntu-latest
  release:        # Depends on: build-matrix (if tagged)
```

**Total Pipeline Times (Estimated):**
- Integration: ~5-7 minutes (parallel execution)
- Main (no release): ~15-20 minutes (multi-platform builds)
- Main (with release): ~20-25 minutes (builds + release creation)

---

## Workflow Specifications

### Integration Workflow: `ci-integration.yml`

**File:** `.github/workflows/ci-integration.yml`

#### Triggers

```yaml
on:
  push:
    branches: [integration]
  pull_request:
    branches: [integration]
```

#### Jobs

##### 1. **lint** Job
- **Purpose:** Run all linters (ESLint, Prettier, Stylelint, Clippy, Rust fmt)
- **Platform:** ubuntu-latest (fastest)
- **Duration:** ~1-2 minutes
- **Commands:**
  ```bash
  npm run lint
  ```

##### 2. **typecheck** Job
- **Purpose:** TypeScript type checking
- **Platform:** ubuntu-latest
- **Duration:** ~1 minute
- **Commands:**
  ```bash
  npm run check:types
  npm run check:lockfile
  ```

##### 3. **test-unit** Job
- **Purpose:** Run Vitest unit tests
- **Platform:** ubuntu-latest
- **Duration:** ~2-3 minutes
- **Commands:**
  ```bash
  npm run test:unit
  ```
- **Artifacts:** Coverage reports (optional)

##### 4. **test-e2e** Job
- **Purpose:** Run Playwright e2e tests
- **Platform:** ubuntu-latest
- **Duration:** ~3-5 minutes
- **Commands:**
  ```bash
  npx playwright install --with-deps chromium
  npm run test:e2e
  ```
- **Artifacts:** Playwright HTML report (on failure)

##### 5. **test-rust** Job
- **Purpose:** Run Rust unit tests
- **Platform:** ubuntu-latest
- **Duration:** ~2-3 minutes
- **Commands:**
  ```bash
  npm run test:rust
  ```

##### 6. **build-check** Job
- **Purpose:** Verify builds successfully (no artifacts)
- **Platform:** macos-latest (representative platform)
- **Duration:** ~5-7 minutes
- **Depends On:** lint, typecheck, test-unit, test-e2e, test-rust
- **Commands:**
  ```bash
  npm run build
  npm run tauri build -- --debug
  ```

---

### Main Workflow: `ci-main.yml`

**File:** `.github/workflows/ci-main.yml`

#### Triggers

```yaml
on:
  push:
    branches: [main]
    tags: ['v*']
  workflow_dispatch:  # Manual trigger
```

#### Jobs

##### Jobs 1-5: Same as Integration
(lint, typecheck, test-unit, test-e2e, test-rust)

##### 6. **build** Job (Matrix Strategy)
- **Purpose:** Build Tauri application for all platforms
- **Platform:** Matrix [macos-latest, windows-latest, ubuntu-latest]
- **Duration:** ~10-15 minutes per platform
- **Depends On:** lint, typecheck, test-unit, test-e2e, test-rust
- **Commands:**
  ```bash
  npm run build
  npm run tauri:build
  ```
- **Artifacts:**
  - macOS: `.dmg`, `.app` bundles
  - Windows: `.exe`, `.msi` installers
  - Linux: `.deb`, `.AppImage` packages

##### 7. **release** Job (Conditional)
- **Purpose:** Create GitHub release with build artifacts
- **Platform:** ubuntu-latest
- **Duration:** ~2-3 minutes
- **Depends On:** build (all platforms)
- **Condition:** `startsWith(github.ref, 'refs/tags/v')`
- **Commands:**
  - Download all build artifacts
  - Create GitHub release
  - Upload artifacts to release
- **Uses:** `actions/create-release@v1` + `actions/upload-release-asset@v1`

---

## Implementation Plan

### Phase 1: Foundation Setup (Day 1)

#### Step 1.1: Create Workflow Directory
```bash
mkdir -p .github/workflows
```

#### Step 1.2: Create Integration Workflow
- Create `.github/workflows/ci-integration.yml`
- Start with basic jobs (lint, typecheck, test-unit)
- Test on a feature branch first

#### Step 1.3: Validate Integration Workflow
- Create test branch: `feature/ci-setup`
- Push to trigger workflow
- Verify all jobs run successfully
- Iterate on any failures

**Success Criteria:**
- ✅ Integration workflow runs on push
- ✅ All basic jobs pass (lint, typecheck, test-unit)

---

### Phase 2: Enhanced Integration Testing (Day 2)

#### Step 2.1: Add E2E Testing
- Add Playwright job to integration workflow
- Configure Playwright browser dependencies
- Test on feature branch

#### Step 2.2: Add Rust Testing
- Add Rust test job
- Configure Rust toolchain setup
- Verify Cargo tests run

#### Step 2.3: Add Build Verification
- Add macOS build job
- Configure dependencies (lint, typecheck, all tests)
- Verify build succeeds without artifacts

**Success Criteria:**
- ✅ E2E tests run successfully
- ✅ Rust tests pass
- ✅ Build verification completes

---

### Phase 3: Main Branch Pipeline (Day 3)

#### Step 3.1: Create Main Workflow
- Create `.github/workflows/ci-main.yml`
- Copy integration jobs (lint through test-rust)
- Add build matrix for multi-platform

#### Step 3.2: Configure Build Matrix
- Add matrix strategy: [macos-latest, windows-latest, ubuntu-latest]
- Configure platform-specific Tauri dependencies
- Test build on each platform

#### Step 3.3: Test Main Workflow
- Merge CI setup to integration
- Merge integration to main
- Verify main workflow triggers
- Verify multi-platform builds succeed

**Success Criteria:**
- ✅ Main workflow triggers on push to main
- ✅ Builds succeed on all platforms
- ✅ Artifacts generated correctly

---

### Phase 4: Release Automation (Day 4)

#### Step 4.1: Add Release Job
- Add conditional release job to main workflow
- Configure artifact download
- Set up GitHub release creation

#### Step 4.2: Configure Version Tagging
- Document version tagging strategy
- Create test tag: `v0.1.0-alpha.1`
- Verify release job triggers

#### Step 4.3: Test Release Flow
- Tag a test release
- Verify artifacts uploaded to release
- Test downloading and installing artifacts

**Success Criteria:**
- ✅ Release created on version tag
- ✅ All platform artifacts uploaded
- ✅ Release notes generated

---

### Phase 5: Optimization & Documentation (Day 5)

#### Step 5.1: Optimize Caching
- Add npm dependency caching
- Add Rust/Cargo caching
- Measure speed improvements

#### Step 5.2: Add Status Badges
- Add GitHub Actions badges to README
- Document CI/CD pipeline
- Add troubleshooting guide

#### Step 5.3: Team Training
- Document workflow triggers
- Document release process
- Document troubleshooting steps

**Success Criteria:**
- ✅ Pipeline runs 20-30% faster with caching
- ✅ Documentation complete
- ✅ Team trained on new workflows

---

## Security Considerations

### Secret Management

#### Required Secrets
None required for basic CI/CD (GitHub provides `GITHUB_TOKEN` automatically)

#### Optional Secrets (Future)
- `CODE_SIGNING_CERT` - For macOS app signing
- `APPLE_ID` / `APPLE_PASSWORD` - For macOS notarization
- `WINDOWS_CERT` - For Windows code signing

### Access Control

#### Branch Protection Rules

**Integration Branch:**
```yaml
Required status checks:
  - lint
  - typecheck
  - test-unit
  - test-e2e
  - test-rust
  - build-check
Require review: 0 (optional)
Require up-to-date branch: true
```

**Main Branch:**
```yaml
Required status checks:
  - lint
  - typecheck
  - test-unit
  - test-e2e
  - test-rust
  - build / macos-latest
  - build / windows-latest
  - build / ubuntu-latest
Require review: 1 (recommended)
Require up-to-date branch: true
Restrict push: Admins only
```

### Dependency Security

#### Dependabot Configuration

Create `.github/dependabot.yml`:

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 5

  - package-ecosystem: "cargo"
    directory: "/src-tauri"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 5

  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 5
```

---

## Monitoring & Maintenance

### Monitoring Strategy

#### Key Metrics to Track
1. **Pipeline Success Rate** - Target: >95%
2. **Average Pipeline Duration** - Integration: <7 min, Main: <20 min
3. **Flaky Test Rate** - Target: <2%
4. **Cache Hit Rate** - Target: >80%

#### Monitoring Tools
- GitHub Actions built-in analytics
- Custom dashboard (optional): Use GitHub API to track metrics
- Alerting: GitHub notifications + Slack/Discord webhooks (optional)

### Maintenance Schedule

#### Weekly
- Review failed pipeline runs
- Address flaky tests
- Check dependency updates (Dependabot PRs)

#### Monthly
- Review pipeline performance metrics
- Optimize slow jobs
- Update GitHub Actions versions

#### Quarterly
- Review and update documentation
- Audit security configurations
- Review caching strategy effectiveness

---

## Rollout Strategy

### Stage 1: Soft Launch (Week 1)
- ✅ Create workflows on feature branch
- ✅ Test thoroughly before merging
- ✅ Merge to integration first
- ❌ Do NOT enforce branch protection yet

### Stage 2: Integration Enforcement (Week 2)
- ✅ Verify integration workflow stability
- ✅ Enable branch protection on integration
- ✅ Require all checks to pass
- ❌ Main branch not yet enforced

### Stage 3: Main Branch Enforcement (Week 3)
- ✅ Verify main workflow stability
- ✅ Enable branch protection on main
- ✅ Require all checks to pass
- ✅ Require review before merge

### Stage 4: Release Automation (Week 4)
- ✅ Test release workflow with alpha tags
- ✅ Document release process
- ✅ Enable automatic releases

### Rollback Plan

If issues occur:
1. Disable branch protection temporarily
2. Fix workflow issues on feature branch
3. Re-test thoroughly before re-enabling
4. Communicate status to team

---

## Cost Considerations

### GitHub Actions Minutes

**Free Tier (Public Repo):**
- ✅ Unlimited minutes for public repositories

**Free Tier (Private Repo):**
- ❌ 2,000 minutes/month (Linux)
- ❌ 1,000 minutes/month (macOS - 10x multiplier)
- ❌ 2,000 minutes/month (Windows - 2x multiplier)

**Estimated Usage (Private Repo):**

Per integration push:
- Linux jobs: ~10 minutes actual = 10 billed minutes
- macOS build: ~7 minutes actual = 70 billed minutes
- **Total per push: ~80 minutes**

Per main push (with multi-platform builds):
- Linux jobs: ~15 minutes actual = 15 billed minutes
- macOS build: ~10 minutes actual = 100 billed minutes
- Windows build: ~12 minutes actual = 24 billed minutes
- **Total per push: ~139 minutes**

**Monthly estimate (10 integration + 5 main pushes):**
- Integration: 10 × 80 = 800 minutes
- Main: 5 × 139 = 695 minutes
- **Total: ~1,495 minutes/month**

**Recommendation:** If private repo and approaching limits, consider:
- Self-hosted runners for Linux jobs
- Optimize caching to reduce build times
- Limit macOS builds to main branch only

---

## Appendix: Complete Workflow Files

### A.1: Integration Workflow

**File:** `.github/workflows/ci-integration.yml`

```yaml
name: CI - Integration

on:
  push:
    branches: [integration]
  pull_request:
    branches: [integration]

# Cancel in-progress runs when a new run is triggered
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

env:
  NODE_VERSION: '24.12.0'

jobs:
  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linters
        run: npm run lint

  typecheck:
    name: Type Check
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Check types
        run: npm run check:types

      - name: Validate lockfile
        run: npm run check:lockfile

  test-unit:
    name: Unit Tests
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:unit

      - name: Upload coverage reports
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: coverage-reports
          path: coverage/
          retention-days: 7

  test-e2e:
    name: E2E Tests
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload Playwright report
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7

  test-rust:
    name: Rust Tests
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Rust
        uses: dtolnay/rust-toolchain@stable
        with:
          components: rustfmt, clippy

      - name: Cache Cargo dependencies
        uses: actions/cache@v4
        with:
          path: |
            ~/.cargo/bin/
            ~/.cargo/registry/index/
            ~/.cargo/registry/cache/
            ~/.cargo/git/db/
            src-tauri/target/
          key: ${{ runner.os }}-cargo-${{ hashFiles('**/Cargo.lock') }}
          restore-keys: |
            ${{ runner.os }}-cargo-

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run Rust tests
        run: npm run test:rust

  build-check:
    name: Build Verification (macOS)
    runs-on: macos-latest
    needs: [lint, typecheck, test-unit, test-e2e, test-rust]
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Setup Rust
        uses: dtolnay/rust-toolchain@stable

      - name: Cache Cargo dependencies
        uses: actions/cache@v4
        with:
          path: |
            ~/.cargo/bin/
            ~/.cargo/registry/index/
            ~/.cargo/registry/cache/
            ~/.cargo/git/db/
            src-tauri/target/
          key: ${{ runner.os }}-cargo-${{ hashFiles('**/Cargo.lock') }}
          restore-keys: |
            ${{ runner.os }}-cargo-

      - name: Install dependencies
        run: npm ci

      - name: Build frontend
        run: npm run build

      - name: Build Tauri (debug mode)
        run: npm run tauri build -- --debug

      - name: Verify build artifacts
        run: |
          echo "Checking for build artifacts..."
          ls -lah src-tauri/target/debug/bundle/ || echo "No bundle directory found (expected in debug mode)"
```

---

### A.2: Main/Release Workflow

**File:** `.github/workflows/ci-main.yml`

```yaml
name: CI/CD - Main & Release

on:
  push:
    branches: [main]
    tags:
      - 'v*'
  workflow_dispatch:

# Cancel in-progress runs when a new run is triggered
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

env:
  NODE_VERSION: '24.12.0'

jobs:
  # Reuse lint, typecheck, and test jobs from integration workflow
  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linters
        run: npm run lint

  typecheck:
    name: Type Check
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Check types
        run: npm run check:types

      - name: Validate lockfile
        run: npm run check:lockfile

  test-unit:
    name: Unit Tests
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:unit

  test-e2e:
    name: E2E Tests
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium

      - name: Run E2E tests
        run: npm run test:e2e

  test-rust:
    name: Rust Tests
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Rust
        uses: dtolnay/rust-toolchain@stable
        with:
          components: rustfmt, clippy

      - name: Cache Cargo dependencies
        uses: actions/cache@v4
        with:
          path: |
            ~/.cargo/bin/
            ~/.cargo/registry/index/
            ~/.cargo/registry/cache/
            ~/.cargo/git/db/
            src-tauri/target/
          key: ${{ runner.os }}-cargo-${{ hashFiles('**/Cargo.lock') }}
          restore-keys: |
            ${{ runner.os }}-cargo-

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run Rust tests
        run: npm run test:rust

  build:
    name: Build - ${{ matrix.platform }}
    runs-on: ${{ matrix.os }}
    needs: [lint, typecheck, test-unit, test-e2e, test-rust]
    strategy:
      fail-fast: false
      matrix:
        include:
          - platform: 'macos-latest'
            os: macos-latest
            target: 'universal-apple-darwin'
          - platform: 'ubuntu-latest'
            os: ubuntu-latest
            target: 'x86_64-unknown-linux-gnu'
          - platform: 'windows-latest'
            os: windows-latest
            target: 'x86_64-pc-windows-msvc'

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Setup Rust
        uses: dtolnay/rust-toolchain@stable
        with:
          targets: ${{ matrix.target }}

      - name: Install dependencies (Ubuntu)
        if: matrix.platform == 'ubuntu-latest'
        run: |
          sudo apt-get update
          sudo apt-get install -y libwebkit2gtk-4.1-dev \
            build-essential \
            curl \
            wget \
            file \
            libssl-dev \
            libayatana-appindicator3-dev \
            librsvg2-dev

      - name: Cache Cargo dependencies
        uses: actions/cache@v4
        with:
          path: |
            ~/.cargo/bin/
            ~/.cargo/registry/index/
            ~/.cargo/registry/cache/
            ~/.cargo/git/db/
            src-tauri/target/
          key: ${{ runner.os }}-cargo-${{ hashFiles('**/Cargo.lock') }}
          restore-keys: |
            ${{ runner.os }}-cargo-

      - name: Install npm dependencies
        run: npm ci

      - name: Build frontend
        run: npm run build

      - name: Build Tauri application
        run: npm run tauri:build

      - name: Upload artifacts (macOS)
        if: matrix.platform == 'macos-latest'
        uses: actions/upload-artifact@v4
        with:
          name: macos-builds
          path: |
            src-tauri/target/release/bundle/dmg/*.dmg
            src-tauri/target/release/bundle/macos/*.app
          retention-days: 7

      - name: Upload artifacts (Windows)
        if: matrix.platform == 'windows-latest'
        uses: actions/upload-artifact@v4
        with:
          name: windows-builds
          path: |
            src-tauri/target/release/bundle/msi/*.msi
            src-tauri/target/release/bundle/nsis/*.exe
          retention-days: 7

      - name: Upload artifacts (Linux)
        if: matrix.platform == 'ubuntu-latest'
        uses: actions/upload-artifact@v4
        with:
          name: linux-builds
          path: |
            src-tauri/target/release/bundle/deb/*.deb
            src-tauri/target/release/bundle/appimage/*.AppImage
          retention-days: 7

  release:
    name: Create Release
    runs-on: ubuntu-latest
    needs: [build]
    if: startsWith(github.ref, 'refs/tags/v')
    permissions:
      contents: write
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Download all artifacts
        uses: actions/download-artifact@v4
        with:
          path: ./artifacts

      - name: Display artifact structure
        run: ls -R ./artifacts

      - name: Create Release
        uses: softprops/action-gh-release@v1
        with:
          draft: true
          generate_release_notes: true
          files: |
            ./artifacts/macos-builds/**/*
            ./artifacts/windows-builds/**/*
            ./artifacts/linux-builds/**/*
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

### A.3: Dependabot Configuration

**File:** `.github/dependabot.yml`

```yaml
version: 2
updates:
  # npm dependencies
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "09:00"
    open-pull-requests-limit: 5
    labels:
      - "dependencies"
      - "npm"
    commit-message:
      prefix: "chore(deps)"
      include: "scope"

  # Cargo (Rust) dependencies
  - package-ecosystem: "cargo"
    directory: "/src-tauri"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "09:00"
    open-pull-requests-limit: 5
    labels:
      - "dependencies"
      - "rust"
    commit-message:
      prefix: "chore(deps)"
      include: "scope"

  # GitHub Actions
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "09:00"
    open-pull-requests-limit: 3
    labels:
      - "dependencies"
      - "github-actions"
    commit-message:
      prefix: "chore(deps)"
      include: "scope"
```

---

## Implementation Checklist

Use this checklist during implementation:

### Pre-Implementation
- [ ] Review this plan with team
- [ ] Ensure all local tests pass (`npm run validate`)
- [ ] Backup current codebase
- [ ] Create feature branch: `feature/github-actions-setup`

### Phase 1: Foundation
- [ ] Create `.github/workflows/` directory
- [ ] Create `ci-integration.yml` with basic jobs
- [ ] Test on feature branch
- [ ] Verify lint job passes
- [ ] Verify typecheck job passes
- [ ] Verify test-unit job passes

### Phase 2: Enhanced Testing
- [ ] Add test-e2e job to integration workflow
- [ ] Add test-rust job to integration workflow
- [ ] Add build-check job to integration workflow
- [ ] Test all jobs on feature branch
- [ ] Fix any failing jobs

### Phase 3: Main Pipeline
- [ ] Create `ci-main.yml` with all jobs from integration
- [ ] Add build matrix for multi-platform
- [ ] Test main workflow on feature branch merge
- [ ] Verify all platform builds succeed
- [ ] Verify artifacts generated

### Phase 4: Release Automation
- [ ] Add release job to main workflow
- [ ] Create test tag `v0.1.0-alpha.1`
- [ ] Verify release creation
- [ ] Verify artifact upload
- [ ] Test downloading artifacts

### Phase 5: Finalization
- [ ] Add dependency caching to all jobs
- [ ] Create `dependabot.yml`
- [ ] Add GitHub Actions status badges to README
- [ ] Document CI/CD pipeline in project docs
- [ ] Enable branch protection on integration
- [ ] Enable branch protection on main
- [ ] Train team on new workflows

### Post-Implementation
- [ ] Monitor first 10 pipeline runs
- [ ] Address any flaky tests
- [ ] Optimize slow jobs
- [ ] Gather team feedback
- [ ] Schedule first maintenance review

---

## Troubleshooting Guide

### Common Issues & Solutions

#### Issue: "npm ci failed - lockfile out of date"
**Solution:**
```bash
# Locally regenerate lockfile
npm install
git add package-lock.json
git commit -m "chore: update lockfile"
```

#### Issue: "Playwright tests fail in CI but pass locally"
**Solution:**
```yaml
# Add to test-e2e job
- name: Run E2E tests
  run: npm run test:e2e
  env:
    CI: true  # Ensures CI-specific Playwright config
```

#### Issue: "Tauri build fails - missing system dependencies"
**Solution:** Verify platform-specific dependencies are installed:
- macOS: Xcode Command Line Tools
- Windows: Visual Studio Build Tools
- Linux: webkit2gtk, libssl-dev, etc. (see Linux build step)

#### Issue: "Build takes too long (>30 minutes)"
**Solution:**
1. Verify caching is working
2. Consider disabling some platforms in integration
3. Optimize Rust build with `--release` flag only on main

#### Issue: "Release artifacts missing or incomplete"
**Solution:** Check artifact paths in build jobs match upload paths

---

## Next Steps After Implementation

1. **Week 1-2:** Monitor pipeline stability, address flaky tests
2. **Week 3:** Add code signing for macOS (requires Apple Developer account)
3. **Week 4:** Add code signing for Windows (requires certificate)
4. **Month 2:** Implement automatic changelog generation
5. **Month 3:** Add performance regression testing
6. **Quarter 2:** Evaluate self-hosted runners for cost optimization

---

## Document Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-31 | BMad Master | Initial comprehensive plan |

---

## Approval & Sign-Off

**Prepared By:** BMad Master  
**Review Required By:** Tim Goshinski (Project Owner)  
**Implementation Start Date:** TBD  
**Target Completion Date:** TBD (Estimated 5 days)  

---

**End of CI/CD Implementation Plan**

*This document is a living plan and should be updated as implementation progresses and requirements evolve.*
