# Story 0.1: GitHub Actions Integration Workflow - Quality Gates

**Epic:** 0 - CI/CD & Release Infrastructure  
**Story ID:** 0-1-github-actions-integration-workflow-quality-gates  
**Status:** ready-for-dev  
**Estimated Effort:** Medium (5-8 hours)  
**Created:** 2026-01-01

---

## User Story

**As a** developer  
**I want** automated quality gates (linting, type checking, tests) to run on every commit to the `integration` branch  
**So that** code quality issues are caught immediately before merging to `main`

---

## Acceptance Criteria

### AC1: Workflow Trigger Configuration
**Given** a developer pushes code to the `integration` branch  
**When** the commit is received by GitHub  
**Then** the quality gates workflow automatically triggers within 5 seconds

**Implementation Notes:**
- Workflow file: `.github/workflows/ci-integration.yml`
- Trigger: `on: push: branches: [integration]`
- Must not trigger on other branches

---

### AC2: Lint Job Execution
**Given** the quality gates workflow has been triggered  
**When** the lint job executes  
**Then** all configured linters run successfully:
- ESLint (TypeScript/React)
- Prettier (code formatting)
- Stylelint (CSS/Tailwind)
- Clippy (Rust)

**Implementation Notes:**
- Command: `npm run lint`
- Runner: `ubuntu-latest` (fastest for linting)
- Node.js: 24.12.0 (from .nvmrc via Volta)
- Caching: npm dependencies
- Expected duration: <1 minute
- Exit code 0 required for success

---

### AC3: Type Check Job Execution
**Given** the quality gates workflow has been triggered  
**When** the typecheck job executes  
**Then** TypeScript type checking and lockfile validation pass:
- `npm run check:types` (TypeScript strict mode)
- `npm run check:lockfile` (package-lock.json integrity)

**Implementation Notes:**
- Command: `npm run check` (runs both)
- Runner: `ubuntu-latest`
- Node.js: 24.12.0
- Caching: npm dependencies
- Expected duration: <1 minute
- Must validate all `*.ts` and `*.tsx` files in `src/`

---

### AC4: Unit Test Job Execution
**Given** the quality gates workflow has been triggered  
**When** the test-unit job executes  
**Then** all Vitest unit tests pass with coverage reporting:
- All tests in `src/**/*.test.ts(x)` execute
- Coverage report generated
- Coverage artifacts uploaded (7-day retention)

**Implementation Notes:**
- Command: `npm run test:unit:coverage`
- Runner: `ubuntu-latest`
- Node.js: 24.12.0
- Caching: npm dependencies
- Expected duration: 1-2 minutes
- Coverage artifact: `coverage/` directory
- Artifact name: `coverage-unit-tests`
- Retention: 7 days

---

### AC5: E2E Test Job Execution
**Given** the quality gates workflow has been triggered  
**When** the test-e2e job executes  
**Then** all Playwright E2E tests pass:
- All tests in `tests/**/*.spec.ts` execute
- Playwright report generated on failure
- Test artifacts uploaded on failure (7-day retention)

**Implementation Notes:**
- Command: `npm run test:e2e` (headless mode)
- Runner: `ubuntu-latest`
- Node.js: 24.12.0
- Additional setup: Install Playwright browsers
- Caching: npm dependencies, Playwright browsers
- Expected duration: 2-3 minutes
- On failure: Upload `playwright-report/` and `test-results/`
- Artifact name: `playwright-report`
- Retention: 7 days

---

### AC6: Rust Test Job Execution
**Given** the quality gates workflow has been triggered  
**When** the test-rust job executes  
**Then** all Cargo tests for the Tauri backend pass:
- All tests in `src-tauri/src/**/*.rs` execute
- Clippy warnings treated as errors
- Format check passes

**Implementation Notes:**
- Command: `npm run test:rust` (runs `cargo test` in `src-tauri/`)
- Runner: `ubuntu-latest`
- Rust: stable toolchain (auto-installed by actions-rs)
- Caching: Cargo dependencies, target directory
- Expected duration: 1-2 minutes
- Must also run `npm run check:rust` (clippy + format check)

---

