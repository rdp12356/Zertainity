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
  interests: ScoreMap = {},
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

  let totalDataPoints = 0;

  // Map interests to RIASEC themes
  Object.entries(interests || {}).forEach(([domain, score]) => {
    if (typeof score === "number" && !isNaN(score) && score > 0) {
      const themes = RIASEC_MAP[domain] || [];
      themes.forEach((theme) => {
        scores[theme] += score;
        counts[theme] += 1;
        totalDataPoints += 1;
      });
    }
  });

  // Map structured RIASEC quiz answers if provided (e.g., question ID or theme specified)
  if (quizAnswers && typeof quizAnswers === "object") {
    Object.entries(quizAnswers).forEach(([qKey, val]) => {
      const numVal = typeof val === "number" ? val : parseFloat(String(val));
      if (!isNaN(numVal) && numVal >= 1 && numVal <= 5) {
        const scaled = numVal * 20;
        // Check if question key indicates a RIASEC theme (e.g., "riasec_R_1", "theme_I", "aptitude_A")
        const keyUpper = qKey.toUpperCase();
        for (const theme of ["R", "I", "A", "S", "E", "C"] as const) {
          if (keyUpper.includes(`_${theme}`) || keyUpper.startsWith(theme)) {
            scores[theme] += scaled;
            counts[theme] += 1;
            totalDataPoints += 1;
          }
        }
      }
    });
  }

  // If no genuine interest or RIASEC quiz data exists, return honest insufficient_data
  if (totalDataPoints === 0) {
    return {
      status: "insufficient_data",
      primary: null,
      secondary: null,
      code: null,
      scores: {},
    };
  }

  const finalScores: Record<string, number> = {};
  (Object.keys(scores) as Array<"R" | "I" | "A" | "S" | "E" | "C">).forEach((theme) => {
    if (counts[theme] > 0) {
      finalScores[theme] = round(scores[theme] / counts[theme]);
    }
  });

  const availableThemes = (Object.keys(finalScores) as Array<"R" | "I" | "A" | "S" | "E" | "C">).sort(
    (a, b) => (finalScores[b] || 0) - (finalScores[a] || 0)
  );

  if (availableThemes.length === 0) {
    return {
      status: "insufficient_data",
      primary: null,
      secondary: null,
      code: null,
      scores: {},
    };
  }

  const primaryCode = availableThemes[0] || null;
  const secondaryCode = availableThemes[1] || null;
  const tertiaryCode = availableThemes[2] || null;

  const code = [primaryCode, secondaryCode, tertiaryCode].filter(Boolean).join("");

  return {
    status: "available",
    primary: primaryCode ? RIASEC_FULL_NAMES[primaryCode] || primaryCode : null,
    secondary: secondaryCode ? RIASEC_FULL_NAMES[secondaryCode] || secondaryCode : null,
    code: code || null,
    scores: finalScores,
  };
}

