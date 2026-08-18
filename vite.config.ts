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
        "@": path.resolve(process.cwd(), "./src"),
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
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("react") || id.includes("react-dom") || id.includes("react-router-dom")) {
                return "react-vendor";
              }
              if (id.includes("@supabase/supabase-js")) {
                return "supabase-vendor";
              }
              if (id.includes("recharts")) {
                return "charts-vendor";
              }
              if (id.includes("framer-motion")) {
                return "motion-vendor";
              }
              if (id.includes("react-markdown")) {
                return "markdown-vendor";
              }
              if (id.includes("@tanstack/react-query")) {
                return "query-vendor";
              }
              if (id.includes("react-hook-form") || id.includes("zod") || id.includes("@hookform/resolvers")) {
                return "form-vendor";
              }
              if (id.includes("lucide-react") || id.includes("clsx") || id.includes("tailwind-merge")) {
                return "ui-vendor";
              }
            }
          },
        },
      },
    },
  };
});
