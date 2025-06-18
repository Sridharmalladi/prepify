import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    // Optimize for performance
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          motion: ['framer-motion'],
        },
      },
    },
    // Enable source maps for debugging
    sourcemap: false,
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
  },
  server: {
    // Enable HMR for faster development
    hmr: true,
    // Optimize for high refresh rates
    fs: {
      strict: false,
    },
  },
  // Enable CSS code splitting
  css: {
    devSourcemap: true,
  },
  // Optimize dependencies
  esbuild: {
    target: 'esnext',
    // Remove console logs in production
    drop: ['console', 'debugger'],
  },
});