### AC7: Build Check Job Execution
**Given** all quality gate jobs (lint, typecheck, test-unit, test-e2e, test-rust) have passed  
**When** the build-check job executes  
**Then** the application builds successfully on macOS:
- Frontend build completes: `npm run build`
- Tauri bundle creation succeeds: `npm run tauri:build`
- No build warnings or errors

**Implementation Notes:**
- Command: `npm run build && npm run tauri:build`
- Runner: `macos-latest` (required for Tauri macOS builds)
- Node.js: 24.12.0
- Dependencies: All previous jobs (lint, typecheck, test-unit, test-e2e, test-rust)
- Caching: npm dependencies, Cargo dependencies
- Expected duration: 3-5 minutes
- Job runs ONLY if all previous jobs succeed
- Use `needs: [lint, typecheck, test-unit, test-e2e, test-rust]`

---

### AC8: Failure Handling and Reporting
**Given** any quality gate job fails  
**When** the workflow completes  
**Then** the following behavior occurs:
- Workflow status shows as "failed" with red X
- Failed job logs clearly indicate the error
- Subsequent dependent jobs are skipped
- GitHub UI shows which specific job failed
- Developer receives notification (if configured)

**Implementation Notes:**
- Default GitHub Actions behavior handles most of this
- Use `if: failure()` for conditional artifact uploads (e.g., Playwright reports)
- Use `if: always()` for jobs that must run regardless (if any)
- Ensure job names are descriptive: "Lint", "Type Check", "Unit Tests", "E2E Tests", "Rust Tests", "Build Check"

---

### AC9: Concurrency Control
**Given** multiple commits are pushed to `integration` in quick succession  
**When** new workflow runs are triggered  
**Then** in-progress runs for the same branch are automatically cancelled:
- Only the most recent commit's workflow runs
- Outdated workflow runs show as "cancelled"
- Resources are freed immediately

**Implementation Notes:**
- Add concurrency group to workflow:
  ```yaml
  concurrency:
    group: integration-quality-gates-${{ github.ref }}
    cancel-in-progress: true
  ```
- This prevents redundant checks on superseded commits
- Saves CI/CD minutes and speeds up feedback

---

## Development Notes

### Workflow File Structure
```yaml
name: Integration Quality Gates
on:
  push:
    branches: [integration]
concurrency:
  group: integration-quality-gates-${{ github.ref }}
  cancel-in-progress: true

jobs:
  lint:
    runs-on: ubuntu-latest
    steps: [checkout, setup-node, cache-npm, install, run-lint]
  
  typecheck:
    runs-on: ubuntu-latest
    steps: [checkout, setup-node, cache-npm, install, run-check]
  
  test-unit:
    runs-on: ubuntu-latest
    steps: [checkout, setup-node, cache-npm, install, run-tests, upload-coverage]
  
  test-e2e:
    runs-on: ubuntu-latest
    steps: [checkout, setup-node, cache-npm, install, install-playwright, run-e2e, upload-report-on-failure]
  
  test-rust:
    runs-on: ubuntu-latest
    steps: [checkout, setup-rust, cache-cargo, run-cargo-test, run-cargo-check]
  
  build-check:
    runs-on: macos-latest
    needs: [lint, typecheck, test-unit, test-e2e, test-rust]
    steps: [checkout, setup-node, setup-rust, cache-all, install, build-frontend, build-tauri]
```

### Key Technical Requirements

**Node.js Setup:**
- Version: 24.12.0 (read from `.nvmrc`)
- Use `actions/setup-node@v4` with `node-version-file: '.nvmrc'`
- Cache: `npm` (built-in caching in setup-node action)

**Rust Setup:**
- Use `actions-rs/toolchain@v1` with `toolchain: stable`
- Cache: Use `actions/cache@v4` for `~/.cargo` and `src-tauri/target`

**Caching Strategy:**
- npm: `~/.npm` (handled by setup-node)
- Cargo: `~/.cargo/registry`, `~/.cargo/git`, `src-tauri/target`
- Playwright: `~/.cache/ms-playwright` (optional, speeds up E2E)
- Cache key: Include `runner.os` and lockfile hashes

**Artifact Retention:**
- Coverage reports: 7 days
- Playwright reports: 7 days (only on failure)
- Use `actions/upload-artifact@v4`

