import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeadersFor } from '../_shared/cors.ts';


// ─── Rate Limiting ───────────────────────────────────────────────────────────
// Best-effort sliding window per client IP. Edge Function isolates are
// ephemeral, so this bounds per-isolate abuse; the one-time-token design
// below remains the real defense.
const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;
const attempts = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (attempts.get(key) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  attempts.set(key, recent);
  if (attempts.size > 10_000) {
    for (const [k, v] of attempts) {
      if (v.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) attempts.delete(k);
    }
  }
  return recent.length > RATE_LIMIT_MAX;
}

Deno.serve(async (req) => {
  const corsHeaders = corsHeadersFor(req.headers.get("origin"));
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (isRateLimited(clientIp)) {
    return new Response(JSON.stringify({ error: 'Too many requests' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 429 });
  }

  try {
    const body = await req.json();
    const { token } = body;
    if (!token || typeof token !== 'string' || token.length > 64) {
      return new Response(JSON.stringify({ error: 'token required' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 });
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Atomic one-time consume: flip the row only if it is still unused AND
    // unexpired. Two concurrent requests can never both succeed, and the
    // single generic failure below avoids revealing which check failed.
    const { data: consumed, error: updErr } = await supabaseAdmin
      .from('impersonations')
      .update({ used: true })
      .eq('token', token)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .select('id, admin_id, target_user_id');

    if (updErr) {
      console.error('Consume impersonation error:', updErr);
      return new Response(JSON.stringify({ error: 'Failed to lookup token' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 });
    }

    const row = consumed?.[0];
    if (!row) return new Response(JSON.stringify({ error: 'Token invalid, already used, or expired' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 });

    // fetch user profile to return
    const { data: userProfile, error: profErr } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('id', row.target_user_id)
      .maybeSingle();

    if (profErr) console.error('Error fetching user profile:', profErr);

    // audit log insert
    try {
      await supabaseAdmin.from('audit_log').insert({
        user_id: row.admin_id,
        action: 'impersonation_started',
        target_user_id: row.target_user_id,
        before_snapshot: null,
        after_snapshot: null,
        ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || null
      });
    } catch (e) {
      console.error('Failed to write audit log:', e);
    }

    return new Response(JSON.stringify({ target_user_id: row.target_user_id, profile: userProfile || null }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
  } catch (error) {
    console.error('Unexpected error in consume-impersonation:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 });
  }
});
