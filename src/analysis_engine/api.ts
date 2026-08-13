import { supabase } from "@/integrations/supabase/client";
import { createAnalysisReportHtml } from "./reports.ts";
import type { AnalysisInput, AnalysisResult } from "./types.ts";

type AnalysisApiResponse = { success: boolean; analysis?: AnalysisResult; error?: string };
type NarrativeApiResponse = { success: boolean; narrative?: string; error?: string };

export async function requestAnalysis(student_data: AnalysisInput): Promise<AnalysisResult> {
  const { data, error } = await supabase.functions.invoke<AnalysisApiResponse>("analyze", { body: { student_data } });
  if (error || !data?.success || !data.analysis) throw new Error(error?.message ?? data?.error ?? "Analysis could not be completed.");
  return data.analysis;
}

export async function requestAnalysisNarrative(analysis: AnalysisResult): Promise<string> {
  const { data, error } = await supabase.functions.invoke<NarrativeApiResponse>("explain-analysis", { body: { analysis } });
  if (error || !data?.success || !data.narrative) throw new Error(error?.message ?? data?.error ?? "AI explanation is unavailable.");
  return data.narrative;
}

export async function downloadAnalysisPdf(analysis: AnalysisResult, filename = "zertainity-analysis-report.pdf"): Promise<void> {
  const { data, error } = await supabase.functions.invoke<Blob>("generate-pdf", { body: { html: createAnalysisReportHtml(analysis), author: "Zertainity", subject: "Zertainity Analysis Report", producer: "Zertainity Analysis Engine v1.0", filename } });
  if (error || !data) throw new Error(error?.message ?? "PDF report generation failed.");
  const url = URL.createObjectURL(data);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
