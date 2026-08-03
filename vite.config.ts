import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const basePath = env.VITE_BASE_PATH || "/";

  return {
    base: basePath,
    server: {
      host: true,
      port: 8080,
      // Allow requests from external dev hosts/tunnels. `true` permits them.
      allowedHosts: true,
      watch: {
        ignored: ["**/*.exe", "**/cloudflared*"],
      },
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      chunkSizeWarningLimit: 900,
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
