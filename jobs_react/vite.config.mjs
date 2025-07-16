import path from "path"
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss(),] ,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'components': path.resolve(__dirname, './src/components'),
      'assets': path.resolve(__dirname, './src/assets'),
      'styles': path.resolve(__dirname, './src/styles'),
    },
  },
  server: {
    proxy: {
      // Forward any /api/* request to your App Service
      '/api': {
        //target: 'https://tripowersllc-api-hxb8buf3apbqfwcy.centralus-01.azurewebsites.net',
        target: 'http://localhost:5169', // Use your local API URL
        changeOrigin: true,
        secure: false,          // if you’re on HTTPS
        rewrite: path => path,  // keep the /api prefix
      },
    },
  },
});
// https://vitejs.dev/config/