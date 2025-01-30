import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const ReactCompilerConfig = {
  target: '18'
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler', ReactCompilerConfig]]
      }
    })
  ],
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
  }
});
