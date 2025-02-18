import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@/api': '/src/api',
      '@/components': '/src/components',
      '@/icons': '/src/icons',
      '@/panels': '/src/panels',
      '@/public': '/public',
      '@/redux': '/src/redux',
      '@/types': '/src/types',
      '@/util': '/src/util',
      '@/windowmanagement': '/src/windowmanagement'
    }
  },
  server: {
    port: 4670
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          mantine: ['@mantine/core', '@mantine/hooks', '@mantine/modals'],
          rcdock: ['rc-dock']
        }
      }
    }
  }
});
