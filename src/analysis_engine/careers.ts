import type {
  AnalysisConfig,
  CareerMatch,
  CareerProfile,
  RecommendedStream,
  RiasecProfile,
  ScoreMap,
} from "./types";
import type { NormalizedSubject } from "./normalization";
import { clamp, round } from "./normalization";
import { DEFAULT_ANALYSIS_CONFIG, RIASEC_FULL_NAMES, RIASEC_MAP } from "./config";

export function calculateRiasecProfile(
  interests: ScoreMap,
  quizAnswers?: Record<string, number | string>
): RiasecProfile {
  const scores: Record<"R" | "I" | "A" | "S" | "E" | "C", number> = {
    R: 0,
    I: 0,
    A: 0,
    S: 0,
    E: 0,
    C: 0,
  };
  const counts: Record<"R" | "I" | "A" | "S" | "E" | "C", number> = {
    R: 0,
    I: 0,
    A: 0,
    S: 0,
    E: 0,
    C: 0,
  };

  // Map interests to RIASEC themes
  Object.entries(interests || {}).forEach(([domain, score]) => {
    const themes = RIASEC_MAP[domain] || [];
    themes.forEach((theme) => {
      scores[theme] += score;
      counts[theme] += 1;
    });
  });

  // Map numerical quiz answers (1-5 scale mapped to 20-100)
  if (quizAnswers) {
    Object.entries(quizAnswers).forEach(([_, val]) => {
      if (typeof val === "number" && val >= 1 && val <= 5) {
        const scaled = val * 20;
        // Distribute general questions to Investigative and Realistic
        scores.I += scaled * 0.5;
        counts.I += 0.5;
      }
    });
  }

  const finalScores: Record<string, number> = {};
  let totalDataPoints = 0;

  (Object.keys(scores) as Array<"R" | "I" | "A" | "S" | "E" | "C">).forEach((theme) => {
    if (counts[theme] > 0) {
      finalScores[theme] = round(scores[theme] / counts[theme]);
      totalDataPoints += counts[theme];
    } else {
      finalScores[theme] = 50; // Neutral baseline
    }
  });

  if (totalDataPoints < 1) {
    return {
      status: "insufficient_data",
      primary: "Investigative",
      secondary: "Realistic",
      code: "IR",
      scores: finalScores,
    };
  }

  // Sort themes by score descending
  const sorted = (Object.keys(finalScores) as Array<"R" | "I" | "A" | "S" | "E" | "C">).sort(
    (a, b) => finalScores[b] - finalScores[a]
  );

  const primaryCode = sorted[0] || "I";
  const secondaryCode = sorted[1] || "R";
  const code = `${primaryCode}${secondaryCode}${sorted[2] || "C"}`;

  return {
    status: "available",
    primary: RIASEC_FULL_NAMES[primaryCode] || primaryCode,
    secondary: RIASEC_FULL_NAMES[secondaryCode] || secondaryCode,
    code,
    scores: finalScores,
  };
}

