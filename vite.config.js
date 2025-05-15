import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import { visualizer } from "rollup-plugin-visualizer";
import lightningcss from "vite-plugin-lightningcss";

export default defineConfig({
  plugins: [
    react(),
    lightningcss({
      browserslist: ['defaults'],
      lightningcssOptions: {
        minify: true,
        targets: {
          chrome: 100,
          firefox: 100,
        },
        drafts: {
          nesting: true,
        },
      },
    }),
    // visualizer({
    //   open: true,
    //   gzipSize: true,
    //   brotliSize: true,
    // }),
  ],
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        passes: 3,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        drop_console: true,
        drop_debugger: true,
        booleans_as_integers: true,
        unsafe: true,
        unsafe_arrows: true,
        unsafe_comps: true,
        unsafe_Function: true,
        unsafe_math: true,
        unsafe_symbols: true,
        unsafe_methods: true,
        unsafe_proto: true,
        unsafe_regexp: true,
        unsafe_undefined: true,
        ecma: 2020,
        module: true,
        toplevel: true,
        hoist_funs: true,
        hoist_props: true,
        hoist_vars: true,
        inline: true,
        reduce_funcs: true,
        reduce_vars: true,
        switches: true,
      },
      mangle: {
        toplevel: true,
        properties: {
          regex: /^_/,
        },
      },
      format: {
        comments: false,
        ascii_only: true,
      },
    },
    cssMinify: false, 
  },
});
