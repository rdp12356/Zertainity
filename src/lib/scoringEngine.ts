// =============================================================================
// ZERTAINITY — Career Scoring Engine (Layer 1)
// Pure TypeScript, no API calls, always available as fallback.
// =============================================================================

export type EducationLevel = '10th' | '12th' | 'graduate';

export interface StudentProfile {
  educationLevel: EducationLevel;
  /** Subject marks 0-100, e.g. { math: 85, science: 78, english: 72 } */
  marks: Record<string, number>;
  /** Interest scores 1-5, e.g. { interest_tech: 5, interest_bio: 2 } */
  interestScores: Record<string, number>;
}

export interface CareerMatch {
  rank: number;
  career: string;
  domain: string;
  matchScore: number;          // 0-100
  strengths: string[];
  weakAreas: string[];
  readinessLevel: 'High' | 'Medium' | 'Low';
  requiredExams: string[];
  topJobRoles: string[];
  growthOutlook: 'high' | 'stable' | 'declining';
  avgSalaryLpa?: number;
}

export interface ScoringResult {
  topCareers: CareerMatch[];
  profileStrengths: string[];
  overallReadiness: 'High' | 'Medium' | 'Low';
  dominantDomain: string;
}

// Career data embedded for offline / Edge Function use.
// In production this is fetched from career_master_data table but
// this embedded set acts as a guaranteed fallback.
const CAREER_WEIGHTS: Record<string, { domain: string; weights: Record<string, number>; exams: string[]; roles: string[]; growth: 'high' | 'stable' | 'declining'; salaryLpa: number }> = {
  'Software Engineer': {
    domain: 'engineering',
    weights: { math: 0.35, science: 0.25, interest_tech: 0.30, english: 0.10 },
    exams: ['JEE Main', 'JEE Advanced', 'BITSAT'],
    roles: ['Software Developer', 'Backend Engineer', 'Full Stack Developer', 'SDE-2'],
    growth: 'high', salaryLpa: 12,
  },
  'Data Scientist': {
    domain: 'engineering',
    weights: { math: 0.40, science: 0.20, interest_tech: 0.30, english: 0.10 },
    exams: ['JEE Main', 'GATE'],
    roles: ['Data Scientist', 'ML Engineer', 'AI Researcher'],
    growth: 'high', salaryLpa: 14,
  },
  'Civil Engineer': {
    domain: 'engineering',
    weights: { math: 0.35, science: 0.30, interest_tech: 0.20, social: 0.15 },
    exams: ['JEE Main', 'JEE Advanced'],
    roles: ['Site Engineer', 'Structural Designer', 'Urban Planner'],
    growth: 'stable', salaryLpa: 7.5,
  },
  'Mechanical Engineer': {
    domain: 'engineering',
    weights: { math: 0.35, science: 0.35, interest_tech: 0.20, english: 0.10 },
    exams: ['JEE Main', 'JEE Advanced', 'GATE'],
    roles: ['Mechanical Designer', 'Manufacturing Engineer', 'Automotive Engineer'],
    growth: 'stable', salaryLpa: 8,
  },
  'Electronics Engineer': {
    domain: 'engineering',
    weights: { math: 0.35, science: 0.35, interest_tech: 0.25, english: 0.05 },
    exams: ['JEE Main', 'JEE Advanced', 'GATE'],
    roles: ['Circuit Designer', 'Embedded Systems Engineer', 'VLSI Engineer'],
    growth: 'high', salaryLpa: 9,
  },
  'Doctor (MBBS)': {
    domain: 'medical',
    weights: { science: 0.45, math: 0.15, interest_bio: 0.30, english: 0.10 },
    exams: ['NEET UG'],
    roles: ['General Physician', 'Surgeon', 'Medical Researcher'],
    growth: 'stable', salaryLpa: 10,
  },
  'Dentist (BDS)': {
    domain: 'medical',
    weights: { science: 0.40, math: 0.15, interest_bio: 0.35, english: 0.10 },
    exams: ['NEET UG'],
    roles: ['General Dentist', 'Oral Surgeon', 'Orthodontist'],
    growth: 'stable', salaryLpa: 7,
  },
  'Pharmacist': {
    domain: 'medical',
    weights: { science: 0.45, math: 0.20, interest_bio: 0.25, english: 0.10 },
    exams: ['NEET UG', 'GPAT'],
    roles: ['Clinical Pharmacist', 'Drug Researcher', 'Regulatory Affairs'],
    growth: 'stable', salaryLpa: 5.5,
  },
  'Biomedical Engineer': {
    domain: 'engineering',
    weights: { science: 0.35, math: 0.30, interest_bio: 0.20, interest_tech: 0.15 },
    exams: ['JEE Main', 'NEET UG'],
    roles: ['Biomedical Engineer', 'Medical Device Designer', 'Clinical Engineer'],
    growth: 'high', salaryLpa: 8,
  },
  'Chartered Accountant': {
    domain: 'commerce',
    weights: { math: 0.30, commerce: 0.40, interest_biz: 0.20, english: 0.10 },
    exams: ['CA Foundation', 'CA Intermediate', 'CA Final'],
    roles: ['CA', 'Auditor', 'Tax Consultant', 'CFO'],
    growth: 'stable', salaryLpa: 10,
  },
  'Business Analyst': {
    domain: 'commerce',
    weights: { math: 0.25, commerce: 0.30, interest_biz: 0.30, english: 0.15 },
    exams: ['CAT', 'XAT', 'GMAT'],
    roles: ['Business Analyst', 'Management Consultant', 'Product Manager'],
    growth: 'high', salaryLpa: 11,
  },
  'Investment Banker': {
    domain: 'commerce',
    weights: { math: 0.30, commerce: 0.35, interest_biz: 0.25, english: 0.10 },
    exams: ['CAT', 'CFA', 'MBA'],
    roles: ['Investment Banker', 'Financial Analyst', 'Portfolio Manager'],
    growth: 'high', salaryLpa: 15,
  },
  Journalist: {
    domain: 'arts',
    weights: { english: 0.45, social: 0.30, interest_social: 0.15, art: 0.10 },
    exams: ['CUET', 'IIMC Entrance'],
    roles: ['Reporter', 'Editor', 'Content Strategist', 'News Anchor'],
    growth: 'stable', salaryLpa: 5,
  },
  Psychologist: {
    domain: 'arts',
    weights: { social: 0.40, english: 0.30, interest_social: 0.20, science: 0.10 },
    exams: ['CUET', 'NET', 'RCI'],
    roles: ['Clinical Psychologist', 'Counsellor', 'HR Manager', 'UX Researcher'],
    growth: 'high', salaryLpa: 6,
  },
  'Graphic Designer': {
    domain: 'design',
    weights: { art: 0.45, interest_art: 0.35, english: 0.10, interest_tech: 0.10 },
    exams: ['NID DAT', 'NIFT', 'CEED'],
    roles: ['Graphic Designer', 'UI Designer', 'Brand Designer', 'Art Director'],
    growth: 'high', salaryLpa: 6,
  },
  'Fashion Designer': {
    domain: 'design',
    weights: { art: 0.45, interest_art: 0.40, english: 0.10, social: 0.05 },
    exams: ['NIFT Entrance', 'NID DAT', 'Pearl Academy'],
    roles: ['Fashion Designer', 'Stylist', 'Textile Designer', 'Creative Director'],
    growth: 'stable', salaryLpa: 5,
  },
  Lawyer: {
    domain: 'law',
    weights: { english: 0.40, social: 0.30, interest_law: 0.20, math: 0.10 },
    exams: ['CLAT', 'AILET', 'LSAT India'],
    roles: ['Advocate', 'Corporate Lawyer', 'Criminal Lawyer', 'Judge'],
    growth: 'stable', salaryLpa: 8,
  },
  'Corporate Lawyer': {
    domain: 'law',
    weights: { english: 0.35, social: 0.25, interest_law: 0.25, commerce: 0.15 },
    exams: ['CLAT', 'AILET', 'LLM'],
    roles: ['Corporate Counsel', 'M&A Lawyer', 'Compliance Officer'],
    growth: 'high', salaryLpa: 14,
  },
  'UX Designer': {
    domain: 'design',
    weights: { art: 0.35, interest_art: 0.25, interest_tech: 0.25, english: 0.15 },
    exams: ['CEED', 'NID DAT', 'BDes Entrance'],
    roles: ['UX Designer', 'Product Designer', 'UX Researcher', 'Interaction Designer'],
    growth: 'high', salaryLpa: 10,
  },
  'Civil Services (IAS/IPS)': {
    domain: 'arts',
    weights: { social: 0.35, english: 0.30, math: 0.15, interest_social: 0.20 },
    exams: ['UPSC CSE'],
    roles: ['IAS Officer', 'IPS Officer', 'IFS Officer', 'IRS Officer'],
    growth: 'stable', salaryLpa: 8,
  },
};

