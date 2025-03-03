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
  base: './',
  build: {
    rollupOptions: {
      output: {
        // This is to fix a warning that vite shows when building the project.
        // The warning is that chunks are not allowed to be larger than 500kb.
        // These manual chunks are placed in separate bundled js files. Since we need
        // both on initial load it seems it should be fine to split them like this.
        // TODO (ylvse 2025-02-20): We might want to come up with a smarter
        // way to split the chunks.
        manualChunks: {
          mantineHooks: ['@mantine/hooks'],
          mantineCore: ['@mantine/core'],
          mantineModals: ['@mantine/modals'],
          rcdock: ['rc-dock']
        }
      }
    }
  }
});
