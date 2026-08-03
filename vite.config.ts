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
      viteCompression({ algorithm: "gzip", ext: ".gz" })
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
            react: ["react", "react-dom", "react-router-dom"],
            supabase: ["@supabase/supabase-js"],
            charts: ["recharts"],
            motion: ["framer-motion"],
            markdown: ["react-markdown"],
          },
        },
      },
    },
  };
});
