/** Optional, privacy-minimizing Sentry error transport without an additional runtime SDK.
 * To activate, configure VITE_SENTRY_DSN in Cloudflare Pages and set an alert in Sentry.
 * Intentionally NEVER sends error.message, stack, student input, credentials or URLs with query strings.
 */
let enabled = false;
let sent = 0;
const MAX_EVENTS_PER_PAGE = 10;

function sanitizeRoute(): string {
  const path = window.location.pathname;
  if (path.startsWith("/r/")) return "/r/:slug";
  if (path.startsWith("/careers/")) return "/careers/:slug";
  return path.replace(/[0-9a-fA-F-]{8,}/g, ":id").slice(0, 140);
}

function endpoint(): { url: string; dsn: string } | null {
  const dsn = String(import.meta.env.VITE_SENTRY_DSN ?? "").trim();
  if (!dsn || !import.meta.env.PROD) return null;
  try {
    const parsed = new URL(dsn);
    const project = parsed.pathname.split("/").filter(Boolean).pop();
    if (parsed.protocol !== "https:" || !project || !/^\d+$/.test(project) || !parsed.username) return null;
    // Prevent a typo in environment settings from exfiltrating even sanitized events.
    if (parsed.hostname !== "sentry.io" && !parsed.hostname.endsWith(".sentry.io")) return null;
    return { url: parsed.origin + "/api/" + project + "/envelope/", dsn };
  } catch {
    return null;
  }
}

export function captureAppError(error: unknown, source: string): void {
  const config = endpoint();
  if (!config || sent >= MAX_EVENTS_PER_PAGE) return;
  sent += 1;
  const kind = error instanceof Error ? error.name : "UnknownError";
  const route = sanitizeRoute();
  const eventId = crypto.randomUUID().replace(/-/g, "");
  const timestamp = new Date().toISOString();
  const payload = {
    event_id: eventId,
    timestamp,
    platform: "javascript",
    level: "error",
    environment: import.meta.env.MODE,
    exception: { values: [{ type: kind.slice(0, 48), value: "Application error; private details omitted" }] },
    fingerprint: ["{{ default }}", source, route],
    tags: { surface: source.slice(0, 50), route },
  };
  const envelope = JSON.stringify({ event_id: eventId, sent_at: timestamp, dsn: config.dsn }) +
    "\n" + JSON.stringify({ type: "event" }) + "\n" + JSON.stringify(payload);
  void fetch(config.url, {
    method: "POST",
    headers: { "Content-Type": "application/x-sentry-envelope" },
    body: envelope,
    keepalive: true,
    credentials: "omit",
  }).catch(() => { /* Error telemetry must never break the app. */ });
}

export function initializeErrorTelemetry(): void {
  if (enabled || !endpoint()) return;
  enabled = true;
  window.addEventListener("error", (event) => {
    if (event.error) captureAppError(event.error, "window.error");
  });
  window.addEventListener("unhandledrejection", (event) => {
    captureAppError(event.reason, "unhandledrejection");
  });
}
