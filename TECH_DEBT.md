# TECH_DEBT: From Template to Production

This document collects guidance and next steps for evolving **Tauri v2 React Starter Application** from a high-quality starter template into a production-ready desktop application. It is deliberately opinionated and aimed at tech leads and senior engineers.

Use this as a living tech-debt register and roadmap: when you make decisions, update this file.

---

## 1. CI/CD Pipelines

Tauri v2 React Starter Application ships with local tooling (lint, tests, formatting) but no CI/CD configuration. Your first productionization step should be to mirror local quality gates in your pipeline.

### 1.1 Goals for CI

At minimum, every push/PR to your main branch should:

- Install dependencies reproducibly (`npm ci`).
- Validate the lockfile (`npm run check:lockfile`).
- Run static checks:
  - `npm run check:types`
  - `npm run lint`
- Run unit tests:
  - `npm run test:unit`
- Optionally run:
  - E2E smoke tests: `npm run test:e2e`
  - Rust tests: `npm run test:rust`
- (Release pipeline) Build artifacts:
  - Frontend: `npm run build`
  - Desktop bundle: `npm run tauri:build`

### 1.2 GitHub Actions Skeleton

Below is an example CI workflow you can adapt. It focuses on fast feedback; adjust jobs and matrices to fit your team.

```yaml
name: CI

on: [push, pull_request]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '24.12.0'

      - name: Install dependencies
        run: npm ci

      - name: Validate lockfile
        run: npm run check:lockfile

      - name: Type check
        run: npm run check:types

      - name: Lint
        run: npm run lint

      - name: Unit tests
        run: npm run test:unit

      # Optional: enable once Playwright is configured for CI
      # - name: Install Playwright browsers
      #   run: npm run e2e:install
      #
      # - name: E2E tests
      #   run: npm run test:e2e

      # Optional: Rust tests if you rely on custom backend logic
      # - name: Rust tests
      #   run: npm run test:rust
```

**Notes:**

- For heavier apps, consider splitting lint/test/build into separate jobs and using caching for `~/.npm` and Playwright browsers.
- For release pipelines, add a separate workflow that runs `npm run tauri:build` on the appropriate OS (macOS for .app/.dmg, Windows for .msi/.exe, etc.).

### 1.3 Azure DevOps Skeleton

If you use Azure DevOps (ADO), you can mirror the same steps:

```yaml
trigger:
  - main

pool:
  vmImage: 'ubuntu-latest'

steps:
  - task: NodeTool@0
    inputs:
      versionSpec: '24.12.0'

  - script: npm ci
    displayName: Install dependencies

  - script: npm run check:lockfile
    displayName: Validate lockfile

  - script: npm run check:types
    displayName: Type check

  - script: npm run lint
    displayName: Lint

  - script: npm run test:unit
    displayName: Unit tests

  # Optional additional stages for E2E, Rust tests, and Tauri builds
```

For Tauri builds in ADO, prefer self-hosted agents or OS-specific hosted agents with the necessary signing credentials installed.

---

## 2. Security & Hardening

### 2.1 Content Security Policy (CSP)

Tauri v2 React Starter Application now ships with a default CSP in `src-tauri/tauri.conf.json`. This policy is enforced in **built** applications and is a key control for preventing XSS and other injection attacks.

Recommended baseline (see the config for the exact string):

- `default-src 'self'`
- `script-src 'self'`
- `style-src 'self' 'unsafe-inline'` (kept for Tailwind/shadcn; consider tightening later)
- `img-src 'self' data:`
- `font-src 'self' data:`
- `connect-src 'self'`

#### When to adjust CSP

You will need to update the CSP when you:

- Load images, fonts, or scripts from remote CDNs.
- Call remote APIs (REST/GraphQL) from the frontend.
- Embed external content (e.g., iframes, OAuth providers).

**Workflow for changes:**

1. Update the `app.security.csp` string in `src-tauri/tauri.conf.json` to add the necessary origins (for example, add `https://api.example.com` to `connect-src`).
2. Build and run the app (`npm run tauri:build` and install, or run in dev noting that dev CSP may be more permissive).
3. Open DevTools in the Tauri window and watch for CSP violation errors.
4. Iterate until you have the minimum set of allowed sources.

See `docs/1-architecture.md` for more background on the security model and capabilities.

### 2.2 Capabilities & IPC

Tauri uses a capability-based model to restrict what each window can do. For Tauri v2 React Starter Application:

- Capabilities are defined under `src-tauri/capabilities/` (for example `default.json`).
- Each command you expose should be:
  - Explicitly declared in Rust (`#[tauri::command]`).
  - Registered via `invoke_handler`.
  - Allowed by the appropriate capability file.

**Tech-debt tasks:**