**Performance Targets:**
- Lint: <1 min
- Typecheck: <1 min
- Unit tests: 1-2 min
- E2E tests: 2-3 min
- Rust tests: 1-2 min
- Build check: 3-5 min
- **Total: <10 min** (many jobs run in parallel)

### NPM Scripts Reference
- `npm run lint` → ESLint + Prettier + Stylelint + Clippy
- `npm run check` → `check:types` + `check:lockfile`
- `npm run test:unit:coverage` → Vitest with coverage
- `npm run test:e2e` → Playwright headless
- `npm run test:rust` → `cargo test` in `src-tauri/`
- `npm run check:rust` → `cargo fmt --check` + `cargo clippy`
- `npm run build` → Vite production build
- `npm run tauri:build` → Tauri bundle creation

### Error Handling Patterns
- Always use `set -e` in multi-line shell scripts (or chain with `&&`)
- Upload artifacts on failure: `if: failure()`
- Use descriptive job names for easy debugging
- Include relevant context in error messages (which command failed)

### Platform-Specific Considerations
- **ubuntu-latest**: Fast, cost-effective for most jobs
- **macos-latest**: Required for Tauri macOS builds (AC7)
- Windows runners: NOT required for this story (future story 0.2)

### Branch Protection Context
- This workflow will be referenced in branch protection rules (future story 0.3)
- All jobs must pass for merges to `main` to be allowed
- Status checks will be enforced via GitHub UI configuration

---

## Technical References

### Source Documents
1. **Epic Definition**: `_bmad-output/project-planning-artifacts/epics.md` (lines 388-465)
2. **CI/CD Strategy**: `_bmad-output/github-actions-cicd-implementation-plan.md`
3. **Architecture**: `_bmad-output/project-planning-artifacts/architecture.md` (CI/CD section)
4. **PRD NFRs**: `_bmad-output/project-planning-artifacts/prd.md` (NFR-R6, NFR-R7)

### Related Stories
- **Story 0.2**: PR Quality Gates (runs on pull requests to `integration`)
- **Story 0.3**: Branch Protection Rules (enforces these quality gates)
- **Story 0.4**: Release Workflow (runs on tags, creates GitHub releases)

### Dependencies
- **Existing npm scripts**: All required scripts already exist in `package.json`
- **Existing linters**: ESLint, Prettier, Stylelint configurations already present
- **Existing tests**: Vitest and Playwright test suites already functional
- **Existing Rust setup**: Cargo tests, clippy, and rustfmt already configured

### Architecture Compliance
- ✅ **NFR-R6**: Cross-platform testing on macOS (build-check job)
- ✅ **NFR-R7**: CI validates all quality gates before merge
- ✅ **CI/CD Strategy**: Implements fast feedback loops (<10 min)
- ✅ **Workflow Naming**: Follows convention `ci-integration.yml`

---

## Definition of Done

- [ ] Workflow file `.github/workflows/ci-integration.yml` created
- [ ] All 6 jobs (lint, typecheck, test-unit, test-e2e, test-rust, build-check) configured
- [ ] Concurrency control implemented (cancel-in-progress)
- [ ] Caching configured for npm and Cargo dependencies
- [ ] Artifact uploads configured (coverage, Playwright reports)
- [ ] Workflow triggers on push to `integration` branch
- [ ] All jobs pass on a clean commit to `integration`
- [ ] Failed jobs properly block the workflow and show errors
- [ ] Build-check job depends on all test jobs (runs last)
- [ ] Total workflow execution time <10 minutes
- [ ] Workflow tested manually by pushing to `integration` branch
- [ ] Documentation updated (if needed)

---

## Next Steps for Developer

1. **Create workflow file**: `.github/workflows/ci-integration.yml`
2. **Implement all 6 jobs** with proper dependencies and caching
3. **Test locally**: Use `act` tool or push to a test branch
4. **Push to integration**: Verify workflow runs and all jobs pass
5. **Test failure scenarios**: Introduce a lint error, verify workflow fails
6. **Verify concurrency**: Push multiple commits quickly, verify cancellation
7. **Review artifacts**: Check coverage and Playwright reports are accessible
8. **Move story to done**: Update `sprint-status.yaml` when complete

---

**Story File Generated:** 2026-01-01  
**Ready for Development:** Yes  
**Blocked:** No  
**Blockers:** None
