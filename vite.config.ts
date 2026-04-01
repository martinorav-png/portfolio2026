import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Only the Vite app entry — avoid scanning other .html files (email-template, work.html, etc.)
  optimizeDeps: {
    entries: [path.resolve(__dirname, 'index.html')],
  },
  build: {
    rollupOptions: {
      output: {
        assetFileNames: 'bundle/[name]-[hash][extname]',
        chunkFileNames: 'bundle/[name]-[hash].js',
        entryFileNames: 'bundle/[name]-[hash].js',
      },
    },
  },
});
