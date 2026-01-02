# Story 0.2: GitHub Actions Main/Release Workflow - Multi-Platform Builds

**Epic:** 0 - CI/CD & Release Infrastructure  
**Story ID:** 0-2-github-actions-main-release-workflow-multi-platform-builds  
**Status:** ready-for-dev  
**Estimated Effort:** Large (10-15 hours)  
**Created:** 2026-01-01  
**Dependencies:** Story 0.1 (integration workflow provides quality gate patterns)

---

## User Story

**As a** developer  
**I want** automated multi-platform builds (macOS, Windows, Linux) to run on every commit to `main`  
**So that** production builds are validated across all target platforms before release

---

## Acceptance Criteria

### AC1: Workflow File Creation and Trigger Configuration
**Given** the `.github/workflows/ci-main.yml` file is created  
**When** a commit is pushed to the `main` branch  
**Then** the GitHub Actions workflow is triggered automatically  
**And** the workflow includes the same quality gate jobs as integration (lint, typecheck, test-unit, test-e2e, test-rust)

**Implementation Notes:**
- Workflow file: `.github/workflows/ci-main.yml`
- Trigger: `on: push: branches: [main]`
- **CRITICAL**: This workflow extends the integration workflow (0.1) with additional multi-platform builds
- Reuse quality gate job configurations from `.github/workflows/ci-integration.yml`
- Consider using workflow reusability (e.g., `.github/workflows/quality-gates.yml` as a reusable workflow)
- Quality gates must pass before build jobs execute

---

### AC2: Build Matrix Configuration with Three Platforms
**Given** all quality gate jobs pass on `main`  
**When** executing the `build` job  
**Then** a build matrix is used with three platforms:
- `macos-latest` (target: `universal-apple-darwin`)
- `ubuntu-latest` (target: `x86_64-unknown-linux-gnu`)
- `windows-latest` (target: `x86_64-pc-windows-msvc`)  
**And** all three builds run in parallel  
**And** the `fail-fast` strategy is disabled (all platforms complete even if one fails)

**Implementation Notes:**
- Use `strategy.matrix` with `os` dimension:
  ```yaml
  strategy:
    fail-fast: false
    matrix:
      include:
        - os: macos-latest
          target: universal-apple-darwin
          artifact_name: macos-builds
        - os: ubuntu-latest
          target: x86_64-unknown-linux-gnu
          artifact_name: linux-builds
        - os: windows-latest
          target: x86_64-pc-windows-msvc
          artifact_name: windows-builds
  ```
- `fail-fast: false` ensures all platforms complete even if one fails
- Job should depend on all quality gate jobs: `needs: [lint, typecheck, test-unit, test-e2e, test-rust]`
- Each platform job runs independently (parallel execution)

---

### AC3: macOS Build Job Configuration
**Given** the macOS build job runs  
**When** executing on `macos-latest`  
**Then** Node.js 24.12.0 is set up  
**And** Rust toolchain is set up with `universal-apple-darwin` target  
**And** Cargo dependencies are cached  
**And** `npm ci` installs dependencies  
**And** `npm run build` builds the frontend  
**And** `npm run tauri:build` builds the Tauri application  
**And** the job completes within 15 minutes  
**And** artifacts are uploaded:
- `src-tauri/target/release/bundle/dmg/*.dmg`
- `src-tauri/target/release/bundle/macos/*.app`  
**And** artifacts are retained for 7 days

**Implementation Notes:**
- Runner: `macos-latest` (ARM64 + Intel universal binary support)
- Node.js: 24.12.0 (from `.nvmrc`)
- Rust target: `universal-apple-darwin` (supports both Intel and Apple Silicon)
- **CRITICAL**: macOS builds are the slowest and most expensive (GitHub Actions pricing)
- Caching strategy:
  - npm: `~/.npm` (via `actions/setup-node@v4` cache parameter)
  - Cargo: `~/.cargo/registry`, `~/.cargo/git`, `src-tauri/target`
- Build commands:
  ```bash
  npm ci
  npm run build
  npm run tauri:build
  ```
- Artifact paths to upload:
  - `src-tauri/target/release/bundle/dmg/*.dmg` (disk image installer)
  - `src-tauri/target/release/bundle/macos/*.app` (application bundle)
