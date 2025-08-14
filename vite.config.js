import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'assets',
  server: {
    port: 3000,
    open: true,
    host: true
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: './index.html'
    }
  },
  assetsInclude: ['**/*.jpg', '**/*.png', '**/*.json']
});
