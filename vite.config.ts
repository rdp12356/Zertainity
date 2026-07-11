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
    },
    define: {
      __BUNDLED_DEV__: "false",
      __SERVER_FORWARD_CONSOLE__: "false",
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
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("react-router-dom") || id.includes("react-dom") || id.includes("react")) {
                return "react";
              }
              if (id.includes("@supabase")) {
                return "supabase";
              }
              if (id.includes("recharts")) {
                return "charts";
              }
              if (id.includes("framer-motion")) {
                return "motion";
              }
              if (id.includes("react-markdown")) {
                return "markdown";
              }
              if (id.includes("@radix-ui")) {
                return "ui";
              }
              return "vendor";
            }
          },
        },
      },
    },
  };
});
