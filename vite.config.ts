import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Custom domain uses root '/', GitHub project page fallback can set VITE_BASE_PATH=/careerping/
  base: process.env.VITE_BASE_PATH || '/',
  build: {
    sourcemap: false, // Security: Never emit source maps to prevent client-side source code reconnaissance
  },
  server: {
    port: 5173,
    host: true
  }
});
