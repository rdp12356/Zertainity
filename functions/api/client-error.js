// Cloudflare Pages Function: privacy-minimized client exception sink.
// Logs contain no student answers, messages, stacks, query strings or tokens.
const allowedKinds = new Set(["react-render", "window-error", "unhandled-rejection"]);
export async function onRequestPost({ request }) {
  const headers = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
  const origin = request.headers.get("origin");
  if (origin !== new URL(request.url).origin) return new Response(null, { status: 403, headers });
  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return new Response(null, { status: 415, headers });
  }
  if (Number(request.headers.get("content-length") || 0) > 2048) {
    return new Response(null, { status: 413, headers });
  }
  const reader = request.body?.getReader();
  if (!reader) return new Response(null, { status: 400, headers });
  const chunks = [];
  let total = 0;
  while (true) {
    const part = await reader.read();
    if (part.done) break;
    total += part.value.byteLength;
    if (total > 2048) { await reader.cancel(); return new Response(null, { status: 413, headers }); }
    chunks.push(part.value);
  }
  let data;
  try {
    const content = new Uint8Array(total);
    let offset = 0;
    for (const chunk of chunks) { content.set(chunk, offset); offset += chunk.byteLength; }
    data = JSON.parse(new TextDecoder().decode(content));
  } catch { return new Response(null, { status: 400, headers }); }
  if (!data || !allowedKinds.has(data.kind)) return new Response(null, { status: 400, headers });
  const route = typeof data.route === "string" && /^\/[a-z0-9/:_-]{0,90}$/i.test(data.route)
    ? data.route : "/unknown";
  const exception = ["Error", "TypeError", "ReferenceError", "RangeError", "SyntaxError", "Unknown"]
    .includes(data.errorName) ? data.errorName : "Unknown";
  console.error("[zertainity-client-error]", JSON.stringify({ kind: data.kind, route, exception }));
  return new Response(null, { status: 204, headers });
}
