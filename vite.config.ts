import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@/api': '/src/api',
      '@/components': '/src/components',
      '@/public': '/public',
      '@/redux': '/src/redux',
      '@/util': '/src/util'
    }
  },
  server: {
    port: 4690
  }
});
