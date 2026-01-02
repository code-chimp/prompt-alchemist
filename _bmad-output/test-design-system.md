# System-Level Test Design - Prompt Alchemist

**Generated:** 2026-01-01  
**Project:** prompt-alchemist  
**Phase:** Phase 3 - Solutioning (Pre-Implementation Readiness)  
**Test Architect:** Murat (TEA Agent)  

---

## Executive Summary

This system-level testability review assesses the prompt-alchemist architecture before the implementation-readiness gate check. The goal: validate that the planned architecture supports reliable, maintainable automated testing across all three platforms (macOS, Windows, Linux).

**Overall Assessment: ✅ PASS with RECOMMENDATIONS**

The architecture is testable with strong foundations (React Testing Library, Playwright, Vitest), clear boundaries (Zustand state, Tauri IPC), and platform-agnostic design (ShadCN UI). **No blockers identified.** The recommendations below optimize test strategy and address potential risks before implementation begins.

**Key Findings:**
- ✅ **Controllability:** Zustand state + mocked Tauri IPC provide excellent test control
- ✅ **Observability:** JSON file format, localStorage persistence, ARIA labels enable test validation
- ⚠️ **Reliability Concern:** Cross-platform E2E tests need burn-in strategy for flake detection
- ⚠️ **Performance Risk:** Search (<100ms), startup (<2s), drag-and-drop (<50ms) need benchmarking from Sprint 0

---

## Testability Assessment

### Controllability: ✅ PASS

**Can we control system state for testing?**

**Database/State Seeding:**
- ✅ Zustand stores are mockable - unit tests can inject fixture data directly
- ✅ JSON library format allows E2E tests to seed `library.json` before launch
- ✅ No real database - file-based storage eliminates migration/seeding complexity
- ✅ localStorage for theme/settings - Playwright can set via `context.addInitScript()`

```typescript
// Unit test: Mock Zustand store with fixture data
vi.mock('@/stores/libraryStore', () => ({
  useLibraryStore: vi.fn(() => ({
    snippets: mockSnippets, // Controlled fixture data
    addSnippet: vi.fn(),
  })),
}));

// E2E test: Seed library.json before app launch
await fs.writeFile(
  path.join(configDir, 'library.json'),
  JSON.stringify({ version: '1.0.0', snippets: fixtureSnippets })
);
await app.launch();
```

**External Dependencies:**
- ✅ **No network calls** - fully offline, no API mocking needed
- ✅ **Tauri IPC mockable** - `vi.mock('@tauri-apps/api/core')` isolates frontend from backend
- ✅ **Clipboard mockable** - Tauri clipboard API can return controlled values in tests

**Error Injection:**
- ✅ File system errors testable - mock Tauri `read_library()` to return error strings
- ✅ Crash recovery testable - kill process mid-write, verify `.tmp` → `library.json` atomic rename
- ⚠️ **Cross-platform error differences** - Windows permission errors vs Unix EACCES need platform-specific test cases

**Recommendation 1: Create `test-fixtures/` directory with seed data**
```
tests/fixtures/
├── library-empty.json          # First launch scenario
├── library-small-10.json       # 10 snippets for fast tests
├── library-medium-100.json     # 100 snippets for search tests
├── library-large-1000.json     # 1000 snippets for perf tests
└── library-corrupted.json      # Invalid JSON for error handling
```

**Recommendation 2: Standardize Tauri IPC mocking pattern**
```typescript
// tests/setup/tauri-mock.ts
export const mockTauriCommands = () => {
  vi.mock('@tauri-apps/api/core', () => ({
    invoke: vi.fn((cmd, args) => {
      switch (cmd) {
        case 'read_library':
          return Promise.resolve(fixtureLibrary);
        case 'write_library':
          return Promise.resolve();
        case 'copy_to_clipboard':
          return Promise.resolve();
        default:
          return Promise.reject(`Unknown command: ${cmd}`);
      }
    }),
  }));
};
```

---

### Observability: ✅ PASS

**Can we inspect system state?**

**State Inspection:**
- ✅ Zustand stores expose state via `useStore.getState()` - unit tests can assert store state directly
- ✅ JSON library file is human-readable - E2E tests can parse `library.json` to verify persistence
- ✅ ARIA labels on all UI elements - Playwright can query by accessible name (screen reader perspective)
- ✅ React DevTools available in development - manual debugging support

