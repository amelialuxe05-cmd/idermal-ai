import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // Казваме на Vite да сглоби сайта, дори и да има грешки в кодовете на Bolt
    chunkSizeWarningLimit: 2000,
    minify: false,
    sourcemap: false
  }
});