export function evaluateCareerCompatibility(
  subjects: NormalizedSubject[],
  interests: ScoreMap,
  skills: ScoreMap,
  aptitude: ScoreMap,
  careerPreferences: string[] = [],
  config: AnalysisConfig = DEFAULT_ANALYSIS_CONFIG,
  topN = 10
): CareerMatch[] {
  const subjectMap: Record<string, number> = {};
  subjects.forEach((s) => {
    subjectMap[s.canonical_name] = s.percentage;
  });

  const overallAcademicAvg =
    subjects.length > 0
      ? subjects.reduce((sum, s) => sum + s.percentage, 0) / subjects.length
      : 70;

  const weights = config.career_weights;

  const matches: CareerMatch[] = config.career_profiles.map((profile) => {
    // 1. Calculate Academic Component (Weighted by profile's specific subject weights)
    let academicScore = 0;
    let totalWeight = 0;
    const positiveFactors: string[] = [];
    const developmentFactors: string[] = [];
    const relationshipEvidence: string[] = [];

    Object.entries(profile.subject_weights).forEach(([subj, weight]) => {
      const studentScore = subjectMap[subj];
      if (studentScore !== undefined) {
        academicScore += studentScore * weight;
        totalWeight += weight;
        relationshipEvidence.push(`${subj}: ${studentScore}% (Weight: ${round(weight * 100)}%)`);

        if (studentScore >= config.strength_threshold) {
          positiveFactors.push(`Strong academic foundation in ${subj} (${studentScore}%)`);
        } else if (studentScore < config.development_threshold) {
          developmentFactors.push(`Academic reinforcement recommended in ${subj} (${studentScore}%)`);
        }
      }
    });

    const finalAcademicScore = totalWeight > 0 ? academicScore / totalWeight : overallAcademicAvg;

    // 2. Calculate Interest Component
    let interestScore = 0;
    let interestWeightTotal = 0;
    profile.interest_categories.forEach((cat) => {
      const studentInterest =
        interests[cat] ??
        interests[cat.toLowerCase()] ??
        interests[profile.category] ??
        interests[profile.category.toLowerCase()];
      if (studentInterest !== undefined) {
        interestScore += studentInterest;
        interestWeightTotal++;
        if (studentInterest >= 75) {
          positiveFactors.push(`High declared interest in ${cat} domain (${studentInterest}%)`);
        }
      }
    });
    if (interestWeightTotal === 0) {
      const catInterest = interests[profile.category] ?? interests[profile.category.toLowerCase()];
      if (catInterest !== undefined) {
        interestScore = catInterest;
        interestWeightTotal = 1;
      }
    }
    const finalInterestScore = interestWeightTotal > 0 ? interestScore / interestWeightTotal : 60;

    // 3. Calculate Skills Component
    let skillScore = 0;
    let skillWeightTotal = 0;
    profile.required_skills.forEach((skill) => {
      const studentSkill =
        skills[skill] ??
        skills[skill.toLowerCase()] ??
        Object.entries(skills).find(([k]) =>
          skill.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(skill.toLowerCase())
        )?.[1];
      if (studentSkill !== undefined) {
        skillScore += studentSkill;
        skillWeightTotal++;
        if (studentSkill >= 75) {
          positiveFactors.push(`Demonstrated competence in ${skill} (${studentSkill}%)`);
        } else if (studentSkill < 60) {
          developmentFactors.push(`Skill development opportunity in ${skill}`);
        }
      }
    });
    const finalSkillScore = skillWeightTotal > 0 ? skillScore / skillWeightTotal : 65;

    // 4. Calculate Aptitude Component
    let aptScore = 0;
    let aptWeightTotal = 0;
    if (profile.aptitude_requirements) {
      Object.entries(profile.aptitude_requirements).forEach(([req, reqWeight]) => {
        const studentApt = aptitude[req] || aptitude[req.toLowerCase()];
        if (studentApt !== undefined) {
          aptScore += studentApt * reqWeight;
          aptWeightTotal += reqWeight;
        }
      });
    }
    const finalAptitudeScore = aptWeightTotal > 0 ? aptScore / aptWeightTotal : 65;

    // 5. Calculate Preference Component
    const prefMatch = careerPreferences.some(
      (p) =>
        p.toLowerCase().includes(profile.name.toLowerCase()) ||
        profile.name.toLowerCase().includes(p.toLowerCase()) ||
        p.toLowerCase() === profile.category.toLowerCase()
    );
    const finalPreferenceScore = prefMatch ? 95 : 60;
    if (prefMatch) {
      positiveFactors.push(`Matches student's stated career preference for ${profile.category}`);
    }

    // 6. Final Composite Compatibility Score
    const compositeScore = round(
      finalAcademicScore * weights.academic +
        finalInterestScore * weights.interest +
        finalSkillScore * weights.skills +
        finalAptitudeScore * weights.aptitude +
        finalPreferenceScore * weights.preferences
    );

    // 7. Evaluate Eligibility vs Compatibility
    const missingPrereqs: string[] = [];
    (profile.required_subjects || []).forEach((req) => {
      if (subjectMap[req] === undefined) {
        missingPrereqs.push(req);
      }
    });

    let eligibilityStatus: "verified" | "partial" | "unknown" = "verified";
    if (missingPrereqs.length > 0) {
      eligibilityStatus =
        missingPrereqs.length === (profile.required_subjects?.length || 0)
          ? "unknown"
          : "partial";
    }

    if (missingPrereqs.length > 0) {
      developmentFactors.push(
        `Prerequisite subject verification needed: ${missingPrereqs.join(", ")}`
      );
    }

    // Calculate Confidence Index (0.50 to 0.98 based on data completeness)
    const dataPoints =
      (totalWeight > 0 ? 0.3 : 0) +
      (interestWeightTotal > 0 ? 0.25 : 0) +
      (skillWeightTotal > 0 ? 0.2 : 0) +
      (subjects.length >= 4 ? 0.25 : 0.1);
    const confidence = round(clamp(0.5 + dataPoints * 0.45, 0.5, 0.95), 2);

    return {
      career: profile.name,
      category: profile.category,
      compatibility_score: compositeScore,
      confidence,
      positive_factors: positiveFactors.slice(0, 4),
      development_factors: developmentFactors.slice(0, 3),
      relationship_evidence: relationshipEvidence,
      eligibility: {
        status: eligibilityStatus,
        missing_requirements: missingPrereqs,
      },
      source_basis: profile.source_basis || ["NEP 2020 Guidelines", "AICTE Career Framework"],
      suggested_subjects: profile.suggested_subjects || Object.keys(profile.subject_weights),
      official_pathways: profile.official_pathways || ["Standard Undergraduate Admissions"],
      next_steps: profile.next_steps || ["Review syllabus and prerequisites", "Prepare for entrance exams"],
      recommended_courses: profile.courses || [],
      top_colleges: profile.top_colleges || [],
      description: profile.description || `Career in ${profile.category} focusing on ${profile.name}.`,
      career_slug: profile.id,
    };
  });

  // Sort descending by compatibility score
  return matches.sort((a, b) => b.compatibility_score - a.compatibility_score).slice(0, topN);
}

