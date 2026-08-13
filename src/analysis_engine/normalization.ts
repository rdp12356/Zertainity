import type { ScoreMap, SubjectInput } from "./types.ts";
export const canonicalKey = (value: string) => value.trim().toLowerCase();
export const round = (value: number, digits = 1) => Number(value.toFixed(digits));
export const percent = (marks: number, maxMarks: number) => round((marks / maxMarks) * 100);
export function normalizeScores(scores: ScoreMap = {}): ScoreMap { return Object.fromEntries(Object.entries(scores).map(([key, value]) => [canonicalKey(key), round(value)])); }
export function normalizeSubjects(subjects: SubjectInput[]): SubjectInput[] { return subjects.map(subject => ({ ...subject, name: subject.name.trim() })); }