- [ ] Review `src-tauri/capabilities/default.json` and disable anything not needed.
- [ ] For new windows or features, create dedicated capability sets instead of reusing a permissive default.
- [ ] Document safe IPC usage patterns in your internal docs (what is allowed to cross the boundary, what stays in Rust only).

---

## 3. Routing Strategy

The template currently uses a single-screen layout without a router. For small tools, that may be enough, but most production apps benefit from a routing strategy.

### 3.1 Options

- **No router (status quo)**
  - Suitable for very small, single-flow tools.
  - Keep components under `src/components` and drive navigation via local state.

- **React Router**
  - Mature, widely used.
  - Good fit if your team already knows it.
  - Typical structure: `src/routes` or `src/pages`, plus a top-level `<Router>` wrapper.

- **TanStack Router**
  - Strongly typed routes, co-located loaders/actions, good TypeScript story.
  - Works well alongside TanStack Query for data fetching.

### 3.2 Considerations Specific to Tauri

- Deep linking: desktop apps often do not need URL-based deep links, but URLs can still be useful for internal routing and debugging.
- Single window vs multi window: decide whether routes are just views within a single window or whether some flows deserve separate Tauri windows.
- Back/forward navigation: decide if you mirror browser-style navigation or use simpler in-app navigation primitives.

### 3.3 Suggested path

1. When you add a second major screen, introduce a router rather than growing ad-hoc conditionals.
2. Choose one router and document the folder layout (for example, `src/routes` with each route in its own folder including tests).
3. Add a brief “Routing” subsection to `docs/1-architecture.md` that matches your choice.

---

## 4. State Management & Data Fetching

Today, state is managed via local `useState` and simple hooks. That’s ideal for a template, but most production apps will need a more structured approach.

### 4.1 Global state options

Common choices:

- **React Context + reducers**
  - Good for a small number of global concerns (theme, auth, feature flags).
  - Low additional dependency footprint.

- **Zustand**
  - Minimal, hook-based store.
  - Easy to adopt incrementally.
  - Good choice for shared UI state, selections, preferences.

- **Jotai**
  - Atomic state management with fine-grained subscriptions.
  - Useful for complex UIs with many independent pieces of state.

- **TanStack Query**
  - Purpose-built for async/server state.
  - Handles caching, retries, background refresh.
  - Pairs well with any of the above for client state.

### 4.2 When to introduce additional state tooling

Consider introducing a dedicated state library when you notice:

- The same state has to be passed through 3+ component layers.
- Multiple pages or features depend on the same slice of data.
- You start storing async request state manually (`isLoading`, `error`, `data`) in many places.

**Suggested incremental path:**

1. Start with Context + custom hooks for global concerns that already exist (theme is provided by `next-themes`).
2. Add a lightweight store (Zustand or Jotai) when you have shared UI state across unrelated parts of the tree.
3. Introduce TanStack Query for remote data sources or when Rust commands start proxying network calls and you want caching/retries.

Document whichever approach you choose in `docs/3-development-guide.md` under a new "State Management" section.

---

## 5. Release & Distribution

Tauri v2 React Starter Application includes Tauri build commands but not a full release process.

### 5.1 Recommended steps

- Define your versioning strategy (semantic versioning, release cadence).
- Configure platform-specific signing and notarization:
  - macOS: Developer ID certificate, notarization, stapling.
  - Windows: code signing certificate.
- Decide distribution channels:
  - Direct downloads from your website or internal portal.
  - Private update server, if you plan to support auto-updates.
- Automate:
  - A release workflow that runs `npm run tauri:build` for target platforms.
  - Generation and upload of artefacts (installers, checksums, release notes).

Prefer linking to the official Tauri documentation for low-level command details and keep this file focused on **decisions** and **checklists**.

---

## 6. Suggested Roadmap

Use this as a starting checklist when you decide to take an app built on Tauri v2 React Starter Application to production:

- [ ] **CI/CD**: Add a pipeline (GitHub Actions / Azure DevOps) that runs `check:lockfile`, `check:types`, `lint`, `test:unit`, and optionally `test:e2e` / `test:rust`.
- [ ] **Security**: Enable and tune CSP in `tauri.conf.json`; review capabilities in `src-tauri/capabilities/`.
- [ ] **Routing**: Pick a router (or confirm none is needed) and document the pattern.
- [ ] **State management**: Introduce a shared state solution and/or TanStack Query as your data needs grow.
- [ ] **Release process**: Define how you build, sign, notarize, and distribute installers.
- [ ] **Monitoring**: Decide how you will monitor errors and performance in production (the logging hooks are in place; you provide aggregation).

As your application matures, expand this file with project-specific decisions and keep it as the single source of truth for your tech debt and production-readiness plan.
