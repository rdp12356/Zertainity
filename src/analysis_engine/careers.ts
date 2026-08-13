import type { AnalysisConfig, CareerMatch, ScoreMap, SubjectAnalysis } from "./types.ts";
import { canonicalKey, round } from "./normalization.ts";
import { subjectScore } from "./academic.ts";
const average = (scores: Array<number | undefined>) => { const present = scores.filter((score): score is number => score !== undefined); return present.length ? present.reduce((sum, score) => sum + score, 0) / present.length : undefined; };
const preferenceScore = (preferences: string[], terms: string[] = []): number | undefined => {
  if (!preferences.length) return undefined;
  if (!terms.length) return 50;
  return terms.some(term => preferences.some(preference => canonicalKey(preference).includes(canonicalKey(term)))) ? 100 : 0;
};
export function scoreCareers(subjects: SubjectAnalysis[], skills: ScoreMap, interests: ScoreMap, aptitude: ScoreMap, preferences: string[], config: AnalysisConfig): CareerMatch[] {
  return config.career_profiles.map(profile => {
    const academicParts = Object.entries(profile.subject_weights).map(([name, weight]) => { const value = subjectScore(subjects, name); return value === undefined ? undefined : value * weight; }); const weightsAvailable = Object.entries(profile.subject_weights).filter(([name]) => subjectScore(subjects, name) !== undefined).reduce<number>((sum, [, weight]) => sum + weight, 0); const academic = weightsAvailable ? academicParts.reduce<number>((sum, value) => sum + (value ?? 0), 0) / weightsAvailable : undefined;
    const skill = average(profile.required_skills.map(key => skills[canonicalKey(key)])); const interest = average(profile.interest_categories.map(key => interests[canonicalKey(key)])); const aptitudeScore = average(Object.keys(profile.aptitude_requirements ?? {}).map(key => aptitude[canonicalKey(key)])); const preference = preferenceScore(preferences, profile.preference_keywords);
    const available = [{ weight: config.career_weights.academic, score: academic }, { weight: config.career_weights.interest, score: interest }, { weight: config.career_weights.skills, score: skill }, { weight: config.career_weights.aptitude, score: aptitudeScore }, { weight: config.career_weights.preferences, score: preference }].filter((part): part is { weight: number; score: number } => part.score !== undefined);
    const denominator = available.reduce((sum, part) => sum + part.weight, 0); const score = denominator ? round(available.reduce((sum, part) => sum + part.score * part.weight, 0) / denominator) : 0;
    const positive_factors: string[] = []; const development_factors: string[] = []; const relationship_evidence: string[] = [];
    Object.keys(profile.subject_weights).forEach(name => { const value = subjectScore(subjects, name); if (value === undefined) return development_factors.push(`${name} mark is not available`); const fact = `${name}: ${value}%`; (value >= 80 ? positive_factors : development_factors).push(value >= 80 ? `Strong ${fact}` : `${fact} can improve`); if (value >= 80) relationship_evidence.push(fact); });
    profile.required_skills.forEach(key => { const value = skills[canonicalKey(key)]; if (value === undefined) return development_factors.push(`${key} skill score is not available`); (value >= 80 ? positive_factors : development_factors).push(value >= 80 ? `Strong ${key} skill (${value}%)` : `${key} skill (${value}%) can improve`); if (value >= 80) relationship_evidence.push(`${key} skill: ${value}%`); });
    profile.interest_categories.forEach(key => { const value = interests[canonicalKey(key)]; if (value !== undefined && value >= 80) { positive_factors.push(`High ${key} interest (${value}%)`); relationship_evidence.push(`${key} interest: ${value}%`); } });
    const missingRequired = (profile.required_subjects ?? []).filter(name => subjectScore(subjects, name) === undefined); if (missingRequired.length) development_factors.push(`Eligibility-related subject data missing: ${missingRequired.join(", ")}`);
    return { career: profile.name, category: profile.category, score, confidence: round(Math.min(1, available.length / 5), 2), positive_factors, development_factors, relationship_evidence, courses: profile.courses ?? [] };
  }).filter(match => match.confidence > 0).sort((a, b) => b.score - a.score || a.career.localeCompare(b.career));
}
