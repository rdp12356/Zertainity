import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import { initSecurityMeasures } from "./lib/security";

initSecurityMeasures();

const REQUIRED_ENVS = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_PUBLISHABLE_KEY'
];

const missingEnvs = REQUIRED_ENVS.filter(
  (env) => !import.meta.env[env]
);

if (missingEnvs.length > 0) {
  const errorMsg = `Critical Error: Missing required environment variables: ${missingEnvs.join(', ')}`;
  console.error(errorMsg);
  document.getElementById("root")!.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#0f172a;color:#ef4444;font-family:system-ui,sans-serif;padding:2rem;text-align:center;">
      <div>
        <h1 style="font-size:1.5rem;margin-bottom:1rem;font-weight:600;">Application Startup Failed</h1>
        <p style="color:#94a3b8;">${errorMsg}</p>
      </div>
    </div>
  `;
  throw new Error(errorMsg);
} else {
  createRoot(document.getElementById("root")!).render(
    <HelmetProvider>
      <App />
    </HelmetProvider>
  );
}
