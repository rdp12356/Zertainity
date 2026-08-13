import type { AnalysisInput, AnalysisConfig, SubjectInput } from "./types";
import { SUBJECT_ALIASES } from "./config";

export function clamp(val: number, min = 0, max = 100): number {
  if (isNaN(val)) return min;
  return Math.min(Math.max(val, min), max);
}

export function round(val: number, decimals = 1): number {
  const factor = Math.pow(10, decimals);
  return Math.round(val * factor) / factor;
}

export interface NormalizedSubject {
  raw_name: string;
  canonical_name: string;
  marks: number;
  max_marks: number;
  percentage: number;
  interest_level?: string;
  normalized_interest?: number;
}

export function normalizeSubject(
  subj: SubjectInput,
  config?: Partial<AnalysisConfig>
): NormalizedSubject {
  const name = (subj.name || "").trim();
  const rawMarks = typeof subj.marks === "number" ? subj.marks : parseFloat(String(subj.marks ?? ""));
  const rawMax = typeof subj.max_marks === "number" ? subj.max_marks : parseFloat(String(subj.max_marks ?? ""));

  const validMarks = isNaN(rawMarks) ? 0 : rawMarks;
  const validMax = isNaN(rawMax) || rawMax <= 0 ? 100 : rawMax;

  const percentage = round(clamp((validMarks / validMax) * 100, 0, 100));

  const interestMap = config?.interest_level_map || {
    high: 90,
    mid: 60,
    medium: 60,
    low: 30,
  };

  const rawInterest = (subj.interest || "").toLowerCase().trim();
  const normalizedInterest = interestMap[rawInterest];

  return {
    raw_name: name,
    canonical_name: getCanonicalSubjectName(name),
    marks: validMarks,
    max_marks: validMax,
    percentage,
    interest_level: subj.interest,
    normalized_interest: normalizedInterest,
  };
}

export function getCanonicalSubjectName(rawSubject: string): string {
  const trimmed = rawSubject.trim();
  for (const [canonical, aliases] of Object.entries(SUBJECT_ALIASES)) {
    if (aliases.some(a => a.toLowerCase() === trimmed.toLowerCase())) {
      return canonical;
    }
  }
  return trimmed;
}

export function normalizeAnalysisInput(
  input: AnalysisInput,
  config?: Partial<AnalysisConfig>
): {
  normalizedSubjects: NormalizedSubject[];
  normalizedInterests: Record<string, number>;
  normalizedSkills: Record<string, number>;
  normalizedAptitude: Record<string, number>;
} {
  // Normalize Subjects (deduplicating by averaging scores)
  const subjectAccumulator: Record<string, { totalPct: number; count: number; lastObj: NormalizedSubject }> = {};

  (input.subjects || []).forEach((subj) => {
    const norm = normalizeSubject(subj, config);
    if (!norm.canonical_name) return;

    if (!subjectAccumulator[norm.canonical_name]) {
      subjectAccumulator[norm.canonical_name] = { totalPct: norm.percentage, count: 1, lastObj: norm };
    } else {
      subjectAccumulator[norm.canonical_name].totalPct += norm.percentage;
      subjectAccumulator[norm.canonical_name].count += 1;
      subjectAccumulator[norm.canonical_name].lastObj = norm;
    }
  });

  const normalizedSubjects: NormalizedSubject[] = Object.entries(subjectAccumulator).map(([canonName, acc]) => {
    const avgPct = round(acc.totalPct / acc.count);
    return {
      ...acc.lastObj,
      canonical_name: canonName,
      percentage: avgPct,
    };
  });

  // Normalize Interests
  const normalizedInterests: Record<string, number> = {};
  if (input.interests) {
    Object.entries(input.interests).forEach(([domain, score]) => {
      if (typeof score === "number" && !isNaN(score)) {
        normalizedInterests[domain] = clamp(score, 0, 100);
      }
    });
  }

  // Derive interests from subject interest pill levels
  normalizedSubjects.forEach((s) => {
    if (s.normalized_interest !== undefined) {
      // Map subject canonical name to domain
      normalizedInterests[s.canonical_name] = Math.max(
        normalizedInterests[s.canonical_name] || 0,
        s.normalized_interest
      );
    }
  });

  // Normalize Skills
  const normalizedSkills: Record<string, number> = {};
  if (input.skills) {
    Object.entries(input.skills).forEach(([skill, score]) => {
      if (typeof score === "number" && !isNaN(score)) {
        normalizedSkills[skill] = clamp(score, 0, 100);
      }
    });
  }

  // Normalize Aptitude
  const normalizedAptitude: Record<string, number> = {};
  if (input.aptitude) {
    Object.entries(input.aptitude).forEach(([apt, score]) => {
      if (typeof score === "number" && !isNaN(score)) {
        normalizedAptitude[apt] = clamp(score, 0, 100);
      }
    });
  }

  return {
    normalizedSubjects,
    normalizedInterests,
    normalizedSkills,
    normalizedAptitude,
  };
}
