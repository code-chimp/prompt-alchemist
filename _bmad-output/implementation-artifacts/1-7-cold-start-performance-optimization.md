# Story 1.7: Cold Start Performance Optimization

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want the application to launch and become usable within 2 seconds,
So that I can quickly access the tool without waiting for slow startup times.

## Acceptance Criteria

**Given** the application is not running
**When** the user launches the app from cold start
**Then** the window appears within 1 second
**And** the UI is fully interactive (clickable, keyboard-responsive) within 2 seconds
**And** the library data is loaded and displayed within 2 seconds

**Given** the application is measuring startup performance
**When** running on a typical developer machine (M1 Mac, Ryzen 5, i5-equivalent)
**Then** cold start time averages <2 seconds across 10 launches
**And** warm start time (app recently closed) averages <1 second

**Given** the library contains 500 snippets
**When** the application loads
**Then** startup time remains under 2 seconds (performance scales with library size)

**Given** the application is bundling assets
**When** building for production
**Then** Vite code-splitting is configured to lazy-load non-critical components
**And** Tailwind CSS is purged to remove unused utility classes
**And** total bundle size is <500KB gzipped (excluding Tauri runtime)

**Given** the application initializes Zustand stores
**When** mounting the React app
**Then** stores are initialized synchronously without async blocking
**And** library data is loaded asynchronously (doesn't block initial render)

**Given** the application is tested on all platforms
**When** measuring cold start time
**Then** performance targets are met on macOS (Intel + Apple Silicon), Windows 10/11, and Linux (Ubuntu 22.04)
**And** no platform-specific startup delays exceed 2.5 seconds

## Tasks / Subtasks

- [ ] Task 1: Benchmark current startup performance and identify bottlenecks (AC: Performance baseline established)
  - [ ] Subtask 1.1: Add performance timing instrumentation to App.tsx (time-to-interactive)
  - [ ] Subtask 1.2: Add timing for Zustand store initialization
  - [ ] Subtask 1.3: Add timing for library.json load via Tauri IPC
  - [ ] Subtask 1.4: Add timing for React first render
  - [ ] Subtask 1.5: Create performance measurement script (measure 10 cold starts)
  - [ ] Subtask 1.6: Document baseline metrics in spreadsheet or JSON
  - [ ] Subtask 1.7: Identify top 3 bottlenecks from timing data

- [ ] Task 2: Optimize Vite build configuration for minimal bundle size (AC: Bundle <500KB gzipped)
  - [ ] Subtask 2.1: Enable Vite code-splitting with dynamic imports for non-critical components
  - [ ] Subtask 2.2: Configure rollupOptions to chunk dependencies separately (React, Zustand, fuse.js)
  - [ ] Subtask 2.3: Enable minification and tree-shaking in production build
  - [ ] Subtask 2.4: Verify Tailwind CSS purging is working (remove unused utilities)
  - [ ] Subtask 2.5: Analyze bundle with `vite-bundle-visualizer` plugin
  - [ ] Subtask 2.6: Ensure total gzipped bundle <500KB (measure with `gzip -c dist/assets/index-*.js | wc -c`)
  - [ ] Subtask 2.7: Document bundle sizes before/after optimization

- [ ] Task 3: Implement lazy loading for non-critical components (AC: Initial render unblocked)
  - [ ] Subtask 3.1: Identify critical path components (App, theme, layout shell)
  - [ ] Subtask 3.2: Identify deferrable components (snippet editor modals, search dialog, settings)
  - [ ] Subtask 3.3: Use React.lazy() for deferrable components
  - [ ] Subtask 3.4: Add Suspense boundaries with loading fallbacks
  - [ ] Subtask 3.5: Verify lazy-loaded components don't block initial render
  - [ ] Subtask 3.6: Test that modals still open quickly when triggered (<200ms)

- [ ] Task 4: Optimize Zustand store initialization (AC: Stores don't block render)
  - [ ] Subtask 4.1: Ensure libraryStore initializes with empty state (no async in create())
  - [ ] Subtask 4.2: Move loadLibrary() call to App.tsx useEffect (after render)
  - [ ] Subtask 4.3: Ensure compositionStore initializes with default framework (RTF)
  - [ ] Subtask 4.4: Ensure themeStore initializes with system theme (no async)
  - [ ] Subtask 4.5: Verify no Zustand stores have async initialization code
  - [ ] Subtask 4.6: Measure store initialization time (<10ms target)

- [ ] Task 5: Optimize library.json loading strategy (AC: Library loads async without blocking)
  - [ ] Subtask 5.1: Ensure loadLibrary() is called in useEffect (non-blocking)
  - [ ] Subtask 5.2: Display loading skeleton/spinner while library loads
  - [ ] Subtask 5.3: Test performance with large library (500 snippets, ~100KB JSON)
  - [ ] Subtask 5.4: Verify library load doesn't block window render
  - [ ] Subtask 5.5: Add error boundary for library load failures
  - [ ] Subtask 5.6: Measure library load time separately (<500ms target)

- [ ] Task 6: Optimize font loading and theme initialization (AC: No FOIT/FOUT)
  - [ ] Subtask 6.1: Verify system font stack is used (no web font downloads)
  - [ ] Subtask 6.2: Apply theme CSS variables before first render (src/main.tsx)
  - [ ] Subtask 6.3: Inline critical CSS in index.html (Tailwind base + theme variables)
  - [ ] Subtask 6.4: Test that theme is applied immediately (no flash of unstyled content)
  - [ ] Subtask 6.5: Verify no layout shift during theme application

- [ ] Task 7: Optimize Tauri configuration for faster app initialization (AC: Window appears <1s)
  - [ ] Subtask 7.1: Review tauri.conf.json for performance settings
  - [ ] Subtask 7.2: Enable Rust compile-time optimizations (lto = true, codegen-units = 1)
  - [ ] Subtask 7.3: Disable unused Tauri plugins if any are included
  - [ ] Subtask 7.4: Verify window creation is not delayed by Rust initialization
  - [ ] Subtask 7.5: Test window appearance time (<1s target)
  - [ ] Subtask 7.6: Compare debug vs release build startup times

- [ ] Task 8: Create automated performance testing suite (AC: Performance regression prevention)
  - [ ] Subtask 8.1: Create performance test script (tests/performance/startup.spec.ts)
  - [ ] Subtask 8.2: Use Playwright to measure time-to-interactive
  - [ ] Subtask 8.3: Run 10 cold start measurements and average
  - [ ] Subtask 8.4: Fail test if average exceeds 2.5 seconds (buffer for CI)
  - [ ] Subtask 8.5: Add performance test to CI/CD pipeline (optional)
  - [ ] Subtask 8.6: Document performance test in testing guide

- [ ] Task 9: Cross-platform performance validation (AC: All platforms meet targets)
  - [ ] Subtask 9.1: Test cold start on macOS (Intel and Apple Silicon if available)
  - [ ] Subtask 9.2: Test cold start on Windows 10/11
  - [ ] Subtask 9.3: Test cold start on Linux (Ubuntu 22.04)
  - [ ] Subtask 9.4: Document platform-specific timing differences
  - [ ] Subtask 9.5: Identify platform-specific bottlenecks if any exist
  - [ ] Subtask 9.6: Ensure no platform exceeds 2.5s cold start

- [ ] Task 10: Documentation and performance best practices (AC: Docs updated)
  - [ ] Subtask 10.1: Add "Performance" section to README.md
  - [ ] Subtask 10.2: Document bundle size budgets (500KB gzipped)
  - [ ] Subtask 10.3: Document cold start targets (2s cold, 1s warm)
  - [ ] Subtask 10.4: Add troubleshooting section for slow startups
  - [ ] Subtask 10.5: Document how to run performance benchmarks locally
  - [ ] Subtask 10.6: Add performance regression guidelines for contributors

## Dev Notes

### Architecture Context

**From Architecture Document (architecture.md):**

**Performance Requirements (NFR-P1 to NFR-P8):**
- NFR-P3: Application cold start completes within 2 seconds from launch to usable state
- NFR-P7: Application baseline memory usage remains under 100MB during idle state
- NFR-P8: Application memory usage remains under 200MB during active composition with large libraries (500+ snippets)

**Starter Template Foundation:**
- Vite 7.3.0 provides lightning-fast HMR and optimized production bundles
- Tailwind CSS v4 with JIT compilation and automatic purging
- React 19.2.3 with concurrent rendering (faster startup)
- Tauri v2 with optimized Rust backend

**Existing Optimizations from Starter:**
- TypeScript strict mode (compile-time checks, no runtime overhead)
- ESLint import ordering (optimal tree-shaking)
- Tailwind purging via `prettier-plugin-tailwindcss`
- Vite production optimizations enabled by default

**Performance Budget:**
- Total bundle size: <500KB gzipped (currently unknown, must measure)
- Cold start time: <2 seconds (window visible + interactive)
- Warm start time: <1 second (app recently closed, OS cache hit)
- Library load time: <500ms for 500 snippets (~100KB JSON)

### Technical Requirements

**Performance Timing API:**
```typescript
// src/lib/performance.ts (new file)

export interface PerformanceMetrics {
  windowAppeared: number; // Time when Tauri window becomes visible
  reactMounted: number;   // Time when React root mounts
  storesInitialized: number; // Time when Zustand stores are ready
  libraryLoaded: number;  // Time when library.json is loaded
  interactive: number;    // Time when UI is fully interactive
}

const metrics: PerformanceMetrics = {
  windowAppeared: 0,
  reactMounted: 0,
  storesInitialized: 0,
  libraryLoaded: 0,
  interactive: 0,
};

export const markPerformance = (event: keyof PerformanceMetrics) => {
  metrics[event] = performance.now();
  console.info(`[Performance] ${event}: ${metrics[event].toFixed(2)}ms`);
};

export const getPerformanceMetrics = (): PerformanceMetrics => metrics;

export const logPerformanceSummary = () => {
  console.info('=== Performance Summary ===');
  console.info(`Window Appeared: ${metrics.windowAppeared.toFixed(2)}ms`);
  console.info(`React Mounted: ${metrics.reactMounted.toFixed(2)}ms`);
  console.info(`Stores Initialized: ${metrics.storesInitialized.toFixed(2)}ms`);
  console.info(`Library Loaded: ${metrics.libraryLoaded.toFixed(2)}ms`);
  console.info(`Interactive: ${metrics.interactive.toFixed(2)}ms`);
  console.info(`Total Time: ${metrics.interactive.toFixed(2)}ms`);
  console.info('==========================');
};
```

**Instrumentation in App.tsx:**
```typescript
// src/App.tsx (add timing markers)
import { useEffect } from 'react';
import { markPerformance, logPerformanceSummary } from '@/lib/performance';
import { useLibraryStore } from '@/stores/libraryStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useThemeStore } from '@/stores/themeStore';

function App() {
  useEffect(() => {
    markPerformance('reactMounted');
    
    // Initialize stores (should be synchronous)
    markPerformance('storesInitialized');
    
    // Load library asynchronously (non-blocking)
    const loadData = async () => {
      await useLibraryStore.getState().loadLibrary();
      markPerformance('libraryLoaded');
      
      // Mark interactive after library loads
      markPerformance('interactive');
      logPerformanceSummary();
    };
    
    loadData().catch((error) => {
      console.error('Failed to load library:', error);
      markPerformance('interactive'); // Still mark interactive
    });
  }, []);
  
  // ... rest of App component
}
```

**Vite Build Optimization Configuration:**
```typescript
// vite.config.ts (add/modify optimizations)
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: false, filename: 'dist/stats.html' }), // Bundle analysis
  ],
  
  build: {
    // Enable minification
    minify: 'terser',
    
    // Terser options for aggressive minification
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
      },
    },
    
    // Rollup code-splitting options
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          react: ['react', 'react-dom'],
          zustand: ['zustand'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'], // ShadCN primitives
        },
      },
    },
    
    // Increase chunk size warning limit (500KB gzipped = ~1.5MB raw)
    chunkSizeWarningLimit: 1500,
    
    // Enable CSS code splitting
    cssCodeSplit: true,
  },
  
  // Production optimizations
  optimizeDeps: {
    include: ['react', 'react-dom', 'zustand'],
  },
});
```

**React Lazy Loading Pattern:**
```typescript
// src/App.tsx (lazy load non-critical components)
import { lazy, Suspense } from 'react';

// Critical components (loaded immediately)
import { ThemeProvider } from '@/components/ThemeProvider';
import { AppErrorBoundary } from '@/components/AppErrorBoundary';
import { Layout } from '@/components/Layout';

// Non-critical components (lazy loaded)
const SearchDialog = lazy(() => import('@/components/search/SearchDialog'));
const SnippetEditor = lazy(() => import('@/components/library/SnippetEditor'));
const SettingsDialog = lazy(() => import('@/components/settings/SettingsDialog'));

function App() {
  return (
    <AppErrorBoundary>
      <ThemeProvider>
        <Layout>
          {/* Critical UI renders immediately */}
          <Sidebar />
          <SnippetList />
          <PreviewPanel />
          
          {/* Non-critical modals render when opened */}
          <Suspense fallback={<div>Loading...</div>}>
            <SearchDialog />
            <SnippetEditor />
            <SettingsDialog />
          </Suspense>
        </Layout>
      </ThemeProvider>
    </AppErrorBoundary>
  );
}
```

**Zustand Store Initialization (Non-Blocking):**
```typescript
// src/stores/libraryStore.ts (ensure synchronous initialization)
import { create } from 'zustand';
import type { Snippet } from '@/types/library';

interface LibraryState {
  snippets: Snippet[];
  isLoading: boolean;
  error: string | null;
  
  loadLibrary: () => Promise<void>;
  // ... other actions
}

// ✅ CORRECT: Synchronous initialization (empty state)
export const useLibraryStore = create<LibraryState>((set) => ({
  snippets: [], // Start with empty array (no async)
  isLoading: false,
  error: null,
  
  loadLibrary: async () => {
    set({ isLoading: true, error: null });
    try {
      const library = await loadLibraryFromTauri();
      set({ snippets: library.snippets, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load library', isLoading: false });
    }
  },
}));

// ❌ WRONG: Async initialization (blocks render)
// DO NOT DO THIS:
// export const useLibraryStore = create<LibraryState>(async (set) => {
//   const library = await loadLibraryFromTauri(); // BLOCKS RENDER
//   return { snippets: library.snippets, ... };
// });
```

**Theme Initialization (Before First Render):**
```typescript
// src/main.tsx (apply theme immediately)
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { markPerformance } from './lib/performance';

// Apply theme BEFORE React mounts (prevents FOUC)
const detectSystemTheme = (): 'mocha' | 'latte' => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'mocha'
    : 'latte';
};

const savedTheme = localStorage.getItem('theme-storage');
const theme = savedTheme ? JSON.parse(savedTheme).state.theme : detectSystemTheme();
document.documentElement.setAttribute('data-theme', theme);

markPerformance('windowAppeared');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

**Tauri Rust Optimization (tauri.conf.json):**
```json
{
  "build": {
    "beforeDevCommand": "npm run dev",
    "beforeBuildCommand": "npm run build",
    "devPath": "http://localhost:5173",
    "distDir": "../dist"
  },
  "tauri": {
    "bundle": {
      "active": true,
      "targets": "all",
      "identifier": "com.prompt-alchemist.app",
      "icon": [
        "icons/32x32.png",
        "icons/128x128.png",
        "icons/icon.icns",
        "icons/icon.ico"
      ]
    },
    "windows": [
      {
        "title": "Prompt Alchemist",
        "width": 1200,
        "height": 800,
        "resizable": true,
        "fullscreen": false,
        "visible": true,
        "decorations": true,
        "transparent": false,
        "skipTaskbar": false,
        "fileDropEnabled": false
      }
    ]
  }
}
```

**Rust Cargo.toml Optimization:**
```toml
# src-tauri/Cargo.toml
[profile.release]
opt-level = "z"        # Optimize for size
lto = true             # Enable link-time optimization
codegen-units = 1      # Better optimization, slower compile
strip = true           # Strip symbols for smaller binary
panic = "abort"        # Smaller binary, no unwinding
```

### Integration with Previous Stories

**Story 1.1: Catppuccin Theme System Implementation:**
- ✅ Theme CSS variables defined in index.css
- 🔄 EXTEND: Apply theme in main.tsx BEFORE React mounts (prevents FOUC)
- 🔄 VERIFY: Theme switching doesn't cause re-render (CSS-only)
- 🔄 MEASURE: Theme initialization time (<5ms target)

**Story 1.2: Three-Panel Layout with Resizable Panels:**
- ✅ Layout component implemented
- 🔄 VERIFY: Layout render doesn't block (should be synchronous)
- 🔄 MEASURE: Panel render time (<50ms target)
- 🔄 OPTIMIZE: Consider lazy loading panel resizing logic if complex

**Story 1.3: Zustand State Management Setup:**
- ✅ libraryStore, compositionStore, themeStore created
- 🔄 CRITICAL: Ensure ALL stores initialize synchronously (no async in create())
- 🔄 VERIFY: Store initialization time (<10ms total)
- 🔄 PATTERN: loadLibrary() called in App.tsx useEffect, not in store creation

**Story 1.4: Tauri IPC Commands for File System Operations:**
- ✅ load_library, save_library commands implemented
- 🔄 MEASURE: Tauri IPC latency for load_library (<100ms target)
- 🔄 OPTIMIZE: Consider caching library in memory if load time exceeds 500ms
- 🔄 VERIFY: IPC doesn't block Rust window initialization

**Story 1.5: Platform-Specific Configuration and Path Resolution:**
- ✅ Platform-specific paths verified
- 🔄 MEASURE: Path resolution time (<5ms target)
- 🔄 VERIFY: Config directory access doesn't slow startup

**Story 1.6: Window State Persistence:**
- ✅ Window state loading implemented
- 🔄 CRITICAL: Ensure window state loads ASYNC (doesn't block window appearance)
- 🔄 VERIFY: Window appears at default size, then resizes if saved state exists
- 🔄 OPTIMIZE: Consider loading settings.json in parallel with library.json

### Testing Requirements

**Performance Benchmarking Script:**
```typescript
// tests/performance/startup.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Startup Performance', () => {
  test('cold start completes within 2 seconds', async ({ page }) => {
    const measurements: number[] = [];
    
    // Run 10 cold start measurements
    for (let i = 0; i < 10; i++) {
      const startTime = Date.now();
      
      // Launch app
      await page.goto('/');
      
      // Wait for app to be interactive
      await page.waitForSelector('[data-testid="app-ready"]', { timeout: 3000 });
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      measurements.push(duration);
      
      console.log(`Run ${i + 1}: ${duration}ms`);
      
      // Close and reopen for cold start
      await page.close();
    }
    
    // Calculate average
    const average = measurements.reduce((a, b) => a + b, 0) / measurements.length;
    console.log(`Average cold start time: ${average}ms`);
    
    // Assert average is under 2.5s (buffer for CI)
    expect(average).toBeLessThan(2500);
    
    // Assert no single run exceeds 3s
    const max = Math.max(...measurements);
    expect(max).toBeLessThan(3000);
  });
  
  test('window appears within 1 second', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForSelector('html[data-theme]', { timeout: 1500 });
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`Window appearance time: ${duration}ms`);
    expect(duration).toBeLessThan(1000);
  });
  
  test('library loads within 500ms', async ({ page }) => {
    await page.goto('/');
    
    // Wait for window to appear
    await page.waitForSelector('[data-testid="snippet-list"]');
    
    // Measure library load time from performance API
    const libraryLoadTime = await page.evaluate(() => {
      return (window as any).__performanceMetrics?.libraryLoaded || 0;
    });
    
    console.log(`Library load time: ${libraryLoadTime}ms`);
    expect(libraryLoadTime).toBeLessThan(500);
  });
});
```

**Bundle Size Verification:**
```bash
# scripts/check-bundle-size.sh
#!/bin/bash

