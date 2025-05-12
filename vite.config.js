import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import compress from 'vite-plugin-compress'; 

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    compress({
      brotli: true,
      gzip: true,
    }),
  ],
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, 
        drop_debugger: true, 
      },
      mangle: true, 
    },
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
});
