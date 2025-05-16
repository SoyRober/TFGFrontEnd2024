import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.info', 'console.debug', 'console.warn'], 
        passes: 3,
        unsafe: true, 
        unsafe_arrows: true,
        unsafe_methods: true,
        unsafe_proto: true,
        unsafe_comps: true,
        toplevel: true, 
        collapse_vars: true,
        reduce_vars: true,
      },
      mangle: {
        toplevel: true, 
      },
      format: {
        comments: false,
      },
    },
  },
});