export function evaluateCareerCompatibility(
  subjects: NormalizedSubject[],
  interests: ScoreMap = {},
  skills: ScoreMap = {},
  aptitude: ScoreMap = {},
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

  const hasInterestsData = Object.keys(interests).length > 0;
  const hasSkillsData = Object.keys(skills).length > 0;
  const hasAptitudeData = Object.keys(aptitude).length > 0;
  const hasPreferencesData = Array.isArray(careerPreferences) && careerPreferences.length > 0;
  const hasAcademicsData = subjects.length > 0;

  const matches: CareerMatch[] = config.career_profiles.map((profile) => {
    const positiveFactors: string[] = [];
    const developmentFactors: string[] = [];
    const relationshipEvidence: string[] = [];

    // 1. Calculate Academic Component
    let academicScore = 0;
    let totalWeight = 0;

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

    const academicAvailable = hasAcademicsData;
    const finalAcademicScore = totalWeight > 0 ? academicScore / totalWeight : overallAcademicAvg;

    // 2. Calculate Interest Component (only if student provided interest data)
    let interestScore = 0;
    let interestWeightTotal = 0;

    if (hasInterestsData) {
      profile.interest_categories.forEach((cat) => {
        const studentInterest =
          interests[cat] ??
          interests[cat.toLowerCase()] ??
          interests[profile.category] ??
          interests[profile.category.toLowerCase()];
        if (studentInterest !== undefined && !isNaN(studentInterest)) {
          interestScore += studentInterest;
          interestWeightTotal++;
          if (studentInterest >= 75) {
            positiveFactors.push(`High declared interest in ${cat} domain (${studentInterest}%)`);
          }
        }
      });

      if (interestWeightTotal === 0) {
        const catInterest = interests[profile.category] ?? interests[profile.category.toLowerCase()];
        if (catInterest !== undefined && !isNaN(catInterest)) {
          interestScore = catInterest;
          interestWeightTotal = 1;
        }
      }
    }

    const interestAvailable = interestWeightTotal > 0;
    const finalInterestScore = interestAvailable ? interestScore / interestWeightTotal : null;

    // 3. Calculate Skills Component (only if student provided skill data)
    let skillScore = 0;
    let skillWeightTotal = 0;

    if (hasSkillsData) {
      profile.required_skills.forEach((skill) => {
        const studentSkill =
          skills[skill] ??
          skills[skill.toLowerCase()] ??
          Object.entries(skills).find(([k]) =>
            skill.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(skill.toLowerCase())
          )?.[1];
        if (studentSkill !== undefined && !isNaN(studentSkill)) {
          skillScore += studentSkill;
          skillWeightTotal++;
          if (studentSkill >= 75) {
            positiveFactors.push(`Demonstrated competence in ${skill} (${studentSkill}%)`);
          } else if (studentSkill < 60) {
            developmentFactors.push(`Skill development opportunity in ${skill}`);
          }
        }
      });
    }

    const skillsAvailable = skillWeightTotal > 0;
    const finalSkillScore = skillsAvailable ? skillScore / skillWeightTotal : null;

    // 4. Calculate Aptitude Component (only if student provided aptitude data)
    let aptScore = 0;
    let aptWeightTotal = 0;

    if (hasAptitudeData && profile.aptitude_requirements) {
      Object.entries(profile.aptitude_requirements).forEach(([req, reqWeight]) => {
        const studentApt = aptitude[req] ?? aptitude[req.toLowerCase()];
        if (studentApt !== undefined && !isNaN(studentApt)) {
          aptScore += studentApt * reqWeight;
          aptWeightTotal += reqWeight;
        }
      });
    }

    const aptitudeAvailable = aptWeightTotal > 0;
    const finalAptitudeScore = aptitudeAvailable ? aptScore / aptWeightTotal : null;

    // 5. Calculate Preference Component (only if student specified preferences)
    let finalPreferenceScore: number | null = null;
    const preferencesAvailable = hasPreferencesData;

    if (hasPreferencesData) {
      const prefMatch = careerPreferences.some(
        (p) =>
          p.toLowerCase().includes(profile.name.toLowerCase()) ||
          profile.name.toLowerCase().includes(p.toLowerCase()) ||
          p.toLowerCase() === profile.category.toLowerCase()
      );
      finalPreferenceScore = prefMatch ? 95 : 60;
      if (prefMatch) {
        positiveFactors.push(`Matches student's stated career preference for ${profile.category}`);
      }
    }

    // 6. Dynamic Re-normalization across Available Dimensions
    let totalAvailableWeight = 0;
    if (academicAvailable) totalAvailableWeight += weights.academic;
    if (interestAvailable) totalAvailableWeight += weights.interest;
    if (skillsAvailable) totalAvailableWeight += weights.skills;
    if (aptitudeAvailable) totalAvailableWeight += weights.aptitude;
    if (preferencesAvailable) totalAvailableWeight += weights.preferences;

    if (totalAvailableWeight === 0) totalAvailableWeight = 1.0;

    const effectiveAcademicWeight = academicAvailable ? round(weights.academic / totalAvailableWeight, 4) : 0;
    const effectiveInterestWeight = interestAvailable ? round(weights.interest / totalAvailableWeight, 4) : 0;
    const effectiveSkillWeight = skillsAvailable ? round(weights.skills / totalAvailableWeight, 4) : 0;
    const effectiveAptitudeWeight = aptitudeAvailable ? round(weights.aptitude / totalAvailableWeight, 4) : 0;
    const effectivePreferenceWeight = preferencesAvailable ? round(weights.preferences / totalAvailableWeight, 4) : 0;

    let weightedSum = 0;
    if (academicAvailable) weightedSum += finalAcademicScore * effectiveAcademicWeight;
    if (interestAvailable && finalInterestScore !== null) weightedSum += finalInterestScore * effectiveInterestWeight;
    if (skillsAvailable && finalSkillScore !== null) weightedSum += finalSkillScore * effectiveSkillWeight;
    if (aptitudeAvailable && finalAptitudeScore !== null) weightedSum += finalAptitudeScore * effectiveAptitudeWeight;
    if (preferencesAvailable && finalPreferenceScore !== null) weightedSum += finalPreferenceScore * effectivePreferenceWeight;

    const compositeScore = round(weightedSum);

    // 7. Evaluate Eligibility vs Compatibility
    const missingPrereqs: string[] = [];
    const verifiedPrereqs: string[] = [];

    (profile.required_subjects || []).forEach((req) => {
      const mark = subjectMap[req];
      if (mark === undefined) {
        missingPrereqs.push(req);
      } else if (mark >= 50) {
        verifiedPrereqs.push(req);
      } else {
        missingPrereqs.push(`${req} (Score ${mark}% below 50% threshold)`);
      }
    });

    let eligibilityStatus: "verified" | "partial" | "unknown" = "verified";
    const totalRequired = profile.required_subjects?.length || 0;

    if (totalRequired > 0) {
      if (verifiedPrereqs.length === totalRequired) {
        eligibilityStatus = "verified";
      } else if (verifiedPrereqs.length > 0) {
        eligibilityStatus = "partial";
      } else {
        eligibilityStatus = "unknown";
      }
    }

    if (missingPrereqs.length > 0) {
      developmentFactors.push(
        `Prerequisite subject verification: ${missingPrereqs.join(", ")}`
      );
    }

    // 8. Construct Transparent Factor-Level Explanations
    const explanations: import("./types").CareerFactorExplanation[] = [];

    // Individual Subject Contributions
    Object.entries(profile.subject_weights).forEach(([subj, weight]) => {
      const studentScore = subjectMap[subj];
      if (studentScore !== undefined) {
        const contributionScore = studentScore * weight;
        let status: import("./types").CareerFactorExplanation["status"];
        let explanationText: string;
        if (studentScore >= 80) {
          status = "Strong Positive";
          explanationText = `Your strong ${studentScore}% in ${subj} provides a solid analytical foundation for ${profile.name}.`;
        } else if (studentScore >= 60) {
          status = "Positive";
          explanationText = `Your ${studentScore}% in ${subj} meets standard prerequisite requirements for ${profile.name}.`;
        } else {
          status = "Development Area";
          explanationText = `Your ${studentScore}% in ${subj} is below optimal domain threshold; reinforcement recommended.`;
        }

        explanations.push({
          factor: subj,
          category: "Core Subject Weight",
          inputValue: `${studentScore}%`,
          normalizedScore: round(studentScore),
          weightPercentage: round(weight * 100),
          weightedContribution: round(contributionScore, 1),
          status,
          explanation: explanationText,
        });
      }
    });

    // Overall Academic Component
    if (academicAvailable) {
      explanations.push({
        factor: "Overall Academic Core",
        category: "Academic Strength",
        inputValue: `${round(finalAcademicScore)}%`,
        normalizedScore: round(finalAcademicScore),
        weightPercentage: round(effectiveAcademicWeight * 100),
        weightedContribution: round(finalAcademicScore * effectiveAcademicWeight, 1),
        status: finalAcademicScore >= 75 ? "Strong Positive" : finalAcademicScore >= 60 ? "Positive" : "Development Area",
        explanation: `Weighted score across required domain subjects for ${profile.name}.`,
      });
    }

    // Interest Component
    if (interestAvailable && finalInterestScore !== null) {
      explanations.push({
        factor: "Interest Alignment",
        category: "Interest Alignment",
        inputValue: `${round(finalInterestScore)}%`,
        normalizedScore: round(finalInterestScore),
        weightPercentage: round(effectiveInterestWeight * 100),
        weightedContribution: round(finalInterestScore * effectiveInterestWeight, 1),
        status: finalInterestScore >= 75 ? "Strong Positive" : finalInterestScore >= 50 ? "Positive" : "Neutral",
        explanation: `Alignment with ${profile.category} interest domains (${profile.interest_categories.join(", ")}).`,
      });
    }

    // Skills Component
    if (skillsAvailable && finalSkillScore !== null) {
      explanations.push({
        factor: "Demonstrated Skills",
        category: "Skill & Aptitude",
        inputValue: `${round(finalSkillScore)}%`,
        normalizedScore: round(finalSkillScore),
        weightPercentage: round(effectiveSkillWeight * 100),
        weightedContribution: round(finalSkillScore * effectiveSkillWeight, 1),
        status: finalSkillScore >= 70 ? "Strong Positive" : "Positive",
        explanation: `Evaluated against core skills: ${profile.required_skills.slice(0, 3).join(", ")}.`,
      });
    }

    // 9. Personalized Stream Guidance
    let personalizedStreamGuidance: string | undefined = undefined;
    const mathScore = subjectMap["Mathematics"];
    const accountsScore = subjectMap["Accountancy"];
    const bioScore = subjectMap["Biology"];

    if (accountsScore !== undefined && mathScore !== undefined && mathScore >= 75 && (profile.category === "Technology" || profile.category === "Finance")) {
      personalizedStreamGuidance = `Your strong Mathematics score (${mathScore}%) combined with Commerce background makes quantitative finance (CA/CFA/Financial Analyst) as well as data-oriented computing pathways (BCA/B.Sc Data Science) highly viable options.`;
    } else if (bioScore !== undefined && profile.category === "Medical") {
      personalizedStreamGuidance = `Your Biology foundation (${bioScore}%) directly supports medical sciences. In addition to MBBS/BDS, explore allied health avenues like Biotechnology, Pharmacy (B.Pharm), and Physiotherapy (BPT).`;
    } else if (mathScore !== undefined && mathScore >= 75 && profile.category === "Engineering") {
      personalizedStreamGuidance = `Your Mathematics proficiency (${mathScore}%) provides the core analytical foundation for engineering disciplines. Prepare for entrance gateways like JEE Main and State CETs.`;
    }

    // 10. Statistical Data Confidence (Reflecting completeness without false certainty)
    const completenessFactor =
      (totalWeight > 0 ? 0.35 : 0.15) +
      (interestAvailable ? 0.25 : 0) +
      (skillsAvailable ? 0.20 : 0) +
      (aptitudeAvailable ? 0.10 : 0) +
      (subjects.length >= 4 ? 0.10 : 0.05);

    const confidence = round(clamp(0.40 + completenessFactor * 0.55, 0.40, 0.95), 2);

    return {
      career: profile.name,
      category: profile.category,
      compatibility_score: compositeScore,
      confidence,
      components: {
        academic: {
          score: round(finalAcademicScore),
          base_weight: weights.academic,
          effective_weight: effectiveAcademicWeight,
          available: academicAvailable,
        },
        interest: {
          score: finalInterestScore !== null ? round(finalInterestScore) : null,
          base_weight: weights.interest,
          effective_weight: effectiveInterestWeight,
          available: interestAvailable,
        },
        skills: {
          score: finalSkillScore !== null ? round(finalSkillScore) : null,
          base_weight: weights.skills,
          effective_weight: effectiveSkillWeight,
          available: skillsAvailable,
        },
        aptitude: {
          score: finalAptitudeScore !== null ? round(finalAptitudeScore) : null,
          base_weight: weights.aptitude,
          effective_weight: effectiveAptitudeWeight,
          available: aptitudeAvailable,
        },
        preferences: {
          score: finalPreferenceScore !== null ? round(finalPreferenceScore) : null,
          base_weight: weights.preferences,
          effective_weight: effectivePreferenceWeight,
          available: preferencesAvailable,
        },
        total_available_weight: round(totalAvailableWeight, 2),
      },
      explanations,
      personalized_stream_guidance: personalizedStreamGuidance,
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
  interests: ScoreMap = {},
  careerMatches: CareerMatch[] = []
): RecommendedStream[] {
  const subjectMap: Record<string, number> = {};
  subjects.forEach((s) => {
    subjectMap[s.canonical_name] = s.percentage;
  });

  const avgSubjectScore =
    subjects.length > 0
      ? subjects.reduce((sum, s) => sum + s.percentage, 0) / subjects.length
      : 70;

  const maths = subjectMap["Mathematics"] ?? avgSubjectScore;
  const science =
    subjectMap["Science"] ??
    ((subjectMap["Physics"] ?? avgSubjectScore) +
      (subjectMap["Chemistry"] ?? avgSubjectScore) +
      (subjectMap["Biology"] ?? avgSubjectScore)) /
      3;
  const english = subjectMap["English"] ?? avgSubjectScore;
  const socSci =
    subjectMap["Social Science"] ??
    ((subjectMap["History"] ?? avgSubjectScore) +
      (subjectMap["Political Science"] ?? avgSubjectScore) +
      (subjectMap["Geography"] ?? avgSubjectScore)) /
      3;

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
        `Quantitative foundations (Maths: ${maths}%)`,
        `Empirical physics & physical science readiness (${science}%)`,
        "Direct alignment with computing, engineering, defense, and architecture pathways",
      ],
      suitability: "Science with Physics, Chemistry, and Mathematics (PCM) is the premier gateway for technology, engineering, architecture, and aviation. Your analytical problem-solving marks demonstrate direct aptitude for competitive STEM curricula (JEE Main, Advanced, and technical entrance examinations).",
    },
    {
      name: "Science (PCB)",
      subjects: ["Physics", "Chemistry", "Biology", "English", "Psychology / Biotechnology"],
      careers: ["Doctor (MBBS)", "Dentist", "Biotechnologist", "Pharmacist", "Nurse", "Nutritionist / Dietitian"],
      score: round(science * 0.50 + english * 0.25 + (subjectMap["Biology"] ?? science) * 0.25),
      reasons: [
        `High affinity for natural and biological sciences (${science}%)`,
        "Direct prerequisite for medical, dental, clinical, and biotechnology degrees (NEET-UG)",
        "Strong foundation for life sciences research and healthcare leadership",
      ],
      suitability: "Science with Physics, Chemistry, and Biology (PCB) is the dedicated pathway for clinical medicine, dental surgery, pharmacy, and allied health sciences. Your scientific curiosity and disciplined study habits align with this intensive, high-impact curriculum.",
    },
    {
      name: "Science (PCMB)",
      subjects: ["Physics", "Chemistry", "Mathematics", "Biology", "English"],
      careers: ["Biomedical Engineer", "Bioinformatician", "Biotechnologist", "Research Scientist", "Pharmaceutical Developer"],
      score: round(maths * 0.35 + science * 0.45 + english * 0.20),
      reasons: [
        "Offers maximum academic versatility across both Engineering and Medical spheres",
        `Balanced proficiency in mathematical and biological disciplines (Maths: ${maths}%, Science: ${science}%)`,
        "Direct preparation for interdisciplinary frontiers such as Bioinformatics and Genetic Engineering",
      ],
      suitability: "Science with PCMB provides the most versatile foundation in secondary education, leaving all technical, biological, and research options fully open for future specialization.",
    },
    {
      name: "Commerce",
      subjects: ["Accountancy", "Business Studies", "Economics", "English", "Mathematics / Applied Mathematics"],
      careers: ["Chartered Accountant (CA)", "Investment Banker", "Financial Analyst", "Business Analyst", "Marketing Manager", "Entrepreneur"],
      score: round(maths * 0.35 + english * 0.35 + socSci * 0.30),
      reasons: [
        `Analytical and quantitative modeling skills (Maths: ${maths}%)`,
        "Direct foundation for premier professional certifications: CA (ICAI), CFA, CS, and CMA",
        "Direct fit with corporate finance, capital markets, business management, and entrepreneurship",
      ],
      suitability: "Commerce is the optimal stream for finance, corporate leadership, banking, accounting, and economic policy. Your analytical and verbal balance indicates high readiness for business and commercial enterprises.",
    },
    {
      name: "Arts & Humanities",
      subjects: ["History", "Geography", "Political Science", "Psychology", "Sociology", "English", "Legal Studies"],
      careers: ["Civil Services (IAS/IPS/IFS)", "Corporate Lawyer", "Psychologist / Counselor", "Graphic/UX Designer", "Journalist", "Public Policy Specialist"],
      score: round(socSci * 0.50 + english * 0.35 + maths * 0.15),
      reasons: [
        `Strong social reasoning, literacy, and conceptual articulation (Social Science: ${socSci}%, English: ${english}%)`,
        "Direct syllabus synergy with Civil Services (UPSC), State Public Services, and Public Administration",
        "Premier foundation for 5-Year Integrated Law (CLAT), Design (NID/UCEED), Psychology, and Media",
      ],
      suitability: "Arts & Humanities provide a rich intellectual foundation spanning governance, constitutional law, human behavior, visual design, and communication.",
    },
  ];

  // Boost stream scores based on matched careers
  streams.forEach((st) => {
    const matchedCount = st.careers.filter((c) => topCareers.includes(c)).length;
    st.score = clamp(st.score + matchedCount * 3, 0, 99);
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

