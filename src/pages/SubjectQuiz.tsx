
// -------------------------------------------------------------
// HELPERS
// -------------------------------------------------------------

import { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

import { ArrowLeft, ArrowRight, Check, GraduationCap, Sparkles, Star, Layers, Calculator, Zap, FlaskConical, Dna, Landmark, Globe, Scale, LineChart, BookOpen, Languages, Activity, Microscope, Users, Palette, Frown, Meh, Smile, ThumbsUp, Flame, Download, Brain, Compass, HelpCircle, Target, Trophy, FileText } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useSetCurves } from "@/components/CurvesContext";
import { generatePdfFallback, generatePdfViaSupabase } from "@/utils/pdfGenerator";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// -------------------------------------------------------------
// QUESTION BANK  (grade-stratified, multiple Qs per subject)
// -------------------------------------------------------------
type Question = { subject: string; question: string; grades: number[] };

const questionBank: Question[] = [
  // -- MATHEMATICS ------------------------------------------
  { subject: "Mathematics", grades: [1, 2, 3, 4, 5], question: "Rate your ability to recognize complex numerical patterns and apply logical reasoning to solve abstract puzzles." },
  { subject: "Mathematics", grades: [6, 7, 8], question: "How adept are you at utilizing algebraic expressions and interpreting statistical data models?" },
  { subject: "Mathematics", grades: [9, 10], question: "Rate your proficiency in constructing geometric proofs and solving multi-variable coordinate geometry problems." },
  { subject: "Mathematics", grades: [11, 12], question: "How comfortable are you applying differential calculus and advanced trigonometry to model real-world scenarios?" },
  
  // -- SCIENCE / PHYSICS / CHEMISTRY / BIOLOGY --------------
  { subject: "Science", grades: [1, 2, 3, 4, 5], question: "Rate your interest in systematically observing natural phenomena and forming empirical hypotheses." },
  { subject: "Science", grades: [6, 7, 8], question: "How effectively can you analyze experimental data to understand basic physical forces and chemical reactions?" },
  { subject: "Science", grades: [9, 10], question: "Rate your ability to comprehend the fundamental principles of thermodynamics, electromagnetism, and atomic structure." },
  
  { subject: "Physics", grades: [11, 12], question: "How proficient are you at deriving complex kinematic equations and analyzing quantum or relativistic mechanics?" },
  { subject: "Chemistry", grades: [11, 12], question: "Rate your capability to predict complex organic reaction mechanisms and balance advanced stoichiometric equations." },
  { subject: "Biology", grades: [11, 12], question: "How well can you synthesize concepts in molecular genetics, cellular respiration, and evolutionary biology?" },
  { subject: "Biotechnology", grades: [11, 12], question: "Rate your understanding of recombinant DNA technology and its applications in modern bioprocessing." },
  
  // -- COMPUTER SCIENCE / IT --------------------------------
  { subject: "Computer Science", grades: [9, 10, 11, 12], question: "How comfortable are you with designing algorithmic solutions and understanding computational complexity?" },
  { subject: "Informatics Practices", grades: [11, 12], question: "Rate your ability to manage relational databases and perform advanced data analysis using modern scripting languages." },
  { subject: "Information Technology", grades: [9, 10, 11, 12], question: "How adept are you at troubleshooting network architectures and developing scalable software applications?" },
  { subject: "Artificial Intelligence", grades: [9, 10, 11, 12], question: "Rate your comprehension of machine learning models, neural networks, and AI ethics." },
  
  // -- COMMERCE & FINANCE -----------------------------------
  { subject: "Accountancy", grades: [11, 12], question: "How proficient are you in interpreting complex corporate financial statements and reconciling ledger accounts?" },
  { subject: "Business Studies", grades: [11, 12], question: "Rate your ability to analyze organizational behavior, market dynamics, and strategic management principles." },
  { subject: "Economics", grades: [9, 10, 11, 12], question: "How effectively can you evaluate macroeconomic policies, inflation trends, and supply-demand elasticities?" },
  { subject: "Entrepreneurship", grades: [11, 12], question: "Rate your capacity to formulate comprehensive business plans, assess venture risks, and project financial growth." },
  
  // -- HUMANITIES & SOCIAL SCIENCES -------------------------
  { subject: "Social Science", grades: [6, 7, 8, 9, 10], question: "How well can you critically analyze historical timelines and evaluate the impact of socio-political movements?" },
  { subject: "History", grades: [11, 12], question: "Rate your ability to synthesize primary sources and construct arguments regarding complex geopolitical events." },
  { subject: "Political Science", grades: [11, 12], question: "How adept are you at evaluating contrasting political ideologies and analyzing constitutional law?" },
  { subject: "Geography", grades: [11, 12], question: "Rate your proficiency in interpreting advanced geospatial data, topographical maps, and demographic models." },
  { subject: "Sociology", grades: [11, 12], question: "How comfortable are you applying sociological paradigms to examine institutional structures and cultural shifts?" },
  { subject: "Psychology", grades: [11, 12], question: "Rate your comprehension of cognitive development theories, neurological processes, and behavioral analysis." },
  
  // -- LANGUAGES & LITERATURE -------------------------------
  { subject: "English", grades: [1, 2, 3, 4, 5, 6, 7, 8], question: "How effectively can you analyze textual narratives and articulate complex ideas in written formats?" },
  { subject: "English", grades: [9, 10, 11, 12], question: "Rate your ability to deconstruct advanced literary works, identify allegorical themes, and critically evaluate rhetorical strategies." },
  { subject: "English Language & Literature", grades: [9, 10], question: "How proficient are you at evaluating literary devices and analyzing the socio-cultural context of prose and poetry?" },
  { subject: "English Communicative", grades: [9, 10], question: "Rate your capacity to engage in advanced rhetorical discourse and construct persuasive, well-structured arguments." },
  { subject: "English Core", grades: [11, 12], question: "How adept are you at synthesizing complex information and analyzing sophisticated literary texts for underlying socio-political themes?" },
  { subject: "English Elective", grades: [11, 12], question: "Rate your ability to critique classic and contemporary literature using advanced theoretical frameworks." },
  
  { subject: "Hindi / Mother Tongue (R1)", grades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], question: "How effectively can you interpret complex vernacular texts and articulate nuanced cultural arguments?" },
  { subject: "Hindi Course-A", grades: [9, 10], question: "Rate your proficiency in analyzing classical vernacular literature and understanding deep linguistic structures." },
  { subject: "Hindi Course-B", grades: [9, 10], question: "How comfortable are you with advanced vernacular communication, professional writing, and literary interpretation?" },
  { subject: "Hindi Core", grades: [11, 12], question: "Rate your ability to critically evaluate advanced vernacular poetry, prose, and contemporary media texts." },
  { subject: "Hindi Elective", grades: [11, 12], question: "How adept are you at analyzing the evolution of vernacular literature and performing high-level linguistic critique?" },
  { subject: "Second Language (Hindi / Regional / Foreign)", grades: [9, 10], question: "Rate your capacity to comprehend, translate, and analyze complex texts in a secondary language." },
  
  // -- ARTS, DESIGN & VOCATIONAL ----------------------------
  { subject: "Fine Arts", grades: [11, 12], question: "How proficient are you at analyzing visual aesthetics, art history, and executing complex mixed-media compositions?" },
  { subject: "Physical Education", grades: [11, 12], question: "Rate your understanding of advanced biomechanics, sports psychology, and physiological training models." },
  { subject: "Legal Studies", grades: [11, 12], question: "How effectively can you interpret statutory frameworks, case laws, and principles of jurisprudence?" },
  { subject: "Mass Media Studies", grades: [11, 12], question: "Rate your ability to critically deconstruct media narratives, analyze broadcasting ethics, and evaluate audience engagement." },
  
  // -- GENERIC / FOUNDATIONAL (For younger grades) ----------
  { subject: "Environmental Studies (EVS)", grades: [1, 2, 3, 4, 5], question: "How adept are you at identifying ecological interdependencies and understanding fundamental conservation principles?" }
];