export function calculateRecommendedStreamsForGrade10(
  subjects: NormalizedSubject[],
  interests: ScoreMap,
  careerMatches: CareerMatch[]
): RecommendedStream[] {
  const subjectMap: Record<string, number> = {};
  subjects.forEach((s) => {
    subjectMap[s.canonical_name] = s.percentage;
  });

  const maths = subjectMap["Mathematics"] ?? 70;
  const science = subjectMap["Science"] ?? ((subjectMap["Physics"] ?? 70) + (subjectMap["Chemistry"] ?? 70) + (subjectMap["Biology"] ?? 70)) / 3;
  const english = subjectMap["English"] ?? 75;
  const socSci = subjectMap["Social Science"] ?? ((subjectMap["History"] ?? 70) + (subjectMap["Political Science"] ?? 70) + (subjectMap["Geography"] ?? 70)) / 3;

  const topCareers = careerMatches.slice(0, 6).map((c) => c.career);

  const streams: Array<{
    name: string;
    subjects: string[];
    careers: string[];
    score: number;
    reasons: string[];
    suitability: string;
  }> = [
    {
      name: "Science (PCM)",
      subjects: ["Physics", "Chemistry", "Mathematics", "English", "Computer Science / Economics"],
      careers: ["Software Engineer", "Mechanical/Civil/Electrical Engineer", "Data Scientist", "Commercial Pilot", "Architect", "AI/ML Engineer"],
      score: round(maths * 0.45 + science * 0.40 + english * 0.15),
      reasons: [
        `Strong quantitative alignment (Maths: ${maths}%)`,
        `Solid conceptual physics & science foundation (${science}%)`,
        "Opens high-demand technology, engineering, defense, and architecture pathways",
      ],
      suitability: "Science with Physics, Chemistry, and Mathematics (PCM) is ideal for engineering, computing, architecture, and technology disciplines. Your analytical problem-solving foundation provides high readiness for competitive examinations like JEE Main and advanced STEM curricula.",
    },
    {
      name: "Science (PCB)",
      subjects: ["Physics", "Chemistry", "Biology", "English", "Psychology / Biotechnology"],
      careers: ["Doctor (MBBS)", "Dentist", "Biotechnologist", "Pharmacist", "Nurse", "Nutritionist / Dietitian"],
      score: round(science * 0.50 + english * 0.25 + (subjectMap["Biology"] ?? science) * 0.25),
      reasons: [
        `High aptitude for biological and natural sciences (${science}%)`,
        "Direct prerequisite for medical, dental, biotech, and clinical sciences (NEET-UG)",
        "Strong fit for healthcare, therapy, and life sciences research",
      ],
      suitability: "Science with Physics, Chemistry, and Biology (PCB) is the dedicated gateway to medicine, healthcare, pharmacy, and allied life sciences. Your empirical curiosity and scientific dedication strongly support this intensive, rewarding curriculum.",
    },
    {
      name: "Science (PCMB)",
      subjects: ["Physics", "Chemistry", "Mathematics", "Biology", "English"],
      careers: ["Biomedical Engineer", "Bioinformatician", "Biotechnologist", "Research Scientist", "Pharmaceutical Developer"],
      score: round(maths * 0.35 + science * 0.45 + english * 0.20),
      reasons: [
        "Offers maximum career versatility across both Engineering (JEE) and Medicine (NEET)",
        `Balanced performance in both quantitative and natural sciences (Maths: ${maths}%, Science: ${science}%)`,
        "Unlocks cross-disciplinary frontiers like Bioinformatics and Genetic Engineering",
      ],
      suitability: "Science with PCMB provides the highest career flexibility in the Indian education system. It requires strong academic stamina but ensures all technological and medical avenues remain completely open for your future choices.",
    },
    {
      name: "Commerce",
      subjects: ["Accountancy", "Business Studies", "Economics", "English", "Mathematics / Applied Mathematics"],
      careers: ["Chartered Accountant (CA)", "Investment Banker", "Financial Analyst", "Business Analyst", "Marketing Manager", "Entrepreneur"],
      score: round(maths * 0.35 + english * 0.35 + socSci * 0.30),
      reasons: [
        `Strong analytical and numerical competence for financial modeling (Maths: ${maths}%)`,
        "Direct foundation for professional credentials: CA (ICAI), CS (ICSI), CMA, and CFA",
        "Direct alignment with business management, banking, corporate finance, and entrepreneurship",
      ],
      suitability: "Commerce is the premier stream for careers in finance, capital markets, corporate law, accounting, and business leadership. Your numerical skill and practical logic indicate a high potential for success in business ecosystems.",
    },
    {
      name: "Arts & Humanities",
      subjects: ["History", "Geography", "Political Science", "Psychology", "Sociology", "English", "Legal Studies"],
      careers: ["Civil Services (IAS/IPS/IFS)", "Corporate Lawyer", "Psychologist / Counselor", "Graphic/UX Designer", "Journalist", "Public Policy Specialist"],
      score: round(socSci * 0.50 + english * 0.35 + maths * 0.15),
      reasons: [
        `Strong social reasoning and verbal articulation (Social Science: ${socSci}%, English: ${english}%)`,
        "Direct syllabus overlap with UPSC Civil Services Examination and State PSCs",
        "Excellent foundation for 5-Year Integrated Law (CLAT), Design, Psychology, and Media",
      ],
      suitability: "Arts & Humanities offer an intellectually rich pathway focusing on governance, human society, law, visual communication, and policy. Your strong verbal expression and conceptual grasp show a natural fit for this dynamic stream.",
    },
  ];

  // Boost stream scores based on matched careers
  streams.forEach((st) => {
    const matchedCount = st.careers.filter((c) => topCareers.includes(c)).length;
    st.score = clamp(st.score + matchedCount * 4, 0, 99);
  });

  streams.sort((a, b) => b.score - a.score);

  return streams.map((s) => {
    const match_level: "High Match" | "Moderate Match" | "Low Match" =
      s.score >= 80 ? "High Match" : s.score >= 65 ? "Moderate Match" : "Low Match";

    return {
      stream_name: s.name,
      match_score: s.score,
      match_level,
      reasons: s.reasons,
      subjects: s.subjects,
      careers: s.careers,
      suitability_analysis: s.suitability,
    };
  });
}
