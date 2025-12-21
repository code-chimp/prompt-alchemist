# Agent Guidelines for tauri2-react-starter

1. Dev: `npm run dev` (Vite) / `npm run tauri:dev` (desktop).
2. Build: `npm run build`; desktop: `npm run tauri:build`.
3. Unit tests: `npm run test:unit` (all), `npm run test:unit -- <pattern>` (single file), `npm run test:unit:coverage`.
4. E2E: `npm run test:e2e` (CLI), `npm run e2e:ui` (Playwright UI).
5. Lint/format: `npm run lint`, `npm run fix`, `npm run check` (types/lockfile/rust).
6. Rust: `npm run test:rust`, `npm run lint:rust:*`, `npm run fix:rust`.
7. Use `@/` alias for `src` imports; ESLint enforces `import/order` (builtin → external → internal → parent → sibling → index, alphabetized, blank lines between groups).
8. Prettier: single quotes, 95-col width, trailing commas, no arrow parens, 2-space indent; Tailwind classes auto-sorted via `prettier-plugin-tailwindcss`.
9. TypeScript: strict, prefer `string[]` over `Array<string>`; tests use Vitest globals without imports.
10. Components: React function components with hooks; use ShadCN UI from `@/components/ui` and `cn()` from `@/lib/utils` for className merging.
11. Naming: PascalCase components/files (e.g. `App.tsx`), camelCase functions/variables, kebab-case CSS custom properties, snake_case Rust.
12. Error handling: `console.log` disallowed in app code (use `console.error`/`console.info`/`console.warn`); avoid magic numbers except -1, 0, 1, 2, 10, 100, 1000.
13. Testing style: test files `*.test.ts(x)`; prefer Testing Library queries by role/label/placeholder; use `vi.hoisted` for mocks and mock Tauri via `vi.mock('@tauri-apps/api/core')`.
14. Vitest env: jsdom with `@testing-library/jest-dom`; global setup in `vitest.globals.ts` and `vitest.setup.ts`.
15. CSS: Tailwind CSS v4 with `@tailwindcss/vite`; follow existing utility patterns and avoid custom CSS where Tailwind utilities suffice.
16. Rust tooling: follow `src-tauri/rustfmt.toml` and `clippy.toml`; run `npm run check:rust` before shipping Rust changes.
17. Git hooks: Husky + lint-staged run on commit; ensure `npm run lint` and `npm run test:unit` pass before committing.
18. Ignore generated artifacts (dist, coverage, Playwright reports, Tauri `src-tauri` gen code) when making manual edits.
19. There are currently no Cursor or GitHub Copilot instruction files in this repo.
20. Prefer minimal, focused changes that respect this style and tooling setup.
