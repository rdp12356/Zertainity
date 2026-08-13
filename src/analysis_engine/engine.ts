import { analyzeAcademics } from "./academic.ts";
import { DEFAULT_CONFIG } from "./config.ts";
import { scoreCareers } from "./careers.ts";
import { buildInsights } from "./insights.ts";
import { normalizeScores, normalizeSubjects } from "./normalization.ts";
import { predictiveStatus } from "./predictive.ts";
import { recommendColleges } from "./recommendations.ts";
import { analyzeTrends } from "./trends.ts";
import { ALGORITHM_VERSION, type AnalysisConfig, type AnalysisInput, type AnalysisResult } from "./types.ts";
import { parseAnalysisInput } from "./validation.ts";
export function analyzeStudent(input: AnalysisInput, override: Partial<AnalysisConfig> = {}): AnalysisResult {
  const data = parseAnalysisInput(input); const config: AnalysisConfig = { ...DEFAULT_CONFIG, ...override, career_weights: { ...DEFAULT_CONFIG.career_weights, ...override.career_weights } };
  const subjects = normalizeSubjects(data.subjects); const academics = analyzeAcademics(subjects, config); const skills = normalizeScores(data.skills); const interests = normalizeScores(data.interests); const aptitude = normalizeScores(data.aptitude); const matches = scoreCareers(academics.subject_analysis, skills, interests, aptitude, data.career_preferences ?? [], config);
  const courses = new Map<string, string[]>(); matches.slice(0, 5).forEach(match => match.courses.forEach(course => courses.set(course, [...(courses.get(course) ?? []), match.career])));
  const course_recommendations = [...courses.entries()].map(([course, based_on_careers]) => ({ course, based_on_careers }));
  const college_recommendations = recommendColleges(config.college_catalog, course_recommendations.map(item => item.course));
  const result: AnalysisResult = { algorithm_version: ALGORITHM_VERSION, student_summary: { name: data.student.name ?? null, grade: data.student.grade, stream: data.student.stream ?? null, attendance: data.attendance ?? null }, academic_analysis: academics, subject_analysis: academics.subject_analysis, skill_analysis: { scores: skills, strengths: Object.entries(skills).filter(([, value]) => value >= config.strength_threshold).map(([name]) => name), development_areas: Object.entries(skills).filter(([, value]) => value < config.development_threshold).map(([name]) => name) }, interest_analysis: { scores: interests, top_interests: Object.entries(interests).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([name]) => name) }, trend_analysis: analyzeTrends(data.previous_examinations, subjects), career_matches: matches, course_recommendations, college_recommendations, insights: [], methodology: { calculated_result: "Deterministic, configured calculations only. Compatibility is an alignment score, not a guarantee or best-career claim.", prediction: "No predictions are produced in v1.0.", career_weights: config.career_weights }, confidence: Math.min(1, Math.max(0, (subjects.length >= 3 ? 0.5 : 0.25) + (Object.keys(skills).length ? 0.15 : 0) + (Object.keys(interests).length ? 0.15 : 0) + (data.previous_examinations?.length ? 0.2 : 0))), warnings: [], prediction: predictiveStatus(data.previous_examinations) };
  if (!Object.keys(skills).length) result.warnings.push("Skill scores were not supplied; career compatibility confidence is reduced."); if (!Object.keys(interests).length) result.warnings.push("Interest scores were not supplied; recommendations are not based on marks alone, but the interest component is unavailable."); if (!data.previous_examinations?.length) result.warnings.push("Historical trend analysis has insufficient data."); if (!config.college_catalog.length) result.warnings.push("College recommendations require verified college course data and are unavailable for this analysis."); result.insights = buildInsights(result); return result;
}
