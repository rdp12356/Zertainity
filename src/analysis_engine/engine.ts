import type {
  AnalysisConfig,
  AnalysisInput,
  AnalysisResult,
  ValidationResult,
} from "./types";
import { ALGORITHM_VERSION } from "./types";
import { DEFAULT_ANALYSIS_CONFIG } from "./config";
import { validateAnalysisInput } from "./validation";
import { normalizeAnalysisInput, round } from "./normalization";
import { calculateAcademicAnalytics } from "./academic";
import { analyzeHistoricalTrends } from "./trends";
import {
  calculateRecommendedStreamsForGrade10,
  calculateRiasecProfile,
  evaluateCareerCompatibility,
} from "./careers";
import {
  deriveCourseRecommendations,
  matchVerifiedColleges,
} from "./recommendations";
import { generateDeterministicInsights } from "./insights";

export function analyzeStudentProfile(
  input: AnalysisInput,
  customConfig?: Partial<AnalysisConfig>
): AnalysisResult {
  const config: AnalysisConfig = {
    ...DEFAULT_ANALYSIS_CONFIG,
    ...customConfig,
    career_weights: {
      ...DEFAULT_ANALYSIS_CONFIG.career_weights,
      ...(customConfig?.career_weights || {}),
    },
  };

  // 1. Validation
  const validation: ValidationResult = validateAnalysisInput(input);
  const warnings = [...validation.warnings];

  if (!validation.valid) {
    const errorMessages = validation.errors.map((e) => `${e.path}: ${e.message}`).join("; ");
    console.warn(`Analysis Engine Validation Warning: ${errorMessages}`);
  }

  // 2. Normalization
  const {
    normalizedSubjects,
    normalizedInterests,
    normalizedSkills,
    normalizedAptitude,
  } = normalizeAnalysisInput(input, config);

  // 3. Academic Analytics
  const academic_analysis = calculateAcademicAnalytics(normalizedSubjects, config);

  // 4. Historical Trends
  const trend_analysis = analyzeHistoricalTrends(
    normalizedSubjects,
    input.previous_examinations
  );

  // 5. RIASEC Psychometric Profile
  const riasec_profile = calculateRiasecProfile(
    normalizedInterests,
    input.quiz_answers
  );

  // 6. Career Compatibility & Prerequisites Evaluation
  const career_matches = evaluateCareerCompatibility(
    normalizedSubjects,
    normalizedInterests,
    normalizedSkills,
    normalizedAptitude,
    input.career_preferences,
    config,
    8
  );

  // 7. Recommended Streams (For 10th Grade / After-10th students)
  const is10thGrade =
    input.student?.grade === 10 ||
    input.student?.education_level === "after-10th" ||
    (input.student?.grade && input.student.grade <= 10);

  const recommended_streams = is10thGrade
    ? calculateRecommendedStreamsForGrade10(
        normalizedSubjects,
        normalizedInterests,
        career_matches
      )
    : undefined;

  // 8. Course & College Pathways
  const course_recommendations = deriveCourseRecommendations(career_matches, 8);
  const college_recommendations = matchVerifiedColleges(
    course_recommendations,
    career_matches,
    config.college_catalog
  );

  // 9. Deterministic Insights
  const insights = generateDeterministicInsights(
    academic_analysis,
    trend_analysis,
    career_matches,
    normalizedInterests,
    normalizedSkills
  );

  // 10. Overall Confidence Score
  const subjectCountFactor = Math.min(normalizedSubjects.length / 5, 1);
  const interestFactor = Object.keys(normalizedInterests).length > 0 ? 0.3 : 0.1;
  const overallConfidence = round(
    Math.min(0.95, 0.45 + subjectCountFactor * 0.35 + interestFactor),
    2
  );

  // 11. Top Strengths & Development Areas for Skills
  const sortedSkills = Object.entries(normalizedSkills).sort((a, b) => b[1] - a[1]);
  const skillStrengths = sortedSkills.filter(([_, val]) => val >= 75).map(([k]) => k);
  const skillDevAreas = sortedSkills.filter(([_, val]) => val < 60).map(([k]) => k);

  const sortedInterests = Object.entries(normalizedInterests).sort((a, b) => b[1] - a[1]);
  const topInterests = sortedInterests.slice(0, 4).map(([k]) => k);

  const sortedAptitude = Object.entries(normalizedAptitude).sort((a, b) => b[1] - a[1]);
  const topAptitudes = sortedAptitude.slice(0, 3).map(([k]) => k);

  return {
    algorithm_version: ALGORITHM_VERSION,
    created_at: new Date().toISOString(),
    student_summary: {
      name: input.student?.name || null,
      grade: input.student?.grade || 10,
      education_level: input.student?.education_level || (is10thGrade ? "after-10th" : "after-12th"),
      board: input.student?.board || "cbse",
      stream: input.student?.stream || null,
      attendance: input.attendance ?? null,
    },
    academic_analysis,
    subject_analysis: academic_analysis?.subject_analysis || [],
    skill_analysis: {
      scores: normalizedSkills,
      strengths: skillStrengths,
      development_areas: skillDevAreas,
    },
    interest_analysis: {
      scores: normalizedInterests,
      top_interests: topInterests,
    },
    aptitude_analysis: {
      scores: normalizedAptitude,
      top_aptitudes: topAptitudes,
    },
    riasec_profile,
    recommended_streams,
    career_matches,
    course_recommendations,
    college_recommendations,
    insights,
    methodology: {
      calculated_result: "Deterministic Multi-Criteria Weighted Model (v1.0)",
      prediction: "Rule-Based Historical Vector Trajectory",
      career_weights: config.career_weights,
    },
    confidence: overallConfidence,
    warnings,
    prediction: {
      status: trend_analysis.trend_status === "available" ? "insufficient_data" : "not_run",
      reason: "Prediction is based purely on verified semester score vectors.",
    },
  };
}
