const fs = require('fs');
let code = fs.readFileSync('src/lib/assessmentEngine.ts', 'utf8');

// Update AssessmentRecommendation
code = code.replace(
  'sourceBasis: string[];',
  'sourceBasis: string[];\n  topColleges?: string[];\n  recommendedCourses?: string[];'
);

// Update CareerDefinition
code = code.replace(
  'requiredSubjects?: string[]; // Core prerequisites for eligibility check',
  'requiredSubjects?: string[]; // Core prerequisites for eligibility check\n  topColleges?: string[];\n  recommendedCourses?: string[];'
);

// We need to inject dummy data into the return object of assessCareer
code = code.replace(
  'sourceBasis: careerData.sourceBasis ?? ["University board standards & regulatory guidelines"],',
  'sourceBasis: careerData.sourceBasis ?? ["University board standards & regulatory guidelines"],\n        topColleges: careerData.topColleges ?? ["IIT", "NIT", "Local State University", "Top Private College"],\n        recommendedCourses: careerData.recommendedCourses ?? ["B.Tech", "B.Sc", "B.A", "B.Com"],'
);

fs.writeFileSync('src/lib/assessmentEngine.ts', code);
console.log('Updated assessmentEngine.ts');
