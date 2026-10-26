import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { corsHeadersFor } from "../_shared/cors.ts";

// Only authenticated users may spend provider credits; prompts never include
// user names, raw answers, session tokens or full assessment objects.
serve(async (request) => {
  const headers = { ...corsHeadersFor(request.headers.get("origin")), "Content-Type": "application/json" };
  if (request.method === "OPTIONS") return new Response("ok", { headers });
  if (request.method !== "POST") return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers });
  const authorization = request.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer ")) return new Response(JSON.stringify({ error: "Login required" }), { status: 401, headers });
  const admin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );
  const { data: { user }, error: userError } = await admin.auth.getUser(authorization.slice(7));
  if (!user || userError) return new Response(JSON.stringify({ error: "Invalid login" }), { status: 401, headers });

  if (Number(request.headers.get("content-length") || 0) > 64_000) {
    return new Response(JSON.stringify({ error: "Report too large" }), { status: 413, headers });
  }
  let body: { analysis?: Record<string, unknown> };
  try { body = await request.json(); } catch { return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers }); }
  const analysis = body.analysis;
  if (!analysis || typeof analysis !== "object" || Array.isArray(analysis)) {
    return new Response(JSON.stringify({ error: "An analysis object is required" }), { status: 422, headers });
  }

  // Strictly whitelist generated fields: never relay free-form student inputs
  // to an external LLM provider.
  const summary = {
    overall_percentage: typeof (analysis.academic_analysis as Record<string, unknown> | undefined)?.overall_percentage === "number"
      ? (analysis.academic_analysis as Record<string, unknown>).overall_percentage : null,
    career_matches: Array.isArray(analysis.career_matches)
      ? analysis.career_matches.slice(0, 6).map((entry: unknown) => {
          const match = entry && typeof entry === "object" ? entry as Record<string, unknown> : {};
          return {
            career: typeof match.career === "string" ? match.career.slice(0, 100) : "",
            compatibility_score: typeof match.compatibility_score === "number" ? match.compatibility_score : null
          };
        }) : [],
    confidence: typeof analysis.confidence === "number" ? analysis.confidence : null,
  };
  const apiKey = Deno.env.get("OPENROUTER_KEY_1");
  if (!apiKey) return new Response(JSON.stringify({ error: "AI narration is unavailable" }), { status: 503, headers });

  try {
    const upstream = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: "Bearer " + apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: "Explain deterministic student career compatibility scores carefully. No additional claims, guarantees or inferred personal details." },
          { role: "user", content: JSON.stringify(summary) }
        ],
        temperature: 0.2,
        max_tokens: 400,
      })
    });
    if (!upstream.ok) return new Response(JSON.stringify({ error: "Narration provider failed" }), { status: 502, headers });
    const reply = await upstream.json() as { choices?: Array<{ message?: { content?: string } }> };
    const explanation = reply.choices?.[0]?.message?.content;
    if (!explanation) throw new Error("Missing narration");
    return new Response(JSON.stringify({ success: true, explanation, narrative: explanation }), { headers });
  } catch {
    return new Response(JSON.stringify({ error: "Narration temporarily unavailable" }), { status: 502, headers });
  }
});
