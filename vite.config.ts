// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vitest/config';
import tsConfigPaths from 'vite-tsconfig-paths';
import { configDefaults } from 'vitest/config';

const host = process.env.TAURI_DEV_HOST;

// https://vite.dev/config/
export default defineConfig(async () => ({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler', { target: '19' }]],
      },
    }),
    tailwindcss(),
    tsConfigPaths(),
  ],
  optimizeDeps: {
    include: ['react', 'react-dom'],
    force: true,
  },
  build: {
    emptyOutDir: true,
  },

  // ShadCN UI
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent Vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: 'ws',
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell Vite to ignore watching `src-tauri`
      ignored: ['**/src-tauri/**'],
    },
  },

  // 4. configure vitest (unit tests)
  test: {
    environment: 'jsdom',
    exclude: [...configDefaults.exclude, 'tests/**'],
    include: ['src/**/*.test.ts?(x)'],
    globals: true,
    globalSetup: './vitest.globals.ts',
    setupFiles: './vitest.setup.ts',
    reporters: ['default', 'junit'],
    outputFile: {
      junit: './test-results/junit.xml',
    },
    coverage: {
      enabled: false,
      reporter: ['text', 'json', 'cobertura', 'lcov', 'html'],
      include: ['src/**/*.ts?(x)'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/*.test.ts?(x)',
        'src/**/index.ts',
        'src/main.tsx',
        'src/constants/**',
        'src/components/ui/button.tsx',
        'src/components/ui/card.tsx',
        'src/components/ui/input.tsx',
      ],
      thresholds: {
        branches: 65,
        functions: 80,
        statements: 80,
      },
    },
  },
}));