```typescript
// Unit test: Assert Zustand store state
const state = useLibraryStore.getState();
expect(state.snippets).toHaveLength(3);
expect(state.snippets[0].name).toBe('Senior C# Developer');

// E2E test: Verify persistence to JSON
await page.getByRole('button', { name: 'New Snippet' }).click();
await page.getByLabel('Name').fill('Test Snippet');
await page.getByRole('button', { name: 'Create' }).click();

const library = JSON.parse(await fs.readFile(libraryPath, 'utf-8'));
expect(library.snippets).toHaveLength(4);
expect(library.snippets[3].name).toBe('Test Snippet');
```

**Test Results Determinism:**
- ✅ No animations blocking assertions - Catppuccin theme switching is instant (<200ms)
- ✅ fuse.js search is deterministic - same query + same library = same results
- ⚠️ **Frecency ranking includes timestamps** - tests must use fixed dates or mock `Date.now()`

**NFR Validation:**
- ✅ Performance metrics observable - Playwright `page.evaluate(() => performance.now())` for timing
- ⚠️ **No telemetry/logging** - tests can't validate error tracking (consider console.error assertions)

**Recommendation 3: Add console.error spy to detect unhandled errors**
```typescript
// tests/setup/console-spy.ts
test.beforeEach(({ page }) => {
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      throw new Error(`Console error detected: ${msg.text()}`);
    }
  });
});
```

**Recommendation 4: Mock Date.now() for frecency tests**
```typescript
// Deterministic frecency ranking
const mockDate = new Date('2026-01-01T12:00:00Z');
vi.setSystemTime(mockDate);

// Snippet last used 5 days ago
const snippet = {
  usageCount: 10,
  lastUsed: new Date('2025-12-27T12:00:00Z').toISOString(),
};

const score = calculateFrecency(snippet);
expect(score).toBe(95); // (10 × 10) + (-5) = 95
```

---

### Reliability: ⚠️ CONCERNS

**Can we parallelize tests and reproduce failures?**

**Test Isolation:**
- ✅ Zustand stores are instance-per-component - React Testing Library renders don't leak state
- ✅ Playwright tests run in isolated browser contexts - no shared localStorage/cookies
- ⚠️ **JSON file writes are serial** - parallel E2E tests writing to same `library.json` will collide

**Failure Reproduction:**
- ✅ HAR capture available - Playwright `recordHar` for network debugging (though no network calls)
- ✅ Screenshots + videos on failure - Playwright built-in artifact capture
- ⚠️ **Cross-platform failures** - macOS-specific flakes may not reproduce on Windows CI

**Component Coupling:**
- ✅ Loosely coupled - Zustand stores don't depend on React lifecycle, easily testable in isolation
- ✅ IPC layer is mockable - frontend tests don't need Rust backend running
- ⚠️ **Drag-and-drop timing** - React DnD or native drag events may have timing issues in headless browsers

**Recommendation 5: E2E test isolation strategy**
```typescript
// Each E2E test gets unique config directory
const testConfigDir = path.join(tmpdir(), `prompt-alchemist-test-${Date.now()}`);

test.beforeEach(async () => {
  await fs.mkdir(testConfigDir, { recursive: true });
  process.env.PROMPT_ALCHEMIST_CONFIG_DIR = testConfigDir;
});

test.afterEach(async () => {
  await fs.rm(testConfigDir, { recursive: true, force: true });
});
```

