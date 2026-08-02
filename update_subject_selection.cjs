const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src', 'pages', 'SubjectSelection.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Update BoardType
content = content.replace(/type BoardType = "cbse" \| "icse";/g, 'type BoardType = "cbse" | "icse" | "ib";');

// 2. Add IB_GRADES
const ibGrades = `
export const IB_GRADES = [
    { grade: "7", range: "Excellent", remark: "Outstanding Performance" },
    { grade: "6", range: "Very Good", remark: "High Level of Competence" },
    { grade: "5", range: "Good", remark: "Good Understanding" },
    { grade: "4", range: "Satisfactory", remark: "Basic Competence" },
    { grade: "3", range: "Mediocre", remark: "Limited Understanding" },
    { grade: "2", range: "Poor", remark: "Very Limited" },
    { grade: "1", range: "Very Poor", remark: "Minimal" },
];
`;
if (!content.includes('IB_GRADES')) {
    content = content.replace('export const ICSE_GRADES = [', ibGrades + '\nexport const ICSE_GRADES = [');
}

// 3. Add IB Subject Groups
const ibGroups = `
const ibGroupsTemplate: SubjectGroup[] = [
    {
        id: "group1",
        label: "Group 1: Studies in Language & Literature",
        icon: Languages,
        color: "text-indigo-600",
        subjects: [
            { id: "ib-eng-lit", name: "English A: Literature", icon: BookOpen, career: "Literature, Media, Law" },
            { id: "ib-eng-langlit", name: "English A: Language and Literature", icon: BookOpen, career: "Communications, Journalism" },
        ],
    },
    {
        id: "group2",
        label: "Group 2: Language Acquisition",
        icon: Languages,
        color: "text-blue-600",
        subjects: [
            { id: "ib-french-b", name: "French B", icon: Languages, career: "Diplomacy, International Business" },
            { id: "ib-spanish-b", name: "Spanish B", icon: Languages, career: "International Relations" },
            { id: "ib-hindi-b", name: "Hindi B", icon: Languages, career: "Regional Business, Media" },
        ],
    },
    {
        id: "group3",
        label: "Group 3: Individuals and Societies",
        icon: Globe,
        color: "text-emerald-600",
        subjects: [
            { id: "ib-history", name: "History", icon: Globe, career: "Law, Politics, Academia" },
            { id: "ib-eco", name: "Economics", icon: TrendingUp, career: "Finance, Consulting" },
            { id: "ib-busman", name: "Business Management", icon: Briefcase, career: "Entrepreneurship, Corporate Management" },
            { id: "ib-psych", name: "Psychology", icon: Users, career: "Therapy, HR, Marketing" },
        ],
    },
    {
        id: "group4",
        label: "Group 4: Sciences",
        icon: FlaskConical,
        color: "text-amber-600",
        subjects: [
            { id: "ib-physics", name: "Physics", icon: Atom, career: "Engineering, Technology" },
            { id: "ib-chem", name: "Chemistry", icon: FlaskConical, career: "Medicine, Chemical Engineering" },
            { id: "ib-bio", name: "Biology", icon: Leaf, career: "Medicine, Biotechnology" },
            { id: "ib-cs", name: "Computer Science", icon: Monitor, career: "Software Engineering, AI" },
        ],
    },
    {
        id: "group5",
        label: "Group 5: Mathematics",
        icon: Calculator,
        color: "text-purple-600",
        subjects: [
            { id: "ib-math-aa", name: "Mathematics: Analysis and Approaches", icon: Calculator, career: "Engineering, Physics, Pure Math" },
            { id: "ib-math-ai", name: "Mathematics: Applications and Interpretation", icon: Calculator, career: "Social Sciences, Statistics, Business" },
        ],
    },
    {
        id: "group6",
        label: "Group 6: The Arts",
        icon: Palette,
        color: "text-pink-600",
        subjects: [
            { id: "ib-visarts", name: "Visual Arts", icon: Palette, career: "Design, Architecture, Fine Arts" },
            { id: "ib-music", name: "Music", icon: Music, career: "Performance, Music Production" },
        ],
    }
];
const getIbGroupsForGrade = (grade: number) => { return ibGroupsTemplate; };
`;
if (!content.includes('ibGroupsTemplate')) {
    content = content.replace('// STREAM COMBO SUGGESTIONS', ibGroups + '\n// STREAM COMBO SUGGESTIONS');
}

// 4. Update the logic that returns groups based on board
content = content.replace(
    /return board === "cbse" \? getCbseGroupsForGrade\(gradeNum\) : getIcseGroupsForGrade\(gradeNum\);/g,
    'return board === "ib" ? getIbGroupsForGrade(gradeNum) : board === "cbse" ? getCbseGroupsForGrade(gradeNum) : getIcseGroupsForGrade(gradeNum);'
);

// 5. Update gradingData
content = content.replace(
    /const gradingData = board === "cbse" \? CBSE_GRADES : ICSE_GRADES;/g,
    'const gradingData = board === "ib" ? IB_GRADES : board === "cbse" ? CBSE_GRADES : ICSE_GRADES;'
);

// 6. Update board toggle rendering
content = content.replace(
    /\{\(\["cbse", "icse"\] as BoardType\[\]\)\.map\(\(b\) => \(/g,
    '{(["cbse", "icse", "ib"] as BoardType[]).map((b) => ('
);

// 7. Update grading scale title
content = content.replace(
    /board === "cbse" \? "CBSE Grading Scale \(Positional\)" : "ICSE\/ISC Grading Scale"/g,
    'board === "ib" ? "IB Grading Scale (1-7)" : board === "cbse" ? "CBSE Grading Scale (Positional)" : "ICSE/ISC Grading Scale"'
);

// 8. Add IB to curriculum text
content = content.replace(
    /official \{board === "cbse" \? "CBSE" : "CISCE"\} curriculum/g,
    'official {board === "ib" ? "IB" : board === "cbse" ? "CBSE" : "CISCE"} curriculum'
);
content = content.replace(
    /\{board === "cbse" \? "cbseacademic\.nic\.in" : "cisce\.org"\}/g,
    '{board === "ib" ? "ibo.org" : board === "cbse" ? "cbseacademic.nic.in" : "cisce.org"}'
);

fs.writeFileSync(file, content);
console.log("Updated SubjectSelection.tsx");
