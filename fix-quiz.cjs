const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src', 'pages', 'SubjectQuiz.tsx');
let content = fs.readFileSync(file, 'utf8');

// Find the start and end of pickQuestionsWithPreference
const match = content.match(/function pickQuestionsWithPreference[\s\S]*?if \(preferredQuestions\.length >= TOTAL_QUESTIONS\) {[\s\S]*?return shuffle\(preferredQuestions\)\.slice\(0, TOTAL_QUESTIONS\);\n  }/);

if (match) {
    const replacement = `function pickQuestionsWithPreference(gradeNum: number, preferredSubjectNames: string[]): Question[] {
  let pool = questionBank.filter((q) => q.grades.includes(gradeNum));
  if (pool.length === 0) pool = questionBank;
  
  const prefs = preferredSubjectNames.map(s => s.toLowerCase());
  
  const preferredQuestions = pool.filter(q => {
    const qSub = q.subject.toLowerCase();
    return prefs.some(p => qSub.includes(p) || p.includes(qSub));
  });
  
  if (preferredQuestions.length >= TOTAL_QUESTIONS) {
    return shuffle(preferredQuestions).slice(0, TOTAL_QUESTIONS);
  }
  
  const chosen = shuffle(preferredQuestions);
  const chosenSet = new Set(chosen.map(q => q.question));
  const remainingPool = pool.filter(q => !chosenSet.has(q.question));
  
  const padded = chosen.concat(shuffle(remainingPool));
  return padded.slice(0, TOTAL_QUESTIONS);
}

// -------------------------------------------------------------
// Rating scale
// -------------------------------------------------------------
const ratings = [
  { label: "Not at all", value: 1 },
  { label: "A little", value: 2 },
  { label: "Somewhat", value: 3 },
  { label: "Very much", value: 4 },
  { label: "Absolutely!", value: 5 },
];`;

    content = content.replace(match[0], replacement);
    fs.writeFileSync(file, content);
    console.log("Updated SubjectQuiz.tsx successfully");
} else {
    console.error("Could not find the function block");
}
