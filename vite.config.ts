import { defineConfig } from 'vite';

export default defineConfig({
  root: '.', // your project root
  build: {
    outDir: 'dist', // output folder
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
    open: true, // automatically open browser
  },
});
