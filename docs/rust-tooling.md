# Rust Tooling & Quality

This project treats the Rust backend (`src-tauri`) as a first-class citizen alongside the TypeScript/React frontend. This document explains how Rust code is organized and which tools enforce quality.

## Project Layout

Key Rust files and directories:

- `src-tauri/Cargo.toml`  Rust crate manifest for the Tauri backend.
- `src-tauri/src/main.rs`  Tauri entry point (framework-managed structure).
- `src-tauri/src/lib.rs`  Tauri command handlers and plugin setup.
- `src-tauri/rustfmt.toml`  rustfmt configuration for consistent formatting.
- `src-tauri/clippy.toml`  Clippy configuration for lint tuning.

The structure of `main.rs`, `lib.rs`, and the basics of `Cargo.toml` follow Tauri's recommended scaffolding and should generally not be heavily reorganized.

## NPM Scripts for Rust
 
All Rust tooling commands are exposed via npm scripts so you can run them from the project root:
 
- `npm run fix:rust`  Format Rust code in `src-tauri` using `cargo fmt`.
- `npm run lint:rust:format`  Verify formatting without writing changes.
- `npm run lint:rust:clippy`  Run Clippy and treat any warning as an error (`-D warnings`).
- `npm run rust:test` or `npm run test:rust`  Run `cargo test` for the Tauri crate.
- `npm run check:rust`  Run `lint:rust:format` and `lint:rust:clippy` in sequence.
 
The default `npm test` command runs **frontend unit tests only**:


```bash
npm test
```

## Formatting (rustfmt)

Rust formatting is handled by `rustfmt` with configuration in `src-tauri/rustfmt.toml`:

```toml
edition = "2021"

use_small_heuristics = "Max"
```

This keeps formatting close to Rust community defaults while avoiding overly aggressive line re-wrapping.

Common commands:

- Format code:
  ```bash
  npm run rust:fmt
  ```
- Check formatting only (used in pre-commit and CI):
  ```bash
  npm run rust:fmt:check
  ```

## Linting (Clippy)

Static analysis is provided by [Clippy](https://github.com/rust-lang/rust-clippy). Configuration lives in `src-tauri/clippy.toml` and is intentionally minimal; the main strictness comes from the CLI flag:
 
```bash
npm run lint:rust:clippy
```


This runs:

```bash
cargo clippy --manifest-path src-tauri/Cargo.toml -- -D warnings
```

which uses Clippy's default lint set and treats any warning as an error. This keeps the backend codebase clean without enabling extra noisy lint groups.

If certain lints become noisy for this template, you can allow them selectively in `clippy.toml` instead of weakening the `-D warnings` flag.

## Tests (cargo test)

Rust tests are run via:

```bash
npm run rust:test
# or
npm run test:rust
```

Rust tests are intentionally **not** wired into the default `npm test` pipeline so that fast unit feedback remains focused on the frontend. Run them explicitly when you touch backend code:
 
 - Frontend unit tests (Vitest) via `npm test` / `npm run test:unit`
 - E2E tests (Playwright) via `npm run test:e2e`
 - Rust tests (cargo test) via `npm run test:rust` or `npm run rust:test`


## Pre-commit Integration

Git pre-commit hooks are managed by Husky and lint-staged. For Rust files, lint-staged is configured to run `rust:fmt:check` on staged files:

- Pattern: `src-tauri/src/**/*.rs`
- Command: `npm run rust:fmt:check`

This means a commit that includes unformatted Rust code will fail, encouraging consistent style without running Clippy on every commit.

## Rust Quality Checklist

For any pull request that changes Rust code under `src-tauri`:

- [ ] `npm run rust:fmt:check` passes (no formatting diffs).
- [ ] `npm run rust:clippy` passes with zero warnings.
- [ ] `npm run rust:test` (or `npm run test:rust`) passes.
- [ ] New commands follow the naming and error-handling conventions in `docs/3-development-guide.md`.
- [ ] New behavior is covered by tests (Rust and/or TypeScript, as appropriate).

## Related Documentation

- `docs/1-architecture.md`  Backend architecture and Tauri command pattern.
- `docs/3-development-guide.md`  Rust conventions section plus Rust tooling summary.
- `TODOS.md`  High-level checklist including "Rust Tooling & Quality".
