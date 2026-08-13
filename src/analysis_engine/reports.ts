import ExcelJS from "exceljs";
import type { AnalysisResult } from "./types.ts";

const escapeHtml = (value: string | number | null | undefined) => String(value ?? "").replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character] ?? character));

export function createAnalysisReportHtml(analysis: AnalysisResult): string {
  const academic = analysis.academic_analysis;
  const subjectRows = analysis.subject_analysis.map(item => "<tr><td>" + escapeHtml(item.name) + "</td><td>" + item.marks + "/" + item.max_marks + "</td><td>" + item.percentage + "%</td><td>" + item.category + "</td></tr>").join("");
  const careerRows = analysis.career_matches.slice(0, 10).map((item, index) => "<tr><td>" + (index + 1) + "</td><td>" + escapeHtml(item.career) + "</td><td>" + item.score + "%</td><td>" + escapeHtml(item.relationship_evidence.join("; ")) + "</td></tr>").join("");
  const insights = analysis.insights.map(item => "<li><strong>" + escapeHtml(item.title) + ":</strong> " + escapeHtml(item.evidence.join("; ")) + "</li>").join("");
  return "<!doctype html><html><head><meta charset=\"utf-8\"><title>Zertainity Analysis Report</title><style>body{font-family:Arial,sans-serif;color:#1f2937;margin:32px}h1{color:#0f766e}h2{border-bottom:1px solid #cbd5e1;padding-bottom:6px;margin-top:28px}table{border-collapse:collapse;width:100%;font-size:13px}th,td{border:1px solid #cbd5e1;padding:8px;text-align:left}th{background:#f0fdfa}.note{color:#475569;font-size:12px}</style></head><body><h1>Zertainity Analysis Report</h1><p>Algorithm version: " + analysis.algorithm_version + " | Confidence: " + Math.round(analysis.confidence * 100) + "%</p><h2>Executive Summary</h2><p>Student: " + escapeHtml(analysis.student_summary.name ?? "Student") + " | Grade: " + analysis.student_summary.grade + " | Stream: " + escapeHtml(analysis.student_summary.stream) + "</p><p>Overall performance: <strong>" + (academic?.overall_percentage ?? "N/A") + "%</strong> (" + escapeHtml(academic?.performance_category) + ")</p><h2>Academic Performance</h2><table><thead><tr><th>Subject</th><th>Marks</th><th>Percentage</th><th>Category</th></tr></thead><tbody>" + subjectRows + "</tbody></table><h2>Career Compatibility</h2><table><thead><tr><th>Rank</th><th>Career</th><th>Compatibility</th><th>Evidence</th></tr></thead><tbody>" + careerRows + "</tbody></table><h2>Insights</h2><ul>" + insights + "</ul><h2>Methodology & Limitations</h2><p class=\"note\">" + escapeHtml(analysis.methodology.calculated_result) + "</p><p class=\"note\">" + escapeHtml(analysis.warnings.join(" ")) + "</p></body></html>";
}

export async function downloadAnalysisWorkbook(analysis: AnalysisResult, filename = "zertainity-analysis.xlsx"): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  const addSheet = (name: string, rows: Record<string, string | number | null>[]) => {
    const worksheet = workbook.addWorksheet(name);
    const columns = Object.keys(rows[0] ?? { value: "" });
    worksheet.columns = columns.map(key => ({ header: key.replace(/_/g, " "), key, width: Math.max(14, key.length + 3) }));
    rows.forEach(row => worksheet.addRow(row));
    worksheet.getRow(1).font = { bold: true };
    worksheet.views = [{ state: "frozen", ySplit: 1 }];
  };
  addSheet("Summary", [{ student: analysis.student_summary.name, grade: analysis.student_summary.grade, stream: analysis.student_summary.stream, overall_percentage: analysis.academic_analysis?.overall_percentage ?? null, performance_category: analysis.academic_analysis?.performance_category ?? null, confidence: analysis.confidence, algorithm_version: analysis.algorithm_version }]);
  addSheet("Subjects", analysis.subject_analysis.map(item => ({ subject: item.name, marks: item.marks, max_marks: item.max_marks, percentage: item.percentage, rank: item.rank, category: item.category })));
  addSheet("Careers", analysis.career_matches.map((item, index) => ({ rank: index + 1, career: item.career, category: item.category, compatibility_score: item.score, confidence: item.confidence, positive_factors: item.positive_factors.join("; "), development_factors: item.development_factors.join("; "), evidence: item.relationship_evidence.join("; ") })));
  addSheet("Courses", analysis.course_recommendations.map(item => ({ course: item.course, based_on_careers: item.based_on_careers.join("; ") })));
  addSheet("Colleges", analysis.college_recommendations.map(item => ({ college: item.name, location: item.location, matched_courses: item.matched_courses.join("; "), rating: item.rating, rank: item.rank, website: item.website })));
  addSheet("Insights", analysis.insights.map(item => ({ type: item.type, title: item.title, evidence: item.evidence.join("; ") })));
  addSheet("Warnings", analysis.warnings.map(warning => ({ warning })));
  const file = await workbook.xlsx.writeBuffer();
  const blob = new Blob([file], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
