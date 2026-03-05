import { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, GraduationCap } from "lucide-react";

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─────────────────────────────────────────────────────────────
// QUESTION BANK  (grade-stratified, multiple Qs per subject)
// ─────────────────────────────────────────────────────────────
type Question = { subject: string; question: string; emoji: string; grades: number[] };

const questionBank: Question[] = [
  // ── MATHEMATICS ──────────────────────────────────────────
  {
    subject: "Mathematics", emoji: "🔢", grades: [1, 2, 3, 4, 5],
    question: "Do you like counting objects and solving number puzzles?"
  },
  {
    subject: "Mathematics", emoji: "📐", grades: [1, 2, 3, 4, 5],
    question: "Do you enjoy drawing shapes and learning about patterns?"
  },
  {
    subject: "Mathematics", emoji: "🧮", grades: [3, 4, 5, 6, 7, 8],
    question: "Do you find it fun to solve addition, subtraction or multiplication problems?"
  },
  {
    subject: "Mathematics", emoji: "📏", grades: [4, 5, 6, 7, 8],
    question: "Do you enjoy measuring things and working with fractions or decimals?"
  },
  {
    subject: "Mathematics", emoji: "📊", grades: [6, 7, 8],
    question: "Are you comfortable reading graphs, charts and working with data?"
  },
  {
    subject: "Mathematics", emoji: "🔢", grades: [7, 8, 9, 10],
    question: "Do you enjoy solving equations and working with algebraic expressions?"
  },
  {
    subject: "Mathematics", emoji: "📐", grades: [9, 10],
    question: "How comfortable are you solving geometry proofs and coordinate problems?"
  },
  {
    subject: "Mathematics", emoji: "∫", grades: [11, 12],
    question: "Do you find calculus (derivatives, integrals) interesting?"
  },
  {
    subject: "Mathematics", emoji: "📈", grades: [11, 12],
    question: "Are you drawn to topics like probability, statistics and matrices?"
  },
  {
    subject: "Mathematics", emoji: "🧩", grades: [9, 10, 11, 12],
    question: "Do you enjoy logical puzzle-solving and number theory?"
  },

  // ── PHYSICS ──────────────────────────────────────────────
  {
    subject: "Physics", emoji: "🔭", grades: [6, 7, 8],
    question: "Are you curious about why things fall, float or move?"
  },
  {
    subject: "Physics", emoji: "💡", grades: [6, 7, 8],
    question: "Do you enjoy experiments with light, sound or electricity?"
  },
  {
    subject: "Physics", emoji: "⚡", grades: [9, 10],
    question: "Are you fascinated by electricity, magnetism and circuits?"
  },
  {
    subject: "Physics", emoji: "🚀", grades: [9, 10],
    question: "Do you enjoy studying motion, forces and laws of physics?"
  },
  {
    subject: "Physics", emoji: "🌌", grades: [11, 12],
    question: "Do topics like optics, waves or modern physics excite you?"
  },
  {
    subject: "Physics", emoji: "⚛️", grades: [11, 12],
    question: "Are you interested in quantum physics, nuclear energy and semiconductors?"
  },

  // ── CHEMISTRY ────────────────────────────────────────────
  {
    subject: "Chemistry", emoji: "🧪", grades: [6, 7, 8],
    question: "Do you enjoy simple experiments like mixing materials and observing reactions?"
  },
  {
    subject: "Chemistry", emoji: "🔬", grades: [8, 9, 10],
    question: "Are you curious about atoms, molecules and what things are made of?"
  },
  {
    subject: "Chemistry", emoji: "🧫", grades: [9, 10],
    question: "Do chemical reactions, acids and bases spark your interest?"
  },
  {
    subject: "Chemistry", emoji: "⚗️", grades: [11, 12],
    question: "Are you interested in organic chemistry, carbon compounds and reaction mechanisms?"
  },
  {
    subject: "Chemistry", emoji: "🧬", grades: [11, 12],
    question: "Do topics like electrochemistry, thermodynamics and equilibrium interest you?"
  },

  // ── BIOLOGY ──────────────────────────────────────────────
  {
    subject: "Biology", emoji: "🌿", grades: [1, 2, 3, 4, 5],
    question: "Do you love learning about plants, animals and nature around you?"
  },
  {
    subject: "Biology", emoji: "🐾", grades: [4, 5, 6, 7, 8],
    question: "Are you curious about how animals live, feed and grow?"
  },
  {
    subject: "Biology", emoji: "🦠", grades: [7, 8, 9, 10],
    question: "Are you interested in cells, microbes and the human body?"
  },
  {
    subject: "Biology", emoji: "🧬", grades: [9, 10],
    question: "Do topics like heredity, genetics and evolution fascinate you?"
  },
  {
    subject: "Biology", emoji: "🫀", grades: [11, 12],
    question: "Do you enjoy studying body systems — circulatory, nervous, reproductive?"
  },
  {
    subject: "Biology", emoji: "🌱", grades: [11, 12],
    question: "Are you interested in plant physiology, ecology and biotechnology?"
  },

  // ── HISTORY ──────────────────────────────────────────────
  {
    subject: "History", emoji: "🏛️", grades: [1, 2, 3, 4, 5],
    question: "Do you like hearing stories about ancient kings, heroes and civilisations?"
  },
  {
    subject: "History", emoji: "📜", grades: [5, 6, 7, 8],
    question: "Do you enjoy learning about medieval empires, battles and historical events?"
  },
  {
    subject: "History", emoji: "🗺️", grades: [8, 9, 10],
    question: "Are you interested in the freedom struggle, colonialism and modern history?"
  },
  {
    subject: "History", emoji: "🏺", grades: [11, 12],
    question: "Do you enjoy analysing primary sources, historical narratives and social movements?"
  },

  // ── GEOGRAPHY ────────────────────────────────────────────
  {
    subject: "Geography", emoji: "🌍", grades: [1, 2, 3, 4, 5],
    question: "Do you enjoy learning about different countries, oceans and continents?"
  },
  {
    subject: "Geography", emoji: "🗺️", grades: [5, 6, 7, 8],
    question: "Are you curious about climate, seasons and natural landforms?"
  },
  {
    subject: "Geography", emoji: "🏔️", grades: [8, 9, 10],
    question: "Do topics like India's geography, rivers and resources interest you?"
  },
  {
    subject: "Geography", emoji: "🌐", grades: [11, 12],
    question: "Are you interested in geopolitics, human geography and environmental issues?"
  },

  // ── POLITICAL SCIENCE ────────────────────────────────────
  {
    subject: "Political Science", emoji: "🏛️", grades: [7, 8, 9, 10],
    question: "Are you interested in how the government and democracy work in India?"
  },
  {
    subject: "Political Science", emoji: "📰", grades: [9, 10],
    question: "Do you follow current affairs, elections and political events?"
  },
  {
    subject: "Political Science", emoji: "⚖️", grades: [11, 12],
    question: "Do you enjoy studying the Constitution, rights and political theory?"
  },

  // ── ECONOMICS ────────────────────────────────────────────
  {
    subject: "Economics", emoji: "📈", grades: [9, 10],
    question: "Do concepts like demand, supply, prices and markets interest you?"
  },
  {
    subject: "Economics", emoji: "💹", grades: [11, 12],
    question: "Are you interested in macroeconomics — GDP, inflation, banking?"
  },
  {
    subject: "Economics", emoji: "💰", grades: [11, 12],
    question: "Do you enjoy studying how economies grow and how money flows?"
  },

  // ── ENGLISH ──────────────────────────────────────────────
  {
    subject: "English", emoji: "📚", grades: [1, 2, 3, 4, 5],
    question: "Do you enjoy reading stories, poems and picture books?"
  },
  {
    subject: "English", emoji: "✍️", grades: [4, 5, 6, 7, 8],
    question: "Do you like writing stories, letters or creative pieces?"
  },
  {
    subject: "English", emoji: "🎭", grades: [7, 8, 9, 10],
    question: "Do you enjoy reading novels, plays and analysing characters?"
  },
  {
    subject: "English", emoji: "📝", grades: [9, 10, 11, 12],
    question: "Are you comfortable writing essays, debates and structured arguments?"
  },
  {
    subject: "English", emoji: "📖", grades: [11, 12],
    question: "Do you enjoy exploring literary themes, poetry and critical analysis?"
  },

  // ── HINDI ────────────────────────────────────────────────
  {
    subject: "Hindi", emoji: "📖", grades: [1, 2, 3, 4, 5],
    question: "Do you like reading and writing in Hindi and listening to Hindi stories?"
  },
  {
    subject: "Hindi", emoji: "🖊️", grades: [5, 6, 7, 8, 9, 10],
    question: "Are you comfortable composing Hindi essays and understanding grammar?"
  },
  {
    subject: "Hindi", emoji: "📜", grades: [9, 10, 11, 12],
    question: "Do you appreciate Hindi literature, poetry and classic texts?"
  },

  // ── COMPUTER SCIENCE ─────────────────────────────────────
  {
    subject: "Computer Science", emoji: "💻", grades: [3, 4, 5, 6, 7, 8],
    question: "Do you enjoy using computers and learning basic coding or Scratch?"
  },
  {
    subject: "Computer Science", emoji: "🖥️", grades: [7, 8, 9, 10],
    question: "Are you interested in programming, web pages and how apps work?"
  },
  {
    subject: "Computer Science", emoji: "⌨️", grades: [11, 12],
    question: "Do you enjoy coding in Python/Java and understanding algorithms?"
  },
  {
    subject: "Computer Science", emoji: "🤖", grades: [11, 12],
    question: "Are you interested in databases, networks and emerging tech like AI?"
  },

  // ── ACCOUNTANCY ──────────────────────────────────────────
  {
    subject: "Accountancy", emoji: "📒", grades: [9, 10],
    question: "Do you enjoy recording and organising financial data methodically?"
  },
  {
    subject: "Accountancy", emoji: "💼", grades: [11, 12],
    question: "Do you enjoy creating balance sheets, ledgers and financial statements?"
  },
  {
    subject: "Accountancy", emoji: "🧾", grades: [11, 12],
    question: "Are you interested in taxation, auditing and managing accounts?"
  },

  // ── BUSINESS STUDIES ─────────────────────────────────────
  {
    subject: "Business Studies", emoji: "🏢", grades: [11, 12],
    question: "Are you interested in how businesses are managed and organised?"
  },
  {
    subject: "Business Studies", emoji: "📣", grades: [11, 12],
    question: "Do topics like marketing, advertising and entrepreneurship excite you?"
  },

  // ── PHYSICAL EDUCATION ───────────────────────────────────
  {
    subject: "Physical Education", emoji: "🏅", grades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    question: "Do you have a passion for sports, fitness or physical activity?"
  },
  {
    subject: "Physical Education", emoji: "🤸", grades: [6, 7, 8, 9, 10],
    question: "Do you enjoy team sports, athletics or yoga classes?"
  },

  // ── SCIENCE (general, lower grades) ─────────────────────
  {
    subject: "Science", emoji: "🔬", grades: [1, 2, 3, 4, 5],
    question: "Do you enjoy simple science experiments and nature observations?"
  },
  {
    subject: "Science", emoji: "🌟", grades: [3, 4, 5, 6],
    question: "Are you curious about the stars, weather and natural phenomena?"
  },

  // ── SOCIAL STUDIES (lower grades) ───────────────────────
  {
    subject: "Social Studies", emoji: "🏘️", grades: [1, 2, 3, 4, 5],
    question: "Do you enjoy learning about your community, family and local places?"
  },
  {
    subject: "Social Studies", emoji: "🌏", grades: [4, 5, 6],
    question: "Are you curious about different cultures, traditions and festivals?"
  },

  // ── ARTS & CRAFT ─────────────────────────────────────────
  {
    subject: "Arts & Craft", emoji: "🎨", grades: [1, 2, 3, 4, 5, 6, 7, 8],
    question: "Do you love drawing, painting, craft or making creative things?"
  },
  {
    subject: "Arts & Craft", emoji: "✏️", grades: [3, 4, 5, 6, 7, 8],
    question: "Do you enjoy art projects and expressing yourself creatively?"
  },
];

