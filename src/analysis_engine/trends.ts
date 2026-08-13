import type { ExaminationInput, TrendResult, TrendSubjectDetail } from "./types";
import type { NormalizedSubject } from "./normalization";
import { normalizeSubject, round } from "./normalization";

export function analyzeHistoricalTrends(
  currentSubjects: NormalizedSubject[],
  previousExaminations?: ExaminationInput[]
): TrendResult {
  if (!previousExaminations || previousExaminations.length === 0 || !currentSubjects || currentSubjects.length === 0) {
    return { trend_status: "insufficient_data" };
  }

  // Get the most recent previous examination
  const lastExam = previousExaminations[previousExaminations.length - 1];
  if (!lastExam || !lastExam.subjects || lastExam.subjects.length === 0) {
    return { trend_status: "insufficient_data" };
  }

  const normalizedPrev = lastExam.subjects.map(s => normalizeSubject(s));
  const prevMap: Record<string, number> = {};
  normalizedPrev.forEach(s => {
    prevMap[s.canonical_name] = s.percentage;
  });

  const subjectDetails: TrendSubjectDetail[] = [];
  let totalChange = 0;
  let matchedCount = 0;

  currentSubjects.forEach(curr => {
    const prevScore = prevMap[curr.canonical_name];
    if (prevScore !== undefined) {
      const diff = round(curr.percentage - prevScore);
      const direction: "improved" | "declined" | "stable" =
        diff >= 2 ? "improved" : diff <= -2 ? "declined" : "stable";

      subjectDetails.push({
        name: curr.canonical_name,
        change: diff,
        direction,
        earlier_score: prevScore,
        recent_score: curr.percentage,
      });

      totalChange += diff;
      matchedCount++;
    }
  });

  if (matchedCount === 0) {
    return { trend_status: "insufficient_data" };
  }

  const overallChange = round(totalChange / matchedCount);
  const overallDirection: "upward" | "downward" | "stable" =
    overallChange >= 2 ? "upward" : overallChange <= -2 ? "downward" : "stable";

  // Sort by change descending
  const sortedByImprovement = [...subjectDetails].sort((a, b) => b.change - a.change);
  const strongest_improvement = sortedByImprovement[0]?.change > 0
    ? `${sortedByImprovement[0].name} (+${sortedByImprovement[0].change} pts)`
    : undefined;

  const sortedByDecline = [...subjectDetails].sort((a, b) => a.change - b.change);
  const largest_decline = sortedByDecline[0]?.change < 0
    ? `${sortedByDecline[0].name} (${sortedByDecline[0].change} pts)`
    : undefined;

  // Calculate consistency of progress
  const changeVariance = subjectDetails.reduce((acc, s) => acc + Math.pow(s.change - overallChange, 2), 0) / matchedCount;
  const consistency = round(Math.max(0, 100 - Math.sqrt(changeVariance) * 5));

  return {
    trend_status: "available",
    overall_change: overallChange,
    direction: overallDirection,
    consistency,
    recent_vs_earlier: overallChange,
    strongest_improvement,
    largest_decline,
    subjects: subjectDetails,
  };
}