- Artifact upload action: `actions/upload-artifact@v4`
- Artifact name: `macos-builds` (consistent with matrix config)
- Retention: 7 days
- Expected duration: 10-15 minutes (longest build)
- **Tauri Universal Binary**: The `universal-apple-darwin` target creates a fat binary supporting both Intel (x86_64) and Apple Silicon (aarch64)

---

### AC4: Linux Build Job Configuration
**Given** the Linux build job runs  
**When** executing on `ubuntu-latest`  
**Then** system dependencies are installed: `libwebkit2gtk-4.1-dev`, `build-essential`, `libssl-dev`, `libayatana-appindicator3-dev`, `librsvg2-dev`  
**And** Rust toolchain is set up with `x86_64-unknown-linux-gnu` target  
**And** `npm run tauri:build` builds the Tauri application  
**And** the job completes within 15 minutes  
**And** artifacts are uploaded:
- `src-tauri/target/release/bundle/deb/*.deb`
- `src-tauri/target/release/bundle/appimage/*.AppImage`

**Implementation Notes:**
- Runner: `ubuntu-latest` (20.04 or 22.04, check GitHub Actions runner images)
- **CRITICAL Linux Dependencies**: Tauri requires WebKit2GTK for Linux builds
- Install system dependencies:
  ```bash
  sudo apt-get update
  sudo apt-get install -y \
    libwebkit2gtk-4.1-dev \
    build-essential \
    libssl-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev
  ```
