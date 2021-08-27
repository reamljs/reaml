import path from 'path'
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vite';

module.exports = defineConfig({
  plugins: [
    tsconfigPaths(),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/main.ts'),
      name: 'WAML',
      formats: ['iife'],
      fileName: () => `waml.js`
    }
  },
  publicDir: path.resolve(__dirname, "dist")
})