// ─────────────────────────────────────────────────────────────
// Grade-to-question selection
// ─────────────────────────────────────────────────────────────
const TOTAL_QUESTIONS = 12;

function pickQuestions(gradeNum: number): Question[] {
  const pool = questionBank.filter((q) => q.grades.includes(gradeNum));
  // Group by subject, pick 1 random per subject, then shuffle
  const bySubject: Record<string, Question[]> = {};
  pool.forEach((q) => {
    if (!bySubject[q.subject]) bySubject[q.subject] = [];
    bySubject[q.subject].push(q);
  });
  // Pick one random question per subject
  const onePerSubject = Object.values(bySubject).map((qs) => qs[Math.floor(Math.random() * qs.length)]);
  const shuffled = shuffle(onePerSubject);
  return shuffled.slice(0, TOTAL_QUESTIONS);
}

// Picks questions, giving priority to subjects that match the student's selected subjects.
// Preferred subjects fill first, padded with other subjects up to TOTAL_QUESTIONS.
function pickQuestionsWithPreference(gradeNum: number, preferredSubjectNames: string[]): Question[] {
  const pool = questionBank.filter((q) => q.grades.includes(gradeNum));
  const bySubject: Record<string, Question[]> = {};
  pool.forEach((q) => {
    if (!bySubject[q.subject]) bySubject[q.subject] = [];
    bySubject[q.subject].push(q);
  });

  const preferred: Question[] = [];
  const rest: Question[] = [];

  const preferredSet = new Set(preferredSubjectNames.map(s => s.toLowerCase()));

  Object.entries(bySubject).forEach(([subject, qs]) => {
    const picked = qs[Math.floor(Math.random() * qs.length)];
    if (preferredSet.has(subject.toLowerCase())) {
      preferred.push(picked);
    } else {
      rest.push(picked);
    }
  });

  // Shuffle both independently
  const shuffledPreferred = shuffle(preferred);
  const shuffledRest = shuffle(rest);

  // Preferred questions first, then fill up from the rest
  return [...shuffledPreferred, ...shuffledRest].slice(0, TOTAL_QUESTIONS);
}


