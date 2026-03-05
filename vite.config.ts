import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import Sitemap from "vite-plugin-sitemap";
import obfuscatorPlugin from "vite-plugin-javascript-obfuscator";
import viteCompression from "vite-plugin-compression";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    Sitemap({
      hostname: 'https://www.zertainity.in',
      dynamicRoutes: [
        '/careers',
        '/entrance-exams',
        '/colleges'
      ]
    }),
    mode === "production" && viteCompression({
      verbose: false,
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
    mode === "production" && viteCompression({
      verbose: false,
      algorithm: 'gzip',
      ext: '.gz',
    }),
    // mode === "production" && obfuscatorPlugin({
    //   include: ["src/**/*.js", "src/**/*.jsx", "src/**/*.ts", "src/**/*.tsx"],
    //   exclude: [/node_modules/],
    //   apply: 'build',
    //   debugger: true,
    //   options: {
    //     compact: true,
    //     controlFlowFlattening: true,
    //     controlFlowFlatteningThreshold: 0.75,
    //     deadCodeInjection: true,
    //     deadCodeInjectionThreshold: 0.4,
    //     debugProtection: false,
    //     debugProtectionInterval: 0,
    //     disableConsoleOutput: false,
    //     identifierNamesGenerator: 'hexadecimal',
    //     log: false,
    //     numbersToExpressions: true,
    //     renameGlobals: false,
    //     selfDefending: false,
    //     simplify: true,
    //     splitStrings: true,
    //     splitStringsChunkLength: 10,
    //     stringArray: true,
    //     stringArrayCallsTransform: true,
    //     stringArrayCallsTransformThreshold: 0.5,
    //     stringArrayEncoding: ['base64'],
    //     stringArrayIndexShift: true,
    //     stringArrayRotate: true,
    //     stringArrayShuffle: true,
    //     stringArrayWrappersCount: 1,
    //     stringArrayWrappersChainedCalls: true,
    //     stringArrayWrappersParametersMaxCount: 2,
    //     stringArrayWrappersType: 'variable',
    //     stringArrayThreshold: 0.75,
    //     unicodeEscapeSequence: false
    //   }
    // })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: false,
    minify: 'esbuild',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  },
  esbuild: {
    drop: mode === 'production' ? ['console', 'debugger'] : [],
  },
}));
