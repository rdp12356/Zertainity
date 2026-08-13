import type { ExaminationInput, TrendResult, TrendSubjectDetail } from "./types";
import type { NormalizedSubject } from "./normalization";
import { normalizeSubject, round } from "./normalization";

export function analyzeHistoricalTrends(
  currentSubjects: NormalizedSubject[],
  previousExaminations?: ExaminationInput[]
): TrendResult {
  if (
    !previousExaminations ||
    previousExaminations.length === 0 ||
    !currentSubjects ||
    currentSubjects.length === 0
  ) {
    return { trend_status: "insufficient_data" };
  }

  // Filter valid historical examination periods
  const validExams = previousExaminations.filter(
    (e) => e && Array.isArray(e.subjects) && e.subjects.length > 0
  );

  if (validExams.length === 0) {
    return { trend_status: "insufficient_data" };
  }

  // Map each examination into canonical subject scores
  const chronologicalPeriods = validExams.map((exam) => {
    const norm = exam.subjects.map((s) => normalizeSubject(s));
    const scoreMap: Record<string, number> = {};
    norm.forEach((s) => {
      scoreMap[s.canonical_name] = s.percentage;
    });
    return {
      label: exam.label || (exam.grade ? `Class ${exam.grade}` : "Previous Period"),
      scores: scoreMap,
    };
  });

  // Most immediate previous examination
  const immediatePrev = chronologicalPeriods[chronologicalPeriods.length - 1];
  // Earliest baseline examination
  const baselineExam = chronologicalPeriods[0];

  const currentMap: Record<string, number> = {};
  currentSubjects.forEach((s) => {
    currentMap[s.canonical_name] = s.percentage;
  });

  const subjectDetails: TrendSubjectDetail[] = [];
  let totalDelta = 0;
  let matchedCount = 0;
  let immediateDelta = 0;
  let immediateMatchedCount = 0;

  currentSubjects.forEach((curr) => {
    const baselineScore = baselineExam.scores[curr.canonical_name];
    const immediateScore = immediatePrev.scores[curr.canonical_name];

    if (baselineScore !== undefined) {
      const diff = round(curr.percentage - baselineScore);
      const direction: "improved" | "declined" | "stable" =
        diff >= 2 ? "improved" : diff <= -2 ? "declined" : "stable";

      subjectDetails.push({
        name: curr.canonical_name,
        change: diff,
        direction,
        earlier_score: baselineScore,
        recent_score: curr.percentage,
      });

      totalDelta += diff;
      matchedCount++;
    }

    if (immediateScore !== undefined) {
      immediateDelta += curr.percentage - immediateScore;
      immediateMatchedCount++;
    }
  });

  if (matchedCount === 0) {
    return { trend_status: "insufficient_data" };
  }

  const overallChange = round(totalDelta / matchedCount);
  const recentVsEarlier =
    immediateMatchedCount > 0 ? round(immediateDelta / immediateMatchedCount) : overallChange;

  const overallDirection: "upward" | "downward" | "stable" =
    overallChange >= 2 ? "upward" : overallChange <= -2 ? "downward" : "stable";

  // Sort by change descending
  const sortedByImprovement = [...subjectDetails].sort((a, b) => b.change - a.change);
  const strongest_improvement =
    sortedByImprovement[0]?.change > 0
      ? `${sortedByImprovement[0].name} (+${sortedByImprovement[0].change} pts)`
      : undefined;

  const sortedByDecline = [...subjectDetails].sort((a, b) => a.change - b.change);
  const largest_decline =
    sortedByDecline[0]?.change < 0
      ? `${sortedByDecline[0].name} (${sortedByDecline[0].change} pts)`
      : undefined;

  // Calculate consistency of progress
  const changeVariance =
    subjectDetails.reduce((acc, s) => acc + Math.pow(s.change - overallChange, 2), 0) /
    matchedCount;
  const consistency = round(Math.max(0, 100 - Math.sqrt(changeVariance) * 5));

  return {
    trend_status: "available",
    overall_change: overallChange,
    direction: overallDirection,
    consistency,
    recent_vs_earlier: recentVsEarlier,
    strongest_improvement,
    largest_decline,
    subjects: subjectDetails,
    period_count: validExams.length + 1,
  };
}

