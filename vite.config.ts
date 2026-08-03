import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import viteCompression from "vite-plugin-compression";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const basePath = env.VITE_BASE_PATH || "/";

  return {
    base: basePath,
    server: {
      host: true,
      port: 8080,
      allowedHosts: true,
      watch: {
        ignored: ["**/*.exe", "**/cloudflared*"],
      },
    },
    plugins: [
      react(),
      viteCompression({ algorithm: "brotliCompress", ext: ".br" }),
      viteCompression({ algorithm: "gzip", ext: ".gz" }),
      {
        name: 'html-transform',
        transformIndexHtml(html) {
          return html.replace(/<script type="module"/g, '<script data-cfasync="false" type="module"');
        },
      }
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      chunkSizeWarningLimit: 900,
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      modulePreload: {
        polyfill: true,
      },
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ["react", "react-dom", "react-router-dom"],
            'supabase-vendor': ["@supabase/supabase-js"],
            'charts-vendor': ["recharts"],
            'motion-vendor': ["framer-motion"],
            'markdown-vendor': ["react-markdown"],
            'query-vendor': ["@tanstack/react-query"],
            'form-vendor': ["react-hook-form", "zod", "@hookform/resolvers"],
            'ui-vendor': ["lucide-react", "clsx", "tailwind-merge"]
          },
        },
      },
    },
  };
});