const TOTAL_QUESTIONS = 15;

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
];
  
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

// -------------------------------------------------------------
// Component
// -------------------------------------------------------------
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

const SUBJECT_ICONS: Record<string, React.ElementType> = {
  Mathematics: Calculator,
  Physics: Zap,
  Chemistry: FlaskConical,
  Biology: Dna,
  History: Landmark,
  Geography: Globe,
  "Political Science": Scale,
  Economics: LineChart,
  English: BookOpen,
  Hindi: Languages,
  "Physical Education": Activity,
  Science: Microscope,
  "Social Studies": Users,
  "Arts & Craft": Palette,
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
  const stateObj = (location.state as {
    grade?: string;
    stage?: string;
    selectedSubjects?: string[];
  }) || {};

  const grade = stateObj.grade || "Grade 10";
  const stage = stateObj.stage || "classes";
  const selectedSubjects = stateObj.selectedSubjects || [];

  const gradeNum = parseInt(grade.replace(/\D/g, "")) || 10;
  const isHigherGrade = gradeNum >= 9;

  // Convert selected subject IDs ? display names for boosting
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

  const setCurves = useSetCurves();
  useEffect(() => {
    setCurves([
      { d: "M -160 220 C -40 160, 120 140, 320 180 S 600 280, 900 220", strokeOpacity: 0.16, strokeWidth: 5 },
      { d: "M -160 220 C -40 160, 120 140, 320 180 S 600 280, 900 220", strokeOpacity: 0.45, strokeWidth: 1.4 },
    ]);
    return () => setCurves([]);
  }, [setCurves]);

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Keyboard navigation & shortcuts (1-5 to select, Enter/Right to next, Left to prev)
  useEffect(() => {
    if (showResults) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key >= "1" && e.key <= "5") {
        const val = parseInt(e.key, 10);
        setAnswers((prev) => ({ ...prev, [current]: val }));
      } else if (e.key === "ArrowRight" || e.key === "Enter") {
        if (answers[current] !== undefined) {
          if (current < selectedQuestions.length - 1) {
            setCurrent((c) => c + 1);
          } else {
            setShowResults(true);
          }
        }
      } else if (e.key === "ArrowLeft") {
        setCurrent((c) => Math.max(0, c - 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [current, answers, showResults, selectedQuestions.length]);

  const retake = () => {
    setShowResults(false);
    setCurrent(0);
    setAnswers({});
    // force new questions next render by navigating with same state
    navigate("/subject-quiz", { state: { grade, stage, selectedSubjects }, replace: true });
  };

  const handleDownload = () => {
    const topSubjectsHtml = topSubjects.map(s => `<tr><td>${s.name}</td><td>${s.pct}%</td></tr>`).join('');
    
    let pathwaysHtml = '';
    if (isHigherGrade) {
      pathwaysHtml = streamResults.map(s => `
        <div class="rec">
          <h3>${s.name} - ${s.pct}%</h3>
          <p>Key Subjects: ${s.stream.subjects.join(', ')}</p>
          <p>Ideal Careers: ${s.stream.careers.join(', ')}</p>
        </div>
      `).join('');
    } else {
      pathwaysHtml = domainStrengths.map(d => `
        <div class="rec">
          <h3>${d.domain} - ${d.pct}%</h3>
        </div>
      `).join('');
    }

    const htmlContent = `
      <div style="text-align: center; margin-bottom: 2rem;">
        <h1>Cognitive Profile & Subject Aptitude</h1>
        <p>Grade Level: ${grade}</p>
      </div>
      
      <h2>Core Strengths</h2>
      <table class="scores-table">
        <thead>
          <tr><th>Subject</th><th>Match Score</th></tr>
        </thead>
        <tbody>
          ${topSubjectsHtml}
        </tbody>
      </table>

      <h2>${isHigherGrade ? 'Recommended Pathways' : 'Domain Affinities'}</h2>
      <div>
        ${pathwaysHtml}
      </div>
      
      <footer>
        Generated by Zertainity | Subject Aptitude Assessment
      </footer>
    `;

    setIsGeneratingPdf(true);
    generatePdfViaSupabase(htmlContent, "Subject_Aptitude_Report.pdf")
      .finally(() => setIsGeneratingPdf(false));
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

  // -- Score calculation --------------------------------------
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
        // Boost weight by 1.6? for subjects the student actually studies
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
  const answeredCount = Object.keys(answers).length;
  const progress = selectedQuestions.length > 0 ? (answeredCount / selectedQuestions.length) * 100 : 0;

  // -- Results view -------------------------------------------
  if (showResults) {
    return (
      <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 pb-24">
        <SEO title="Subject Aptitude Quiz Results" description="Subject-based aptitude assessment results from Zertainity." canonical="/subject-quiz" noindex />
        
        {/* Bespoke glowing header */}
        <div className="relative pt-20 pb-16 overflow-hidden border-b border-border/40 bg-secondary/20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="container mx-auto px-6 relative z-10 text-center space-y-4">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", damping: 15 }} className="w-20 h-20 mx-auto bg-primary/10 rounded-3xl flex items-center justify-center border border-primary/20 mb-6 shadow-xl shadow-primary/5">
              <Sparkles className="w-10 h-10 text-primary" />
            </motion.div>
            <p className="text-sm font-semibold text-primary uppercase tracking-[0.2em]">{grade}</p>
            <h1 className="text-5xl md:text-6xl font-light tracking-[-1.5px] font-serif">
              Your Cognitive <span className="italic text-muted-foreground">Profile</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto font-light leading-relaxed">
              Based on your intuitive responses, we've mapped out your academic affinities and ideal pathways.
            </p>
          </div>
        </div>

        <main className="container mx-auto px-6 py-16 max-w-4xl space-y-10">
          {/* Selected subjects badge row */}
          {selectedSubjectNames.length > 0 && (
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="flex flex-col items-center">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">Baseline Subjects</p>
              <div className="flex flex-wrap justify-center gap-2">
                {selectedSubjectNames.map((name) => (
                  <span key={name} className="px-4 py-2 rounded-full text-[13px] bg-secondary/50 border border-border text-foreground font-medium shadow-sm">
                    {name}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            {/* Top Subject Strengths */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="rounded-[32px] p-8 border border-border/60 bg-card shadow-sm">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2"><Layers className="w-5 h-5 text-primary"/> Core Strengths</h3>
              <div className="space-y-6">
                {topSubjects.map(({ name, pct }, i) => (
                  <div key={name} className="space-y-2 group">
                    <div className="flex justify-between text-[15px]">
                      <span className="font-medium text-foreground group-hover:text-primary transition-colors">{name}</span>
                      <span className="text-muted-foreground font-mono text-sm">{pct}%</span>
                    </div>
                    <div className="h-2 w-full bg-secondary overflow-hidden rounded-full">
                      <motion.div 
                        initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: 0.3 + (i * 0.1), ease: "easeOut" }}
                        className="h-full bg-primary rounded-full relative"
                      >
                        <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]" />
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Stream recommendations for Grade 9?12 */}
            {isHigherGrade && (
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="space-y-4">
                <h3 className="text-xl font-semibold mb-2 flex items-center gap-2 px-2"><Star className="w-5 h-5 text-amber-500"/> Recommended Pathways</h3>
                {streamResults.map(({ key, name, pct, stream }, idx) => {
                  const isTop = idx === 0;
                  return (
                    <div key={key} className={`relative overflow-hidden rounded-[24px] p-6 transition-all duration-300 ${isTop ? 'bg-primary/5 border border-primary/30 shadow-lg shadow-primary/5 scale-[1.02]' : 'bg-card border border-border/60 hover:border-primary/30'}`}>
                      {isTop && <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10" />}
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            {isTop && <span className="px-2.5 py-1 rounded-md bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider">Best Match</span>}
                            <span className={`font-semibold text-lg ${isTop ? 'text-primary' : 'text-foreground'}`}>{name}</span>
                          </div>
                          <span className={`font-mono text-lg font-bold ${isTop ? 'text-primary' : 'text-muted-foreground'}`}>{pct}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-secondary overflow-hidden rounded-full mb-4">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: 0.5 + (idx * 0.1) }} className={`h-full rounded-full ${isTop ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                        </div>
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {stream.subjects.slice(0, 4).map((sub) => (
                            <span key={sub} className={`text-[11px] px-2.5 py-1 rounded-lg border ${isTop ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-secondary/50 border-border/50 text-muted-foreground'}`}>{sub}</span>
                          ))}
                        </div>
                        {isTop && (
                          <div className="mt-4 pt-4 border-t border-primary/10">
                            <p className="text-[13px] text-primary/80 font-medium">Ideal Careers: <span className="text-foreground">{stream.careers.slice(0, 3).join(", ")}</span></p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}

            {/* Learning domain strengths for lower grades */}
            {!isHigherGrade && (
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="rounded-[32px] p-8 border border-border/60 bg-card shadow-sm">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2"><Layers className="w-5 h-5 text-emerald-500"/> Domain Affinities</h3>
                <div className="space-y-6">
                  {domainStrengths.map(({ domain, pct }, i) => (
                    <div key={domain} className="space-y-2">
                      <div className="flex justify-between text-[15px]">
                        <span className="font-medium text-foreground">{domain}</span>
                        <span className="text-muted-foreground font-mono text-sm">{pct}%</span>
                      </div>
                      <div className="h-2 w-full bg-secondary overflow-hidden rounded-full">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: 0.4 + (i * 0.1) }} className="h-full bg-emerald-500 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="flex justify-center mt-16 pt-8 border-t border-border/40 gap-4 flex-wrap">
            <button onClick={() => navigate("/")} className="px-8 py-4 rounded-full font-medium transition-all bg-secondary text-foreground hover:bg-secondary/80">
              Return Home
            </button>
            <button onClick={retake} className="px-8 py-4 rounded-full font-medium transition-all bg-secondary text-foreground hover:bg-secondary/80">
              Retake Assessment
            </button>
            <button onClick={handleDownload} disabled={isGeneratingPdf} className="px-8 py-4 rounded-full font-medium transition-all bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 hover:-translate-y-1 flex items-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0">
              {isGeneratingPdf ? (
                <span className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <Download className="w-5 h-5" />
              )}
              {isGeneratingPdf ? "Generating..." : "Download Report"}
            </button>
          </motion.div>
        </main>
      </div>
    );
  }

  // -- Quiz view ----------------------------------------------
  if (!q) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center space-y-4">
        <GraduationCap className="h-12 w-12 text-primary" />
        <h2 className="text-xl font-bold">No questions available for this selection</h2>
        <p className="text-sm text-muted-foreground max-w-sm">Please start from the education level selection to pick your grade and subjects.</p>
        <Button className="rounded-full" onClick={() => navigate("/education-level")}>
          Start Assessment Flow
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <SEO title="Subject Aptitude Quiz" description="Take Zertainity's subject-based aptitude quiz to refine your career match." canonical="/subject-quiz" noindex />
      
      <header className="fixed top-0 w-full z-50 bg-background/60 backdrop-blur-2xl border-b border-border/40">
        <div className="mx-auto max-w-[1200px] px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className="w-10 h-10 flex items-center justify-center rounded-full bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="hidden sm:block">
              <span className="text-[13px] font-semibold tracking-[0.2em] uppercase text-foreground/80 block leading-tight">Assessment</span>
              <span className="text-[11px] text-muted-foreground">{grade}</span>
            </div>
          </div>
          
          {/* Custom segmented progress */}
          <div className="flex items-center gap-1.5">
            {selectedQuestions.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  idx === current ? 'w-6 bg-primary' : 
                  answers[idx] !== undefined ? 'w-2 bg-primary/40' : 'w-2 bg-secondary'
                }`}
              />
            ))}
          </div>
        </div>
      </header>

      <main className="flex flex-col items-center justify-center min-h-screen px-6 pt-24 pb-12 overflow-hidden">
        <div className="w-full max-w-[800px] relative">
          
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-full"
          >
            <div className="bg-card border border-border/60 rounded-[40px] p-8 sm:p-12 shadow-2xl shadow-primary/5">
              
              <div className="flex flex-col items-center text-center mb-12">
                <div className="w-24 h-24 rounded-full bg-secondary/50 flex items-center justify-center text-5xl mb-8 border border-border/50 shadow-inner text-primary">
                  {(() => {
                    const Icon = SUBJECT_ICONS[q.subject] || Sparkles;
                    return <Icon className="w-12 h-12" />;
                  })()}
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                  <Sparkles className="w-4 h-4" />
                  {q.subject}
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-[-1px] font-serif leading-tight">
                  {q.question}
                </h2>
              </div>

              {/* Bespoke Horizontal Touch Targets for Ratings */}
              <div className="grid grid-cols-5 gap-2 sm:gap-4 mt-12">
                {[
                  { v: 1, icon: Frown, label: "Not at all" },
                  { v: 2, icon: Meh, label: "A little" },
                  { v: 3, icon: Smile, label: "Somewhat" },
                  { v: 4, icon: ThumbsUp, label: "Very much" },
                  { v: 5, icon: Flame, label: "Absolutely" }
                ].map((rating) => {
                  const isSelected = answers[current] === rating.v;
                  const IconComponent = rating.icon;
                  return (
                    <button
                      key={rating.v}
                      onClick={() => handleAnswer(rating.v)}
                      className={`group flex flex-col items-center justify-center py-6 px-2 rounded-3xl transition-all duration-300 relative overflow-hidden ${
                        isSelected 
                          ? 'bg-primary border-primary shadow-lg shadow-primary/20 -translate-y-2' 
                          : 'bg-secondary/40 border-transparent hover:bg-secondary hover:border-border hover:-translate-y-1'
                      } border`}
                    >
                      {/* Active glow */}
                      {isSelected && <div className="absolute inset-0 bg-white/20 blur-md rounded-3xl" />}
                      
                      <span className={`mb-3 transition-transform duration-300 ${isSelected ? 'scale-110 relative z-10 text-primary-foreground' : 'group-hover:scale-110 opacity-70 group-hover:opacity-100 text-muted-foreground group-hover:text-foreground'}`}>
                        <IconComponent className="w-8 h-8 sm:w-10 sm:h-10" />
                      </span>
                      <span className={`text-[11px] sm:text-[13px] font-medium text-center relative z-10 ${isSelected ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>
                        {rating.label}
                      </span>
                      
                      {/* Keyboard hint */}
                      <span className={`absolute bottom-2 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity ${isSelected ? 'text-primary-foreground/70' : 'text-muted-foreground/50'}`}>
                        Key {rating.v}
                      </span>
                    </button>
                  );
                })}
              </div>

            </div>
          </motion.div>
          
          {/* Contextual navigation below card */}
          <div className="flex justify-between items-center mt-8 px-4">
            <button
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              className={`flex items-center gap-2 text-sm font-medium transition-all ${current === 0 ? 'opacity-0 pointer-events-none' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <p className="text-xs text-muted-foreground font-mono">
              {current + 1} / {selectedQuestions.length}
            </p>
            {current === selectedQuestions.length - 1 && answers[current] !== undefined ? (
              <button
                onClick={() => setShowResults(true)}
                className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-all animate-pulse"
              >
                See Results <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="w-16" /> /* spacer */
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SubjectQuiz;
