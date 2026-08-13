export const ALGORITHM_VERSION = "1.0" as const;

export type ScoreMap = Record<string, number>;

export interface SubjectInput { name: string; marks: number; max_marks: number }
export interface ExaminationInput { label?: string; subjects: SubjectInput[] }
export interface StudentInput { name?: string; grade: number; stream?: string; id?: string }
export interface AnalysisInput {
  schema_version: "1.0";
  student: StudentInput;
  subjects: SubjectInput[];
  previous_examinations?: ExaminationInput[];
  attendance?: number;
  skills?: ScoreMap;
  interests?: ScoreMap;
  aptitude?: ScoreMap;
  career_preferences?: string[];
  course_preferences?: string[];
  goals?: string[];
  textual_responses?: Record<string, string>;
}

export interface ValidationIssue { path: string; code: string; message: string }
export interface ValidationResult { valid: boolean; errors: ValidationIssue[] }

export interface CareerProfile {
  id: string;
  name: string;
  category: string;
  required_subjects?: string[];
  subject_weights: ScoreMap;
  required_skills: string[];
  interest_categories: string[];
  aptitude_requirements?: ScoreMap;
  preference_keywords?: string[];
  courses?: string[];
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
  career_weights: { academic: number; interest: number; skills: number; aptitude: number; preferences: number };
  career_profiles: CareerProfile[];
  college_catalog: CollegeProfile[];
}

export interface SubjectAnalysis { name: string; marks: number; max_marks: number; percentage: number; rank: number; category: string }
export interface TrendResult { trend_status: "available" | "insufficient_data"; overall_change?: number; direction?: "upward" | "downward" | "stable"; consistency?: number; subjects?: Array<{ name: string; change: number; direction: "improved" | "declined" | "stable" }> }
export interface CareerMatch { career: string; category: string; score: number; confidence: number; positive_factors: string[]; development_factors: string[]; relationship_evidence: string[]; courses: string[] }
export interface Insight { type: "strength" | "development_area" | "trend" | "alignment" | "attention"; title: string; evidence: string[] }
export interface AnalysisResult {
  algorithm_version: typeof ALGORITHM_VERSION;
  student_summary: { name: string | null; grade: number; stream: string | null; attendance: number | null };
  academic_analysis: { overall_percentage: number; average_marks: number; performance_category: string; highest_performing_subject: string; lowest_performing_subject: string; consistency_score: number; strengths: string[]; development_areas: string[] } | null;
  subject_analysis: SubjectAnalysis[];
  skill_analysis: { scores: ScoreMap; strengths: string[]; development_areas: string[] };
  interest_analysis: { scores: ScoreMap; top_interests: string[] };
  trend_analysis: TrendResult;
  career_matches: CareerMatch[];
  course_recommendations: Array<{ course: string; based_on_careers: string[] }>;
  college_recommendations: Array<{ id: string; name: string; location: string; rating: number | null; rank: string | null; website: string | null; matched_courses: string[]; match_reasons: string[] }>;
  insights: Insight[];
  methodology: { calculated_result: string; prediction: string; career_weights: AnalysisConfig["career_weights"] };
  confidence: number;
  warnings: string[];
  prediction: { status: "not_run" | "insufficient_data"; reason: string };
}
