# Agent Guidelines for prompt-alchemist

1. Dev: `npm run dev` (Vite web) / `npm run tauri:dev` (desktop app with Rust backend).
2. Build: `npm run build` (web); `npm run tauri:build` (desktop bundle).
3. Unit tests: `npm run test:unit` (all), `npm run test:unit -- <pattern>` (single test file or pattern), `npm run test:unit:coverage` (with coverage report).
4. E2E: `npm run test:e2e` (headless Playwright), `npm run e2e:ui` (Playwright UI mode), `npm run test:e2e:headed` (headed browser).
5. Lint: `npm run lint` (all linters), `npm run fix` (auto-fix code/format/styles), `npm run check` (types + lockfile + Rust).
6. Rust: `npm run test:rust` (cargo tests), `npm run check:rust` (format + clippy), `npm run fix:rust` (auto-format).
7. Imports: Use `@/` alias for `src/` imports; ESLint enforces `import/order` (builtin → external → internal → parent → sibling → index, alphabetized, blank lines between groups).
8. Prettier: single quotes, 95-char width, trailing commas, no arrow parens, 2-space indent; Tailwind classes auto-sorted via `prettier-plugin-tailwindcss`.
9. TypeScript: strict mode; prefer `string[]` over `Array<string>` (enforced by ESLint); Vitest tests use globals (describe/it/expect) without imports.
10. Components: React 19 function components with hooks; use ShadCN UI components from `@/components/ui`; merge classes with `cn()` from `@/lib/utils`.
11. Naming: PascalCase for components/files (e.g. `App.tsx`, `HomePage.ts`), camelCase for functions/variables, kebab-case for CSS custom properties, snake_case for Rust.
12. Error handling: `console.log` disallowed in app code (use `console.error`/`console.info`/`console.warn`); no magic numbers except -1, 0, 1, 2, 10, 100, 1000 (ESLint enforced).
13. Testing: test files named `*.test.ts(x)`; use Testing Library queries (prefer `getByRole`/`getByLabelText`/`getByPlaceholderText`); use `vi.hoisted` for mocks; mock Tauri via `vi.mock('@tauri-apps/api/core')`.
14. Test environment: Vitest with jsdom, `@testing-library/jest-dom` matchers; global setup in `vitest.globals.ts` and `vitest.setup.ts`.
15. CSS: Tailwind CSS v4 with `@tailwindcss/vite` plugin; prefer Tailwind utilities over custom CSS; follow existing patterns for consistency.
16. Rust: follow `src-tauri/rustfmt.toml` and `clippy.toml`; run `npm run check:rust` before committing Rust changes (clippy fails on warnings).
17. Git hooks: Husky + lint-staged run on pre-commit; ensure `npm run lint` and `npm run test:unit` pass before committing.
18. Ignore generated artifacts: `dist/`, `coverage/`, `playwright-report/`, `test-results/`, `src-tauri/target/`, `src-tauri/build/` when editing or searching code.
19. Cursor/Copilot: No `.cursorrules`, `.cursor/rules/`, or `.github/copilot-instructions.md` files exist in this repo.
20. Philosophy: Prefer minimal, focused changes that respect this style and tooling setup; always run tests and linters before finalizing changes.
