import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,  // Frontend is on port 5174
    proxy: {
      '/api': {
        target: 'http://localhost:5173',  // Backend is on port 5173
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),  // Remove '/api' prefix for backend
      },
    },
  },
});
