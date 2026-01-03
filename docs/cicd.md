# CI/CD Pipeline Guide

> Comprehensive guide to the Prompt Alchemist CI/CD pipelines, branch strategy, and release process

## Table of Contents

1. [Quick Start for New Developers](#quick-start-for-new-developers)
2. [Overview](#overview)
3. [Workflows (Integration vs Main)](#workflows-integration-vs-main)
4. [Branch Strategy](#branch-strategy)
5. [Quality Gates](#quality-gates)
6. [Triggering Workflows](#triggering-workflows)
7. [Release Process](#release-process)
8. [Build Artifacts](#build-artifacts)
9. [Caching Strategy](#caching-strategy)
10. [Troubleshooting](#troubleshooting)
11. [Performance Metrics](#performance-metrics)

---

## Quick Start for New Developers

**Your first PR workflow:**
1. Push your feature branch to trigger checks on `integration` branch
2. Wait for all quality gates to pass (green checkmarks)
3. Address any failures by clicking the red badge → viewing logs → checking the troubleshooting section below
4. Once green, your PR is ready for review and merge

**Daily development:**
- `integration` branch = QA environment (all checks run, fast feedback)
- `main` branch = Production releases (full multi-platform builds)
- CI/CD badges in README show current build status at a glance
- Click any badge to view detailed workflow run logs

**Need help?** Jump to [Troubleshooting](#troubleshooting) for common error solutions.

---

## Overview

Prompt Alchemist uses **GitHub Actions** for automated CI/CD with two distinct workflows optimized for different purposes:

### Why Two Workflows?

**Integration Workflow (`ci-integration.yml`)**
- **Purpose:** Fast feedback for development and QA
- **Branch:** `integration`
- **Target Duration:** <7 minutes (performance target; see Story 0.5)
- **Build Target:** macOS only (representative platform)
- **Artifacts:** None (validation only)

**Main Workflow (`ci-main.yml`)**
- **Purpose:** Production releases and multi-platform builds
- **Branch:** `main`
- **Target Duration:** <20 minutes (performance target; see Story 0.5)
- **Build Targets:** macOS, Windows, Linux
- **Artifacts:** Platform-specific installers (.dmg, .exe, .deb, .AppImage)

### Key Benefits

- ✅ **Automated Quality Gates** – Linting, type checking, and testing on every commit
- ✅ **Fast Feedback** – Integration checks complete in <7 minutes via parallel execution
- ✅ **Multi-Platform Support** – Automated builds for macOS, Windows, and Linux
- ✅ **Release Automation** – Tag-based releases with automatic artifact uploads
- ✅ **Performance Optimized** – npm and Cargo caching for 30-50% faster builds

---

## Workflows (Integration vs Main)

### Comparison Table

| Feature | Integration Workflow | Main Workflow |
|---------|---------------------|---------------|
| **Branch** | `integration` | `main` |
| **Trigger** | Push, PR to integration | Push to main, manual dispatch |
| **Quality Gates** | All (lint, types, tests) | All (inherited from integration) |
| **Build Platforms** | macOS only | macOS, Windows, Linux |
| **Artifacts** | None | Platform installers |
| **Release Creation** | No | Yes (on version tags) |
| **Target Time** | <7 minutes | <20 minutes |
| **Purpose** | Fast QA validation | Production deployment |

### Integration Workflow Jobs

```
┌───────────────────────────────────────────────────────────┐
│                 INTEGRATION WORKFLOW                       │
├───────────────────────────────────────────────────────────┤
│  Runs in parallel:                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │   Lint   │  │   Types  │  │  Unit    │  │   E2E    │ │
│  │  (~2min) │  │  (~1min) │  │  Tests   │  │  Tests   │ │
│  │          │  │          │  │  (~3min) │  │  (~5min) │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │
│                                                            │
│  ┌──────────┐                                             │
│  │   Rust   │                                             │
│  │  Tests   │                                             │
│  │  (~3min) │                                             │
│  └──────────┘                                             │
│       ↓                                                    │
│  After all tests pass:                                    │
│  ┌──────────────────────────────────────┐                │
│  │  Build Check (macOS)                 │                │
│  │  Verify build succeeds               │                │
│  │  No artifacts generated              │                │
│  │  (~7min including setup)             │                │
│  └──────────────────────────────────────┘                │
└───────────────────────────────────────────────────────────┘
```

### Main Workflow Jobs

```
┌───────────────────────────────────────────────────────────┐
│                    MAIN WORKFLOW                           │
├───────────────────────────────────────────────────────────┤
│  Phase 1: Quality Gates (inherited from integration)      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │   Lint   │  │   Types  │  │  Tests   │  │   Rust   │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │
│                                                            │
│  Phase 2: Multi-Platform Builds (parallel)                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   macOS      │  │   Windows    │  │   Linux      │   │
│  │   (ARM64     │  │   (x64)      │  │   (x64)      │   │
│  │   + x64)     │  │              │  │              │   │
│  │   (~15min)   │  │   (~12min)   │  │   (~10min)   │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
│        ↓                  ↓                  ↓            │
│  ┌──────────────────────────────────────────────────┐    │
│  │  If tagged (v*): Create GitHub Release           │    │
│  │  Upload: .dmg, .exe, .msi, .deb, .AppImage       │    │
│  └──────────────────────────────────────────────────┘    │
└───────────────────────────────────────────────────────────┘
```

---

## Branch Strategy

### Branch Purposes

#### `integration` Branch
**Use for:** Development, QA, pre-release testing

**Workflow:**
1. Create feature branch from `integration`
2. Develop your feature
3. Push to remote → Integration workflow runs
4. Create PR to `integration`
5. Wait for all checks to pass (green)
6. Merge when approved

**Quality gates:** All checks run (lint, types, tests, build verification)
**Build:** macOS only (fast feedback)
**Artifacts:** None

#### `main` Branch
**Use for:** Production releases, stable code

**Workflow:**
1. Merge from `integration` to `main` (after QA approval)
2. Main workflow runs automatically
3. Multi-platform builds generate artifacts
4. (Optional) Create version tag for GitHub release

**Quality gates:** Same as integration (all checks)
**Build:** macOS, Windows, Linux (full matrix)
**Artifacts:** Platform installers

### Typical Development Flow

```
feature/my-feature
       ↓
    [Develop + Test Locally]
       ↓
  Push to remote
       ↓
  ┌─────────────────────────┐
  │  Integration Workflow   │  ← Fast QA validation
  │  Runs automatically     │
  └─────────────────────────┘
       ↓
  PR to integration
       ↓
  [Code Review + Approval]
       ↓
  Merge to integration
       ↓
  [QA Testing]
       ↓
  Merge to main
       ↓
  ┌─────────────────────────┐
  │  Main Workflow          │  ← Multi-platform builds
  │  Runs automatically     │
  └─────────────────────────┘
       ↓
  (Optional) Tag release
       ↓
  ┌─────────────────────────┐
  │  GitHub Release Created │
  │  Artifacts uploaded     │
  └─────────────────────────┘
```

---

## Quality Gates

Both workflows run the same quality gates to ensure code quality and correctness.

### 1. Lint Job (~1-2 minutes)

**Purpose:** Enforce code style and catch common errors

**Checks:**
- ESLint (JavaScript/TypeScript code quality)
- Prettier (code formatting)
- Stylelint (CSS/Tailwind formatting)
- Clippy (Rust linting)
- rustfmt (Rust formatting)

**Command:** `npm run lint`

**Platform:** Ubuntu (fastest for non-build checks)

**Common failures:**
- `console.log()` in non-test files (ESLint rule)
- Unused variables or imports
- Incorrect code formatting
- Rust clippy warnings (treated as errors)

**Fix:** Run `npm run fix` locally to auto-fix most issues

---

### 2. Typecheck Job (~1 minute)

**Purpose:** Verify TypeScript type safety and lockfile integrity

**Checks:**
- TypeScript compilation (no type errors)
- Lockfile validation (package-lock.json in sync with package.json)

**Commands:**
```bash
npm run check:types
npm run check:lockfile
```

**Platform:** Ubuntu

**Common failures:**
- Type errors (`Property 'foo' does not exist...`)
- Lockfile out of sync (run `npm install` locally)

**Fix:** Run `npm run check` locally to catch type errors before pushing

---

### 3. Unit Tests Job (~2-3 minutes)

**Purpose:** Run fast, isolated unit tests with Vitest

**Checks:**
- All unit tests in `src/**/*.test.ts(x)` pass
- No test failures or timeouts

**Command:** `npm run test:unit`

**Platform:** Ubuntu

**Common failures:**
- Test assertions fail (expected vs actual mismatch)
- Test timeouts (slow async operations)
- Mock setup errors

**Fix:** Run `npm run test:unit` locally to reproduce and debug

---

### 4. E2E Tests Job (~3-5 minutes)

**Purpose:** Run end-to-end tests with Playwright (browser automation)

**Checks:**
- All E2E tests in `tests/**/*.spec.ts` pass
- Tauri application launches and functions correctly
- No navigation or interaction errors

**Commands:**
```bash
npx playwright install --with-deps chromium
npm run test:e2e
```

**Platform:** Ubuntu (with Playwright system dependencies installed)

**Artifacts:** On failure, Playwright HTML report is uploaded for debugging

**Common failures:**
- Tauri app fails to launch (missing system dependencies)
- Element not found (timing issues, incorrect selectors)
- Test timeouts (slow app startup)

**Fix:** Run `npm run test:e2e` locally (or `npm run e2e:ui` for interactive mode)

---

### 5. Rust Tests Job (~2-3 minutes)

**Purpose:** Run Rust unit and integration tests

**Checks:**
- All Rust tests in `src-tauri/src/` pass
- Cargo test suite succeeds

**Command:** `npm run test:rust`

**Platform:** Ubuntu

**Common failures:**
- Rust test assertions fail
- Compilation errors in Rust code
- Missing Rust system dependencies

**Fix:** Run `npm run test:rust` locally (or `cd src-tauri && cargo test`)

---

### 6. Build Check / Build Job (varies by workflow)

**Integration:** Build Check (~5-7 minutes, macOS only, no artifacts)
**Main:** Build Matrix (~10-20 minutes, macOS + Windows + Linux, generates artifacts)

**Purpose:** Verify the application builds successfully for target platforms

**Checks:**
- Vite frontend build succeeds
- Tauri backend compiles (Rust)
- Application bundle is created

**Commands:**
```bash
npm run build              # Frontend build
npm run tauri:build        # Full Tauri build
```

**Platforms:**
- **Integration:** macOS-latest (single platform for speed)
- **Main:** macOS-latest, windows-latest, ubuntu-latest (full matrix)

**Common failures:**
- Vite build errors (import errors, missing modules)
- Rust compilation errors (cargo build failures)
- Tauri bundling errors (missing platform dependencies)

**Fix:** Run `npm run tauri:build` locally to reproduce

---

## Triggering Workflows

### Automatic Triggers

#### Integration Workflow
Runs automatically on:
- **Push to `integration` branch**
- **Pull requests targeting `integration` branch**

Example:
```bash
git checkout integration
git add .
git commit -m "feat: add new feature"
git push origin integration  # ← Triggers integration workflow
```

#### Main Workflow
Runs automatically on:
- **Push to `main` branch** (typically via merge from integration)
- **Version tags** (e.g., `v0.1.0`) for release creation

Example:
```bash
git checkout main
git merge integration         # Merge approved code
git push origin main          # ← Triggers main workflow

# For releases:
git tag v0.1.0                # Create version tag
git push origin v0.1.0        # ← Triggers main workflow + release
```

---

### Manual Triggers (Workflow Dispatch)

Both workflows support manual triggering from the GitHub Actions UI.

**How to manually trigger:**
1. Navigate to **Actions** tab in GitHub repository
2. Select workflow (`CI - Integration` or `CI/CD - Main & Release`)
3. Click **Run workflow** button (top right)
4. Select branch to run against
5. Click **Run workflow** (green button)

**Use cases for manual triggers:**
- Test workflow changes before merging
- Re-run failed builds without new commits
- Build release artifacts for a specific commit (main workflow)
- Validate PR from external contributor (integration workflow)

---

## Release Process

Creating releases is simple: tag a commit on `main` with a version number.

### Step-by-Step Release Guide

#### 1. Ensure Main is Ready
```bash
# Make sure you're on main and up-to-date
git checkout main
git pull origin main

# Verify integration workflow passed for the latest commit
# (Check GitHub Actions tab or README badge)
```

#### 2. Create Version Tag
```bash
# Tag format: v{major}.{minor}.{patch}
git tag v0.1.0

# View tag details
git tag -l
```

#### 3. Push Tag to Trigger Release
```bash
git push origin v0.1.0
```

#### 4. Monitor Release Creation
1. Go to **Actions** tab in GitHub
2. Find the "CI/CD - Main & Release" workflow run for your tag
3. Wait for multi-platform builds to complete (~20 minutes)
4. Release is automatically created at **Releases** tab with uploaded artifacts

#### 5. Verify Release
1. Go to **Releases** tab in repository
2. Confirm release exists with correct version (e.g., "v0.1.0")
3. Verify artifacts are attached:
   - macOS: `.dmg`, `.app`
   - Windows: `.exe`, `.msi`
   - Linux: `.deb`, `.AppImage`
4. Download and test installers (optional)

---

### Version Numbering (Semantic Versioning)

Follow [Semantic Versioning](https://semver.org/): `v{major}.{minor}.{patch}`

**Examples:**
- `v0.1.0` - Initial alpha release
- `v0.2.0` - Add new feature (minor version bump)
- `v0.2.1` - Bug fix (patch version bump)
- `v1.0.0` - First production-ready release (major version)

**Breaking changes:** Increment major version (e.g., `v1.0.0` → `v2.0.0`)
**New features:** Increment minor version (e.g., `v1.0.0` → `v1.1.0`)
**Bug fixes:** Increment patch version (e.g., `v1.0.0` → `v1.0.1`)

---

### Release Notes

After release is created, add release notes in GitHub:

1. Go to **Releases** tab
2. Click **Edit** on the new release
3. Add description:
   - What's new (features)
   - What's fixed (bug fixes)
   - Breaking changes (if any)
   - Known issues
4. Save release notes

---

## Build Artifacts

### Where to Find Artifacts

After the main workflow completes:

**Option 1: GitHub Releases (for tagged releases)**
1. Go to **Releases** tab
2. Click on release version (e.g., "v0.1.0")
3. Scroll to **Assets** section
4. Download platform-specific installer

**Option 2: GitHub Actions (for all builds)**
1. Go to **Actions** tab
2. Click on workflow run
3. Scroll to **Artifacts** section (bottom of page)
4. Download zip files for each platform

---

### Artifact Types by Platform

#### macOS
- **`.dmg`** - Disk image installer (recommended for distribution)
- **`.app`** - Application bundle (for direct use)

**Installation:**
1. Download `.dmg` file
2. Open `.dmg`
3. Drag "Prompt Alchemist" to Applications folder

---

#### Windows
- **`.exe`** - Executable installer (recommended)
- **`.msi`** - Windows Installer package (enterprise deployments)

**Installation:**
1. Download `.exe` file
2. Run installer
3. Follow installation wizard

---

#### Linux
- **`.deb`** - Debian/Ubuntu package (apt-compatible)
- **`.AppImage`** - Portable executable (universal Linux)

**Installation (.deb):**
```bash
sudo dpkg -i prompt-alchemist_0.1.0_amd64.deb
```

**Installation (.AppImage):**
```bash
chmod +x prompt-alchemist_0.1.0_amd64.AppImage
./prompt-alchemist_0.1.0_amd64.AppImage
```

---

### Artifact Retention

- **Release artifacts:** Permanent (stored with GitHub Release)
- **Workflow artifacts:** 90 days (GitHub Actions default)

**Tip:** Always create tagged releases for production deployments to ensure artifacts are permanently available.

---

## Caching Strategy

Both workflows use caching to speed up builds and reduce CI minutes.

### npm Caching (Automatic)

**Action:** `actions/setup-node@v4` with `cache: 'npm'`

**How it works:**
1. Cache key is based on `package-lock.json` hash
2. On cache hit: Restores `~/.npm` cache (~20-30 seconds)
3. On cache miss: Runs `npm ci` and caches result (~2 minutes)
4. Cache automatically invalidates when lockfile changes

**Cache behavior:**
```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: 24.12.0
    cache: 'npm'  # ← Automatic caching
```

**Performance impact:**
- Cache hit: ~20-30 seconds (restore cache + verify)
- Cache miss: ~2 minutes (full `npm ci`)
- **Speed improvement:** 1.5-2 minutes saved per job

---

### Cargo Caching (Explicit)

**Action:** `actions/cache@v4`

**Cached directories:**
- `~/.cargo/bin/`
- `~/.cargo/registry/index/`
- `~/.cargo/registry/cache/`
- `~/.cargo/git/db/`
- `src-tauri/target/` (build artifacts)

**How it works:**
1. Cache key: `{OS}-cargo-{Cargo.lock hash}`
2. On cache hit: Restores all directories (~30-60 seconds)
3. On cache miss: Full Cargo build, then caches result (~5-10 minutes)
4. Uses restore-keys for partial matches (faster than full rebuild)

**Cache behavior:**
```yaml
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
```

**Performance impact:**
- Cache hit: ~30-60 seconds (restore + incremental build)
- Cache miss: ~5-10 minutes (full Cargo build)
- **Speed improvement:** 4-9 minutes saved per Rust job

---

### Cache Storage Limits

- **Total cache size:** 10 GB per repository
- **Retention:** 7 days unused, then evicted (LRU)
- **Cache key strategy:** OS-specific keys to avoid conflicts

**Example cache sizes:**
- npm cache: ~200-500 MB
- Cargo cache: ~1-2 GB per platform (macOS, Windows, Linux)

---

### When Caches Invalidate

**Automatic invalidation:**
- `package-lock.json` changes → npm cache invalidated
- `Cargo.lock` changes → Cargo cache invalidated
- 7 days of inactivity → cache evicted

**Manual cache invalidation:**
Not usually needed, but useful for debugging cache-related issues.

---

### Manual Cache Clearing

**When to clear cache:**
- Major dependency upgrades (e.g., React 18 → 19)
- Lockfile corruption or conflicts
- Debugging persistent cache-related build issues
- **Not needed for normal development** (automatic invalidation works)

**How to clear cache:**
1. Go to repository **Settings** → **Actions** → **Caches**
2. Search for specific cache or view all
3. Click **Delete** button next to cache entry
4. Next workflow run will rebuild cache from scratch

**Alternative:** Change cache key in workflow file (forces cache miss)

---

## Troubleshooting

### Common Errors and Solutions

#### 1. Lockfile Out of Sync

**Error message:**
```
npm error code EUSAGE
npm error `npm ci` can only install packages when your package.json and package-lock.json are in sync
```

**Cause:** `package-lock.json` doesn't match `package.json`

**Solution:**
```bash
# Regenerate lockfile
rm package-lock.json
npm install

# Commit updated lockfile
git add package-lock.json
git commit -m "chore: update lockfile"
git push
```

**Prevention:** Always run `npm install` (not `npm ci`) when adding/updating dependencies locally.

---

#### 2. Playwright Tests Fail in CI but Pass Locally

**Error message:**
```
Error: page.click: Target closed
```

**Cause:** CI environment differences (headless mode, slower performance, missing dependencies)

**Solution:**

**Option A: Increase timeouts**
```typescript
// In Playwright test
test('my test', async ({ page }) => {
  await page.click('button', { timeout: 10000 }); // 10 seconds
});
```

**Option B: Wait for element to be ready**
```typescript
await page.waitForSelector('button', { state: 'visible' });
await page.click('button');
```

**Option C: Run locally in CI-like mode**
```bash
npm run test:e2e:headed  # Run in headed mode
npm run e2e:ui           # Interactive debugging
```

---

#### 3. Tauri Build Fails (Missing System Dependencies)

**Error message:**
```
error: failed to run custom build command for `tauri v2.x.x`
```

**Cause:** Missing platform-specific build dependencies

**Solution by platform:**

**macOS:**
```bash
# Install Xcode Command Line Tools
xcode-select --install
```

**Windows:**
```powershell
# Install WebView2 runtime
# (Usually pre-installed on Windows 10/11)
```

**Linux:**
```bash
# Install required dependencies
sudo apt update
sudo apt install -y \
  libwebkit2gtk-4.1-dev \
  build-essential \
  curl \
  wget \
  file \
  libxdo-dev \
  libssl-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev
```

**CI note:** Dependencies are automatically installed in GitHub Actions workflows.

---

#### 4. Rust Clippy Warnings Blocking Build

**Error message:**
```
error: this function has too many arguments (8/7)
  --> src-tauri/src/lib.rs:42:1
```

**Cause:** Clippy treats warnings as errors (strict mode)

**Solution:**

**Option A: Fix the warning** (recommended)
```rust
// Refactor to use a struct instead of many parameters
struct MyParams {
    field1: String,
    field2: i32,
}

fn my_function(params: MyParams) {
    // ...
}
```

**Option B: Allow specific warning** (use sparingly)
```rust
#[allow(clippy::too_many_arguments)]
fn my_function(a: String, b: i32, ...) {
    // ...
}
```

---

#### 5. Cache Restoration Slow or Failing

**Symptom:** Cache restore takes >2 minutes or fails

**Cause:** Large cache size, network issues, or corrupted cache

**Solution:**

**Option A: Clear cache manually**
1. Go to **Settings** → **Actions** → **Caches**
2. Delete stale caches
3. Re-run workflow

**Option B: Check cache size**
```bash
# Locally check Cargo cache size
du -sh ~/.cargo

# If >2 GB, consider cleaning
cargo clean
```

---

#### 6. Workflow Doesn't Trigger

**Symptom:** Pushed to `integration` or `main`, but no workflow runs

**Possible causes:**

**Cause A: Branch name mismatch**
```bash
# Check current branch
git branch --show-current

# Should be exactly "integration" or "main" (not "Integration" or "master")
```

**Cause B: Workflow file syntax error**
```bash
# Validate workflow YAML locally
npx ajv-cli validate -s workflow-schema.json -d .github/workflows/ci-integration.yml
```

**Cause C: Actions disabled in repository settings**
1. Go to **Settings** → **Actions** → **General**
2. Ensure "Allow all actions and reusable workflows" is selected

---

#### 7. ESLint Error: `console.log` Not Allowed

**Error message:**
```
error  Unexpected console statement  no-console
```

**Cause:** `console.log()` is disallowed in non-test app code (enforced by ESLint rule)

**Solution:**

**Option A: Use proper logging** (recommended)
```typescript
// Use console.error, console.info, or console.warn
console.error('Error occurred:', error);
console.info('User logged in:', userId);
```

**Option B: Remove console.log**
```typescript
// Remove debugging console.log statements before committing
// console.log('debug:', data); ← Delete this
```

**Option C: Allow in specific cases** (rare)
```typescript
// eslint-disable-next-line no-console
console.log('Legitimate use case:', data);
```

---

### Getting More Help

**Check workflow logs:**
1. Go to **Actions** tab
2. Click on failed workflow run
3. Click on failed job (red X)
4. Expand failed step to see full error logs

**Search error messages:**
- Copy exact error message
- Search in project issues: [GitHub Issues](https://github.com/code-chimp/prompt-alchemist/issues)
- Search GitHub Actions docs: [docs.github.com/actions](https://docs.github.com/en/actions)

**Ask for help:**
- Open an issue with:
  - Error message (full text)
  - Link to failed workflow run
  - Steps to reproduce locally (if applicable)

---

## Performance Metrics

### Expected Pipeline Times

| Workflow | Target Time | Breakdown |
|----------|-------------|-----------|
| **Integration** | **<7 minutes** | Quality gates (parallel): ~3-5 min<br>Build check (macOS): ~5-7 min |
| **Main (no release)** | **<20 minutes** | Quality gates: ~3-5 min<br>Multi-platform builds: ~10-15 min |
| **Main (with release)** | **<25 minutes** | Builds + release creation: ~20-25 min |

### Job-Level Performance

| Job | Platform | Cache Hit | Cache Miss |
|-----|----------|-----------|------------|
| Lint | Ubuntu | ~1 min | ~2 min |
| Typecheck | Ubuntu | ~1 min | ~2 min |
| Unit Tests | Ubuntu | ~2 min | ~3 min |
| E2E Tests | Ubuntu | ~3 min | ~5 min |
| Rust Tests | Ubuntu | ~2 min | ~5 min |
| Build Check | macOS | ~5 min | ~10 min |
| Build (macOS) | macOS | ~10 min | ~15 min |
| Build (Windows) | Windows | ~8 min | ~12 min |
| Build (Linux) | Ubuntu | ~7 min | ~10 min |

### Caching Impact

**Cache hit rate:** >80% under normal development (lockfiles change infrequently)

**Time savings per workflow run:**
- **npm cache hit:** ~1.5 minutes saved per job (5 jobs) = ~7.5 minutes total
- **Cargo cache hit:** ~4-9 minutes saved per Rust job (3 jobs) = ~15 minutes total
- **Total savings:** ~25-30% faster builds with cache hits

**CI minute reduction:** Caching reduces CI minutes by 25-30% per month

---

### Performance Tips

**1. Keep lockfiles up-to-date**
```bash
# Sync lockfile when adding dependencies
npm install  # ← Creates/updates lockfile
git add package-lock.json
git commit -m "chore: update dependencies"
```

**2. Run checks locally before pushing**
```bash
# Run all checks locally (faster iteration)
npm run validate  # Runs: check + lint + test:unit
npm run test:e2e  # Run E2E tests
```

**3. Use cache-friendly commit patterns**
- Avoid committing lockfile changes with every commit
- Batch dependency updates to minimize cache invalidation

**4. Monitor slow jobs**
- Check Actions tab for jobs taking >2x expected time
- Investigate caching issues or test performance

**5. Clear cache if persistent slowdowns**
- If builds consistently slow (>2x target), clear caches manually
- See [Manual Cache Clearing](#manual-cache-clearing) section

---

## Related Documentation

- [Getting Started](0-getting-started.md) - Setup and installation
- [Development Guide](3-development-guide.md) - Local development workflow
- [Testing Guide](4-testing-guide.md) - Testing strategy and patterns
- [Contributing](5-contributing.md) - PR workflow and code review process

---

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Tauri Build Guide](https://v2.tauri.app/guides/building/)
- [Semantic Versioning](https://semver.org/)
- [GitHub Releases](https://docs.github.com/en/repositories/releasing-projects-on-github)

---

**Questions or issues?** Open an issue at [GitHub Issues](https://github.com/code-chimp/prompt-alchemist/issues) or check [Discussions](https://github.com/code-chimp/prompt-alchemist/discussions).
