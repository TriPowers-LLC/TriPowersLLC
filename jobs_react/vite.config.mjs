import path from "path";
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const shouldProxyApi = !process.env.VITE_API_BASE_URL;

const config = {
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'components': path.resolve(__dirname, './src/components'),
      'assets': path.resolve(__dirname, './src/assets'),
      'styles': path.resolve(__dirname, './src/styles'),
    },
  },
  };

if (shouldProxyApi) {
  config.server = {
    proxy: {
    "/api/jobs": "http://localhost:5186",
    "/api/auth": "http://localhost:5186"
  }
  };
}

export default defineConfig(config);
// https://vitejs.dev/config/