// Subject label → readable display name
const SUBJECT_LABELS: Record<string, string> = {
  math: 'Mathematics',
  science: 'Science',
  english: 'English',
  social: 'Social Studies',
  art: 'Arts',
  commerce: 'Commerce',
  interest_tech: 'Technology Interest',
  interest_bio: 'Biology / Medical Interest',
  interest_law: 'Law Interest',
  interest_art: 'Design / Art Interest',
  interest_biz: 'Business Interest',
  interest_social: 'Social Sciences Interest',
};

// Daily AI call limit per user
export const DAILY_AI_CALL_LIMIT = 5;

// High-performance thresholds
function normalizeSubject(raw: number): number {
  return Math.min(100, Math.max(0, raw));
}

function normalizeInterest(raw: number): number {
  // Interests are 1-5; convert to 0-100
  return Math.min(100, Math.max(0, ((raw - 1) / 4) * 100));
}

// Build a unified signal map from the student profile
function buildSignalMap(profile: StudentProfile): Record<string, number> {
  const signals: Record<string, number> = {};

  for (const [key, val] of Object.entries(profile.marks)) {
    signals[key.toLowerCase()] = normalizeSubject(val);
  }

  for (const [key, val] of Object.entries(profile.interestScores)) {
    signals[key.toLowerCase()] = normalizeInterest(val);
  }

  // Education-level modifier — graduates get a slight readiness boost
  const eduBoost = profile.educationLevel === 'graduate' ? 5 : 0;
  signals._edu_boost = eduBoost;

  return signals;
}

