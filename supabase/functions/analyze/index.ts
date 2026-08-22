import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeadersFor } from '../_shared/cors.ts';

serve(async (request) => {
  const headers = { ...corsHeadersFor(request.headers.get("origin")), "Content-Type": "application/json" };
  if (request.method === "OPTIONS") return new Response("ok", { headers });
  if (request.method !== "POST") return new Response(JSON.stringify({ success: false, error: "Method not allowed. Use POST." }), { status: 405, headers });
  
  let body: { student_data?: unknown };
  try { 
    body = await request.json(); 
  } catch { 
    return new Response(JSON.stringify({ success: false, error: "Invalid JSON body" }), { status: 400, headers }); 
  }
  
  return new Response(JSON.stringify({ success: true, message: "Analysis service ready" }), { status: 200, headers });
});
