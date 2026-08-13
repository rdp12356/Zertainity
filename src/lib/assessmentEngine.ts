import {
  analyzeStudentProfile,
  type AnalysisInput,
  type AnalysisResult as UnifiedAnalysisResult,
  type CareerMatch,
  type RiasecProfile,
} from "@/analysis_engine";
import { SUBJECT_ALIASES, DOMAIN_KEYWORDS } from "@/analysis_engine/config";

export type SubjectMarksInput = {
  subject: string;
  marks: string | number;
  max_marks?: string | number;
  interest?: "high" | "mid" | "low" | string;
};

export type QuizQuestionInput = {
  subject?: string;
  question?: string;
};

export type AssessmentRecommendation = {
  stream: string;
  category: string;
  match: number;
  confidence: "High" | "Medium" | "Low";
  description: string;
  reasons: string[];
  careers: string[];
  nextSteps: string[];
  suggestedSubjects: string[];
  officialPathways: string[];
  sourceBasis: string[];
  topColleges?: string[];
  recommendedCourses?: string[];
};

export type RecommendedStream = {
  streamName: string;
  matchScore: number;
  matchLevel: "High Match" | "Moderate Match" | "Low Match";
  reasons: string[];
  subjects: string[];
  careers: string[];
  suitabilityAnalysis: string;
};

export type AssessmentResult = {
  strengths: string;
  recommendations: AssessmentRecommendation[];
  academicAverage: number;
  topInterestDomains: string[];
  riasecProfile?: {
    primary: string;
    secondary: string;
    code: string;
    scores: Record<string, number>;
  };
  recommendedStreams?: RecommendedStream[];
  rawAnalysis?: UnifiedAnalysisResult;
};

export type RiasecCode = "R" | "I" | "A" | "S" | "E" | "C";

export type AssessmentInput = {
  studentName?: string;
  grade?: number;
  educationLevel?: string;
  board?: string;
  marks?: Record<string, number>;
  interests?: Record<string, number>;
  skills?: Record<string, number>;
  aptitude?: Record<string, number>;
  topN?: number;
  academicWeight?: number;
  interestWeight?: number;
  subjectRows?: SubjectMarksInput[];
  previousSubjectRows?: SubjectMarksInput[];
  answers?: Record<string, number | string>;
};

function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

export const buildMarksFromSubjectRows = (
  rows: unknown[],
  _board?: "cbse" | "icse" | "ib" | string
): Record<string, number> => {
  const marks: Record<string, number> = {};
  if (!Array.isArray(rows)) return marks;

  rows.forEach((row) => {
    const item = row as Partial<SubjectMarksInput>;
    const subject = typeof item.subject === "string" ? item.subject.trim() : "";
    const score = typeof item.marks === "number" ? item.marks : parseFloat(String(item.marks ?? ""));
    if (!subject || Number.isNaN(score)) return;

    const mappedSubjects = SUBJECT_ALIASES[subject] ?? [subject];
    mappedSubjects.forEach((mappedSubject) => {
      marks[mappedSubject] = marks[mappedSubject] === undefined
        ? clamp(score, 0, 100)
        : Math.round(((marks[mappedSubject] + clamp(score, 0, 100)) / 2) * 10) / 10;
    });
  });

  return marks;
};

export const buildInterestsFromSubjectRows = (
  rows: unknown[],
  freeText?: string
): Record<string, number> => {
  const interests: Record<string, number> = {};
  if (!Array.isArray(rows)) return interests;

  const addInterest = (domain: string, rating: number) => {
    interests[domain] = Math.max(interests[domain] ?? 0, rating);
  };

  rows.forEach((row) => {
    const item = row as Partial<SubjectMarksInput>;
    const subject = typeof item.subject === "string" ? item.subject.trim() : "";
    const rating = item.interest === "high" ? 90 : item.interest === "mid" || item.interest === "medium" ? 60 : item.interest === "low" ? 30 : undefined;
    if (!subject || !rating) return;

    const mappedSubjects = SUBJECT_ALIASES[subject] ?? [subject];
    mappedSubjects.forEach((mappedSubject) => {
      interests[mappedSubject] = Math.max(interests[mappedSubject] ?? 0, rating);
    });
  });

  const text = (freeText ?? "").toLowerCase();
  DOMAIN_KEYWORDS.forEach(([domain, keywords]) => {
    if (keywords.some((keyword) => text.includes(keyword))) {
      addInterest(domain, 80);
    }
  });

  return interests;
};