// Compute weighted dot product for one career
function computeCareerScore(signals: Record<string, number>, weights: Record<string, number>): number {
  let score = 0;
  let totalWeight = 0;

  for (const [signal, weight] of Object.entries(weights)) {
    const value = signals[signal] ?? 50; // default 50 if signal not provided
    score += value * weight;
    totalWeight += weight;
  }

  // Normalise to 0-100 even if weights don't sum to 1
  return totalWeight > 0 ? score / totalWeight : 0;
}

// Identify which subject dimensions are strong (>= 75)
function computeStrengths(signals: Record<string, number>, weights: Record<string, number>): { strengths: string[]; weakAreas: string[] } {
  const strengths: string[] = [];
  const weakAreas: string[] = [];

  for (const signal of Object.keys(weights)) {
    const val = signals[signal] ?? 50;
    const label = SUBJECT_LABELS[signal] ?? signal;
    if (val >= 75) strengths.push(label);
    else if (val < 55) weakAreas.push(label);
  }

  return { strengths, weakAreas };
}

function readinessFromScore(score: number): 'High' | 'Medium' | 'Low' {
  if (score >= 72) return 'High';
  if (score >= 52) return 'Medium';
  return 'Low';
}

// Main export: score all careers, return top N sorted by score
export function scoreCareers(
  profile: StudentProfile,
  careerData: typeof CAREER_WEIGHTS = CAREER_WEIGHTS,
  topN = 3
): ScoringResult {
  const signals = buildSignalMap(profile);
  const results: (CareerMatch & { rawScore: number })[] = [];

  for (const [careerName, meta] of Object.entries(careerData)) {
    const rawScore = computeCareerScore(signals, meta.weights) + (signals._edu_boost ?? 0);
    const finalScore = Math.round(Math.min(100, rawScore));
    const { strengths, weakAreas } = computeStrengths(signals, meta.weights);

    results.push({
      rank: 0,
      career: careerName,
      domain: meta.domain,
      matchScore: finalScore,
      strengths,
      weakAreas,
      readinessLevel: readinessFromScore(finalScore),
      requiredExams: meta.exams,
      topJobRoles: meta.roles,
      growthOutlook: meta.growth,
      avgSalaryLpa: meta.salaryLpa,
      rawScore: finalScore,
    });
  }

  // Sort descending by score
  results.sort((a, b) => b.rawScore - a.rawScore);

  const topCareers = results.slice(0, topN).map((r, i) => ({
    rank: i + 1,
    career: r.career,
    domain: r.domain,
    matchScore: r.matchScore,
    strengths: r.strengths,
    weakAreas: r.weakAreas,
    readinessLevel: r.readinessLevel,
    requiredExams: r.requiredExams,
    topJobRoles: r.topJobRoles,
    growthOutlook: r.growthOutlook,
    avgSalaryLpa: r.avgSalaryLpa,
  }));

  // Aggregate profile-level strengths from top career
  const profileStrengths = [...new Set(topCareers.flatMap(c => c.strengths))].slice(0, 4);
  const dominantDomain = topCareers[0]?.domain ?? 'general';
  const overallReadiness = topCareers[0]?.readinessLevel ?? 'Medium';

  return { topCareers, profileStrengths, overallReadiness, dominantDomain };
}

