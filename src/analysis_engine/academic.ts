import type { AnalysisConfig, SubjectAnalysis } from "./types";
import type { NormalizedSubject } from "./normalization";
import { round } from "./normalization";
import { DEFAULT_ANALYSIS_CONFIG } from "./config";

export interface AcademicAnalyticsResult {
  overall_percentage: number;
  average_marks: number;
  performance_category: string;
  highest_performing_subject: string;
  lowest_performing_subject: string;
  consistency_score: number;
  strengths: string[];
  development_areas: string[];
  subject_analysis: SubjectAnalysis[];
}

export function calculatePerformanceCategory(
  percentage: number,
  config: AnalysisConfig = DEFAULT_ANALYSIS_CONFIG
): string {
  for (const threshold of config.performance_thresholds) {
    if (percentage >= threshold.min) {
      return threshold.label;
    }
  }
  return "Needs Improvement";
}

export function calculateAcademicAnalytics(
  subjects: NormalizedSubject[],
  config: AnalysisConfig = DEFAULT_ANALYSIS_CONFIG
): AcademicAnalyticsResult | null {
  if (!subjects || subjects.length === 0) {
    return null;
  }

  // Sort subjects descending by percentage for ranking
  const sorted = [...subjects].sort((a, b) => b.percentage - a.percentage);

  const subject_analysis: SubjectAnalysis[] = sorted.map((s, idx) => ({
    name: s.raw_name || s.canonical_name,
    raw_marks: s.raw_marks ?? s.marks,
    marks: s.marks,
    max_marks: s.max_marks,
    percentage: s.percentage,
    rank: idx + 1,
    category: calculatePerformanceCategory(s.percentage, config),
    canonical_subject: s.canonical_name,
    interest_level: s.interest_level,
    normalized_interest: s.normalized_interest,
  }));

  const totalPercentage = subjects.reduce((sum, s) => sum + s.percentage, 0);
  const overall_percentage = round(totalPercentage / subjects.length);

  const totalMarks = subjects.reduce((sum, s) => sum + s.marks, 0);
  const average_marks = round(totalMarks / subjects.length);

  const highest_performing_subject = sorted[0]?.canonical_name || "";
  const lowest_performing_subject = sorted[sorted.length - 1]?.canonical_name || "";

  // Consistency Score calculation (using inverse standard deviation)
  const mean = overall_percentage;
  const variance = subjects.reduce((acc, s) => acc + Math.pow(s.percentage - mean, 2), 0) / subjects.length;
  const stdDev = Math.sqrt(variance);
  // Max expected stdDev is ~50. Standardize consistency to 0-100:
  const consistency_score = round(Math.max(0, 100 - (stdDev * 2)));

  const strengths = subject_analysis
    .filter(s => s.percentage >= config.strength_threshold)
    .map(s => `${s.name} (${s.percentage}%)`);

  const development_areas = subject_analysis
    .filter(s => s.percentage < config.development_threshold)
    .map(s => `${s.name} (${s.percentage}%)`);

  return {
    overall_percentage,
    average_marks,
    performance_category: calculatePerformanceCategory(overall_percentage, config),
    highest_performing_subject,
    lowest_performing_subject,
    consistency_score,
    strengths,
    development_areas,
    subject_analysis,
  };
}
