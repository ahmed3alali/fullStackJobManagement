import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5173',  // Pointing to the correct backend server
        changeOrigin: true,
        // Remove or adjust the rewrite as needed:
        // rewrite: (path) => path.replace(/^\/api/, '')  // Remove this if you want to keep /api
      },
    },
  },
});
