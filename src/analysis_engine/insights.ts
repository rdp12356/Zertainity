import type { AnalysisResult, Insight } from "./types.ts";
export function buildInsights(analysis: Pick<AnalysisResult, "academic_analysis" | "skill_analysis" | "interest_analysis" | "trend_analysis" | "career_matches">): Insight[] {
  const insights: Insight[] = []; const academic = analysis.academic_analysis;
  academic?.strengths.forEach(name => { const subject = analysis.career_matches.flatMap(match => match.relationship_evidence).find(item => item.startsWith(`${name}:`)); insights.push({ type: "strength", title: `Strong ${name} performance`, evidence: [subject ?? `${name} meets the configured strength threshold`] }); });
  academic?.development_areas.forEach(name => insights.push({ type: "development_area", title: `${name} is a development area`, evidence: [`Subject percentage is below the configured development threshold`] }));
  analysis.skill_analysis.strengths.forEach(name => insights.push({ type: "strength", title: `Strong ${name} skill`, evidence: [`${name}: ${analysis.skill_analysis.scores[name]}%`] }));
  if (analysis.trend_analysis.trend_status === "available") insights.push({ type: "trend", title: `Overall trend is ${analysis.trend_analysis.direction}`, evidence: [`Percentage-point change: ${analysis.trend_analysis.overall_change}`] });
  const match = analysis.career_matches[0]; if (match) insights.push({ type: "alignment", title: `${match.career} has the highest current compatibility score`, evidence: [...match.relationship_evidence.slice(0, 3), `Compatibility score: ${match.score}%`] });
  return insights;
}
