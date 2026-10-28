import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: path.resolve(__dirname, 'website'),
  publicDir: path.resolve(__dirname, 'public'),
  base: '/',
  plugins: [react()],
  server: {
    host: true,
    port: 3002,
  },
  build: {
    outDir: path.resolve(__dirname, 'website-dist'),
    emptyOutDir: true,
  },
});
