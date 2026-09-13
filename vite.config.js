import { defineConfig } from 'vite';
export default defineConfig({
  root: 'app',
  base: './',
  publicDir: '../public',
  build: { outDir: '../dist', emptyOutDir: true },
  server: { fs: { allow: ['..'] } }
});