// ─────────────────────────────────────────────────────────────
// Rating scale
// ─────────────────────────────────────────────────────────────
const ratings = [
  { label: "Not at all", value: 1 },
  { label: "A little", value: 2 },
  { label: "Somewhat", value: 3 },
  { label: "Very much", value: 4 },
  { label: "Absolutely!", value: 5 },
];

// ─────────────────────────────────────────────────────────────
// CBSE Stream definitions (for Grades 9–12)
// ─────────────────────────────────────────────────────────────
const streams = {
  science_pcm: {
    name: "Science (PCM)",
    subjects: ["Physics", "Chemistry", "Mathematics", "English", "Computer Science"],
    weights: { Physics: 3, Chemistry: 3, Mathematics: 3, English: 1, "Computer Science": 2 },
    careers: ["Engineering", "Architecture", "Pilot", "Data Scientist", "IT Professional"],
    color: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  },
  science_pcb: {
    name: "Science (PCB)",
    subjects: ["Physics", "Chemistry", "Biology", "English", "Physical Education"],
    weights: { Physics: 2, Chemistry: 3, Biology: 3, English: 1, "Physical Education": 1 },
    careers: ["Doctor", "Nurse", "Biotechnologist", "Pharmacist", "Nutritionist"],
    color: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  },
  commerce: {
    name: "Commerce",
    subjects: ["Accountancy", "Business Studies", "Economics", "English", "Mathematics"],
    weights: { Accountancy: 3, "Business Studies": 3, Economics: 3, English: 1, Mathematics: 2 },
    careers: ["CA", "Banker", "Entrepreneur", "Financial Analyst", "Marketing Manager"],
    color: "bg-amber-500/10 text-amber-700 border-amber-500/20",
  },
  humanities: {
    name: "Humanities / Arts",
    subjects: ["History", "Geography", "Political Science", "Economics", "English"],
    weights: { History: 3, Geography: 2, "Political Science": 3, Economics: 2, English: 2 },
    careers: ["IAS/IPS Officer", "Journalist", "Lawyer", "Social Worker", "Psychologist"],
    color: "bg-purple-500/10 text-purple-700 border-purple-500/20",
  },
};

