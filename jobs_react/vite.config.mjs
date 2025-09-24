import path from "path";
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const shouldProxyApi = !process.env.VITE_API_BASE_URL;

const config = {
  plugins: [react(), tailwindcss()],
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
      // Forward any /api/* request to your App Service
      '/api': {
        target: 'http://localhost:5169', // Use your local API URL
        changeOrigin: true,
        secure: false,          // if you’re on HTTPS
        rewrite: path => path,  // keep the /api prefix
      },
    },
  };
}

export default defineConfig(config);
// https://vitejs.dev/config/