- **Dependency explanation**:
  - `libwebkit2gtk-4.1-dev`: WebKit2 GTK bindings (Tauri's rendering engine on Linux)
  - `build-essential`: GCC, make, libc-dev (Rust compilation)
  - `libssl-dev`: OpenSSL development headers (network/crypto)
  - `libayatana-appindicator3-dev`: System tray support
  - `librsvg2-dev`: SVG rendering support
- Rust target: `x86_64-unknown-linux-gnu` (standard Linux x86_64)
- Caching: Same as macOS (npm + Cargo)
- Build commands:
  ```bash
  npm ci
  npm run build
  npm run tauri:build
  ```
- Artifact paths to upload:
  - `src-tauri/target/release/bundle/deb/*.deb` (Debian package)
  - `src-tauri/target/release/bundle/appimage/*.AppImage` (portable executable)
- Artifact name: `linux-builds`
- Retention: 7 days
- Expected duration: 8-12 minutes

---

### AC5: Windows Build Job Configuration
**Given** the Windows build job runs  
**When** executing on `windows-latest`  
**Then** Rust toolchain is set up with `x86_64-pc-windows-msvc` target  
**And** `npm run tauri:build` builds the Tauri application  
**And** the job completes within 15 minutes  
**And** artifacts are uploaded:
- `src-tauri/target/release/bundle/msi/*.msi`
- `src-tauri/target/release/bundle/nsis/*.exe`

**Implementation Notes:**
- Runner: `windows-latest` (Windows Server 2022 with Visual Studio 2022)
- Rust target: `x86_64-pc-windows-msvc` (Windows x64 with MSVC toolchain)
- **CRITICAL**: Windows builds require Visual Studio build tools (pre-installed on `windows-latest`)
- No additional system dependencies required (unlike Linux)
- Caching: Same as macOS/Linux (npm + Cargo)
- Build commands:
  ```bash
  npm ci
  npm run build
  npm run tauri:build
  ```
- Artifact paths to upload:
  - `src-tauri/target/release/bundle/msi/*.msi` (Windows Installer package)
  - `src-tauri/target/release/bundle/nsis/*.exe` (NSIS installer executable)
- Artifact name: `windows-builds`
- Retention: 7 days
- Expected duration: 8-12 minutes
- **Path considerations**: Windows uses backslashes by default, but GitHub Actions handles forward slashes correctly

---

### AC6: Build Failure Handling
**Given** any platform build fails  
**When** the workflow completes  
**Then** the specific platform's failure is clearly reported  
**And** other platforms still complete their builds  
**And** the overall workflow status is "failed"

**Implementation Notes:**
- `fail-fast: false` in matrix strategy ensures all platforms run to completion
- GitHub Actions UI clearly shows which matrix job failed (e.g., "build (macos-latest)")
- Overall workflow status will be "failed" if ANY platform fails
- Developers can inspect individual job logs for failure details
- **Best practice**: Check logs for common failures:
  - macOS: Code signing issues (not applicable for CI builds)
  - Linux: Missing system dependencies
  - Windows: MSVC toolchain issues
- Consider adding error annotations for common failures (future enhancement)

---

### AC7: Build Success Confirmation
**Given** all platform builds succeed  
**When** the workflow completes  
**Then** the workflow status is marked as "success"  
**And** the commit shows a green checkmark on GitHub  
**And** all build artifacts are available for download from the Actions tab

**Implementation Notes:**
- Workflow status: "success" (green checkmark on commit/PR)
- All 3 artifacts available for download:
  - `macos-builds.zip`
  - `linux-builds.zip`
  - `windows-builds.zip`
- Artifacts accessible via:
  - GitHub Actions tab → Workflow run → Artifacts section
  - GitHub CLI: `gh run download <run-id>`
  - REST API: `GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts`
- **Artifact retention**: 7 days (configurable in workflow)
- **Artifact size considerations**: DMG/MSI/AppImage files can be 50-100 MB each

---

## Development Notes

### Workflow File Structure

```yaml
name: CI - Main Branch (Multi-Platform Builds)

on:
  push:
    branches: [main]

concurrency:
  group: main-quality-gates-${{ github.ref }}
  cancel-in-progress: true

jobs:
  # Quality gate jobs (inherited from integration workflow)
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
  
  # Multi-platform build matrix
  build:
    needs: [lint, typecheck, test-unit, test-e2e, test-rust]
    runs-on: ${{ matrix.os }}
    strategy:
      fail-fast: false
      matrix:
        include:
          - os: macos-latest
            target: universal-apple-darwin
            artifact_name: macos-builds
            artifact_paths: |
              src-tauri/target/release/bundle/dmg/*.dmg
              src-tauri/target/release/bundle/macos/*.app
          - os: ubuntu-latest
            target: x86_64-unknown-linux-gnu
            artifact_name: linux-builds
            artifact_paths: |
              src-tauri/target/release/bundle/deb/*.deb
              src-tauri/target/release/bundle/appimage/*.AppImage
          - os: windows-latest
            target: x86_64-pc-windows-msvc
            artifact_name: windows-builds
            artifact_paths: |
              src-tauri/target/release/bundle/msi/*.msi
              src-tauri/target/release/bundle/nsis/*.exe
    steps:
      - checkout
      - setup-node (with .nvmrc)
      - setup-rust (with target)
      - cache-dependencies (npm + cargo)
      - install-system-deps (Linux only)
      - npm-ci
      - npm-run-build
      - npm-run-tauri-build
      - upload-artifacts (with matrix.artifact_name and matrix.artifact_paths)
```

### Key Technical Requirements

**Node.js Setup (All Platforms):**
- Version: 24.12.0 (read from `.nvmrc`)
- Use `actions/setup-node@v4` with `node-version-file: '.nvmrc'`
- Cache: `npm` (built-in caching)

**Rust Setup (All Platforms):**
- Toolchain: `stable`
- Use `actions-rs/toolchain@v1` or `dtolnay/rust-toolchain@stable`
- Target: Platform-specific (see matrix config)
- Cache: Use `Swatinem/rust-cache@v2` (recommended for Tauri projects)

**Platform-Specific Steps:**

**macOS:**
- No additional system dependencies
- Universal binary support built-in with `universal-apple-darwin` target
- Produces: `.dmg` (disk image), `.app` (application bundle)

**Linux:**
- Install WebKit2GTK and dependencies (see AC4)
- Produces: `.deb` (Debian package), `.AppImage` (portable executable)

**Windows:**
- No additional system dependencies (MSVC pre-installed)
- Produces: `.msi` (Windows Installer), `.exe` (NSIS installer)

**Caching Strategy (All Platforms):**
- npm cache: `~/.npm` (handled by `setup-node`)
- Cargo cache: `~/.cargo/registry`, `~/.cargo/git`, `src-tauri/target`
- Recommended: Use `Swatinem/rust-cache@v2` for optimal Cargo caching

**Performance Targets:**
- Quality gates: <10 min (parallel execution)
- macOS build: 10-15 min
- Linux build: 8-12 min
- Windows build: 8-12 min
- **Total: ~20-25 min** (gates + longest build in parallel)

### NPM Scripts Reference

All scripts already exist in `package.json`:
- `npm run lint` → ESLint + Prettier + Stylelint + Clippy
- `npm run check` → `check:types` + `check:lockfile`
- `npm run test:unit:coverage` → Vitest with coverage
- `npm run test:e2e` → Playwright headless
- `npm run test:rust` → `cargo test` in `src-tauri/`
- `npm run check:rust` → `cargo fmt --check` + `cargo clippy`
- `npm run build` → Vite production build
- `npm run tauri:build` → Tauri bundle creation (all platform formats)

### Reusing Integration Workflow Logic

**Option 1: Copy-Paste (Simple, Less DRY)**
- Copy quality gate jobs from `.github/workflows/ci-integration.yml`
- Add multi-platform build matrix
- Pros: Simple, no workflow reusability complexity
- Cons: Duplication, maintenance burden

**Option 2: Reusable Workflow (DRY, Complex)**
- Create `.github/workflows/quality-gates.yml` (reusable workflow)
- Call from both `ci-integration.yml` and `ci-main.yml`
- Pros: Single source of truth, easier maintenance
- Cons: More complex setup, workflow reusability learning curve

**Recommendation**: Start with Option 1 (copy-paste) for this story, refactor to Option 2 in Story 0.5 (pipeline optimization)

### Error Handling Patterns

**Common Build Failures:**

**macOS:**
- Code signing issues (not applicable for CI, only local builds)
- Xcode version mismatches (rare on GitHub Actions)
- Universal binary compilation errors (ensure Rust target installed)

**Linux:**
- Missing system dependencies (most common)
- WebKit2GTK version conflicts
- AppImage bundling failures (check `fuse` support)

**Windows:**
- MSVC toolchain issues (rare, pre-installed)
- Path length limitations (Windows 260-char limit)
- WiX Toolset issues (for `.msi` generation)

**Debugging Steps:**
1. Check job logs for error messages
2. Verify caching is working (check cache hit/miss)
3. Re-run failed jobs (may be transient GitHub Actions issues)
4. Test locally with `npm run tauri:build` on target platform

### Artifact Management

**Upload Strategy:**
- Use `actions/upload-artifact@v4` (latest stable)
- Artifact name: `{platform}-builds` (e.g., `macos-builds`)
- Artifact paths: Use glob patterns to match all bundles
- Retention: 7 days (GitHub default, configurable)

**Download Strategy (for Story 0.3 - Release Workflow):**
- Use `actions/download-artifact@v4`
- Download all artifacts to `./artifacts/{platform}-builds/`
- Verify artifact structure with `ls -R ./artifacts/`
- Upload to GitHub Release with `softprops/action-gh-release@v1`

**Artifact Size Considerations:**
- macOS DMG: ~50-80 MB
- macOS .app: ~40-70 MB (compressed)
- Linux .deb: ~30-50 MB
- Linux .AppImage: ~60-90 MB
- Windows .msi: ~40-60 MB
- Windows .exe: ~40-60 MB
- **Total per run**: ~250-400 MB (all platforms)

### Branch Protection Context

**Dependencies from Story 0.1:**
- Integration workflow (`.github/workflows/ci-integration.yml`) already exists
- Quality gate patterns established (lint, typecheck, tests)
- Branch protection rules will reference this workflow (Story 0.4)

**Future Stories:**
- **Story 0.3**: Release automation (depends on this story's artifact output)
- **Story 0.4**: Branch protection rules (enforces this workflow)
- **Story 0.5**: Pipeline optimization (caching improvements, workflow reusability)

---

## Technical References

### Source Documents
1. **Epic Definition**: `_bmad-output/project-planning-artifacts/epics.md` (lines 468-534)
2. **CI/CD Strategy**: `_bmad-output/github-actions-cicd-implementation-plan.md`
3. **Architecture**: `_bmad-output/project-planning-artifacts/architecture.md` (CI/CD section)
4. **Previous Story**: `_bmad-output/implementation-artifacts/0-1-github-actions-integration-workflow-quality-gates.md`

### Related Stories
- **Story 0.1**: Integration workflow (provides quality gate foundation) - **DEPENDENCY**
- **Story 0.3**: Release automation (consumes this story's artifacts)
- **Story 0.4**: Branch protection rules (enforces this workflow)
- **Story 0.5**: Pipeline optimization (improves caching and performance)

### Dependencies
- **Story 0.1**: Integration workflow MUST be completed first (provides quality gate patterns)
- **Existing npm scripts**: All required scripts already exist in `package.json`
- **Existing linters**: ESLint, Prettier, Stylelint configurations already present
- **Existing tests**: Vitest and Playwright test suites already functional
- **Existing Rust setup**: Cargo, clippy, and rustfmt already configured
- **Tauri configuration**: `src-tauri/tauri.conf.json` already configured with bundle settings

### Architecture Compliance
- ✅ **NFR-R6**: Cross-platform testing on macOS, Windows, Linux
- ✅ **NFR-R7**: CI validates all quality gates before multi-platform builds
- ✅ **CI/CD Strategy**: Implements multi-platform build matrix with fail-fast disabled
- ✅ **Workflow Naming**: Follows convention `ci-main.yml`
- ✅ **Artifact Management**: 7-day retention, structured naming

### External Resources
- **GitHub Actions Documentation**: https://docs.github.com/en/actions
- **Tauri Build Documentation**: https://tauri.app/v1/guides/building/
- **Tauri GitHub Actions Guide**: https://tauri.app/v1/guides/building/cross-platform/
- **GitHub Actions Runner Images**: https://github.com/actions/runner-images
- **Rust Cache Action**: https://github.com/Swatinem/rust-cache

---

## Definition of Done

- [ ] Workflow file `.github/workflows/ci-main.yml` created
- [ ] All quality gate jobs (lint, typecheck, test-unit, test-e2e, test-rust) configured
- [ ] Build matrix configured with macOS, Windows, Linux
- [ ] `fail-fast: false` strategy enabled
- [ ] All jobs depend on quality gates passing
- [ ] macOS build produces `.dmg` and `.app` artifacts
- [ ] Linux build produces `.deb` and `.AppImage` artifacts
- [ ] Windows build produces `.msi` and `.exe` artifacts
- [ ] All artifacts uploaded with 7-day retention
- [ ] Concurrency control implemented (cancel-in-progress)
- [ ] Caching configured for npm and Cargo dependencies
- [ ] Workflow triggers on push to `main` branch
- [ ] All platforms build successfully on a clean commit to `main`
- [ ] Failed platforms properly report errors (test by introducing build error)
- [ ] Total workflow execution time <25 minutes
- [ ] All artifacts accessible from GitHub Actions UI
- [ ] Workflow tested manually by pushing to `main` branch
- [ ] Documentation updated (if needed)

---

## Next Steps for Developer

1. **Prerequisite Check**: Verify Story 0.1 is complete (`.github/workflows/ci-integration.yml` exists)
2. **Create workflow file**: `.github/workflows/ci-main.yml`
3. **Copy quality gate jobs**: From `ci-integration.yml` (lint, typecheck, tests)
4. **Implement build matrix**: Configure 3 platforms with `fail-fast: false`
5. **Add platform-specific steps**: Linux dependencies, Rust targets, artifact paths
6. **Configure caching**: npm + Cargo caching for all platforms
7. **Test locally (if possible)**: Use `act` tool to test workflow locally (macOS only)
8. **Push to main**: Create a test commit to `main` and verify workflow runs
9. **Verify all platforms**: Check that all 3 platforms build successfully
10. **Test failure scenario**: Introduce a build error on one platform, verify others complete
11. **Download artifacts**: Verify all artifacts are accessible from Actions UI
12. **Check execution time**: Ensure total time <25 minutes
13. **Move story to done**: Update `sprint-status.yaml` when complete

---

## Implementation Tips

**Before You Start:**
1. Review Story 0.1 implementation carefully (reuse patterns)
2. Check GitHub Actions pricing (macOS runners are 10x more expensive than Linux)
3. Understand Tauri bundle formats for each platform

**During Implementation:**
1. Start with quality gate jobs (copy from 0.1)
2. Implement one platform at a time (start with Linux - fastest)
3. Test each platform independently before enabling all three
4. Use matrix strategy carefully (verify `fail-fast: false` works)
5. Check artifact paths match Tauri's output structure

**Testing Strategy:**
1. Push a clean commit to `main` (all platforms should succeed)
2. Introduce a build error (e.g., syntax error in Rust code)
3. Verify failed platform reports clearly, others complete
4. Verify artifacts upload correctly for successful platforms
5. Test artifact download from GitHub UI

**Troubleshooting:**
1. If macOS build fails: Check Xcode version, Rust target installation
2. If Linux build fails: Check system dependencies installation
3. If Windows build fails: Check MSVC toolchain, path length issues
4. If caching issues: Clear cache manually, re-run workflow
5. If artifact upload fails: Check path patterns, file permissions

---

**Story File Generated:** 2026-01-01  
**Ready for Development:** Yes  
**Blocked:** No (Story 0.1 provides foundation, but not a blocker)  
**Blockers:** None
