import { defineConfig } from 'vitest/config';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    target: 'esnext',
    minify: true,
    lib: {
      entry: './src/index.ts',
      formats: ['es'],
      fileName: 'AACommodateAPI',
    },
    rollupOptions: {
      external: [
        'module',
        'worker_threads',
        /.*\/whisper\/libstream\.js$/, // Mark libstream as external
        './whisper/libstream.js' // Also add direct path
      ],
    },
    copyPublicDir: false,
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'src/whisper/*',
          dest: 'whisper'
        }
      ]
    })
  ],
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
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/*.ts', 'src/*.js'],
    },
  },
});