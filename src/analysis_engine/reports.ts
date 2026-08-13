import type { AnalysisResult } from "./types";

/**
 * Generates an Excel 2003 XML Spreadsheet (SpreadsheetML) file.
 * This format natively supports multiple worksheets, styled headers, bold fonts,
 * and structured tables in all spreadsheet readers (Excel, Google Sheets, Apple Numbers, LibreOffice)
 * with 0 external npm dependencies and 0 security vulnerabilities.
 */
export function generateExcelWorkbookXml(result: AnalysisResult): string {
  const escapeXml = (str: string | number | null | undefined): string => {
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  };

  const createRow = (cells: Array<string | number | null | undefined>, isHeader = false): string => {
    const cellXml = cells
      .map((c) => {
        const isNum = typeof c === "number";
        const val = escapeXml(c);
        const type = isNum ? "Number" : "String";
        const style = isHeader ? ' ss:StyleID="HeaderStyle"' : "";
        return `<Cell${style}><Data ss:Type="${type}">${val}</Data></Cell>`;
      })
      .join("");
    return `<Row>${cellXml}</Row>`;
  };

  // Sheet 1: Summary
  const summaryRows = [
    createRow(["Student Career Assessment Summary", "", ""], true),
    createRow(["Field", "Value"]),
    createRow(["Student Name", result.student_summary.name || "Student"]),
    createRow(["Grade / Stage", `Grade ${result.student_summary.grade}`]),
    createRow(["Education Level", result.student_summary.education_level === "after-10th" ? "Class 10th / Secondary" : "Class 12th / Senior Secondary"]),
    createRow(["Board", (result.student_summary.board || "CBSE").toUpperCase()]),
    createRow(["Overall Academic Percentage", `${result.academic_analysis?.overall_percentage ?? 0}%`]),
    createRow(["Performance Category", result.academic_analysis?.performance_category ?? "N/A"]),
    createRow(["Academic Consistency", `${result.academic_analysis?.consistency_score ?? 0}/100`]),
    createRow(["RIASEC Personality Code", result.riasec_profile?.code ?? "N/A"]),
    createRow(["Confidence Index", `${Math.round(result.confidence * 100)}%`]),
    createRow(["Generated On", new Date(result.created_at).toLocaleString("en-IN")]),
    createRow(["Algorithm Version", `Zertainity Engine v${result.algorithm_version}`]),
  ];

  // Sheet 2: Academic Performance
  const academicRows = [
    createRow(["Subject", "Marks Obtained", "Maximum Marks", "Percentage", "Rank", "Category", "Interest Level"], true),
    ...(result.subject_analysis || []).map((s) =>
      createRow([s.name, s.marks, s.max_marks, `${s.percentage}%`, s.rank, s.category, s.interest_level || "Medium"])
    ),
  ];

  // Sheet 3: Historical Trends
  const trendRows = [
    createRow(["Subject", "Earlier Score (%)", "Recent Score (%)", "Point Delta", "Trajectory"], true),
    ...(result.trend_analysis?.subjects || []).map((t) =>
      createRow([t.name, t.earlier_score, t.recent_score, `${t.change > 0 ? "+" : ""}${t.change} pts`, t.direction.toUpperCase()])
    ),
  ];
  if (!result.trend_analysis?.subjects?.length) {
    trendRows.push(createRow(["Insufficient multi-semester history available for trend generation."]));
  }

  // Sheet 4: Skills & Interests
  const skillsInterestsRows = [
    createRow(["Category", "Domain / Skill", "Score (0-100)"], true),
    ...Object.entries(result.interest_analysis?.scores || {}).map(([dom, score]) =>
      createRow(["Interest", dom, score])
    ),
    ...Object.entries(result.skill_analysis?.scores || {}).map(([sk, score]) =>
      createRow(["Skill", sk, score])
    ),
    ...Object.entries(result.aptitude_analysis?.scores || {}).map(([apt, score]) =>
      createRow(["Aptitude", apt, score])
    ),
  ];

  // Sheet 5: Career Compatibility
  const careerRows = [
    createRow(["Rank", "Career Title", "Category", "Compatibility Score", "Eligibility Status", "Missing Prerequisites", "Confidence", "Key Strengths", "Development Areas"], true),
    ...(result.career_matches || []).map((c, idx) =>
      createRow([
        idx + 1,
        c.career,
        c.category,
        `${c.compatibility_score}%`,
        c.eligibility.status.toUpperCase(),
        c.eligibility.missing_requirements.join(", ") || "None",
        `${Math.round(c.confidence * 100)}%`,
        c.positive_factors.join("; "),
        c.development_factors.join("; "),
      ])
    ),
  ];

  // Sheet 6: Recommended Streams (Class 10)
  const streamRows = [
    createRow(["Stream Name", "Match Score", "Match Level", "Core Subjects", "Key Fit Reasons"], true),
    ...(result.recommended_streams || []).map((st) =>
      createRow([st.stream_name, `${st.match_score}%`, st.match_level, st.subjects.join(", "), st.reasons.join("; ")])
    ),
  ];

  // Sheet 7: Course Pathways
  const courseRows = [
    createRow(["Recommended Course / Degree", "Supporting Careers"], true),
    ...(result.course_recommendations || []).map((cr) =>
      createRow([cr.course, cr.based_on_careers.join(", ")])
    ),
  ];

  // Sheet 8: Verified Colleges
  const collegeRows = [
    createRow(["College / Institute Name", "Location", "Accreditation / Rank", "Matching Courses", "Match Reasons"], true),
    ...(result.college_recommendations || []).map((col) =>
      createRow([col.name, col.location, col.rank || "National Institute", col.matched_courses.join(", "), col.match_reasons.join("; ")])
    ),
  ];

  // Sheet 9: Insights
  const insightRows = [
    createRow(["Type", "Insight Title", "Supporting Data Evidence"], true),
    ...(result.insights || []).map((ins) =>
      createRow([ins.type.toUpperCase(), ins.title, ins.evidence.join("; ")])
    ),
  ];

  const buildWorksheet = (name: string, rows: string[]) => `
    <Worksheet ss:Name="${escapeXml(name)}">
      <Table>
        ${rows.join("\n        ")}
      </Table>
    </Worksheet>
  `;

  return `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Borders/>
   <Font ss:FontName="Calibri" ss:Size="11" ss:Color="#000000"/>
   <Interior/>
   <NumberFormat/>
   <Protection/>
  </Style>
  <Style ss:ID="HeaderStyle">
   <Font ss:FontName="Calibri" ss:Size="11" ss:Color="#FFFFFF" ss:Bold="1"/>
   <Interior ss:Color="#0EA5A4" ss:Pattern="Solid"/>
   <Alignment ss:Vertical="Center"/>
  </Style>
 </Styles>
 ${buildWorksheet("Summary", summaryRows)}
 ${buildWorksheet("Academic Performance", academicRows)}
 ${buildWorksheet("Historical Trends", trendRows)}
 ${buildWorksheet("Skills & Interests", skillsInterestsRows)}
 ${buildWorksheet("Career Compatibility", careerRows)}
 ${result.recommended_streams?.length ? buildWorksheet("High School Streams", streamRows) : ""}
 ${buildWorksheet("Course Pathways", courseRows)}
 ${buildWorksheet("Verified Colleges", collegeRows)}
 ${buildWorksheet("Diagnostic Insights", insightRows)}
</Workbook>`;
}

export function downloadAnalysisExcel(result: AnalysisResult, filename?: string): void {
  const xml = generateExcelWorkbookXml(result);
  const blob = new Blob([xml], { type: "application/vnd.ms-excel;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || `zertainity-assessment-${new Date().toISOString().slice(0, 10)}.xls`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadAnalysisJson(result: AnalysisResult, filename?: string): void {
  const json = JSON.stringify(result, null, 2);
  const blob = new Blob([json], { type: "application/json;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || `zertainity-assessment-data-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
