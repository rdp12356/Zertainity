import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeadersFor } from '../_shared/cors.ts';

// Per-instance guard complements authenticated access. Enforce project-wide quotas at the gateway.
const usage = new Map<string, { count: number; reset: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 3;
serve(async request => {
  const headers = { ...corsHeadersFor(request.headers.get("origin")), "Content-Type": "application/json" };
  if (request.method === "OPTIONS") return new Response("ok", { headers });
  if (request.method !== "POST") return new Response(JSON.stringify({ success: false, error: "Method not allowed. Use POST." }), { status: 405, headers });
  // A paid narration request always needs a valid session.
  const authorization = request.headers.get('Authorization') ?? '';
  if (!authorization.startsWith('Bearer ')) return new Response(JSON.stringify({ error: 'Authentication required' }), { status: 401, headers });
  const authClient = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
  const { data: { user }, error: authError } = await authClient.auth.getUser(authorization.slice(7));
  if (authError || !user) return new Response(JSON.stringify({ error: 'Invalid session' }), { status: 401, headers });
  const now = Date.now();
  const current = usage.get(user.id);
  if (usage.size > 5000) for (const [id, entry] of usage) if (entry.reset <= now) usage.delete(id);
  if (current && current.reset > now && current.count >= MAX_REQUESTS) return new Response(JSON.stringify({ error: 'Usage limit reached' }), { status: 429, headers });
  // Bound upstream token/cost exposure and avoid accidentally forwarding raw records.
  const length = Number(request.headers.get('content-length') ?? '0');
  if (length > 24000) return new Response(JSON.stringify({ error: 'Analysis too large' }), { status: 413, headers });
  let body: { analysis?: unknown };
  try { body = await request.json(); } catch { return new Response(JSON.stringify({ success: false, error: "Invalid JSON body" }), { status: 400, headers }); }
  if (!body.analysis || typeof body.analysis !== "object") return new Response(JSON.stringify({ success: false, error: "A calculated analysis object is required." }), { status: 422, headers });
  const rawAnalysis = JSON.stringify(body.analysis);
  if (rawAnalysis.length > 24000) return new Response(JSON.stringify({ error: 'Analysis too large' }), { status: 413, headers });
  usage.set(user.id, { count: current && current.reset > now ? current.count + 1 : 1, reset: current && current.reset > now ? current.reset : now + WINDOW_MS });
  const apiKey = Deno.env.get("OPENROUTER_KEY_1");
  if (!apiKey) return new Response(JSON.stringify({ success: false, error: "AI narration is not configured. Calculated analysis remains available." }), { status: 503, headers });
  const prompt = "Explain the supplied Zertainity analysis in clear, supportive language. Do not recalculate, add facts, predict outcomes, call a career guaranteed/best, or infer missing data. Refer only to the calculated fields, warnings, and methodology. Provide a concise executive summary, strengths, development focus, and why the top compatibility matches align. Analysis JSON:\n" + JSON.stringify(body.analysis);
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", { method: "POST", headers: { Authorization: "Bearer " + apiKey, "Content-Type": "application/json" }, body: JSON.stringify({ model: "openai/gpt-4o-mini", messages: [{ role: "system", content: "You are a careful educational report narrator. Calculations are already verified and must never be changed." }, { role: "user", content: prompt }], temperature: 0.2 }) });
    if (!response.ok) return new Response(JSON.stringify({ success: false, error: "AI narration provider failed." }), { status: 502, headers });
    const payload = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
    const narrative = payload.choices?.[0]?.message?.content;
    if (!narrative) return new Response(JSON.stringify({ success: false, error: "AI narration provider returned no content." }), { status: 502, headers });
    return new Response(JSON.stringify({ success: true, narrative }), { status: 200, headers });
  } catch {
    return new Response(JSON.stringify({ success: false, error: "AI narration provider is unavailable." }), { status: 502, headers });
  }
});
