import type { AnalysisInput, AnalysisResult } from "./types";
import { analyzeStudentProfile } from "./engine";
import { supabase } from "@/integrations/supabase/client";

/**
 * Single Authoritative Analysis API / Service
 * Runs deterministic analysis locally with optional Supabase Edge Function syncing.
 */
export async function performCareerAnalysis(
  input: AnalysisInput
): Promise<AnalysisResult> {
  // 1. Run authoritative deterministic calculation
  const deterministicResult = analyzeStudentProfile(input);

  // 2. Optionally invoke AI natural language explanation in the background
  try {
    const { data: explanationData, error } = await supabase.functions.invoke("explain-analysis", {
      body: {
        analysis: deterministicResult,
        student_name: input.student?.name || "Student",
      },
    });

    if (!error && explanationData?.explanation) {
      deterministicResult.ai_explanation = explanationData.explanation;
    }
  } catch {
    // If AI explanation fails or is offline, the deterministic engine is 100% complete
  }

  return deterministicResult;
}
