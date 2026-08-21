import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.1";
import { analyzeStudent, validateAnalysisInput, type AnalysisConfig, type AnalysisInput, type CareerProfile, type CollegeProfile } from "../../../src/analysis_engine/index.ts";
import { corsHeadersFor } from '../_shared/cors.ts';

async function loadCollegeCatalog(): Promise<CollegeProfile[]> {
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_ANON_KEY");
  if (!url || !key) return [];
  const client = createClient(url, key);
  const { data, error } = await client.from("colleges").select("id,name,location,courses,rating,rank,website").limit(500);
  if (error || !data) return [];
  return data.map(item => ({ id: item.id, name: item.name, location: item.location, courses: item.courses ?? [], rating: item.rating, rank: item.rank, website: item.website }));
}

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);

async function loadAlgorithmConfiguration(): Promise<Partial<AnalysisConfig>> {
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_ANON_KEY");
  const college_catalog = await loadCollegeCatalog();
  if (!url || !key) return { college_catalog };
  const client = createClient(url, key);
  const [{ data: configuration }, { data: profileRows }] = await Promise.all([
    client.from("analysis_configurations").select("configuration").eq("algorithm_version", "1.0").eq("active", true).maybeSingle(),
    client.from("career_scoring_profiles").select("profile").eq("algorithm_version", "1.0").eq("active", true),
  ]);
  const override: Partial<AnalysisConfig> = { college_catalog };
  if (isRecord(configuration?.configuration) && isRecord(configuration.configuration.career_weights)) {
    const weights = configuration.configuration.career_weights;
    if (["academic", "interest", "skills", "aptitude", "preferences"].every(name => typeof weights[name] === "number")) {
      override.career_weights = weights as AnalysisConfig["career_weights"];
    }
  }
  const profiles = (profileRows ?? []).map(row => row.profile).filter(isRecord).filter(profile => typeof profile.id === "string" && typeof profile.name === "string" && typeof profile.category === "string" && isRecord(profile.subject_weights) && Array.isArray(profile.required_skills) && Array.isArray(profile.interest_categories));
  if (profiles.length) override.career_profiles = profiles as CareerProfile[];
  return override;
}

serve(async (request) => {
  const headers = { ...corsHeadersFor(request.headers.get("origin")), "Content-Type": "application/json" };
  if (request.method === "OPTIONS") return new Response("ok", { headers });
  if (request.method !== "POST") return new Response(JSON.stringify({ success: false, error: "Method not allowed. Use POST." }), { status: 405, headers });
  let body: { student_data?: unknown };
  try { body = await request.json(); } catch { return new Response(JSON.stringify({ success: false, error: "Invalid JSON body" }), { status: 400, headers }); }
  const validation = validateAnalysisInput(body.student_data); if (!validation.valid) return new Response(JSON.stringify({ success: false, errors: validation.errors }), { status: 422, headers });
  try {
    const configuration = await loadAlgorithmConfiguration();
    return new Response(JSON.stringify({ success: true, analysis: analyzeStudent(body.student_data as AnalysisInput, configuration) }), { status: 200, headers });
  } catch {
    return new Response(JSON.stringify({ success: false, error: "Unable to analyze supplied student data" }), { status: 500, headers });
  }
});
