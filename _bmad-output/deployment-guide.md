# Deployment Configuration - Prompt Alchemist

**Generated:** 2025-12-21  
**Application Type:** Tauri v2 Desktop Application  
**Platforms:** Windows, macOS, Linux

---

## Build Configuration

### Tauri Configuration

**File:** `src-tauri/tauri.conf.json`

**Application Metadata:**
- **Product Name:** Prompt Alchemist
- **Version:** 0.1.0
- **Bundle Identifier:** com.code-chimp.prompt-alchemist

**Window Configuration:**
- **Default Size:** 800x600
- **Title:** Prompt Alchemist

**Security Policy (CSP):**
```
default-src 'self'; 
script-src 'self'; 
style-src 'self' 'unsafe-inline'; 
img-src 'self' data:; 
font-src 'self' data:; 
connect-src 'self'
```

---

## Build Process

### Production Build

```bash
# Build desktop application for current platform
npm run tauri:build
```

**Build Steps:**
1. TypeScript compilation (`tsc`)
2. Vite builds frontend → `dist/`
3. Tauri bundles app with Rust backend
4. Platform-specific installers generated

**Output Location:**
```
src-tauri/target/release/
├── prompt-alchemist              # Executable (Linux/macOS)
├── prompt-alchemist.exe          # Executable (Windows)
└── bundle/                       # Platform-specific installers
    ├── deb/                      # Debian package (Linux)
    ├── dmg/                      # Disk image (macOS)
    ├── msi/                      # Windows installer
    └── appimage/                 # AppImage (Linux)
```

### Build Artifacts

**Bundle Targets:** All platforms configured (`"targets": "all"`)

**Supported Formats:**
- **macOS:** `.dmg`, `.app`
- **Windows:** `.msi`, `.exe`
- **Linux:** `.deb`, `.AppImage`

**Icons:** Multi-resolution icons in `src-tauri/icons/`
- 32x32.png, 128x128.png, 128x128@2x.png
- icon.icns (macOS)
- icon.ico (Windows)
- Plus Windows Store assets (Square*.png)

---

## Platform-Specific Builds

### macOS

```bash
# Requires macOS
npm run tauri:build -- --target x86_64-apple-darwin
npm run tauri:build -- --target aarch64-apple-darwin  # Apple Silicon
```

**Output:** `.dmg` installer and `.app` bundle

**Code Signing:** Not currently configured
- For distribution: Apple Developer account required
- Configure in `tauri.conf.json` under `bundle.macOS`

### Windows

```bash
# Requires Windows
npm run tauri:build -- --target x86_64-pc-windows-msvc
```

**Output:** `.msi` installer and `.exe`

**Code Signing:** Not currently configured
- For distribution: Code signing certificate required
- Configure in `tauri.conf.json` under `bundle.windows`

### Linux

```bash
# Requires Linux
npm run tauri:build -- --target x86_64-unknown-linux-gnu
```

**Output:** `.deb`, `.AppImage`

---

## Environment Configuration

### Development Environment

**Frontend Dev Server:**
- URL: `http://localhost:1420`
- Configured in `tauri.conf.json` → `build.devUrl`
- HMR enabled for hot reload

**Rust Backend:**
- Compiled in debug mode during development
- Environment: `RUST_BACKTRACE=1` (set via npm scripts)

### Production Environment

**Frontend:**
- Built by Vite to `dist/`
- Configured in `tauri.conf.json` → `build.frontendDist`
- Assets optimized and minified

**Rust Backend:**
- Compiled in release mode with optimizations
- Binary embedded in platform-specific bundle

---

## Infrastructure Requirements

### Development

- **OS:** Windows, macOS, or Linux
- **Node.js:** v24.12.0
- **Rust:** Latest stable
- **Disk Space:** ~500MB (node_modules + Rust target/)

### Build Environment

**For Cross-Platform Builds:**
- **macOS builds:** Require macOS system
- **Windows builds:** Require Windows system
- **Linux builds:** Require Linux system

