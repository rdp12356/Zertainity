/**
 * Production browser crash reporting using Cloudflare Pages Function logs.
 * Never transmit exception messages, stacks, search params, names or student answers.
 * Dashboard → Workers & Pages → zertainity → Functions → Logs.
 * Configure Cloudflare log alerts/Logpush separately for proactive notification.
 */
type ErrorKind = "react-render" | "window-error" | "unhandled-rejection";
let lastSent = 0;

export function reportBrowserError(kind: ErrorKind, error?: unknown): void {
  if (!import.meta.env.PROD || typeof window === "undefined") return;
  const now = Date.now();
  // Limit volume from repeated render failures or cascading rejections.
  if (now - lastSent < 20_000) return;
  lastSent = now;

  const rawPath = window.location.pathname;
  const route = rawPath.startsWith("/r/") ? "/r/:slug"
    : rawPath.startsWith("/careers/") ? "/careers/:slug"
    : /^\/[a-z0-9/_-]{0,90}$/i.test(rawPath) ? rawPath : "/unknown";
  const errorName = error instanceof Error ? error.name : "Unknown";
  const payload = JSON.stringify({ kind, route, errorName });
  try {
    const blob = new Blob([payload], { type: "application/json" });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/client-error", blob);
    } else {
      void fetch("/api/client-error", { method: "POST", body: payload, headers: { "Content-Type": "application/json" }, keepalive: true }).catch(() => {});
    }
  } catch {
    // Reporting must never cause an additional application failure.
  }
}

export function installBrowserErrorMonitoring(): void {
  if (!import.meta.env.PROD || typeof window === "undefined") return;
  window.addEventListener("error", (event) => reportBrowserError("window-error", event.error));
  window.addEventListener("unhandledrejection", (event) => reportBrowserError("unhandled-rejection", event.reason));
}