export const buildInterestsFromQuizAnswers = (
  answers?: Record<string, number | string>,
  questions?: QuizQuestionInput[],
  customAnswers?: Record<number, string>
): Record<string, number> => {
  const interests: Record<string, number> = {};
  if (!answers) return interests;

  const addInterest = (domain: string, rating: number) => {
    interests[domain] = Math.max(interests[domain] ?? 0, rating);
  };

  const values = [
    ...Object.values(answers).filter((value): value is string => typeof value === "string"),
    ...Object.values(customAnswers ?? {}),
  ];
  const text = values.join(" ").toLowerCase();

  DOMAIN_KEYWORDS.forEach(([domain, keywords]) => {
    const matches = keywords.filter((keyword) => text.includes(keyword)).length;
    if (matches > 0) addInterest(domain, clamp(60 + matches * 10, 0, 100));
  });

  Object.entries(answers).forEach(([questionIndex, value]) => {
    if (typeof value !== "number") return;
    const question = questions?.[Number(questionIndex)];
    const subject = question?.subject?.trim();
    const rating = value === 6 ? 80 : clamp(value * 20, 0, 100);

    if (subject) {
      addInterest(subject, rating);
    }

    const questionText = question?.question?.toLowerCase() ?? "";
    DOMAIN_KEYWORDS.forEach(([domain, keywords]) => {
      if (keywords.some((keyword) => questionText.includes(keyword)) && value >= 3) {
        addInterest(domain, rating);
      }
    });
  });

  return interests;
};

/**
 * Authoritative assessCareer wrapper that delegates all calculations to the Zertainity Analysis Engine.
 */
export const assessCareer = (input: AssessmentInput): AssessmentResult => {
  // Convert marks record or subjectRows to AnalysisInput format
  const subjects = input.subjectRows && input.subjectRows.length > 0
    ? input.subjectRows.map((r) => ({
        name: r.subject,
        marks: typeof r.marks === "number" ? r.marks : parseFloat(String(r.marks || 0)),
        max_marks: typeof r.max_marks === "number" ? r.max_marks : parseFloat(String(r.max_marks || 100)),
        interest: r.interest,
      }))
    : Object.entries(input.marks || {}).map(([name, score]) => ({
        name,
        marks: score,
        max_marks: 100,
      }));

  const previous_examinations = input.previousSubjectRows && input.previousSubjectRows.length > 0
    ? [{
        label: "Previous Grade",
        subjects: input.previousSubjectRows.map((r) => ({
          name: r.subject,
          marks: typeof r.marks === "number" ? r.marks : parseFloat(String(r.marks || 0)),
          max_marks: typeof r.max_marks === "number" ? r.max_marks : parseFloat(String(r.max_marks || 100)),
        })),
      }]
    : undefined;

  const analysisPayload: AnalysisInput = {
    schema_version: "1.0",
    student: {
      name: input.studentName,
      grade: input.grade || (input.educationLevel === "after-10th" ? 10 : 12),
      education_level: input.educationLevel || "after-12th",
      board: input.board || "cbse",
    },
    subjects,
    previous_examinations,
    interests: input.interests,
    skills: input.skills,
    aptitude: input.aptitude,
    quiz_answers: input.answers,
  };

  const rawResult: UnifiedAnalysisResult = analyzeStudentProfile(analysisPayload);

  // Map CareerMatch array to legacy AssessmentRecommendation shape
  const recommendations: AssessmentRecommendation[] = rawResult.career_matches.map((c: CareerMatch) => ({
    stream: c.career,
    category: c.category,
    match: c.compatibility_score,
    confidence: c.confidence >= 0.8 ? "High" : c.confidence >= 0.65 ? "Medium" : "Low",
    description: c.description,
    reasons: c.positive_factors.length > 0 ? c.positive_factors : [`Strong alignment in ${c.category} subjects`],
    careers: [c.career, ...c.suggested_subjects],
    nextSteps: c.next_steps,
    suggestedSubjects: c.suggested_subjects,
    officialPathways: c.official_pathways,
    sourceBasis: c.source_basis,
    topColleges: c.top_colleges,
    recommendedCourses: c.recommended_courses,
  }));

  const strengths = rawResult.academic_analysis?.strengths.join(", ") ||
    rawResult.insights.find((i) => i.type === "strength")?.title ||
    "Balanced analytical foundation across subjects.";

  const recommendedStreams: RecommendedStream[] | undefined = rawResult.recommended_streams?.map((st) => ({
    streamName: st.stream_name,
    matchScore: st.match_score,
    matchLevel: st.match_level,
    reasons: st.reasons,
    subjects: st.subjects,
    careers: st.careers,
    suitabilityAnalysis: st.suitability_analysis,
  }));

  return {
    strengths,
    recommendations,
    academicAverage: rawResult.academic_analysis?.overall_percentage ?? 75,
    topInterestDomains: rawResult.interest_analysis.top_interests,
    riasecProfile: {
      primary: rawResult.riasec_profile.primary,
      secondary: rawResult.riasec_profile.secondary,
      code: rawResult.riasec_profile.code,
      scores: rawResult.riasec_profile.scores,
    },
    recommendedStreams,
    rawAnalysis: rawResult,
  };
};
