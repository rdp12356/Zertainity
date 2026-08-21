// ─── Shared CORS policy for all Zertainity Edge Functions ────────────────────
//
// Browser callers are restricted to known app origins. Non-browser callers
// (curl, mobile apps, server-to-server) are unaffected — CORS is enforced by
// browsers only, and every privileged function still verifies the caller's
// JWT independently.
//
// To allow additional origins (staging mirrors, tunnels), set the
// ALLOWED_ORIGINS environment variable in the Supabase project secrets as a
// comma-separated list, e.g. "https://staging.zertainity.in,https://abc.preview.app".

const DEFAULT_ORIGINS = [
  "https://zertainity.in",
  "https://www.zertainity.in",
  "https://admin.zertainity.in",
  // Local development
  "http://localhost:8080",
  "http://127.0.0.1:8080",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

function allowedOrigins(): string[] {
  const extra = (Deno.env.get("ALLOWED_ORIGINS") ?? "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
  return [...DEFAULT_ORIGINS, ...extra];
}

/** Builds CORS headers for a request. When the Origin is not allow-listed,
 *  no Access-Control-Allow-Origin is emitted, so browsers reject the reply;
 *  the function still processes the request for non-browser clients. */
export function corsHeadersFor(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type, x-pdf-secret",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
  if (origin && allowedOrigins().includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return headers;
}