// Build the AI mentor prompt text
export function buildMentorPrompt(topCareer: CareerMatch, profile: StudentProfile): string {
  const { career, matchScore, strengths, requiredExams, topJobRoles, growthOutlook } = topCareer;
  return `You are a senior career mentor in India. The student has received their personalised career analysis.

**Top Career Match**: ${career} (${matchScore}% match)
**Education Level**: ${profile.educationLevel}
**Their Strengths**: ${strengths.join(', ') || 'General aptitude'}
**Required Exams**: ${requiredExams.join(', ')}
**Potential Roles**: ${topJobRoles.slice(0, 3).join(', ')}
**Industry Growth**: ${growthOutlook}

Write a warm, encouraging mentor-style explanation (max 500 tokens) covering:
1. Why this career fits them specifically (reference their strengths)
2. A realistic 5-year growth path
3. The 2-3 most important entrance exams and how to prepare
4. One key industry insight or trend they should know
5. A single actionable next step they can take this week

Be specific, encouraging, and honest. Write in second person. Do not use bullet points in the first paragraph.`;
}

// Rule-based explanation fallback (no AI required)
export function buildRuleBasedExplanation(topCareer: CareerMatch, profile: StudentProfile): string {
  const { career, matchScore, strengths, requiredExams, topJobRoles, growthOutlook, domain, avgSalaryLpa } = topCareer;

  const strengthText = strengths.length > 0
    ? `Your strongest areas — ${strengths.join(' and ')} — align very well with this field.`
    : 'Your academic profile shows a solid foundation for this career.';

  const growthText = {
    high: 'This field is one of the fastest-growing sectors with excellent long-term demand.',
    stable: 'This is a respected and stable profession with consistent career progression.',
    declining: 'This field is evolving rapidly — adaptability and upskilling will be key.',
  }[growthOutlook];

  const examText = requiredExams.length > 0
    ? `To enter this field, focus on ${requiredExams.slice(0, 2).join(' and ')}.`
    : 'Several pathways exist to enter this field — research the best fit for your profile.';

  return `Based on your assessment, ${career} is your top career match with a ${matchScore}% compatibility score.

${strengthText} This positions you strongly in the ${domain} domain.

${growthText} Professionals in this field typically start at ₹${avgSalaryLpa ?? 6}–${(avgSalaryLpa ?? 6) + 2} LPA and can grow significantly with experience.

${examText} Start preparing early, as these are competitive national-level examinations.

Some of the exciting roles you could grow into include: ${topJobRoles.slice(0, 3).join(', ')}.

Your next step: Research the syllabus for ${requiredExams[0] ?? 'the relevant entrance exam'} and create a 6-month preparation calendar. Consistency is more important than intensity.`;
}