// Learning domain map for lower grades
const domainMap: Record<string, string> = {
  Mathematics: "STEM & Logic",
  Science: "STEM & Logic",
  Physics: "STEM & Logic",
  Chemistry: "STEM & Logic",
  Biology: "Life Sciences",
  "Computer Science": "Technology",
  English: "Languages & Communication",
  Hindi: "Languages & Communication",
  History: "Social Sciences & Humanities",
  Geography: "Social Sciences & Humanities",
  "Political Science": "Social Sciences & Humanities",
  "Social Studies": "Social Sciences & Humanities",
  Economics: "Business & Finance",
  Accountancy: "Business & Finance",
  "Business Studies": "Business & Finance",
  "Physical Education": "Sports & Wellness",
  "Arts & Craft": "Creative Arts",
};

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────
// Subject-ID to display-name map (for showing selected subjects in results)
const SUBJECT_ID_NAMES: Record<string, string> = {
  english: "English", hindi: "Hindi", maths: "Mathematics", evs: "EVS",
  "third-lang": "Third Language", "art-craft": "Art & Craft", "pe-primary": "Physical Education",
  "music-dance": "Music / Dance", "hindi-a": "Hindi", "maths-std": "Mathematics (Standard)",
  "maths-basic": "Mathematics (Basic)", "science-910": "Science", "soc-sci": "Social Science",
  "social-sci": "Social Science", "computer-ict": "Computer Applications / ICT",
  "art-ed": "Art Education", "health-pe": "Health & PE", "work-ed": "Work Education",
  "third-lang-mid": "Third Language", "eng-lit": "English", sanskrit: "Sanskrit",
  urdu: "Urdu", "other-lang": "Other Language", "comp-apps": "Computer Applications",
  "it-skill": "Information Technology", "home-sci": "Home Science", "elem-biz": "Elements of Business",
  "elem-accounts": "Elements of Accountancy", painting: "Painting", "music-hind": "Music",
  "ncc-910": "NCC", "eng-core": "English Core", "hindi-core": "Hindi Core",
  "other-lang-sr": "Other Language", physics: "Physics", chemistry: "Chemistry",
  "maths-sr": "Mathematics", biology: "Biology", accountancy: "Accountancy",
  "biz-studies": "Business Studies", economics: "Economics", history: "History",
  "pol-sci": "Political Science", geography: "Geography", sociology: "Sociology",
  psychology: "Psychology", philosophy: "Philosophy", "comp-sci": "Computer Science",
  "inf-prac": "Informatics Practices", "applied-maths": "Applied Mathematics",
  "pe-sr": "Physical Education", "home-sci-sr": "Home Science", entrepreneurship: "Entrepreneurship",
  "fine-arts": "Fine Arts", "legal-studies": "Legal Studies", biotech: "Biotechnology",
  "eng-graphics": "Engineering Graphics", multimedia: "Multimedia & Web Tech",
  dance: "Dance", "music-sr": "Music", "ncc-sr": "NCC",
};

