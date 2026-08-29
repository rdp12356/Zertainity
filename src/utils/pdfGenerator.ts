import type { PdfStage } from "@/hooks/usePdfDownload";
import type { AnalysisResult } from "@/analysis_engine/types";

export interface ReportMetadata {
  studentName?: string;
  stageLabel?: string;
  board?: string;
  dateString?: string;
  filename?: string;
}

/**
 * Builds high-fidelity, publication-grade HTML for the Zertainity Official Career Assessment Report.
 */
export function buildAssessmentReportHtml(analysis: AnalysisResult, meta: ReportMetadata = {}): string {
  const studentName = meta.studentName || analysis.student_summary?.name || "Student";
  const stageLabel = meta.stageLabel || (analysis.student_summary?.grade ? `Class ${analysis.student_summary.grade}` : "Class Guidance");
  const boardLabel = (meta.board || analysis.student_summary?.board || "CBSE").toUpperCase();
  const dateString = meta.dateString || new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>Zertainity Official Career Assessment Report - ${studentName}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @page { size: A4 portrait; margin: 16mm; }
        * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        body { font-family: 'Inter', system-ui, -apple-system, sans-serif; color: #0f172a; line-height: 1.5; font-size: 12px; margin: 0; padding: 0; background: #ffffff; }
        
        .header-table { width: 100%; border-bottom: 2.5px solid #0ea5a4; padding-bottom: 12px; margin-bottom: 16px; }
        .brand { font-size: 24px; font-weight: 800; color: #0ea5a4; letter-spacing: -0.5px; }
        .sub-brand { font-size: 11.5px; color: #64748b; font-weight: 500; }
        .meta-cell { text-align: right; font-size: 11.5px; color: #475569; }
        .meta-cell strong { color: #0f172a; }
        
        .section-title { font-size: 14px; font-weight: 700; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-top: 16px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.3px; }
        
        .kpi-grid { display: table; width: 100%; margin-bottom: 14px; table-layout: fixed; }
        .kpi-cell { display: table-cell; width: 25%; padding: 8px 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; }
        .kpi-label { font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: 600; }
        .kpi-val { font-size: 17px; font-weight: 800; color: #0ea5a4; margin-top: 2px; }
        
        .data-table { width: 100%; border-collapse: collapse; margin-top: 6px; margin-bottom: 12px; font-size: 11.5px; }
        .data-table th { background: #f1f5f9; padding: 6px 10px; text-align: left; font-weight: 600; border-bottom: 1.5px solid #cbd5e1; font-size: 11px; }
        .data-table td { padding: 6px 10px; border-bottom: 1px solid #e2e8f0; }
        
        .card { background: #ffffff; border: 1px solid #e2e8f0; border-left: 4px solid #0ea5a4; padding: 10px 14px; border-radius: 6px; margin-bottom: 8px; page-break-inside: avoid; }
        .card-alt { border-left-color: #3b82f6; background: #f8fafc; }
        
        .badge { display: inline-block; padding: 2px 7px; font-size: 10px; font-weight: 700; border-radius: 12px; background: #ccfbf1; color: #0f766e; }
        .badge-warn { background: #fef3c7; color: #92400e; }
        .badge-blue { background: #dbeafe; color: #1d4ed8; }
        
        .grid-2 { display: table; width: 100%; table-layout: fixed; }
        .col-2 { display: table-cell; width: 50%; vertical-align: top; }
        .col-2:first-child { padding-right: 8px; }
        .col-2:last-child { padding-left: 8px; }
        
        footer { margin-top: 24px; padding-top: 8px; border-top: 1px solid #e2e8f0; font-size: 9.5px; color: #94a3b8; text-align: center; page-break-inside: avoid; }
        
        @media print {
          h1, h2, h3, h4, h5 { page-break-after: avoid; }
          table, .card, .kpi-grid { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <table class="header-table">
        <tr>
          <td>
            <div class="brand">ZERTAINITY</div>
            <div class="sub-brand">Authoritative Academic & Career Analysis Report · v${analysis.algorithm_version}</div>
          </td>
          <td class="meta-cell">
            <div><strong>Student:</strong> ${studentName}</div>
            <div><strong>Curriculum:</strong> ${stageLabel} · ${boardLabel}</div>
            <div><strong>Generated:</strong> ${dateString}</div>
          </td>
        </tr>
      </table>

      <!-- KPI Executive Summary -->
      <div class="kpi-grid">
        <div class="kpi-cell">
          <div class="kpi-label">Overall Academic Score</div>
          <div class="kpi-val">${analysis.academic_analysis?.overall_percentage ?? 0}%</div>
        </div>
        <div class="kpi-cell">
          <div class="kpi-label">Performance Band</div>
          <div class="kpi-val" style="font-size: 14px;">${analysis.academic_analysis?.performance_category ?? "Good"}</div>
        </div>
        <div class="kpi-cell">
          <div class="kpi-label">RIASEC Profile Code</div>
          <div class="kpi-val">${analysis.riasec_profile?.code || "N/A"}</div>
        </div>
        <div class="kpi-cell">
          <div class="kpi-label">Engine Confidence</div>
          <div class="kpi-val">${Math.round((analysis.confidence ?? 0.95) * 100)}%</div>
        </div>
      </div>

      <!-- 1. Academic Performance Breakdown -->
      <div class="section-title">1. Academic Performance & Subject Analysis</div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Subject</th>
            <th>Marks Obtained</th>
            <th>Max Marks</th>
            <th>Normalized %</th>
            <th>Classification</th>
          </tr>
        </thead>
        <tbody>
          ${(analysis.subject_analysis || []).map((s) => `
            <tr>
              <td>#${s.rank}</td>
              <td><strong>${s.name}</strong></td>
              <td>${s.raw_marks ?? s.marks}</td>
              <td>${s.max_marks}</td>
              <td><strong>${s.percentage}%</strong></td>
              <td><span class="badge ${s.percentage >= 80 ? '' : s.percentage >= 65 ? 'badge-blue' : 'badge-warn'}">${s.category}</span></td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      ${analysis.trend_analysis && analysis.trend_analysis.trend_status === "available" ? `
      <!-- Historical Trends -->
      <div class="section-title">2. Historical Semester Performance Trends</div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Earlier Exam</th>
            <th>Recent Exam</th>
            <th>Point Difference</th>
            <th>Trajectory</th>
          </tr>
        </thead>
        <tbody>
          ${(analysis.trend_analysis.subjects || []).map((t) => `
            <tr>
              <td><strong>${t.name}</strong></td>
              <td>${t.earlier_score}%</td>
              <td>${t.recent_score}%</td>
              <td><strong>${t.change > 0 ? "+" : ""}${t.change} pts</strong></td>
              <td><span class="badge ${t.change > 0 ? '' : t.change < 0 ? 'badge-warn' : 'badge-blue'}">${t.direction.toUpperCase()}</span></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
      ` : ""}

      ${analysis.recommended_streams && analysis.recommended_streams.length > 0 ? `
      <!-- Recommended Streams for Secondary / Senior -->
      <div class="section-title">${analysis.trend_analysis?.trend_status === "available" ? "3" : "2"}. Recommended Senior Streams (Classes 11–12)</div>
      ${analysis.recommended_streams.map((st, idx) => `
        <div class="card ${idx > 0 ? 'card-alt' : ''}">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <strong style="font-size: 12.5px;">${st.stream_name}</strong>
            <span class="badge">${st.match_score}% Match (${st.match_level})</span>
          </div>
          <div style="font-size: 11px; color: #475569; margin: 3px 0;"><strong>Key Subjects:</strong> ${st.subjects.join(" · ")}</div>
          <p style="font-size: 11.5px; margin: 3px 0; color: #334155;">${st.suitability_analysis}</p>
          <div style="font-size: 11px; color: #0f766e;"><strong>Career Alignment:</strong> ${st.careers.join(", ")}</div>
        </div>
      `).join("")}
      ` : ""}

      <!-- Career Compatibility -->
      <div class="section-title">Top Career Compatibility Matches</div>
      ${(analysis.career_matches || []).slice(0, 5).map((c, idx) => `
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <strong style="font-size: 12.5px;">${idx + 1}. ${c.career}</strong>
              <span style="font-size: 10.5px; color: #64748b; margin-left: 6px;">(${c.category})</span>
            </div>
            <div>
              <span class="badge">${c.compatibility_score}% Compatibility</span>
              <span class="badge ${c.eligibility?.status === 'verified' ? '' : 'badge-warn'}">${(c.eligibility?.status || 'VERIFIED').toUpperCase()}</span>
            </div>
          </div>
          <p style="font-size: 11.5px; margin: 4px 0; color: #334155;">${c.description}</p>
          <div style="font-size: 11px; color: #0369a1; margin-top: 3px;"><strong>Strengths:</strong> ${(c.positive_factors || []).join(" • ")}</div>
          ${c.next_steps && c.next_steps.length > 0 ? `
          <div style="font-size: 11px; color: #475569; margin-top: 2px;"><strong>Next Steps:</strong> ${c.next_steps.slice(0, 2).join("; ")}</div>
          ` : ""}
        </div>
      `).join("")}

      <!-- Course & College Pathways -->
      <div class="section-title">Verified Degree & Institution Pathways</div>
      <div class="grid-2">
        <div class="col-2">
          <strong>Recommended Degrees / Programs:</strong>
          <ul style="padding-left: 16px; margin: 4px 0 0 0; font-size: 11px;">
            ${(analysis.course_recommendations || []).slice(0, 5).map((cr) => `
              <li style="margin-bottom: 3px;"><strong>${cr.course}</strong> <span style="color: #64748b;">(For ${cr.based_on_careers.slice(0, 2).join(", ")})</span></li>
            `).join("")}
          </ul>
        </div>
        <div class="col-2">
          <strong>Verified Institutions (India):</strong>
          <ul style="padding-left: 16px; margin: 4px 0 0 0; font-size: 11px;">
            ${(analysis.college_recommendations || []).slice(0, 4).map((col) => `
              <li style="margin-bottom: 3px;"><strong>${col.name}</strong> - ${col.location} <span style="color: #64748b;">(${col.rank || 'Premier'})</span></li>
            `).join("")}
          </ul>
        </div>
      </div>

      <!-- Actionable Insights -->
      <div class="section-title">Diagnostic Insights & Recommendations</div>
      <ul style="padding-left: 16px; margin: 4px 0 0 0; font-size: 11.5px;">
        ${(analysis.insights || []).map((ins) => `
          <li style="margin-bottom: 4px;"><strong>${ins.title}:</strong> ${ins.evidence.join("; ")}</li>
        `).join("")}
      </ul>

      <footer>
        Official Assessment Report deterministically generated by Zertainity Analysis Engine v${analysis.algorithm_version}. Intended for student and parental career planning. Verified on ${dateString}.
      </footer>
    </body>
    </html>
  `;
}

/**
 * Generates and downloads PDF via the Supabase edge-function render pipeline.
 * Throws when rendering fails so callers can surface an error (with retry)
 * instead of interrupting the user with a browser print dialog.
 */
export async function generatePdfViaSupabase(
  htmlContent: string,
  filename: string = "report.pdf",
  onStage?: (stage: PdfStage) => void
): Promise<void> {
  let failureReason: string;
  try {
    const { supabase } = await import("@/integrations/supabase/client");
    const { data: blob, error } = await supabase.functions.invoke("generate-pdf", {
      body: {
        html: htmlContent,
        filename,
        author: "Zertainity",
      },
    });

    if (!error && blob && blob instanceof Blob) {
      onStage?.("saving");
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      // Defer revocation: revoking synchronously can cancel the download in
      // some browsers, and batch flows fire several downloads in quick succession.
      setTimeout(() => window.URL.revokeObjectURL(url), 10000);
      document.body.removeChild(a);
      return;
    }

    failureReason = error?.message || "Renderer returned an invalid response";
  } catch (edgeError) {
    console.warn("Supabase PDF edge function unreachable:", edgeError);
    failureReason = edgeError instanceof Error ? edgeError.message : String(edgeError);
  }

  throw new Error(`PDF generation failed: ${failureReason || "rendering service unavailable"}`);
}

/**
 * Downloads official PDF assessment report using the Supabase edge-function pipeline.
 */
export async function downloadAssessmentReportPdf(
  analysis: AnalysisResult,
  meta: ReportMetadata = {},
  onStage?: (stage: PdfStage) => void
): Promise<void> {
  const filename = meta.filename || `zertainity-assessment-${new Date().toISOString().slice(0, 10)}.pdf`;
  const htmlContent = buildAssessmentReportHtml(analysis, meta);
  await generatePdfViaSupabase(htmlContent, filename, onStage);
}

