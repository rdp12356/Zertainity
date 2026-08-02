const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'src', 'pages', 'SubjectQuiz.tsx');
let content = fs.readFileSync(filePath, 'utf-8');
const newContent = fs.readFileSync(path.join(__dirname, 'new_content.txt'), 'utf-8');

const newBankMatches = newContent.match(/(const questionBank: Question\[\] = \[.*?\];)/s);
const newLogicMatches = newContent.match(/(function pickQuestionsWithPreference.*?\n\})/s);

content = content.replace(/const questionBank: Question\[\].*?\];/s, newBankMatches[1]);
content = content.replace(/function pickQuestionsWithPreference.*?\n\}/s, newLogicMatches[1]);

fs.writeFileSync(filePath, content);
console.log('Successfully replaced content.');

