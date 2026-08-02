const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src', 'lib', 'assessmentEngine.ts');
let content = fs.readFileSync(file, 'utf8');

// 1. Add fields to AssessmentRecommendation
content = content.replace(
    /officialPathways: string\[\];\n  sourceBasis: string\[\];\n\};/g,
    'officialPathways: string[];\n  sourceBasis: string[];\n  courses: string[];\n  topColleges: string[];\n};'
);

// 2. Add fields to CareerDefinition
content = content.replace(
    /officialPathways\?: string\[\];\n  sourceBasis\?: string\[\];\n  requiredSubjects\?: string\[\];/g,
    'officialPathways?: string[];\n  sourceBasis?: string[];\n  requiredSubjects?: string[];\n  courses?: string[];\n  topColleges?: string[];'
);

// 3. Update return in assessCareer
const returnReplacement = `
      const categoryTopColleges: Record<string, string[]> = {
        "Technology": ["IITs (Delhi, Bombay, Madras)", "NITs (Trichy, Surathkal)", "BITS Pilani", "IIIT Hyderabad"],
        "Engineering": ["IITs", "NITs", "BITS Pilani", "Delhi Technological University (DTU)"],
        "Medical": ["AIIMS New Delhi", "CMC Vellore", "AFMC Pune", "JIPMER Puducherry"],
        "Healthcare": ["AIIMS", "Manipal Academy of Higher Education", "Lady Irwin College"],
        "Finance": ["SRCC Delhi", "Christ University", "St. Xavier's College Mumbai", "IIMs (for PG)"],
        "Business": ["IIMs (Indore, Rohtak for BBA/IPM)", "Shaheed Sukhdev College", "NMIMS Mumbai"],
        "Government": ["Delhi University (BA)", "JNU (PG)", "Ashoka University"],
        "Legal": ["NLSIU Bangalore", "NALSAR Hyderabad", "NLU Delhi", "Symbiosis Law School"],
        "Design": ["NID Ahmedabad", "NIFT Delhi", "IDC IIT Bombay", "Srishti Institute"],
        "Aviation": ["IGRUA", "NFTI Gondia", "Bombay Flying Club"]
      };

      const defaultColleges = categoryTopColleges[careerData.category] || ["Delhi University", "Christ University", "Symbiosis International", "Local State Universities"];

      const defaultCourses = careerData.officialPathways 
        ? careerData.officialPathways.map(p => p.split(" ").slice(0, 3).join(" ")) 
        : ["Bachelors Degree in related field"];

      return {
        stream: careerName,
        category: careerData.category,
        match: Math.round(score),
        confidence,
        description,
        reasons,
        careers: [careerName],
        nextSteps: careerData.nextSteps,
        suggestedSubjects: careerData.suggestedSubjects ?? Object.keys(careerData.subjectWeights),
        officialPathways: careerData.officialPathways ?? ["Consult official state board/entrance brochures to verify selection criteria."],
        sourceBasis: careerData.sourceBasis ?? ["University board standards & regulatory guidelines"],
        courses: careerData.courses ?? defaultCourses,
        topColleges: careerData.topColleges ?? defaultColleges,
      };
`;

content = content.replace(
    /return \{\n\s+stream: careerName,[\s\S]*?sourceBasis: careerData\.sourceBasis \?\? \["University board standards & regulatory guidelines"\](?:,\n|\n)\s+\};\n/g,
    returnReplacement + '\n'
);

// 4. Update buildMarksFromSubjectRows
const marksFunctionRegex = /export const buildMarksFromSubjectRows = \(rows: unknown\[\]\) => \{\n  const marks: Record<string, number> = \{\};\n[\s\S]*?return marks;\n\};/g;

const updatedMarksFunction = `export const buildMarksFromSubjectRows = (rows: unknown[], board: string = "cbse") => {
  const marks: Record<string, number> = {};

  rows.forEach((row) => {
    const item = row as Partial<SubjectMarksInput>;
    const subject = typeof item.subject === "string" ? item.subject.trim() : "";
    const score = typeof item.marks === "number" ? item.marks : parseFloat(String(item.marks ?? ""));
    if (!subject || Number.isNaN(score)) return;

    let normalizedScore = clamp(score, 0, 100);
    if (board === 'ib' && score <= 7) {
      normalizedScore = 35 + ((score - 1) * 10);
    }

    const mappedSubjects = subjectAliases[subject] ?? [subject];
    mappedSubjects.forEach((mappedSubject) => {
      marks[mappedSubject] = marks[mappedSubject] === undefined
        ? normalizedScore
        : Math.round(((marks[mappedSubject] + normalizedScore) / 2) * 10) / 10;
    });
  });

  return marks;
};`;

content = content.replace(marksFunctionRegex, updatedMarksFunction);

fs.writeFileSync(file, content);
console.log('Updated assessmentEngine.ts');
