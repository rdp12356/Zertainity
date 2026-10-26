import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { corsHeadersFor } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  const headers = { ...corsHeadersFor(req.headers.get("origin")), "Content-Type": "application/json" };
  if (req.method === "OPTIONS") return new Response(null, { headers });
  if (req.method !== "POST") return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers });
  const authorization = req.headers.get("Authorization") || "";
  if (!authorization.startsWith("Bearer ")) return new Response(JSON.stringify({ error: "Authentication required" }), { status: 401, headers });
  try {
    const admin = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "");
    const { data: { user }, error: authError } = await admin.auth.getUser(authorization.slice(7));
    if (authError || !user) return new Response(JSON.stringify({ error: "Invalid session" }), { status: 401, headers });
    const { data: roles, error: roleError } = await admin.from("user_roles").select("role")
      .eq("user_id", user.id).in("role", ["admin", "owner"]).limit(1);
    if (roleError || !roles?.length) return new Response(JSON.stringify({ error: "Administrator access required" }), { status: 403, headers });
    if (Number(req.headers.get("content-length") || 0) > 4096) {
      return new Response(JSON.stringify({ error: "Request too large" }), { status: 413, headers });
    }
    const body = await req.json();
    const { targetUserId, display_name, phone_number, location, bio } = body || {};
    if (typeof targetUserId !== "string" || !/^[0-9a-f]{8}-[0-9a-f-]{27,}$/i.test(targetUserId)) {
      return new Response(JSON.stringify({ error: "Invalid target ID" }), { status: 400, headers });
    }
    const fields = { display_name, phone_number, location, bio };
    for (const [key, value] of Object.entries(fields)) {
      if (value !== null && value !== undefined && (typeof value !== "string" || value.length > (key === "bio" ? 2000 : 200))) {
        return new Response(JSON.stringify({ error: "Invalid profile field" }), { status: 400, headers });
      }
    }
    const changes = Object.fromEntries(Object.entries(fields).filter(([, value]) => value !== undefined));
    if (!Object.keys(changes).length) return new Response(JSON.stringify({ error: "No fields to update" }), { status: 400, headers });
    const { data: updated, error: updateError } = await admin.from("user_profiles").update(changes).eq("id", targetUserId).select("id");
    if (updateError) throw updateError;
    if (updated?.length !== 1) return new Response(JSON.stringify({ error: "Profile not found or unchanged" }), { status: 404, headers });
    const { error: auditError } = await admin.from("audit_log").insert({
      user_id: user.id, action: "user_profile_updated", target_user_id: targetUserId,
      before_snapshot: null, after_snapshot: { changed_fields: Object.keys(changes) },
    });
    if (auditError) console.error("Profile update audit failed", auditError);
    return new Response(JSON.stringify({ success: true, updated: 1 }), { status: 200, headers });
  } catch (error) {
    console.error("Update user profile failed", error);
    return new Response(JSON.stringify({ error: "Unable to update profile" }), { status: 500, headers });
  }
});
