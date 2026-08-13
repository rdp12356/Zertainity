import type { AnalysisConfig, SubjectAnalysis, SubjectInput } from "./types.ts";
import { canonicalKey, percent, round } from "./normalization.ts";
const category = (score: number, config: AnalysisConfig) => config.performance_thresholds.find(threshold => score >= threshold.min)?.label ?? "Unclassified";
export function analyzeAcademics(subjects: SubjectInput[], config: AnalysisConfig) {
  const ordered = subjects.map(subject => ({ ...subject, percentage: percent(subject.marks, subject.max_marks) })).sort((a, b) => b.percentage - a.percentage || a.name.localeCompare(b.name));
  const subject_analysis: SubjectAnalysis[] = ordered.map((subject, index) => ({ ...subject, rank: index + 1, category: category(subject.percentage, config) }));
  const totalMarks = subjects.reduce((sum, subject) => sum + subject.marks, 0); const totalMaximum = subjects.reduce((sum, subject) => sum + subject.max_marks, 0);
  const overall_percentage = percent(totalMarks, totalMaximum); const mean = subject_analysis.reduce((sum, subject) => sum + subject.percentage, 0) / subject_analysis.length;
  const variance = subject_analysis.reduce((sum, subject) => sum + (subject.percentage - mean) ** 2, 0) / subject_analysis.length;
  return { subject_analysis, overall_percentage, average_marks: round(totalMarks / subjects.length), performance_category: category(overall_percentage, config), highest_performing_subject: subject_analysis[0].name, lowest_performing_subject: subject_analysis[subject_analysis.length - 1].name, consistency_score: round(Math.max(0, 100 - Math.sqrt(variance))), strengths: subject_analysis.filter(subject => subject.percentage >= config.strength_threshold).map(subject => subject.name), development_areas: subject_analysis.filter(subject => subject.percentage < config.development_threshold).map(subject => subject.name) };
}
export function subjectScore(subjects: SubjectAnalysis[], name: string): number | undefined { return subjects.find(subject => canonicalKey(subject.name) === canonicalKey(name))?.percentage; }
