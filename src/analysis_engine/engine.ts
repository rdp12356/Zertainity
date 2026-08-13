import type {
  AnalysisConfig,
  AnalysisInput,
  AnalysisResult,
  DataCompleteness,
  ValidationResult,
} from "./types";
import { ALGORITHM_VERSION } from "./types";
import { DEFAULT_ANALYSIS_CONFIG } from "./config";
import { validateAnalysisInput } from "./validation";
import { normalizeAnalysisInput, round, clamp } from "./normalization";
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

export class AnalysisValidationError extends Error {
  public validation: ValidationResult;
  constructor(validation: ValidationResult) {
    const errorMessages = validation.errors.map((e) => `${e.path}: ${e.message}`).join("; ");
    super(`Analysis Engine validation failed: ${errorMessages}`);
    this.name = "AnalysisValidationError";
    this.validation = validation;
  }
}

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

  // 1. Validation — CRITICAL: MUST BLOCK CALCULATION ON INVALID INPUT
  const validation: ValidationResult = validateAnalysisInput(input);
  if (!validation.valid) {
    throw new AnalysisValidationError(validation);
  }

  const warnings = [...validation.warnings];

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

  // 5. RIASEC Psychometric Profile (Only when genuine interest/quiz data exists)
  const riasec_profile = calculateRiasecProfile(
    normalizedInterests,
    input.quiz_answers
  );

  // 6. Career Compatibility & Prerequisites Evaluation (Dynamic re-normalization)
  const career_matches = evaluateCareerCompatibility(
    normalizedSubjects,
    normalizedInterests,
    normalizedSkills,
    normalizedAptitude,
    input.career_preferences,
    config,
    8
  );

  // 7. Recommended Streams (For 10th Grade / After-10th students only)
  const is10thGrade =
    input.student?.grade === 10 ||
    input.student?.education_level === "after-10th" ||
    (input.student?.grade !== undefined && input.student.grade <= 10);

  const isSeniorSecondary =
    input.student?.grade === 11 ||
    input.student?.grade === 12 ||
    input.student?.education_level === "after-12th";

  const recommended_streams = is10thGrade && !isSeniorSecondary
    ? calculateRecommendedStreamsForGrade10(
        normalizedSubjects,
        normalizedInterests,
        career_matches
      )
    : undefined;

  // 8. Course & College Pathways (Derived from canonical catalog)
  const course_recommendations = deriveCourseRecommendations(career_matches, 8);
  const college_recommendations = matchVerifiedColleges(
    course_recommendations,
    career_matches,
    config.college_catalog
  );

  // 9. Deterministic Insights (Grounded strictly in verified numbers)
  const insights = generateDeterministicInsights(
    academic_analysis,
    trend_analysis,
    career_matches,
    normalizedInterests,
    normalizedSkills
  );

  // 10. Data Completeness & Statistical Data Confidence
  const hasAcademics = normalizedSubjects.length > 0;
  const hasHistoricalTrends = trend_analysis.trend_status === "available";
  const hasInterests = Object.keys(normalizedInterests).length > 0;
  const hasSkills = Object.keys(normalizedSkills).length > 0;
  const hasAptitude = Object.keys(normalizedAptitude).length > 0;
  const hasPreferences = Array.isArray(input.career_preferences) && input.career_preferences.length > 0;
  const hasRiasec = riasec_profile.status === "available";

  const completenessScore = round(
    (hasAcademics ? 35 : 0) +
    (hasInterests ? 20 : 0) +
    (hasSkills ? 15 : 0) +
    (hasHistoricalTrends ? 15 : 0) +
    (hasAptitude ? 10 : 0) +
    (hasPreferences ? 5 : 0),
    1
  );

  const data_completeness: DataCompleteness = {
    overall_score: completenessScore,
    has_academics: hasAcademics,
    has_historical_trends: hasHistoricalTrends,
    has_interests: hasInterests,
    has_skills: hasSkills,
    has_aptitude: hasAptitude,
    has_preferences: hasPreferences,
    has_riasec: hasRiasec,
    subject_count: normalizedSubjects.length,
  };

  const overallConfidence = round(
    clamp(0.40 + (completenessScore / 100) * 0.55, 0.40, 0.95),
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
    trend_analysis,
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
    data_completeness,
    methodology: {
      calculated_result: "Deterministic Multi-Criteria Weighted Model (v1.0)",
      prediction: "Predictive Module Not Run (v1.0)",
      career_weights: config.career_weights,
    },
    confidence: overallConfidence,
    warnings,
    prediction: {
      status: "not_run",
      reason: "Predictive forecasting is intentionally disabled in Analysis Engine v1.0. Recommendations reflect verified multi-criteria empirical evaluations.",
    },
  };
}

