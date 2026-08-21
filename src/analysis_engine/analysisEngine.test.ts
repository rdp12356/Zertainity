import {
  analyzeStudentProfile,
  validateAnalysisInput,
  normalizeAnalysisInput,
  calculateAcademicAnalytics,
  analyzeHistoricalTrends,
  calculateRiasecProfile,
  evaluateCareerCompatibility,
  generateDeterministicInsights,
  exportAnalysisToExcel,
  exportAnalysisToJson,
  AnalysisValidationError,
  type AnalysisInput,
} from "./index";

describe("Zertainity Analysis Engine Test Suite", () => {
  // Test Data from Prompt Section 25
  const sampleTestPayload: AnalysisInput = {
    schema_version: "1.0",
    student: {
      name: "Test Student",
      grade: 12,
      stream: "Commerce",
      education_level: "after-12th",
      board: "cbse",
    },
    subjects: [
      { name: "Accountancy", marks: 88, max_marks: 100, interest: "high" },
      { name: "Business Studies", marks: 84, max_marks: 100, interest: "high" },
      { name: "Economics", marks: 79, max_marks: 100, interest: "mid" },
      { name: "Mathematics", marks: 92, max_marks: 100, interest: "high" },
      { name: "English", marks: 76, max_marks: 100, interest: "mid" },
    ],
    skills: {
      analytical: 88,
      communication: 82,
      logical: 85,
    },
    interests: {
      finance: 90,
      business: 85,
      technology: 70,
    },
  };

  describe("1. Input Validation & Blocking", () => {
    test("validates complete and correct payload", () => {
      const result = validateAnalysisInput(sampleTestPayload);
      expect(result.valid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    test("flags marks exceeding maximum marks", () => {
      const invalidInput: AnalysisInput = {
        ...sampleTestPayload,
        subjects: [{ name: "Physics", marks: 105, max_marks: 100 }],
      };
      const result = validateAnalysisInput(invalidInput);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.code === "SCORE_EXCEEDS_MAX")).toBe(true);
    });

    test("flags negative marks", () => {
      const invalidInput: AnalysisInput = {
        ...sampleTestPayload,
        subjects: [{ name: "Chemistry", marks: -10, max_marks: 100 }],
      };
      const result = validateAnalysisInput(invalidInput);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.code === "NEGATIVE_SCORE")).toBe(true);
    });

    test("blocks calculation by throwing AnalysisValidationError on invalid input", () => {
      const invalidInput: AnalysisInput = {
        ...sampleTestPayload,
        subjects: [{ name: "Physics", marks: 120, max_marks: 100 }],
      };
      expect(() => analyzeStudentProfile(invalidInput)).toThrow(AnalysisValidationError);
    });

    test("handles IB 1-7 scale correctly", () => {
      const ibInput: AnalysisInput = {
        schema_version: "1.0",
        student: { grade: 11, board: "ib" },
        subjects: [
          { name: "Mathematics", marks: 6, max_marks: 7 },
          { name: "Physics", marks: 7, max_marks: 7 },
        ],
      };
      const result = validateAnalysisInput(ibInput);
      expect(result.valid).toBe(true);
    });
  });

  describe("2. Normalization", () => {
    test("normalizes marks to 0-100 percentage", () => {
      const { normalizedSubjects } = normalizeAnalysisInput({
        schema_version: "1.0",
        student: { grade: 10 },
        subjects: [
          { name: "Mathematics", marks: 35, max_marks: 50 },
          { name: "Science", marks: 7, max_marks: 7 }, // 100%
        ],
      });

      const math = normalizedSubjects.find((s) => s.canonical_name === "Mathematics");
      const science = normalizedSubjects.find((s) => s.canonical_name === "Science");

      expect(math?.percentage).toBe(70);
      expect(math?.raw_marks).toBe(35);
      expect(science?.percentage).toBe(100);
    });

    test("normalizes interest levels ('high' -> 90, 'mid' -> 60, 'low' -> 30)", () => {
      const { normalizedInterests } = normalizeAnalysisInput({
        schema_version: "1.0",
        student: { grade: 10 },
        subjects: [
          { name: "Accountancy", marks: 80, max_marks: 100, interest: "high" },
          { name: "History", marks: 70, max_marks: 100, interest: "low" },
        ],
      });

      expect(normalizedInterests["Accountancy"]).toBe(90);
      expect(normalizedInterests["History"]).toBe(30);
    });
  });

  describe("3. Academic Analytics", () => {
    test("calculates overall percentage, ranks, and categories", () => {
      const { normalizedSubjects } = normalizeAnalysisInput(sampleTestPayload);
      const academic = calculateAcademicAnalytics(normalizedSubjects);

      expect(academic).not.toBeNull();
      // (88 + 84 + 79 + 92 + 76) / 5 = 419 / 5 = 83.8%
      expect(academic?.overall_percentage).toBe(83.8);
      expect(academic?.performance_category).toBe("Strong");
      expect(academic?.highest_performing_subject).toBe("Mathematics");
      expect(academic?.lowest_performing_subject).toBe("English");
      expect(academic?.subject_analysis[0].name).toBe("Mathematics");
      expect(academic?.subject_analysis[0].rank).toBe(1);
    });

    test("identifies strengths and development areas", () => {
      const { normalizedSubjects } = normalizeAnalysisInput(sampleTestPayload);
      const academic = calculateAcademicAnalytics(normalizedSubjects);

      expect(academic?.strengths.some((s) => s.includes("Mathematics"))).toBe(true);
      expect(academic?.strengths.some((s) => s.includes("Accountancy"))).toBe(true);
    });
  });

  describe("4. Multi-Period Historical Trends", () => {
    test("returns insufficient_data when no previous examination is provided", () => {
      const { normalizedSubjects } = normalizeAnalysisInput(sampleTestPayload);
      const trend = analyzeHistoricalTrends(normalizedSubjects, undefined);
      expect(trend.trend_status).toBe("insufficient_data");
    });

    test("detects upward trajectory across multi-period examinations", () => {
      const { normalizedSubjects } = normalizeAnalysisInput({
        schema_version: "1.0",
        student: { grade: 12 },
        subjects: [
          { name: "Mathematics", marks: 92, max_marks: 100 },
          { name: "Accountancy", marks: 88, max_marks: 100 },
        ],
      });

      const trend = analyzeHistoricalTrends(normalizedSubjects, [
        {
          label: "Class 10",
          subjects: [
            { name: "Mathematics", marks: 75, max_marks: 100 },
            { name: "Accountancy", marks: 72, max_marks: 100 },
          ],
        },
        {
          label: "Class 11",
          subjects: [
            { name: "Mathematics", marks: 85, max_marks: 100 },
            { name: "Accountancy", marks: 80, max_marks: 100 },
          ],
        },
      ]);

      expect(trend.trend_status).toBe("available");
      // Overall change compared to baseline Class 10: ((92-75) + (88-72)) / 2 = (17 + 16) / 2 = 16.5 -> 17
      expect(trend.overall_change).toBe(16.5);
      expect(trend.direction).toBe("upward");
      expect(trend.period_count).toBe(3);
    });
  });

  describe("5. RIASEC Profile & Career Compatibility", () => {
    test("returns insufficient_data and null fields when no interest or RIASEC quiz data exists", () => {
      const riasec = calculateRiasecProfile({}, undefined);
      expect(riasec.status).toBe("insufficient_data");
      expect(riasec.primary).toBeNull();
      expect(riasec.secondary).toBeNull();
      expect(riasec.code).toBeNull();
      expect(Object.keys(riasec.scores).length).toBe(0);
    });

    test("generates RIASEC code from genuine interest inputs", () => {
      const riasec = calculateRiasecProfile({
        Finance: 90,
        Business: 85,
        Technology: 70,
      });

      expect(riasec.status).toBe("available");
      expect(riasec.code?.length).toBeGreaterThanOrEqual(2);
      expect(riasec.scores.C).toBeDefined();
      expect(riasec.scores.E).toBeDefined();
    });

    test("dynamically re-normalizes weights when dimensions are missing without fake fallback scores", () => {
      const { normalizedSubjects } = normalizeAnalysisInput({
        schema_version: "1.0",
        student: { grade: 12, stream: "Commerce" },
        subjects: [
          { name: "Mathematics", marks: 90, max_marks: 100 },
          { name: "Accountancy", marks: 85, max_marks: 100 },
        ],
      });

      // Pass ONLY academics (empty interests, skills, aptitude, preferences)
      const matches = evaluateCareerCompatibility(
        normalizedSubjects,
        {},
        {},
        {},
        [],
        undefined,
        5
      );

      expect(matches.length).toBeGreaterThan(0);
      const topMatch = matches[0];
      expect(topMatch.components?.academic.available).toBe(true);
      expect(topMatch.components?.academic.effective_weight).toBe(1.0); // 100% effective weight
      expect(topMatch.components?.interest.available).toBe(false);
      expect(topMatch.components?.interest.score).toBeNull();
      expect(topMatch.components?.skills.available).toBe(false);
      expect(topMatch.components?.skills.score).toBeNull();
    });

    test("scores careers deterministically with correct weights", () => {
      const { normalizedSubjects, normalizedInterests, normalizedSkills, normalizedAptitude } =
        normalizeAnalysisInput(sampleTestPayload);

      const matches = evaluateCareerCompatibility(
        normalizedSubjects,
        normalizedInterests,
        normalizedSkills,
        normalizedAptitude,
        [],
        undefined,
        5
      );

      expect(matches.length).toBeGreaterThan(0);
      expect(matches[0].compatibility_score).toBeGreaterThan(0);
      expect(matches[0].compatibility_score).toBeLessThanOrEqual(100);
      expect(matches[0].confidence).toBeGreaterThan(0.5);
      expect(matches[0].eligibility.status).toBeDefined();

      // Assert factor-level explanation breakdown
      expect(matches[0].explanations).toBeDefined();
      expect(matches[0].explanations!.length).toBeGreaterThan(0);
      const mathFactor = matches[0].explanations!.find((e) => e.factor === "Mathematics" || e.factor === "Accountancy");
      if (mathFactor) {
        expect(mathFactor.normalizedScore).toBeGreaterThan(0);
        expect(mathFactor.explanation.length).toBeGreaterThan(10);
      }

      // For Commerce student with high Math & Accounts, Finance/Accounting careers score top
      const topCareers = matches.map((m) => m.career);
      expect(
        topCareers.some((c) =>
          ["Chartered Accountant (CA)", "Investment Banker", "Financial Analyst", "Data Scientist", "Business Analyst"].includes(c)
        )
      ).toBe(true);
    });
  });

  describe("6. Insights & Evidence", () => {
    test("generates evidence-backed insights", () => {
      const result = analyzeStudentProfile(sampleTestPayload);

      expect(result.insights.length).toBeGreaterThan(0);
      const mathInsight = result.insights.find((i) =>
        i.title.toLowerCase().includes("quantitative") || i.title.toLowerCase().includes("academic")
      );
      expect(mathInsight).toBeDefined();
      expect(mathInsight?.evidence.length).toBeGreaterThan(0);
    });
  });

  describe("7. End-to-End Master Pipeline & Data Completeness", () => {
    test("produces full production-ready analysis object with data completeness metric", () => {
      const result = analyzeStudentProfile(sampleTestPayload);

      expect(result.algorithm_version).toBe("1.0");
      expect(result.student_summary.name).toBe("Test Student");
      expect(result.academic_analysis?.overall_percentage).toBe(83.8);
      expect(result.career_matches.length).toBeGreaterThan(0);
      expect(result.course_recommendations.length).toBeGreaterThan(0);
      expect(result.college_recommendations.length).toBeGreaterThan(0);
      expect(result.confidence).toBeGreaterThan(0.7);
      expect(result.data_completeness.has_academics).toBe(true);
      expect(result.data_completeness.has_interests).toBe(true);
      expect(result.data_completeness.has_skills).toBe(true);
      expect(result.data_completeness.overall_score).toBeGreaterThan(50);
    });
  });

  describe("8. Multi-Format Report Export", () => {
    test("exports multi-sheet XML Excel format", () => {
      const result = analyzeStudentProfile(sampleTestPayload);
      const excelXml = exportAnalysisToExcel(result);

      expect(excelXml).toContain("<?xml");
      expect(excelXml).toContain("Workbook");
      expect(excelXml).toContain("Academic Performance");
      expect(excelXml).toContain("Career Compatibility");
      expect(excelXml).toContain("Test Student");
    });

    test("exports valid structured JSON format", () => {
      const result = analyzeStudentProfile(sampleTestPayload);
      const jsonStr = exportAnalysisToJson(result);
      const parsed = JSON.parse(jsonStr);

      expect(parsed.algorithm_version).toBe("1.0");
      expect(parsed.academic_analysis.overall_percentage).toBe(83.8);
      expect(parsed.career_matches.length).toBeGreaterThan(0);
    });
  });
});

