import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { mkdirSync } from "fs";
import { componentTagger } from "lovable-tagger";
import Sitemap from "vite-plugin-sitemap";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    {
      name: "ensure-sitemap-output-dir",
      apply: "build",
      buildStart() {
        mkdirSync(path.resolve(__dirname, "dist"), { recursive: true });
      },
    },
    Sitemap({
      hostname: 'https://www.zertainity.in',
      dynamicRoutes: [
        '/careers',
        '/entrance-exams',
        '/colleges'
      ]
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: false,
    minify: 'esbuild',
  },
  esbuild: {
    drop: mode === 'production' ? ['console', 'debugger'] : [],
  },
}));