**Recommendation 6: CI burn-in for cross-platform flake detection**
- Run full E2E suite 10x on each platform (Mac, Windows, Linux) before release
- Track flake rate: P0 tests must have 0% flake rate, P1 tests <1% flake rate
- Use `--repeat-each=5` in Playwright for burn-in runs
- Fail CI if any test flakes (don't merge flaky tests)

---

## Architecturally Significant Requirements (ASRs)

### ASR-1: Search Performance (<100ms for 1000 snippets)

**Risk Score: 6** (Probability: 2, Impact: 3)  
**Category:** PERF  

**Testability Challenge:**
- fuse.js performance depends on library size, query complexity, and device specs
- Frontend TypeScript search may hit 100ms limit on older devices
- No backend search fallback initially (Phase 2 deferred Rust fuzzy-matcher)

**Test Strategy:**
1. **Benchmark Suite:** Create `tests/benchmark/search-performance.bench.ts` with Vitest benchmark
2. **Fixture Sizes:** Test with 100, 500, 1000 snippet libraries
3. **Worst-Case Queries:** Test long queries (20+ chars), Unicode, special characters
4. **Device Simulation:** Throttle CPU in Playwright for low-end device testing

```typescript
// tests/benchmark/search-performance.bench.ts
import { bench, describe } from 'vitest';
import Fuse from 'fuse.js';
import { generate1000Snippets } from '../fixtures/snippet-generator';

describe('Search Performance', () => {
  const snippets = generate1000Snippets();
  const fuse = new Fuse(snippets, {
    keys: ['name', 'content'],
    threshold: 0.4,
  });

  bench('search 1000 snippets', () => {
    fuse.search('senior developer c# architecture');
  }, { time: 1000, iterations: 100 });
  
  // Target: avg < 50ms, p95 < 100ms, p99 < 150ms
});
```

**Gate Criteria:**
- ✅ PASS: Benchmark shows p95 < 100ms for 1000 snippets on CI runner
- ⚠️ CONCERNS: Benchmark shows p95 = 80-150ms (trending toward limit)
- ❌ FAIL: Benchmark shows p95 > 150ms (violates NFR-P1)

**Mitigation Plan:**
- If FAIL: Implement debounced search (300ms) + virtual scrolling (render top 50 results)
- If still FAIL: Phase 2 early - move search to Rust with `fuzzy-matcher` crate

---

### ASR-2: Cold Start (<2s to usable state)

**Risk Score: 4** (Probability: 2, Impact: 2)  
**Category:** PERF  

**Testability Challenge:**
- Cold start includes: Tauri initialization, React hydration, library JSON load, theme CSS load
- CI runners are faster than user devices - benchmarks may not reflect real-world performance
- No telemetry to track real user startup times

**Test Strategy:**
1. **E2E Timing Test:** Measure `app.launch()` → first interactive element
2. **Fixture Sizes:** Test with 0, 100, 500 snippet libraries (JSON parse time scales)
3. **Cold vs Warm:** Clear system cache between runs to simulate cold start
4. **CI Baseline:** Establish CI runner baseline, add 30% buffer for user devices

```typescript
// tests/e2e/startup-performance.spec.ts
test('cold start completes within 2 seconds', async ({ app }) => {
  const startTime = performance.now();
  
  await app.launch();
  await page.waitForSelector('[data-testid="library-panel"]', { state: 'visible' });
  await page.waitForSelector('[data-testid="preview-panel"]', { state: 'visible' });
  
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  expect(duration).toBeLessThan(2000); // NFR-P3
});
```

**Gate Criteria:**
- ✅ PASS: E2E test shows cold start < 2s on all platforms (Mac, Windows, Linux)
- ⚠️ CONCERNS: Cold start = 1.8-2.5s (close to limit)
- ❌ FAIL: Cold start > 2.5s (violates NFR-P3)

**Mitigation Plan:**
- If FAIL: Lazy load non-critical components (settings dialog, help modal)
- If FAIL: Code-split Vite bundles to defer fuse.js until first search
- If FAIL: Optimize Tailwind CSS purge to reduce initial CSS payload

---

### ASR-3: Cross-Platform Clipboard Consistency

**Risk Score: 4** (Probability: 2, Impact: 2)  
**Category:** TECH  

**Testability Challenge:**
- Clipboard APIs differ across macOS (NSPasteboard), Windows (Win32), Linux (X11/Wayland)
- Playwright clipboard API works in browser context, not native desktop clipboard
- No way to mock native clipboard in E2E tests (must test real clipboard)

**Test Strategy:**
1. **Platform-Specific E2E Tests:** Run clipboard tests on all 3 platforms in CI
2. **Manual QA:** Human verification that copied prompts paste correctly into Cursor/ChatGPT
3. **Format Validation:** Assert clipboard contains plain text markdown (no rich text, no HTML)
4. **Special Characters:** Test markdown syntax, Unicode, emoji in clipboard output

```typescript
// tests/e2e/clipboard.spec.ts
test('copy to clipboard preserves markdown format', async ({ page, electronApp }) => {
  // Compose prompt
  await page.getByLabel('Role').fill('You are a senior developer');
  await page.getByLabel('Task').fill('Refactor this code');
  
  // Copy to clipboard
  await page.getByRole('button', { name: 'Copy' }).click();
  
  // Read clipboard (Playwright Electron app API)
  const clipboardText = await electronApp.evaluate(async ({ clipboard }) => {
    return clipboard.readText();
  });
  
  // Assert format
  expect(clipboardText).toContain('# Role\nYou are a senior developer');
  expect(clipboardText).toContain('# Task\nRefactor this code');
  expect(clipboardText).not.toContain('<div>'); // No HTML
});
```

**Gate Criteria:**
- ✅ PASS: Clipboard tests pass on Mac, Windows, Linux CI runners
- ⚠️ CONCERNS: Clipboard works on 2/3 platforms (1 platform has issues)
- ❌ FAIL: Clipboard fails on >1 platform or copies corrupted data

**Mitigation Plan:**
- If FAIL on Windows: Investigate Tauri Windows clipboard plugin, fallback to Ctrl+C native
- If FAIL on Linux: Wayland vs X11 clipboard differences, test both
- If FAIL: Add manual clipboard copy fallback (select all text + Cmd/Ctrl+C)

---

### ASR-4: Atomic File Writes (No Corruption on Crash)

**Risk Score: 6** (Probability: 2, Impact: 3)  
**Category:** DATA  

**Testability Challenge:**
- Simulating crashes mid-write is difficult in unit tests
- File system behavior differs across platforms (fsync semantics, rename atomicity)
- Race conditions in debounced auto-save may cause lost writes

**Test Strategy:**
1. **Rust Unit Tests:** Test atomic write logic in isolation (`.tmp` → rename)
2. **E2E Crash Simulation:** Kill app process during write, verify no corruption
3. **Concurrent Write Test:** Trigger rapid snippet creation (5 snippets in 500ms), verify all saved
4. **Platform-Specific Tests:** Verify atomic rename on NTFS (Windows), ext4 (Linux), APFS (macOS)

```rust
// src-tauri/src/commands/library.rs
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_atomic_write_no_corruption() {
        let temp_dir = tempfile::tempdir().unwrap();
        let library_path = temp_dir.path().join("library.json");
        
        let library = Library {
            version: "1.0.0".to_string(),
            snippets: vec![/* test data */],
        };
        
        // Write atomically
        save_library(library.clone(), &library_path).unwrap();
        
        // Verify file exists and is valid JSON
        let loaded = load_library(&library_path).unwrap();
        assert_eq!(loaded.snippets.len(), library.snippets.len());
    }
    
    #[test]
    fn test_atomic_write_interrupted() {
        let temp_dir = tempfile::tempdir().unwrap();
        let library_path = temp_dir.path().join("library.json");
        
        // Simulate interrupted write (tmp file exists, final file doesn't)
        let tmp_path = library_path.with_extension("json.tmp");
        std::fs::write(&tmp_path, "partial data").unwrap();
        
        // Load should fall back to empty library (not crash)
        let loaded = load_library(&library_path).unwrap();
        assert_eq!(loaded.snippets.len(), 0);
    }
}
```

**Gate Criteria:**
- ✅ PASS: Rust unit tests validate atomic writes, E2E crash tests show no corruption
- ⚠️ CONCERNS: Rare corruption observed (<1% flake rate) in stress tests
- ❌ FAIL: Corruption observed >1% of the time or data loss confirmed

**Mitigation Plan:**
- If FAIL: Add fsync() before rename to guarantee disk flush
- If FAIL: Add file integrity check on load (validate JSON schema, reject if invalid)
- If FAIL: Implement backup strategy (keep last N versions of `library.json`)

---

## Test Levels Strategy

### Recommended Test Distribution

**70% Unit / 20% Integration / 10% E2E** (API-heavy applications typical split)

**Rationale:**
- Desktop app with minimal external integration (no backend APIs, no auth)
- Complex UI interactions (drag-and-drop, search, keyboard nav) require E2E validation
- Zustand state logic and fuse.js search are pure functions → unit test coverage

**Distribution by Epic:**

| Epic                          | Unit % | Integration % | E2E % | Rationale                                          |
|-------------------------------|--------|---------------|-------|----------------------------------------------------|
| Epic 1: Foundation & Shell    | 80%    | 10%           | 10%   | Theme system, Zustand stores → unit tests          |
| Epic 2: Snippet Library CRUD  | 70%    | 20%           | 10%   | JSON persistence → integration, UI → E2E           |
| Epic 3: Prompt Composition    | 60%    | 20%           | 20%   | Framework switching → unit, clipboard → E2E        |
| Epic 4: Search & Discovery    | 80%    | 10%           | 10%   | fuse.js + frecency → unit, Cmd+K flow → E2E        |
| Epic 5: Advanced Interactions | 50%    | 20%           | 30%   | Drag-and-drop, tab stops → E2E critical            |
| Epic 6: Keyboard Navigation   | 60%    | 10%           | 30%   | Focus management, shortcuts → E2E validation       |

**Total Tests Estimate:** 200-250 tests
- Unit: 140-175 tests (70%)
- Integration: 40-50 tests (20%)
- E2E: 20-25 tests (10%)

---

### Unit Tests (140-175 tests, P0-P2 mix)

**What to test:**
- Zustand store actions (addSnippet, updateSnippet, deleteSnippet, incrementUseCount)
- fuse.js search + frecency ranking algorithm
- Framework template definitions (RTF, CODER, Co-Star section mappings)
- Markdown export formatting (section headers, empty section omission)
- Theme system (CSS custom property application, system preference detection)
- Date/time utilities (frecency days calculation, ISO 8601 formatting)

**Example:**
```typescript
// src/stores/libraryStore.test.ts
describe('LibraryStore', () => {
  beforeEach(() => {
    useLibraryStore.setState({ snippets: [] }); // Reset state
  });

  it('should add snippet with generated UUID and metadata', () => {
    const store = useLibraryStore.getState();
    
    store.addSnippet({
      name: 'Test Snippet',
      type: 'persona',
      content: 'Test content',
    });
    
    const snippet = store.snippets[0];
    expect(snippet.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-/); // UUID v4
    expect(snippet.usageCount).toBe(0);
    expect(snippet.lastUsed).toBeNull();
    expect(snippet.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/); // ISO 8601
  });

  it('should increment usage count and update lastUsed', () => {
    const store = useLibraryStore.getState();
    
    store.addSnippet({
      name: 'Test',
      type: 'persona',
      content: 'Content',
    });
    
    const snippetId = store.snippets[0].id;
    store.incrementUseCount(snippetId);
    
    expect(store.snippets[0].usageCount).toBe(1);
    expect(store.snippets[0].lastUsed).not.toBeNull();
  });
});
```

---

### Integration Tests (40-50 tests, P1-P2 mix)

**What to test:**
- JSON library persistence (Zustand store → Tauri IPC → file system)
- Atomic write behavior (`.tmp` → rename)
- Config directory creation (platform-specific paths)
- Theme persistence (localStorage → Zustand → CSS)
- Framework switching (preserve matching sections, store non-matching)

**Example:**
```typescript
// tests/integration/library-persistence.test.ts
describe('Library Persistence', () => {
  const testConfigDir = path.join(tmpdir(), 'prompt-alchemist-test');

  beforeEach(async () => {
    await fs.mkdir(testConfigDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(testConfigDir, { recursive: true, force: true });
  });

  it('should persist snippets to library.json via atomic write', async () => {
    const store = useLibraryStore.getState();
    
    // Add snippet (triggers auto-save)
    store.addSnippet({
      name: 'Test Snippet',
      type: 'persona',
      content: 'Test content',
    });
    
    // Wait for debounced save (200ms)
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Verify file written
    const libraryPath = path.join(testConfigDir, 'library.json');
    expect(await fs.access(libraryPath)).resolves.toBeUndefined();
    
    // Verify JSON content
    const library = JSON.parse(await fs.readFile(libraryPath, 'utf-8'));
    expect(library.version).toBe('1.0.0');
    expect(library.snippets).toHaveLength(1);
    expect(library.snippets[0].name).toBe('Test Snippet');
  });
});
```

---

### E2E Tests (20-25 tests, P0-P1 only)

**What to test (CRITICAL PATHS ONLY):**
- Snippet creation → save → reload app → snippet persists
- Search (Cmd+K) → select result → snippet inserts into prompt
- Framework switching → content preserved for matching sections
- Copy to clipboard → paste into external app (manual QA)
- Drag-and-drop snippet → inserts at cursor position
- Keyboard navigation (Tab, Shift+Tab, arrow keys) → focus moves correctly
- Cross-platform: Run full suite on macOS, Windows, Linux

**Example:**
```typescript
// tests/e2e/snippet-lifecycle.spec.ts
test('snippet creation persists across app restart', async ({ app, page }) => {
  // Create snippet
  await page.getByRole('button', { name: 'New Snippet' }).click();
  await page.getByLabel('Name').fill('E2E Test Snippet');
  await page.getByLabel('Type').selectOption('persona');
  await page.getByLabel('Content').fill('Test content for E2E');
  await page.getByRole('button', { name: 'Create' }).click();
  
  // Verify snippet visible
  await expect(page.getByText('E2E Test Snippet')).toBeVisible();
  
  // Restart app
  await app.close();
  await app.launch();
  
  // Verify snippet still exists
  await expect(page.getByText('E2E Test Snippet')).toBeVisible();
});
```

---

## NFR Testing Approach

### Security: ✅ PASS (Low Risk, Desktop App)

**Approach:**
- **No authentication/authorization** - offline-only app, no user accounts
- **No sensitive data** - snippets are plain text, no encryption needed
- **File system access limited** - Tauri capabilities restrict to config directory only
- **No network calls** - eliminates XSS, CSRF, injection risks

**Test Strategy:**
1. **Tauri Capability Validation:** Verify `capabilities/default.json` restricts file access
2. **Input Sanitization:** Test snippet content with `<script>` tags → should render as plain text, not execute
3. **Path Traversal:** Test library paths with `../` → should reject or normalize

**Security NFR Criteria:**
- ✅ PASS: No XSS, no file system escape, Tauri sandbox enforced
- ⚠️ CONCERNS: User can manually edit `library.json` to inject malicious content (acceptable risk for local tool)
- ❌ FAIL: File system escape or code execution via snippet content

**Tests Needed:** 5-10 security tests (P2 priority, low risk)

---

### Performance: ⚠️ CRITICAL (ASRs Identified)

**Approach:**
- **Benchmarking:** Vitest benchmark suite for search, frecency, framework switching
- **E2E Timing:** Playwright performance.timing API for cold start, clipboard copy, drag-and-drop
- **Load Testing:** Test with 1000-snippet libraries (worst case)
- **Device Simulation:** Playwright CPU throttling for low-end device testing

**Test Strategy:**
1. **Search Performance:** ASR-1 benchmarks (see above)
2. **Cold Start:** ASR-2 E2E timing (see above)
3. **Drag-and-Drop:** E2E timing (<50ms target from NFR-P4)
4. **Framework Switching:** E2E timing (<200ms target from NFR-P5)

**Performance NFR Criteria:**
- ✅ PASS: All benchmarks meet SLOs (search <100ms p95, cold start <2s, drag-and-drop <50ms)
- ⚠️ CONCERNS: Benchmarks show p95 within 20% of SLO (e.g., search = 120ms)
- ❌ FAIL: Benchmarks consistently exceed SLO by >20%

**Tests Needed:** 15-20 performance tests (P0-P1 priority, critical)

**Recommendation 7: Sprint 0 performance baseline**
- Establish performance baselines BEFORE implementing features
- Run benchmarks on CI runner + local dev machines to compare
- Set up performance regression detection (fail CI if benchmarks degrade >10%)

---

### Reliability: ✅ PASS with RECOMMENDATIONS

**Approach:**
- **Error Handling:** Mock file system errors, verify graceful degradation
- **Crash Recovery:** Kill app mid-write, verify atomic writes prevent corruption
- **Cross-Platform:** Run full test suite on Mac, Windows, Linux
- **Flake Detection:** Burn-in strategy (run tests 10x) to detect non-deterministic failures

**Test Strategy:**
1. **Atomic Writes:** ASR-4 Rust unit tests + E2E crash simulation (see above)
2. **File System Errors:** Mock Tauri IPC to return permission denied, disk full → verify error messages displayed
3. **Offline Resilience:** No network tests needed (fully offline)
4. **Cross-Platform Parity:** Run E2E suite on all 3 platforms, assert identical behavior

**Reliability NFR Criteria:**
- ✅ PASS: Error handling tested, crash recovery validated, cross-platform tests pass
- ⚠️ CONCERNS: <5% flake rate in burn-in, or 1 platform has edge case issues
- ❌ FAIL: Data loss observed, corruption confirmed, or >5% flake rate

**Tests Needed:** 20-30 reliability tests (P0-P1 priority)

**Recommendation 8: Cross-platform CI matrix**
```yaml
# .github/workflows/test.yml
strategy:
  matrix:
    os: [macos-latest, windows-latest, ubuntu-latest]
    node-version: [24]
jobs:
  test:
    runs-on: ${{ matrix.os }}
    steps:
      - run: npm run test:unit
      - run: npm run test:e2e
      - run: npm run test:rust
```

---

### Maintainability: ✅ PASS (Strong Foundation)

**Approach:**
- **Code Coverage:** Vitest coverage (target 80%+)
- **Linting:** ESLint + Clippy + Stylelint (already configured)
- **Test Quality:** Follow Definition of Done (no hard waits, <300 lines, no conditionals)

**Test Strategy:**
1. **Coverage Target:** 80%+ unit test coverage, 50%+ E2E coverage
2. **Test Quality:** Review tests against `test-quality.md` checklist
3. **Documentation:** Generate coverage reports, display in CI

**Maintainability NFR Criteria:**
- ✅ PASS: 80%+ coverage, clean tests (no flakes, no magic waits)
- ⚠️ CONCERNS: 60-79% coverage, some test smells (conditionals, >300 lines)
- ❌ FAIL: <60% coverage, tests are flaky or unmaintainable

**Tests Needed:** All tests (200-250) should follow test quality standards

**Recommendation 9: Coverage gate in CI**
```json
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      lines: 80,
      functions: 80,
      branches: 75,
      statements: 80,
    },
  },
});
```

---

## Test Environment Requirements

### Local Development
- **OS:** macOS 13+, Windows 10+, Ubuntu 22.04+
- **Node:** v24.12.0 (per `.nvmrc`)
- **Rust:** 1.70+ (Tauri v2 requirement)
- **Test Runners:** Vitest 4.0.16, Playwright 1.57.0

### CI/CD (GitHub Actions)
- **Matrix:** macOS-latest, Windows-latest, Ubuntu-latest
- **Node:** 24.x
- **Rust:** stable
- **Test Artifacts:** Screenshots, videos, HAR files, coverage reports

### Platform-Specific Needs
- **macOS:** No additional dependencies
- **Windows:** PowerShell 7+ for scripts
- **Linux:** libgtk-3-dev, libwebkit2gtk-4.0-dev (Tauri dependencies)

---

## Testability Concerns (if any)

### Concern 1: Drag-and-Drop in Headless Browsers

**Issue:** React DnD or native drag events may not work reliably in Playwright headless mode

**Impact:** Epic 5 (Advanced Interactions) drag-and-drop tests may be flaky

**Mitigation:**
1. Run drag-and-drop E2E tests in headed mode only (slower but reliable)
2. Add keyboard alternative tests (select snippet + Enter) as backup
3. Consider using Playwright `locator.dragTo()` API instead of native drag events

**Owner:** Test Architect (TEA)  
**Deadline:** Sprint 1 (during Epic 5 implementation)

---

### Concern 2: Cross-Platform File System Timing

**Issue:** File system operations (write, rename, fsync) have different timing guarantees across platforms

**Impact:** Atomic write tests may pass on Mac but fail on Windows due to filesystem differences

**Mitigation:**
1. Add explicit wait/retry logic in E2E tests (wait for `library.json` to exist, retry if not)
2. Increase timeouts for file system operations on Windows (NTFS slower than APFS)
3. Document platform-specific timing expectations in test comments

**Owner:** Backend Developer (Rust)  
**Deadline:** Sprint 1 (Epic 2 - Snippet Library Persistence)

---

## Recommendations for Sprint 0

**Sprint 0 = Foundation Sprint (1-2 weeks before Epic 1 starts)**

**Goal:** Set up testing infrastructure, establish baselines, validate tooling

### 1. Test Framework Setup (P0)
- ✅ Vitest already configured in starter template
- ✅ Playwright already configured in starter template
- ⚠️ **Action:** Add `tests/fixtures/` directory with seed data (Recommendation 1)
- ⚠️ **Action:** Add `tests/setup/tauri-mock.ts` (Recommendation 2)
- ⚠️ **Action:** Add `tests/setup/console-spy.ts` (Recommendation 3)

### 2. Performance Baselines (P0)
- ⚠️ **Action:** Create `tests/benchmark/search-performance.bench.ts` (ASR-1)
- ⚠️ **Action:** Create `tests/e2e/startup-performance.spec.ts` (ASR-2)
- ⚠️ **Action:** Run baselines on CI runner + local machines, document results

### 3. Cross-Platform CI (P0)
- ⚠️ **Action:** Set up GitHub Actions matrix for macOS, Windows, Linux (Recommendation 8)
- ⚠️ **Action:** Configure Playwright to run E2E tests on all platforms
- ⚠️ **Action:** Add burn-in job (`--repeat-each=10`) for flake detection (Recommendation 6)

### 4. Coverage Gates (P1)
- ⚠️ **Action:** Configure Vitest coverage thresholds (80% target, Recommendation 9)
- ⚠️ **Action:** Add coverage report to CI (upload to Codecov or GitHub Actions Summary)

### 5. Test Quality Standards (P1)
- ⚠️ **Action:** Create test template files (`snippet.test.tsx.template`, `feature.spec.ts.template`)
- ⚠️ **Action:** Add pre-commit hook to lint test files (no `waitForTimeout`, no conditionals)

---

## Summary & Gate Decision

### Testability Assessment: ✅ PASS

| Criterion       | Status | Details                                                                 |
|-----------------|--------|-------------------------------------------------------------------------|
| Controllability | ✅ PASS | Zustand + mocked Tauri IPC provide excellent test control              |
| Observability   | ✅ PASS | JSON files, ARIA labels, Zustand state enable validation                |
| Reliability     | ⚠️ CONCERNS | Cross-platform flakes need burn-in strategy (Recommendation 6)      |

### ASRs: 4 Identified (2 High Priority, 2 Medium Priority)

| ASR                          | Risk Score | Status | Mitigation Plan                                      |
|------------------------------|------------|--------|------------------------------------------------------|
| ASR-1: Search (<100ms)       | 6 (High)   | ⚠️     | Benchmark + fallback to Rust if needed               |
| ASR-2: Cold Start (<2s)      | 4 (Medium) | ⚠️     | E2E timing + lazy loading if needed                  |
| ASR-3: Clipboard Consistency | 4 (Medium) | ⚠️     | Platform-specific E2E + manual QA                    |
| ASR-4: Atomic Writes         | 6 (High)   | ⚠️     | Rust unit tests + E2E crash simulation               |

### Test Levels Strategy: Defined

- **Distribution:** 70% Unit / 20% Integration / 10% E2E
- **Total Tests:** 200-250 tests
- **Coverage Target:** 80%+ unit, 50%+ E2E

### NFR Testing: Planned

| NFR Category    | Approach                                    | Tests Needed | Priority |
|-----------------|---------------------------------------------|--------------|----------|
| Security        | Input sanitization, Tauri sandbox           | 5-10         | P2       |
| Performance     | Benchmarks + E2E timing                     | 15-20        | P0-P1    |
| Reliability     | Error handling, crash recovery, burn-in     | 20-30        | P0-P1    |
| Maintainability | Coverage (80%+), test quality standards     | All tests    | P1       |

### Sprint 0 Recommendations: 9 Total (5 P0, 4 P1)

**P0 (Must Complete Before Epic 1):**
1. Test fixtures directory
2. Tauri IPC mock standardization
3. Performance baseline benchmarks
4. Cross-platform CI matrix
5. Burn-in strategy for flake detection

**P1 (Complete During Epic 1):**
6. Console error spy
7. Coverage gates in CI
8. Test quality templates
9. Test linting pre-commit hook

---

## Next Steps

**For Implementation Readiness Gate Check:**
1. ✅ Review this document with Architect and PM
2. ⚠️ Complete Sprint 0 P0 recommendations (1-5 above)
3. ⚠️ Run initial performance baselines to validate feasibility
4. ✅ Proceed to Epic 1 implementation if no blockers found

**During Implementation (Epic 1-6):**
- Write tests TDD-style (test first, then implement)
- Run burn-in after each epic completes (10x runs to detect flakes)
- Update this document if testability concerns arise

**Before Release:**
- Verify all ASRs pass gate criteria (search <100ms, cold start <2s, etc.)
- Confirm 80%+ unit coverage, 50%+ E2E coverage
- Run full E2E suite 10x on all platforms (0% flake rate for P0 tests)

---

**Document Status:** ✅ Complete  
**Gate Recommendation:** ✅ PROCEED to Implementation Readiness (with Sprint 0 recommendations)  
**Next Review:** After Sprint 0 completion (validate performance baselines)