**Note:** Tauri doesn't support true cross-compilation. Build on target platform or use CI/CD with multiple runners.

---

## CI/CD Pipeline

### Current Status

❌ **No CI/CD configured** (GitHub Actions workflows not found)

### Recommended Setup

**Suggested CI/CD Pipeline (GitHub Actions):**

1. **Linting & Tests** (on push/PR)
   - Run `npm run validate`
   - Check types, lint, run tests
   - Validate Rust with clippy

2. **Build** (on tag/release)
   - Matrix build: macOS, Windows, Linux
   - Run `npm run tauri:build`
   - Upload artifacts

3. **Release** (on tag)
   - Create GitHub release
   - Attach platform-specific installers
   - Generate release notes

**Example workflow files needed:**
- `.github/workflows/ci.yml` - Lint and test
- `.github/workflows/build.yml` - Build app
- `.github/workflows/release.yml` - Create releases

---

## Distribution

### Current Distribution Method

**Manual Distribution:**
- Build locally on each platform
- Distribute installers manually
- No auto-update configured

### Auto-Update Setup (Future)

Tauri supports auto-updates via:
- **Tauri updater plugin**
- Requires release server or GitHub releases
- Configure in `tauri.conf.json` → `updater`

---

## Security Considerations

### Content Security Policy

**Current CSP** (from `tauri.conf.json`):
- Restricts to same-origin resources
- Allows inline styles (for Tailwind)
- Allows data URIs for images/fonts

### Capabilities

**File:** `src-tauri/capabilities/default.json`
- Defines which Tauri APIs the frontend can access
- Currently: Default capabilities (opener, log plugins)

### Permissions

- **File System:** Not exposed by default
- **Network:** connect-src limited to 'self'
- **IPC:** Controlled via Tauri command system

---

## Deployment Checklist

### Pre-Release

- [ ] Update version in `package.json`
- [ ] Update version in `src-tauri/Cargo.toml`
- [ ] Update version in `src-tauri/tauri.conf.json`
- [ ] Run `npm run validate` (lint + type-check + tests)
- [ ] Test build on all target platforms
- [ ] Update CHANGELOG.md (if exists)

### Build

- [ ] Run `npm run tauri:build` on each platform
- [ ] Test installers on clean systems
- [ ] Verify app functionality after installation

### Distribution

- [ ] Create GitHub release with version tag
- [ ] Upload platform-specific installers
- [ ] Write release notes
- [ ] Notify users (if applicable)

### Post-Release

- [ ] Monitor for issues
- [ ] Update documentation if needed

---

## Troubleshooting Build Issues

### Rust Compilation Errors

```bash
# Update Rust toolchain
rustup update stable

# Clean and rebuild
cd src-tauri
cargo clean
cargo build --release
```

### Frontend Build Errors

```bash
# Clean and rebuild
npm run clean
npm install
npm run build
```

### Platform-Specific Issues

**macOS:**
- Ensure Xcode Command Line Tools installed: `xcode-select --install`

**Windows:**
- Ensure Visual Studio Build Tools installed
- Requires Windows SDK

**Linux:**
- Install system dependencies: `webkit2gtk`, `libayatana-appindicator3`
- See Tauri docs for distro-specific packages

---

## Resources

- **Tauri Documentation:** https://tauri.app/
- **Tauri v2 Guide:** https://v2.tauri.app/guide/
- **Existing Docs:** `docs/3-development-guide.md`
- **License:** BSD-3-Clause (see `LICENSE`)

---

## Current Limitations

1. **No CI/CD:** Manual builds required
2. **No Code Signing:** Installers not signed
3. **No Auto-Updates:** Manual update distribution
4. **No Crash Reporting:** No telemetry configured
5. **Single-Window:** No multi-window support configured

**Future Enhancements:**
- Set up GitHub Actions for automated builds
- Configure code signing for trusted distribution
- Implement Tauri updater for auto-updates
- Add crash reporting/telemetry (opt-in)
