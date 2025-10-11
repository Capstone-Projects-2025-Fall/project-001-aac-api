import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    target: 'esnext', // <-- Add this to support top-level await
    minify: true,
    lib: {
      entry: './src/index.ts',
      formats: ['es'],
      fileName: 'AACommodateAPI', // Optional: cleaner output name
      
    },
    rollupOptions: {
      external: ['module', 'worker_threads'],
    },
  },
  worker: {
    format: 'es',
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
    }
  },
  resolve: {
    alias: {},
  },
});