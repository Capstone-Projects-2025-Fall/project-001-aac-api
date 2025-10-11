import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    lib: {
      entry: './src/index.ts', // your package entry
      formats: ['es'],         // <-- use ES modules
    },
    rollupOptions: {
      external: ['module', 'worker_threads'], // Node built-ins
    },
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
    open: true,
  },

test: {
    globals: true,
    environment: 'node', // or 'jsdom' if you need browser APIs
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/*.ts', 'src/*.js'],
      reportsDirectory: './documentation/static/coverage',
    }
  },
  resolve: {
    alias: {
      // This helps Vitest resolve your TypeScript paths correctly
    },
  },
});