# Build for production
npm run build

# Get gzipped size of main bundle
BUNDLE_SIZE=$(gzip -c dist/assets/index-*.js | wc -c)
SIZE_KB=$((BUNDLE_SIZE / 1024))

echo "Bundle size: ${SIZE_KB}KB (gzipped)"

# Fail if exceeds 500KB
if [ $SIZE_KB -gt 500 ]; then
  echo "❌ Bundle size exceeds 500KB limit!"
  exit 1
else
  echo "✅ Bundle size within 500KB limit"
  exit 0
fi
```

**Manual Performance Testing Checklist:**

- [ ] Measure cold start on macOS (M1/M2 Mac)
- [ ] Measure cold start on macOS (Intel Mac)
- [ ] Measure cold start on Windows 10
- [ ] Measure cold start on Windows 11
- [ ] Measure cold start on Linux (Ubuntu 22.04)
- [ ] Verify window appears within 1 second on all platforms
- [ ] Verify UI is interactive within 2 seconds on all platforms
- [ ] Test with empty library (0 snippets)
- [ ] Test with small library (10 snippets)
- [ ] Test with medium library (100 snippets)
- [ ] Test with large library (500 snippets)
- [ ] Verify no console errors during startup
- [ ] Verify no visual flicker (FOUC, layout shift)
- [ ] Verify bundle size <500KB gzipped
- [ ] Verify memory usage <100MB after startup

### Git Intelligence

**Recent Commits (Last 10):**
1. `7662be0` - Merge pull request #4 (test design and gate check)
2. `2ad96b2` - Finalize design - test strategy - implementation readiness
3. `4fec2ac` - Upgrade BMAD to v6 alpha.22
4. `1d5517d` - Merge pull request #3 (architecture specs)
5. `8c880c7` - Architecture and planning - Generate architecture - Create epics
6. `5a7f060` - Merge pull request #2 (finish design phase)
7. `56452e9` - Finalize UX design - Generate UX specs - Generate UI mockups
8. `5dea522` - Merge pull request #1 (spec-driven kit)
9. `518fcca` - Add BMAD Method - Initialize - Run brainstorming - Generate PRD
10. `80750a8` - Initialize project from template

**Pattern Observations:**
- No implementation work has started yet (all planning/design)
- Story 1.7 is the LAST story in Epic 1 (Foundation & Application Shell)
- This story completes the foundation before moving to Epic 2 (Snippet Library Management)
- Performance is critical for user experience (30-second composition workflow depends on fast startup)

**Performance Context:**
- Startup time is a competitive advantage (vs Cursor, ChatGPT web interface)
- Power users will launch app frequently throughout the day
- 2-second startup enables impulse-driven usage ("I need a prompt NOW")

### Latest Technical Information

**Vite 7.3.0 Performance Features:**
- Pre-bundling with esbuild (10-100x faster than webpack)
- Native ES modules in dev (no bundling during development)
- Rollup for production (tree-shaking, code-splitting)
- CSS code-splitting automatic
- Dynamic imports supported (React.lazy() works out of the box)

**React 19.2.3 Performance Improvements:**
- Concurrent rendering (improves perceived performance)
- Automatic batching (fewer re-renders)
- Suspense for data fetching (better loading states)
- Transition API (defer non-urgent updates)

**Tauri v2 Performance Characteristics:**
- Window creation: ~100-200ms (platform-dependent)
- IPC latency: ~1-5ms per call (JSON serialization overhead)
- Rust startup: ~50-100ms (binary initialization)
- WebView initialization: ~200-500ms (Chromium/WebKit startup)

**Zustand v4.x Performance:**
- Store creation: <1ms (no providers, no context)
- Selector subscriptions: <0.1ms per subscription
- State updates: <1ms for shallow updates
- No unnecessary re-renders (selective subscriptions)

### Cross-Cutting Concerns

**Performance vs Bundle Size Tradeoffs:**
- Lazy loading adds minimal runtime overhead (~10ms per lazy component)
- Code-splitting increases HTTP requests but enables parallel downloads
- Minification adds ~2-3s to build time but reduces bundle ~30-40%
- Tree-shaking requires careful imports (prefer named imports over default)

**Memory Management:**
- Zustand stores use WeakMap (automatic garbage collection)
- React components unmount cleanly (no memory leaks)
- Tauri IPC messages are pooled (no accumulation)
- Large JSON (library.json) is loaded once and cached in memory

**Platform-Specific Performance:**
- **macOS Apple Silicon:** Fastest (native ARM, optimized Rust)
- **macOS Intel:** Fast (x86_64 Rust, mature platform)
- **Windows 10/11:** Fast (native x86_64, good WebView2 performance)
- **Linux:** Variable (depends on WebKitGTK version, distro optimizations)

**Accessibility Impact:**
- Fast startup benefits all users (cognitive load reduction)
- Screen reader users benefit from immediate interactivity
- Keyboard-first users can start typing commands immediately

### Anti-Patterns to Avoid

❌ **Don't use async initialization in Zustand stores:**
- Blocks React render until async completes
- Use synchronous initialization + async actions in useEffect

❌ **Don't load all components eagerly:**
- Increases bundle size and parse time
- Use React.lazy() for modals, dialogs, settings

❌ **Don't import entire libraries:**
```typescript
// ❌ WRONG - imports entire lodash (70KB)
import _ from 'lodash';

