import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import cssnano from "cssnano";
import purgeCss from "vite-plugin-purgecss";

export default defineConfig({
  plugins: [
    react(),
    purgeCss({
      content: [
        "./index.html",
        "./src/**/*.jsx",
        "./src/**/*.js",
        "./styles/**/*.css", 
      ],
      safelist: [
        /^(alert|btn|bg-|text-|navbar|collapse|show|fade|modal|dropdown|form-|input-|d-|me-|ms-|mt-|mb-|mx-|my-|p-|pt-|pb-|px-|py-|w-|h-)/,
        /^(fa|fas|far|fab)/,
        /^Toastify/, 
        /^ToastContainer/,
        /^toast-/,
        /^react-loading-skeleton/, 
        /^hover-navbar/, 
        /^active/,
        /^text-light/,
        /^bg-dark/,
        /^sticky-top/,
        /^position-/,
      ],
    }),
  ],
  css: {
    postcss: {
      plugins: [
        cssnano({
          preset: [
            "default",
            {
              discardComments: {
                removeAll: true,
              },
              normalizeWhitespace: true,
            },
          ],
        }),
      ],
    },
  },
  build: {
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ["console.info", "console.debug", "console.warn"],
        passes: 3,
        unsafe: true,
        unsafe_arrows: true,
        unsafe_methods: true,
        unsafe_proto: true,
        unsafe_comps: true,
        toplevel: true,
        collapse_vars: true,
        reduce_vars: true,
        module: true,
        hoist_funs: true,
        hoist_props: true,
        hoist_vars: true,
      },
      mangle: {
        toplevel: true,
        module: true,
      },
      format: {
        comments: false,
      },
    },
    cssCodeSplit: true,
    target: "esnext",
  },
});
