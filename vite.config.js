import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/',
  root: '.',
  publicDir: 'public',
  build: {
    rollupOptions: {
      input: path.resolve(__dirname, 'public/index.html')
    }
  }
});
