import type { AnalysisInput, ValidationIssue, ValidationResult } from "./types";

export function validateAnalysisInput(input: AnalysisInput): ValidationResult {
  const errors: ValidationIssue[] = [];
  const warnings: string[] = [];

  if (!input) {
    return {
      valid: false,
      errors: [{ path: "root", code: "REQUIRED", message: "Analysis input payload is required." }],
      warnings: [],
    };
  }

  // Student Validation
  if (!input.student) {
    errors.push({ path: "student", code: "REQUIRED", message: "Student information is required." });
  } else {
    if (input.student.grade !== undefined) {
      if (typeof input.student.grade !== "number" || isNaN(input.student.grade) || input.student.grade < 1 || input.student.grade > 12) {
        errors.push({ path: "student.grade", code: "INVALID_RANGE", message: "Student grade must be an integer between 1 and 12." });
      }
    }
  }

  // Attendance Validation
  if (input.attendance !== undefined && input.attendance !== null) {
    if (typeof input.attendance !== "number" || isNaN(input.attendance) || input.attendance < 0 || input.attendance > 100) {
      errors.push({ path: "attendance", code: "INVALID_RANGE", message: "Attendance percentage must be between 0 and 100." });
    }
  }

  // Subjects Validation
  if (!Array.isArray(input.subjects) || input.subjects.length === 0) {
    errors.push({ path: "subjects", code: "MIN_ITEMS", message: "At least one subject score is required for academic analysis." });
  } else {
    const seenSubjects = new Set<string>();
    const board = input.student?.board?.toLowerCase();
    const isIb = board === "ib";

    input.subjects.forEach((subj, idx) => {
      const path = `subjects[${idx}]`;
      if (!subj || typeof subj !== "object") {
        errors.push({ path, code: "INVALID_TYPE", message: "Subject entry must be an object." });
        return;
      }

      const name = typeof subj.name === "string" ? subj.name.trim() : "";
      if (!name) {
        errors.push({ path: `${path}.name`, code: "EMPTY_NAME", message: "Subject name is required." });
      } else {
        const lower = name.toLowerCase();
        if (seenSubjects.has(lower)) {
          warnings.push(`Duplicate subject detected: "${name}". Scores will be averaged.`);
        }
        seenSubjects.add(lower);
      }

      const rawMarks = typeof subj.marks === "number" ? subj.marks : parseFloat(String(subj.marks ?? ""));
      const rawMax = typeof subj.max_marks === "number" ? subj.max_marks : parseFloat(String(subj.max_marks ?? ""));

      if (isNaN(rawMarks)) {
        errors.push({ path: `${path}.marks`, code: "INVALID_SCORE", message: `Marks for "${name || 'Subject'}" must be a valid number.` });
      } else if (rawMarks < 0) {
        errors.push({ path: `${path}.marks`, code: "NEGATIVE_SCORE", message: `Marks for "${name || 'Subject'}" cannot be negative.` });
      }

      if (isNaN(rawMax) || rawMax <= 0) {
        errors.push({ path: `${path}.max_marks`, code: "INVALID_MAX", message: `Maximum marks for "${name || 'Subject'}" must be greater than 0.` });
      } else if (!isNaN(rawMarks) && rawMarks > rawMax) {
        errors.push({ path: `${path}.marks`, code: "SCORE_EXCEEDS_MAX", message: `Marks (${rawMarks}) cannot exceed maximum marks (${rawMax}) for "${name}".` });
      }

      if (isIb && rawMax === 7 && (rawMarks < 1 || rawMarks > 7)) {
        errors.push({ path: `${path}.marks`, code: "IB_SCALE_MISMATCH", message: `IB scores on a 7-point scale must be between 1 and 7 for "${name}".` });
      }
    });
  }

  // Previous Examinations Validation
  if (input.previous_examinations && Array.isArray(input.previous_examinations)) {
    input.previous_examinations.forEach((exam, examIdx) => {
      if (!exam.subjects || !Array.isArray(exam.subjects)) return;
      exam.subjects.forEach((subj, subjIdx) => {
        const path = `previous_examinations[${examIdx}].subjects[${subjIdx}]`;
        const rawMarks = typeof subj.marks === "number" ? subj.marks : parseFloat(String(subj.marks ?? ""));
        const rawMax = typeof subj.max_marks === "number" ? subj.max_marks : parseFloat(String(subj.max_marks ?? ""));

        if (isNaN(rawMarks) || rawMarks < 0) {
          errors.push({ path: `${path}.marks`, code: "INVALID_SCORE", message: `Historical marks for "${subj.name || 'Subject'}" must be a valid non-negative number.` });
        }
        if (isNaN(rawMax) || rawMax <= 0) {
          errors.push({ path: `${path}.max_marks`, code: "INVALID_MAX", message: `Historical max marks for "${subj.name || 'Subject'}" must be greater than 0.` });
        } else if (!isNaN(rawMarks) && rawMarks > rawMax) {
          errors.push({ path: `${path}.marks`, code: "SCORE_EXCEEDS_MAX", message: `Historical marks (${rawMarks}) exceed max marks (${rawMax}) for "${subj.name}".` });
        }
      });
    });
  }

  // Skills & Interests Validation
  const validateScoreMap = (map: Record<string, number> | undefined, field: string) => {
    if (!map) return;
    Object.entries(map).forEach(([key, val]) => {
      if (typeof val !== "number" || isNaN(val) || val < 0 || val > 100) {
        errors.push({ path: `${field}.${key}`, code: "INVALID_SCORE", message: `Score for ${field} "${key}" must be between 0 and 100.` });
      }
    });
  };

  validateScoreMap(input.skills, "skills");
  validateScoreMap(input.interests, "interests");
  validateScoreMap(input.aptitude, "aptitude");

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