// ✅ CORRECT - imports only debounce (~1KB)
import debounce from 'lodash-es/debounce';
```

❌ **Don't block window render with IPC calls:**
- Window should appear first, then load data
- Use loading skeletons while data loads

❌ **Don't forget to inline critical CSS:**
- Tailwind base styles should be in index.html <head>
- Prevents FOUC (flash of unstyled content)

❌ **Don't disable Rust optimizations:**
- Always use release profile for production builds
- Enable LTO, strip symbols, optimize for size

❌ **Don't ignore bundle size warnings:**
- Vite warns when chunks exceed 500KB
- Investigate large dependencies (consider alternatives)

### Developer Checklist

Before marking this story as complete, verify:

**Benchmarking:**
- [ ] Baseline performance measured (before optimizations)
- [ ] Cold start time measured on 3+ platforms
- [ ] Bundle size measured before/after optimizations
- [ ] Performance test suite runs successfully

**Build Optimizations:**
- [ ] Vite code-splitting enabled
- [ ] Rollup manual chunks configured
- [ ] Terser minification enabled
- [ ] Tailwind purging verified
- [ ] Bundle visualizer shows reasonable chunk sizes
- [ ] Total bundle <500KB gzipped

**Code Optimizations:**
- [ ] React.lazy() used for non-critical components
- [ ] Suspense boundaries added with loading fallbacks
- [ ] Zustand stores initialize synchronously
- [ ] Library loads asynchronously (non-blocking)
- [ ] Theme applied before React mount
- [ ] No FOUC (flash of unstyled content)

**Tauri Optimizations:**
- [ ] Rust release profile optimized (LTO, strip, opt-level)
- [ ] Unused Tauri plugins disabled
- [ ] Window appears within 1 second
- [ ] IPC calls don't block window initialization

**Testing:**
- [ ] Performance test suite passes (<2.5s average)
- [ ] Bundle size check passes (<500KB)
- [ ] Manual testing on macOS completed
- [ ] Manual testing on Windows completed
- [ ] Manual testing on Linux completed
- [ ] Large library (500 snippets) tested

**Documentation:**
- [ ] Performance section added to README.md
- [ ] Bundle size budgets documented
- [ ] Cold start targets documented
- [ ] Performance benchmarking guide added
- [ ] Troubleshooting section for slow startups

**Cross-Platform:**
- [ ] Cold start <2s on macOS (Intel)
- [ ] Cold start <2s on macOS (Apple Silicon)
- [ ] Cold start <2s on Windows 10/11
- [ ] Cold start <2.5s on Linux (Ubuntu 22.04)
- [ ] No platform-specific performance regressions

**UX Polish:**
- [ ] Window appears instantly (no black screen)
- [ ] Theme applied immediately (no flash)
- [ ] Loading skeleton shows while library loads
- [ ] UI is interactive immediately after render
- [ ] No layout shift during initialization

**Memory & Resource Usage:**
- [ ] Idle memory <100MB
- [ ] Active memory <200MB with 500 snippets
- [ ] No memory leaks detected
- [ ] CPU usage drops to 0% after startup

---

## Notes for Dev Agent

**Story Complexity: High**
- 10 tasks, ~60 subtasks
- Performance optimization requires careful measurement and iteration
- Cross-platform testing essential
- Build configuration complexity (Vite, Rollup, Tailwind, Rust)

**Estimated Effort: 6-8 hours**
- Benchmarking setup: 1 hour
- Vite/Rollup optimization: 1.5 hours
- React lazy loading: 1 hour
- Store initialization fixes: 1 hour
- Theme/font optimization: 1 hour
- Tauri Rust optimization: 30 minutes
- Performance testing: 1.5 hours
- Cross-platform validation: 1 hour
- Documentation: 30 minutes

**Key Risks:**
1. **Platform-specific performance:** Linux might be slower due to WebKitGTK overhead
2. **Bundle size creep:** Dependencies might push bundle over 500KB limit
3. **Lazy loading complexity:** Suspense boundaries might introduce visual glitches
4. **Measurement accuracy:** Performance timing in Playwright might not reflect real usage
5. **Optimization conflicts:** Some optimizations might break hot reload or dev experience

**Dependencies:**
- Stories 1.1-1.6 MUST be complete (foundation must exist to optimize)
- React lazy loading requires Suspense boundaries (might not exist yet)
- Performance tests require E2E test infrastructure (Playwright setup)
- Bundle size checks require production build pipeline

**Success Criteria:**
- Cold start averages <2 seconds on all platforms
- Window appears <1 second
- Bundle size <500KB gzipped
- Performance test suite passes reliably
- No visual glitches during startup (FOUC, layout shift)
- Documentation includes performance benchmarking guide

**Critical Path Items:**
1. **Baseline measurement FIRST** - Can't optimize without knowing current state
2. **Fix blocking async** - Zustand stores must initialize synchronously
3. **Theme FOUC prevention** - Apply theme in main.tsx before React mounts
4. **Bundle size analysis** - Use visualizer to identify largest dependencies
5. **Lazy loading critical components** - SearchDialog, SnippetEditor, Settings

**Post-Completion:**
- Epic 1 is complete after this story
- Epic 2 (Snippet Library Management) can begin
- Foundation is solid for building features
- Performance baseline is established for regression prevention

