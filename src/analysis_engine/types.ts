export const ALGORITHM_VERSION = "1.0" as const;

export type ScoreMap = Record<string, number>;

export interface SubjectInput {
  name: string;
  marks: number | string;
  max_marks: number | string;
  interest?: "high" | "mid" | "low" | string;
}

export interface ExaminationInput {
  label?: string;
  grade?: number;
  subjects: SubjectInput[];
}

export interface StudentInput {
  id?: string;
  name?: string;
  grade?: number;
  education_level?: "after-10th" | "after-12th" | "early-school" | "middle-school" | string;
  board?: "cbse" | "icse" | "ib" | "state" | string;
  stream?: string;
}

export interface AnalysisInput {
  schema_version: "1.0";
  student: StudentInput;
  subjects: SubjectInput[];
  previous_examinations?: ExaminationInput[];
  attendance?: number;
  skills?: ScoreMap;
  interests?: ScoreMap;
  aptitude?: ScoreMap;
  quiz_answers?: Record<string, number | string>;
  career_preferences?: string[];
  course_preferences?: string[];
  goals?: string[];
  textual_responses?: Record<string, string>;
}

export interface ValidationIssue {
  path: string;
  code: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationIssue[];
  warnings: string[];
}

export interface CareerProfile {
  id: string;
  name: string;
  category: string;
  demand?: "Very High" | "High" | "Medium" | "Low";
  education?: string;
  required_subjects?: string[];
  subject_weights: ScoreMap;
  required_skills: string[];
  interest_categories: string[];
  riasec_themes: Array<"R" | "I" | "A" | "S" | "E" | "C">;
  aptitude_requirements?: ScoreMap;
  preference_keywords?: string[];
  courses?: string[];
  suggested_subjects?: string[];
  official_pathways?: string[];
  source_basis?: string[];
  next_steps?: string[];
  top_colleges?: string[];
  description?: string;
}

export interface CollegeProfile {
  id: string;
  name: string;
  location: string;
  courses: string[];
  rating?: number | null;
  rank?: string | null;
  website?: string | null;
}

export interface AnalysisConfig {
  performance_thresholds: Array<{ min: number; label: string }>;
  strength_threshold: number;
  development_threshold: number;
  career_weights: {
    academic: number;
    interest: number;
    skills: number;
    aptitude: number;
    preferences: number;
  };
  interest_level_map: Record<string, number>;
  career_profiles: CareerProfile[];
  college_catalog: CollegeProfile[];
}

export interface SubjectAnalysis {
  name: string;
  raw_marks: number;
  marks?: number;
  max_marks: number;
  percentage: number;
  rank: number;
  category: string;
  canonical_subject: string;
  interest_level?: string;
  normalized_interest?: number;
}

export interface TrendSubjectDetail {
  name: string;
  change: number;
  direction: "improved" | "declined" | "stable";
  earlier_score: number;
  recent_score: number;
}

export interface TrendResult {
  trend_status: "available" | "insufficient_data";
  overall_change?: number;
  direction?: "upward" | "downward" | "stable";
  consistency?: number;
  recent_vs_earlier?: number;
  strongest_improvement?: string;
  largest_decline?: string;
  subjects?: TrendSubjectDetail[];
  period_count?: number;
}

export interface RiasecProfile {
  status: "available" | "insufficient_data";
  primary: string | null;
  secondary: string | null;
  code: string | null;
  scores: Record<string, number>;
}

export interface CareerMatchComponentScore {
  score: number | null;
  base_weight: number;
  effective_weight: number;
  available: boolean;
}

export interface CareerMatchComponents {
  academic: CareerMatchComponentScore;
  interest: CareerMatchComponentScore;
  skills: CareerMatchComponentScore;
  aptitude: CareerMatchComponentScore;
  preferences: CareerMatchComponentScore;
  total_available_weight: number;
}

export interface CareerMatch {
  career: string;
  category: string;
  compatibility_score: number;
  confidence: number;
  components?: CareerMatchComponents;
  positive_factors: string[];
  development_factors: string[];
  relationship_evidence: string[];
  eligibility: {
    status: "verified" | "partial" | "unknown";
    missing_requirements: string[];
  };
  source_basis: string[];
  suggested_subjects: string[];
  official_pathways: string[];
  next_steps: string[];
  recommended_courses: string[];
  top_colleges: string[];
  description: string;
  career_slug: string;
}

export interface RecommendedStream {
  stream_name: string;
  match_score: number;
  match_level: "High Match" | "Moderate Match" | "Low Match";
  reasons: string[];
  subjects: string[];
  careers: string[];
  suitability_analysis: string;
}

export interface Insight {
  type: "strength" | "development_area" | "trend" | "alignment" | "attention";
  title: string;
  evidence: string[];
}

export interface CourseRecommendation {
  course: string;
  based_on_careers: string[];
  duration?: string;
  category?: string;
}

export interface CollegeRecommendation {
  id: string;
  name: string;
  location: string;
  rating?: number | null;
  rank?: string | null;
  website?: string | null;
  matched_courses: string[];
  match_reasons: string[];
}

export interface DataCompleteness {
  overall_score: number;
  has_academics: boolean;
  has_historical_trends: boolean;
  has_interests: boolean;
  has_skills: boolean;
  has_aptitude: boolean;
  has_preferences: boolean;
  has_riasec: boolean;
  subject_count: number;
}

export interface AnalysisResult {
  algorithm_version: typeof ALGORITHM_VERSION;
  created_at: string;
  student_summary: {
    name: string | null;
    grade: number;
    education_level: string;
    board: string;
    stream: string | null;
    attendance: number | null;
  };
  academic_analysis: {
    overall_percentage: number;
    average_marks: number;
    performance_category: string;
    highest_performing_subject: string;
    lowest_performing_subject: string;
    consistency_score: number;
    strengths: string[];
    development_areas: string[];
  } | null;
  subject_analysis: SubjectAnalysis[];
  trend_analysis: TrendResult;
  skill_analysis: {
    scores: ScoreMap;
    strengths: string[];
    development_areas: string[];
  };
  interest_analysis: {
    scores: ScoreMap;
    top_interests: string[];
  };
  aptitude_analysis: {
    scores: ScoreMap;
    top_aptitudes: string[];
  };
  riasec_profile: RiasecProfile;
  recommended_streams?: RecommendedStream[];
  career_matches: CareerMatch[];
  course_recommendations: CourseRecommendation[];
  college_recommendations: CollegeRecommendation[];
  insights: Insight[];
  data_completeness: DataCompleteness;
  ai_explanation?: {
    overview: string;
    key_advice: string;
    strengths_summary: string;
  };
  methodology: {
    calculated_result: string;
    prediction: string;
    career_weights: AnalysisConfig["career_weights"];
  };
  confidence: number;
  warnings: string[];
  prediction: {
    status: "not_run" | "insufficient_data";
    reason: string;
  };
}

