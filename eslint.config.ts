import { fixupPluginRules } from '@eslint/compat';
import js from '@eslint/js';
import json from '@eslint/json';
import markdown from '@eslint/markdown';
import { defineConfig, globalIgnores } from 'eslint/config';
import importPlugin from 'eslint-plugin-import';
import jestDom from 'eslint-plugin-jest-dom';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import reactCompiler from 'eslint-plugin-react-compiler';
import globals from 'globals';
import ts from 'typescript-eslint';

export default defineConfig([
  // Global ignores - applied to ALL configurations
  // These are the most performance-critical as they prevent file system traversal
  globalIgnores([
    // Dependencies (CRITICAL for performance - largest impact)
    'node_modules',
    'node_modules/**',

    // Build outputs and generated files
    'dist',
    'dist/**',
    'build',
    'build/**',
    '**/*.d.ts',

    // Test outputs and reports
    'coverage',
    'coverage/**',
    'playwright-report',
    'playwright-report/**',
    'test-results',
    'test-results/**',
    '.nyc_output',
    '.nyc_output/**',

    // IDE and tooling directories
    '.cursor',
    '.cursor/**',
    '.husky',
    '.husky/**',
    '.idea',
    '.idea/**',
    '.tanstack',
    '.tanstack/**',
    '.vscode',
    '.vscode/**',
    '.git',
    '.git/**',

    // Cache files
    '.eslintcache',
    '.stylelintcache',
    '.cache',
    '.cache/**',
    '.temp',
    '.temp/**',
    '.tmp',
    '.tmp/**',

    // Lock files (no need to lint these)
    'package-lock.json',
    'yarn.lock',
    'pnpm-lock.yaml',

    // Tauri-specific
    'src-tauri',
    'src-tauri/**',

    // Config files that don't need linting
    'vite.config.ts',
    'vitest.globals.ts',
    'vitest.setup.ts',
    'playwright.config.ts',
    'tailwind.config.ts',
  ]),

  // JSON files (with comments support for tsconfig files)
  {
    files: ['**/*.json'],
    // No need to repeat ignores here - globalIgnores already covers it
    language: 'json/jsonc',
    ...json.configs.recommended,
  },

  // Markdown files (GitHub Flavored Markdown)
  {
    files: ['**/*.md'],
    plugins: {
      markdown,
    },
    language: 'markdown/gfm',
    rules: {
      'markdown/no-html': 'off', // Allow HTML in GFM
    },
  },

  // TypeScript scripts and utilities (non-src)
  {
    files: ['**/*.ts'],
    ignores: ['src/**/*'], // Only need to exclude src, global ignores handle the rest
    extends: [js.configs.recommended, ...ts.configs.recommended],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.node,
    },
  },

  // Application source code (ignore generated files)
  {
    files: ['src/**/*.ts?(x)'],
    ignores: ['**/*.d.ts'], // Only exclude .d.ts files, rest handled globally
    plugins: {
      import: fixupPluginRules(importPlugin),
      'react-hooks': fixupPluginRules(reactHooks),
    },
    extends: [
      js.configs.recommended,
      ...ts.configs.recommended,
      reactCompiler.configs.recommended,
      reactRefresh.configs.vite,
      jsxA11y.flatConfigs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
        node: true,
      },
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
    },
    rules: {
      '@typescript-eslint/array-type': ['warn', { default: 'array' }],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { vars: 'local', args: 'after-used', argsIgnorePattern: '^_' },
      ],
      // Import plugin rules
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import/no-unresolved': 'error',
      'import/no-duplicates': 'error',
      'jsx-a11y/anchor-is-valid': 'warn',
      'no-console': [
        'error',
        {
          allow: ['error', 'info', 'warn'],
        },
      ],
      'no-magic-numbers': ['error', { ignore: [-1, 0, 1, 2, 10, 100, 1000] }],
      'react-compiler/react-compiler': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },

  // ShadCN UI components - allow non-component exports
  {
    files: ['src/components/ui/**/*.ts?(x)'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },

  // Unit Test files (Vitest)
  {
    files: ['src/**/*.test.ts?(x)'],
    extends: [
      js.configs.recommended,
      ...ts.configs.recommended,
      jestDom.configs['flat/recommended'],
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser,
        ...globals.vitest,
      },
    },
    rules: {
      '@typescript-eslint/array-type': ['warn', { default: 'array' }],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { vars: 'local', args: 'after-used', argsIgnorePattern: '^_' },
      ],
      'no-console': 'off', // Allow console in tests
      'no-magic-numbers': 'off', // Allow magic numbers in tests
    },
  },
]);