// Map subject display names → boostable subject keys used in stream weights
const SUBJECT_NAME_BOOST_MAP: Record<string, string[]> = {
  "Physics": ["Physics"], "Chemistry": ["Chemistry"], "Mathematics": ["Mathematics"],
  "Mathematics (Standard)": ["Mathematics"], "Mathematics (Basic)": ["Mathematics"],
  "Applied Mathematics": ["Mathematics"], "Biology": ["Biology"],
  "Accountancy": ["Accountancy"], "Business Studies": ["Business Studies"],
  "Economics": ["Economics"], "History": ["History"], "Geography": ["Geography"],
  "Political Science": ["Political Science"], "Computer Science": ["Computer Science"],
  "Informatics Practices": ["Computer Science"], "English": ["English"],
  "English Core": ["English"], "Physical Education": ["Physical Education"],
  "Science": ["Physics", "Chemistry", "Biology"], "Social Science": ["History", "Geography"],
};

const SubjectQuiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { grade, stage, selectedSubjects } = (location.state as {
    grade: string;
    stage: string;
    selectedSubjects?: string[];
  }) || { grade: "Grade 10", stage: "classes", selectedSubjects: [] };

  const gradeNum = parseInt(grade.replace(/\D/g, "")) || 10;
  const isHigherGrade = gradeNum >= 9;

  // Convert selected subject IDs → display names for boosting
  const selectedSubjectNames = useMemo(() =>
    (selectedSubjects || []).flatMap(id => {
      if (id.startsWith("custom_")) {
        const namePart = id.replace("custom_", "").replace(/-/g, " ");
        return [namePart.replace(/\b\w/g, l => l.toUpperCase())];
      }
      const name = SUBJECT_ID_NAMES[id];
      return name ? [name] : [];
    }),
    [selectedSubjects]);

  // Boost set: subject keys that should receive extra weight in scoring
  const boostedSubjects = useMemo(() => {
    const boostSet = new Set<string>();
    selectedSubjectNames.forEach(name => {
      const keys = SUBJECT_NAME_BOOST_MAP[name] || [];
      keys.forEach(k => boostSet.add(k));
    });
    return boostSet;
  }, [selectedSubjectNames]);

  // Pick questions, preferring subjects matching selectedSubjectNames
  const [sessionSeed] = useState(() => Math.random());
  const selectedQuestions = useMemo(() => {
    void sessionSeed;
    return pickQuestionsWithPreference(gradeNum, selectedSubjectNames);
  }, [gradeNum, sessionSeed, selectedSubjectNames]);

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const retake = () => {
    setShowResults(false);
    setCurrent(0);
    setAnswers({});
    // force new questions next render by navigating with same state
    navigate("/subject-quiz", { state: { grade, stage }, replace: true });
  };

  const handleAnswer = (value: number) => {
    const qId = current;
    const updated = { ...answers, [qId]: value };
    setAnswers(updated);
    if (current < selectedQuestions.length - 1) {
      setCurrent(current + 1);
    } else {
      setShowResults(true);
    }
  };

  // ── Score calculation ──────────────────────────────────────
  const computeSubjectScores = () => {
    const scores: Record<string, number[]> = {};
    selectedQuestions.forEach((q, idx) => {
      const ans = answers[idx] || 0;
      if (!scores[q.subject]) scores[q.subject] = [];
      scores[q.subject].push(ans);
    });
    const avg: Record<string, number> = {};
    Object.entries(scores).forEach(([sub, vals]) => {
      avg[sub] = vals.reduce((a, b) => a + b, 0) / vals.length;
    });
    return avg;
  };

  const computeStreamScores = (subjectScores: Record<string, number>) =>
    Object.entries(streams).map(([key, stream]) => {
      let total = 0, maxTotal = 0;
      Object.entries(stream.weights).forEach(([sub, weight]) => {
        // Boost weight by 1.6× for subjects the student actually studies
        const multiplier = boostedSubjects.has(sub) ? 1.6 : 1;
        total += (subjectScores[sub] || 0) * weight * multiplier;
        maxTotal += 5 * weight * multiplier;
      });
      return { key, name: stream.name, pct: Math.round((total / maxTotal) * 100), stream };
    }).sort((a, b) => b.pct - a.pct);

  const computeDomainStrengths = (subjectScores: Record<string, number>) => {
    const domainTotals: Record<string, number[]> = {};
    Object.entries(subjectScores).forEach(([sub, score]) => {
      const domain = domainMap[sub] || "Other";
      if (!domainTotals[domain]) domainTotals[domain] = [];
      domainTotals[domain].push(score);
    });
    return Object.entries(domainTotals).map(([domain, vals]) => ({
      domain,
      pct: Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 20),
    })).sort((a, b) => b.pct - a.pct);
  };

  const subjectScores = computeSubjectScores();
  const streamResults = computeStreamScores(subjectScores);
  const domainStrengths = computeDomainStrengths(subjectScores);

  const topSubjects = Object.entries(subjectScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, score]) => ({ name, pct: Math.round(score * 20) }));

  const q = selectedQuestions[current];
  const progress = ((current + 1) / selectedQuestions.length) * 100;

  // ── Results view ───────────────────────────────────────────
  if (showResults) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border/40 bg-card/80 sticky top-0 z-50 backdrop-blur-xl">
          <div className="container mx-auto px-6 py-4 flex items-center gap-3">
            <GraduationCap className="h-6 w-6 text-primary" />
            <h1 className="text-lg font-semibold">Your Subject Strengths</h1>
          </div>
        </header>

        <main className="container mx-auto px-4 py-10 max-w-2xl space-y-6">
          <div className="text-center space-y-1">
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">{grade}</p>
            <h2 className="text-3xl font-bold text-foreground">Here's your profile</h2>
            <p className="text-muted-foreground">Based on your responses, here are your academic strengths</p>
          </div>

          {/* Selected subjects badge row */}
          {selectedSubjectNames.length > 0 && (
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
              <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">Your Selected Subjects</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedSubjectNames.map((name) => (
                  <Badge key={name} variant="secondary" className="text-xs">{name}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Top Subject Strengths */}
          <Card className="border border-border/40">
            <CardHeader>
              <CardTitle className="text-base">Subject Strengths</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {topSubjects.map(({ name, pct }) => (
                <div key={name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{name}</span>
                    <span className="text-muted-foreground">{pct}%</span>
                  </div>
                  <Progress value={pct} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Stream recommendations for Grade 9–12 */}
          {isHigherGrade && (
            <Card className="border border-border/40">
              <CardHeader>
                <CardTitle className="text-base">Recommended Streams for Grade 11–12</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {streamResults.map(({ key, name, pct, stream }, idx) => (
                  <div key={key} className={`rounded-xl p-4 border ${stream.color}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {idx === 0 && <Badge className="text-xs bg-primary text-primary-foreground">Best Match</Badge>}
                        <span className="font-semibold text-sm">{name}</span>
                      </div>
                      <span className="text-sm font-bold">{pct}%</span>
                    </div>
                    <Progress value={pct} className="h-1.5 mb-3" />
                    <div className="flex flex-wrap gap-1">
                      {stream.subjects.slice(0, 4).map((sub) => (
                        <span key={sub} className="text-xs px-2 py-0.5 rounded-full bg-background/60 border border-current/20">{sub}</span>
                      ))}
                    </div>
                    {idx === 0 && (
                      <p className="text-xs mt-2 opacity-80">Careers: {stream.careers.slice(0, 3).join(", ")}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Learning domain strengths for lower grades */}
          {!isHigherGrade && (
            <Card className="border border-border/40">
              <CardHeader>
                <CardTitle className="text-base">Learning Domain Strengths</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {domainStrengths.map(({ domain, pct }) => (
                  <div key={domain} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{domain}</span>
                      <span className="text-muted-foreground">{pct}%</span>
                    </div>
                    <Progress value={pct} className="h-2" />
                  </div>
                ))}
                <p className="text-xs text-muted-foreground pt-2">
                  Focus on your strong domains — these will guide your subject choices in higher classes.
                </p>
              </CardContent>
            </Card>
          )}

          {/* CBSE Subject Sets overview for Grade 9+ */}
          {isHigherGrade && (
            <Card className="border border-border/40">
              <CardHeader>
                <CardTitle className="text-base">CBSE Subject Sets Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                {[
                  { name: "Science (PCM)", desc: "Physics · Chemistry · Mathematics · English · Computer Science / Informatics Practices" },
                  { name: "Science (PCB)", desc: "Physics · Chemistry · Biology · English · Physical Education / Psychology" },
                  { name: "Commerce", desc: "Accountancy · Business Studies · Economics · English · Mathematics / Informatics Practices" },
                  { name: "Humanities / Arts", desc: "History · Geography · Political Science · Economics / Psychology · English" },
                ].map(({ name, desc }) => (
                  <div key={name} className="space-y-1">
                    <p className="font-semibold text-foreground">{name}</p>
                    <p>{desc}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 rounded-full" onClick={retake}>
              Retake Quiz
            </Button>
            <Button className="flex-1 rounded-full" onClick={() => navigate("/")}>
              Back to Home
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // ── Quiz view ──────────────────────────────────────────────
  if (!q) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-card/80 sticky top-0 z-50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-base font-semibold text-foreground">Subject Interest Quiz</h1>
            <p className="text-xs text-muted-foreground">{grade}</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-xl">
        <div className="mb-8 space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Question {current + 1} of {selectedQuestions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="border border-border/40">
          <CardHeader className="text-center pb-4">
            <div className="text-5xl mb-4">{q.emoji}</div>
            <Badge variant="secondary" className="mx-auto mb-3 w-fit text-xs">{q.subject}</Badge>
            <CardTitle className="text-xl font-semibold text-foreground leading-snug">{q.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ratings.map((r) => (
                <button
                  key={r.value}
                  onClick={() => handleAnswer(r.value)}
                  className="w-full flex items-center justify-between px-5 py-3.5 rounded-xl border border-border/60 hover:border-primary/50 hover:bg-primary/5 transition-all text-left group"
                >
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{r.label}</span>
                  <div className="flex gap-1">
                    {Array.from({ length: r.value }).map((_, i) => (
                      <div key={i} className="w-2 h-2 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {current > 0 && (
          <Button variant="ghost" size="sm" className="mt-4 mx-auto flex" onClick={() => setCurrent(current - 1)}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
        )}
      </main>
    </div>
  );
};

export default SubjectQuiz;
