import type { CareerMatch, Insight, ScoreMap, TrendResult } from "./types.ts";
import type { AcademicAnalyticsResult } from "./academic.ts";

export function generateDeterministicInsights(
  academic: AcademicAnalyticsResult | null,
  trends: TrendResult,
  careerMatches: CareerMatch[],
  interests: ScoreMap,
  skills: ScoreMap
): Insight[] {
  const insights: Insight[] = [];

  if (!academic) {
    return insights;
  }

  // 1. Overall Academic Performance Insight
  if (academic.overall_percentage >= 85) {
    insights.push({
      type: "strength",
      title: `Outstanding Academic Profile (${academic.performance_category})`,
      evidence: [
        `Overall aggregate percentage: ${academic.overall_percentage}%`,
        `Leading subject: ${academic.highest_performing_subject}`,
        `Academic consistency index: ${academic.consistency_score}/100`,
      ],
    });
  } else if (academic.overall_percentage >= 70) {
    insights.push({
      type: "strength",
      title: `Solid Academic Foundation (${academic.performance_category})`,
      evidence: [
        `Overall aggregate percentage: ${academic.overall_percentage}%`,
        `Strongest subject: ${academic.highest_performing_subject}`,
      ],
    });
  }

  // 2. Quantitative / STEM Profile Insight
  const maths = academic.subject_analysis.find((s) => s.name === "Mathematics");
  const physics = academic.subject_analysis.find((s) => s.name === "Physics");
  const compSci = academic.subject_analysis.find((s) => s.name === "Computer Science");

  if (maths && maths.percentage >= 80) {
    const evidence = [`Mathematics score: ${maths.percentage}%`];
    if (physics) evidence.push(`Physics score: ${physics.percentage}%`);
    if (compSci) evidence.push(`Computer Science score: ${compSci.percentage}%`);
    if (skills["analytical"] || skills["Analytical Thinking"]) {
      evidence.push(`Analytical skill rating: ${skills["analytical"] || skills["Analytical Thinking"]}%`);
    }

    insights.push({
      type: "strength",
      title: "Strong Quantitative & Analytical Reasoning Profile",
      evidence,
    });
  }

  // 3. Life Sciences Profile Insight
  const biology = academic.subject_analysis.find((s) => s.name === "Biology" || s.name === "Science");
  if (biology && biology.percentage >= 80) {
    insights.push({
      type: "strength",
      title: "High Empirical Aptitude for Biological & Healthcare Sciences",
      evidence: [
        `${biology.name} score: ${biology.percentage}%`,
        `Natural affinity for scientific inquiry and observation`,
      ],
    });
  }

  // 4. Commerce & Finance Profile Insight
  const accounts = academic.subject_analysis.find((s) => s.name === "Accountancy");
  const economics = academic.subject_analysis.find((s) => s.name === "Economics");
  if ((accounts && accounts.percentage >= 75) || (economics && economics.percentage >= 80)) {
    const evidence: string[] = [];
    if (accounts) evidence.push(`Accountancy score: ${accounts.percentage}%`);
    if (economics) evidence.push(`Economics score: ${economics.percentage}%`);
    if (interests["Finance"] || interests["finance"]) evidence.push(`Finance interest rating: ${interests["Finance"] || interests["finance"]}%`);

    insights.push({
      type: "strength",
      title: "Strong Financial & Economic Modeling Competence",
      evidence,
    });
  }

  // 5. Historical Trend Insights
  if (trends.trend_status === "available" && trends.overall_change !== undefined) {
    if (trends.overall_change >= 3) {
      insights.push({
        type: "trend",
        title: `Positive Academic Momentum (+${trends.overall_change} percentage points)`,
        evidence: [
          `Overall semester-on-semester trajectory: Upward`,
          ...(trends.strongest_improvement ? [`Fastest advancing subject: ${trends.strongest_improvement}`] : []),
          `Learning consistency index: ${trends.consistency}/100`,
        ],
      });
    } else if (trends.overall_change <= -3) {
      insights.push({
        type: "attention",
        title: `Semester Performance Decline (${trends.overall_change} percentage points)`,
        evidence: [
          `Overall trajectory: Downward`,
          ...(trends.largest_decline ? [`Subject with largest drop: ${trends.largest_decline}`] : []),
          `Early intervention and conceptual review recommended`,
        ],
      });
    }
  }

  // 6. Interest to Marks Coherence / Alignment Insight
  const topCareer = careerMatches[0];
  if (topCareer) {
    insights.push({
      type: "alignment",
      title: `High Career Alignment: ${topCareer.career} (${topCareer.compatibility_score}% Match)`,
      evidence: [
        ...topCareer.positive_factors.slice(0, 2),
        `Confidence Level: ${Math.round(topCareer.confidence * 100)}%`,
        `Eligibility Status: ${topCareer.eligibility.status.toUpperCase()}`,
      ],
    });
  }

  // 7. Development Area Insight
  if (academic.development_areas.length > 0) {
    insights.push({
      type: "development_area",
      title: "Key Subject Reinforcement Opportunities",
      evidence: academic.development_areas.map((d) => `Reinforce foundation in: ${d}`),
    });
  }

  return insights;
}
