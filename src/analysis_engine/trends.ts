import type { ExaminationInput, SubjectInput, TrendResult } from "./types.ts";
import { canonicalKey, percent, round } from "./normalization.ts";
const examinationPercentage = (subjects: SubjectInput[]) => percent(subjects.reduce((sum, subject) => sum + subject.marks, 0), subjects.reduce((sum, subject) => sum + subject.max_marks, 0));
export function analyzeTrends(previous: ExaminationInput[] | undefined, current: SubjectInput[]): TrendResult {
  if (!previous?.length) return { trend_status: "insufficient_data" };
  const all = [...previous.map(exam => exam.subjects), current]; if (all.length < 2) return { trend_status: "insufficient_data" };
  const first = all[0], latest = all[all.length - 1]; const changes = latest.map(subject => { const earlier = first.find(item => canonicalKey(item.name) === canonicalKey(subject.name)); if (!earlier) return null; const change = round(percent(subject.marks, subject.max_marks) - percent(earlier.marks, earlier.max_marks)); return { name: subject.name, change, direction: change > 1 ? "improved" as const : change < -1 ? "declined" as const : "stable" as const }; }).filter((item): item is NonNullable<typeof item> => item !== null);
  const overall_change = round(examinationPercentage(latest) - examinationPercentage(first));
  const overallSeries = all.map(examinationPercentage); const mean = overallSeries.reduce((sum, value) => sum + value, 0) / overallSeries.length; const consistency = round(Math.max(0, 100 - Math.sqrt(overallSeries.reduce((sum, value) => sum + (value - mean) ** 2, 0) / overallSeries.length)));
  return { trend_status: "available", overall_change, direction: overall_change > 1 ? "upward" : overall_change < -1 ? "downward" : "stable", consistency, subjects: changes };
}
