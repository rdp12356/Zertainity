import { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AssessmentStepper } from "@/components/AssessmentStepper";
import { motion, AnimatePresence } from "framer-motion";

import {
  ArrowLeft,
  ArrowRight,
  Info,
  CheckSquare,
  Square,
  Atom,
  BarChart,
  BookOpen,
  Calculator,
  Globe,
  Palette,
  Dumbbell,
  Monitor,
  Music,
  Briefcase,
  TrendingUp,
  Scale,
  FlaskConical,
  Leaf,
  Users,
  Zap,
  Languages,
  Plus,
  GraduationCap,
  Sparkles,
  Search,
  Check,
  ChevronsUpDown,
  Filter,
  X,
  Star,
  School,
  Layers,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { SEO } from "@/components/SEO";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────
interface Subject {
  id: string;
  name: string;
  code?: string;          // Official Board / Curriculum Code (e.g. CBSE 041, IB HL/SL)
  icon: React.ElementType;
  career: string;         // Guidance & Career Foundation description
  level?: "HL" | "SL" | "Standard" | "Basic" | "Skill" | "Core";
  required?: boolean;
}

interface SubjectGroup {
  id: string;
  label: string;
  subtitle?: string;
  icon: React.ElementType;
  color: string;
  subjects: Subject[];
}

interface StreamCombo {
  id: string;
  label: string;
  description: string;
  subjects: string[];
  color: string;
  badge: string;
}

type BoardType = "cbse" | "icse" | "ib";

export interface GradeStageInfo {
  stageId: string;
  stageLabel: string;
  ageRange: string;
  gradeNum: number;
}

// ─────────────────────────────────────────────────────────────
// GRADING REFERENCE DATA
// ─────────────────────────────────────────────────────────────
export const CBSE_GRADES = [
  { grade: "A1", range: "91–100", points: 10, remark: "Top 1/8th of Passed Candidates" },
  { grade: "A2", range: "81–90",  points: 9,  remark: "Next 1/8th of Passed Candidates" },
  { grade: "B1", range: "71–80",  points: 8,  remark: "Next 1/8th of Passed Candidates" },
  { grade: "B2", range: "61–70",  points: 7,  remark: "Next 1/8th of Passed Candidates" },
  { grade: "C1", range: "51–60",  points: 6,  remark: "Next 1/8th of Passed Candidates" },
  { grade: "C2", range: "41–50",  points: 5,  remark: "Next 1/8th of Passed Candidates" },
  { grade: "D",  range: "33–40",  points: 4,  remark: "Passing Grade Benchmark" },
  { grade: "E",  range: "Below 33", points: 0, remark: "Needs Essential Improvement" },
];

export const IB_GRADES = [
  { grade: "7", range: "90–100%", remark: "Excellent / Outstanding Mastery" },
  { grade: "6", range: "80–89%",  remark: "Very Good / High Competence" },
  { grade: "5", range: "70–79%",  remark: "Good / Solid Understanding" },
  { grade: "4", range: "60–69%",  remark: "Satisfactory / Basic Competence" },
  { grade: "3", range: "50–59%",  remark: "Mediocre / Limited Mastery" },
  { grade: "2", range: "40–49%",  remark: "Poor / Very Limited Competence" },
  { grade: "1", range: "Below 40%", remark: "Very Poor / Minimal Knowledge" },
];

export const ICSE_GRADES = [
  { grade: "1", range: "90–100", remark: "Outstanding Distinction" },
  { grade: "2", range: "80–89",  remark: "Excellent Performance" },
  { grade: "3", range: "70–79",  remark: "Very Good" },
  { grade: "4", range: "60–69",  remark: "Good" },
  { grade: "5", range: "50–59",  remark: "Credit / Commendable" },
  { grade: "6", range: "40–49",  remark: "Pass Grade" },
  { grade: "7", range: "33–39",  remark: "Pass (Minimum Benchmark)" },
  { grade: "8", range: "21–32",  remark: "Needs Improvement" },
  { grade: "9", range: "0–20",   remark: "Unclassified" },
];

// ─────────────────────────────────────────────────────────────
// 1. CBSE CURRICULUM — 2026-27 (NEP 2020 + NCF-SE 2023)
// ─────────────────────────────────────────────────────────────

// Primary / Preparatory (Classes 1–5)
const cbsePrimaryGroups: SubjectGroup[] = [
  {
    id: "core",
    label: "Core Foundational Subjects",
    subtitle: "Language, Numeracy & Environmental Inquiry",
    icon: BookOpen,
    color: "text-amber-600",
    subjects: [
      { id: "english", name: "English", code: "184", icon: BookOpen, career: "Foundation for all professional careers – communication, law, media, literature" },
      { id: "hindi", name: "Hindi / Mother Tongue (R1)", code: "002", icon: Languages, career: "Vernacular proficiency opens government administration, journalism, translation" },
      { id: "maths", name: "Mathematics", code: "041", icon: Calculator, career: "Foundation for engineering, finance, data science, and quantitative STEM" },
      { id: "evs", name: "Environmental Studies (EVS)", icon: Leaf, career: "Builds curiosity about science & ecology; foundation for medicine, biology, environmental policy" },
    ],
  },
  {
    id: "languages",
    label: "Languages (Three-Language Formula — R2 & R3)",
    subtitle: "Regional & Classical Language Exploration",
    icon: Languages,
    color: "text-indigo-600",
    subjects: [
      { id: "second-lang", name: "Second Language (R2)", icon: Languages, career: "Bilingual communication skills for administration, media, and diplomatic careers" },
      { id: "third-lang", name: "Third Language (R3 — Sanskrit / Regional)", icon: Languages, career: "Additional language proficiency useful in civil services, linguistics, foreign affairs" },
    ],
  },
  {
    id: "experiential",
    label: "Experiential & Co-Scholastic Learning",
    subtitle: "Arts, Physical Fitness & Digital Play",
    icon: Palette,
    color: "text-emerald-600",
    subjects: [
      { id: "art-craft", name: "Art & Craft", icon: Palette, career: "Creative thinking leads to careers in design, architecture, fine arts, animation" },
      { id: "pe-primary", name: "Physical Education & Play", icon: Dumbbell, career: "Sports & fitness careers — athlete, coach, physiotherapist, sports scientist" },
      { id: "music-dance", name: "Music & Performing Arts", icon: Music, career: "Performing arts, entertainment, acoustic production, cultural programmes" },
      { id: "digital-lit", name: "Foundational Coding & Digital Literacy", icon: Monitor, career: "Early logical thinking, computational literacy, future technology" },
    ],
  },
];

// Middle School (Classes 6–8)
const cbseMiddleGroups: SubjectGroup[] = [
  {
    id: "core",
    label: "Core Academic Disciplines",
    subtitle: "Sciences, Humanities & Quantitative Methods",
    icon: BookOpen,
    color: "text-blue-600",
    subjects: [
      { id: "english", name: "English Language & Literature", code: "184", icon: BookOpen, career: "Foundation for international communication, legal writing, media, publishing" },
      { id: "hindi", name: "Hindi / Mother Tongue (R1)", code: "002", icon: Languages, career: "Language mastery opens administrative civil services, content strategy, media" },
      { id: "maths", name: "Mathematics", code: "041", icon: Calculator, career: "Algebra, Geometry & Statistics – gateway to engineering, economics, data science" },
      { id: "science", name: "Science (Physics, Chemistry & Biology)", code: "086", icon: FlaskConical, career: "Scientific exploration – engineering, medical sciences, scientific research" },
      { id: "social-sci", name: "Social Science (History, Civics, Geography)", code: "087", icon: Globe, career: "Civil services (UPSC), public policy, law, diplomacy, urban geography" },
    ],
  },
  {
    id: "languages",
    label: "Three-Language Formula (R2 & R3)",
    subtitle: "National & Global Languages",
    icon: Languages,
    color: "text-indigo-600",
    subjects: [
      { id: "second-lang-mid", name: "Second Language (R2)", icon: Languages, career: "Bilingual fluency for public administration, corporate translation, diplomatic liaison" },
      { id: "third-lang-mid", name: "Third Language (R3 — Sanskrit / French / German / Regional)", icon: Languages, career: "Multilingual proficiency opens foreign services, international trade, translation" },
    ],
  },
  {
    id: "skill-middle",
    label: "Vocational Skills & Electives (NEP 2020 10-Bagless Days)",
    subtitle: "Hands-on Crafts, AI & Coding",
    icon: Zap,
    color: "text-purple-600",
    subjects: [
      { id: "comp-apps-mid", name: "Computer Applications & ICT", icon: Monitor, career: "Tech literacy → software development, data science, digital marketing" },
      { id: "ai-middle", name: "Artificial Intelligence (AI)", code: "417", icon: Monitor, career: "AI/ML engineering, intelligent systems, automation, future tech" },
      { id: "coding-mid", name: "Coding & Computational Thinking", code: "420", icon: Monitor, career: "Software architecture, algorithmic design, robotics programming" },
      { id: "design-inn-mid", name: "Design Thinking & Innovation", code: "422", icon: Palette, career: "Product innovation, industrial design, creative problem solving" },
      { id: "art-ed", name: "Art Education", icon: Palette, career: "Design systems, animation, fine arts, interior styling, art therapy" },
      { id: "health-pe", name: "Health & Physical Education", icon: Dumbbell, career: "Sports science, sports management, physiotherapy, physical training" },
      { id: "vocational-craft", name: "Vocational Crafts (Pottery / Carpentry / Gardening)", icon: Briefcase, career: "Practical engineering, entrepreneurship, sustainable crafts, hands-on trades" },
    ],
  },
];

// Secondary (Classes 9–10)
const cbseSecondaryGroups: SubjectGroup[] = [
  {
    id: "languages",
    label: "Group L: Languages (Three-Language Formula)",
    subtitle: "Official CBSE Language Electives",
    icon: Languages,
    color: "text-indigo-600",
    subjects: [
      { id: "eng-lit", name: "English Language & Literature", code: "184", icon: BookOpen, career: "Communication, media, law, civil services, literature – core for all careers" },
      { id: "eng-comm", name: "English Communicative", code: "101", icon: BookOpen, career: "Spoken communication, public speaking, corporate communications, media" },
      { id: "hindi-a", name: "Hindi Course-A", code: "002", icon: Languages, career: "Civil services, administrative journalism, Hindi literature, governance" },
      { id: "hindi-b", name: "Hindi Course-B", code: "085", icon: Languages, career: "Government services, vernacular media, corporate translation" },
      { id: "sanskrit", name: "Sanskrit", code: "122", icon: BookOpen, career: "Classical studies, civil services, Indian knowledge systems, linguistics" },
      { id: "sanskrit-comm", name: "Sanskrit Communicative", code: "119", icon: BookOpen, career: "Spoken Sanskrit, Vedic research, Indology, cultural tourism" },
      { id: "urdu-a", name: "Urdu Course-A", code: "003", icon: BookOpen, career: "Urdu literature, journalism, diplomacy, government civil services" },
      { id: "tamil", name: "Tamil", code: "033", icon: Languages, career: "State administrative services, regional journalism, media & film" },
      { id: "telugu", name: "Telugu", code: "034", icon: Languages, career: "State civil services, media, regional publishing, diplomacy" },
      { id: "kannada", name: "Kannada", code: "035", icon: Languages, career: "State civil services, regional media, cultural administration" },
      { id: "malayalam", name: "Malayalam", code: "036", icon: Languages, career: "State governance, broadcast journalism, translation" },
      { id: "marathi", name: "Marathi", code: "009", icon: Languages, career: "State services, publishing, regional business communication" },
      { id: "gujarati", name: "Gujarati", code: "010", icon: Languages, career: "State administration, commerce, trade communication" },
      { id: "punjabi", name: "Punjabi", code: "011", icon: Languages, career: "State services, cross-border trade, regional broadcasting" },
      { id: "bengali", name: "Bengali", code: "006", icon: Languages, career: "State administrative services, Bengali literature, media" },
      { id: "odia", name: "Odia", code: "014", icon: Languages, career: "State services, regional media, cultural heritage" },
      { id: "assamese", name: "Assamese", code: "015", icon: Languages, career: "NE India administration, cultural tourism, media" },
      { id: "french", name: "French", code: "164", icon: Languages, career: "MNCs, diplomacy, export trade, UN agencies, international hospitality" },
      { id: "german", name: "German", code: "120", icon: Languages, career: "German engineering firms, EU diplomacy, automotive R&D" },
      { id: "spanish", name: "Spanish", code: "166", icon: Languages, career: "Latin American trade, international diplomacy, NGOs" },
      { id: "japanese", name: "Japanese", code: "096", icon: Languages, career: "Japanese technology corporations, translation, automotive engineering" },
      { id: "arabic", name: "Arabic", code: "016", icon: Languages, career: "Middle East & Gulf trade, diplomacy, international aviation" },
    ],
  },
  {
    id: "compulsory",
    label: "Group C: Compulsory Core Subjects",
    subtitle: "Foundational Board Examination Subjects",
    icon: BookOpen,
    color: "text-blue-600",
    subjects: [
      { id: "maths-std", name: "Mathematics (Standard)", code: "041", icon: Calculator, career: "Mandatory for Engineering (PCM), Data Science, Economics & Finance in Class 11" },
      { id: "maths-basic", name: "Mathematics (Basic)", code: "241", icon: Calculator, career: "Practical numeracy; ideal for Commerce without Core Maths or Humanities streams" },
      { id: "science-910", name: "Science", code: "086", icon: FlaskConical, career: "Physics, Chemistry, Biology – mandatory for Medical (NEET) & Engineering (JEE)" },
      { id: "soc-sci", name: "Social Science", code: "087", icon: Globe, career: "History, Geography, Economics, Pol Sci – base for Civil Services (IAS/IPS), Law & Policy" },
    ],
  },
  {
    id: "skill-subjects-910",
    label: "Group S: 2026-27 Skill & Vocational Electives",
    subtitle: "New-Age Technology, Business & Creative Subjects",
    icon: Zap,
    color: "text-purple-600",
    subjects: [
      { id: "ai-910", name: "Artificial Intelligence", code: "417", icon: Monitor, career: "AI/ML engineering, computer vision, data science, automation" },
      { id: "data-sci-910", name: "Data Science", code: "419", icon: Monitor, career: "Data analytics, business intelligence, machine learning pipelines" },
      { id: "comp-apps", name: "Computer Applications", code: "165", icon: Monitor, career: "Software engineering, web development, cybersecurity, database design" },
      { id: "it-skill", name: "Information Technology", code: "402", icon: Monitor, career: "IT management, cloud solutions, full-stack software development" },
      { id: "design-thinking", name: "Design Thinking & Innovation", code: "422", icon: Palette, career: "Product design, UX strategy, innovation consulting, startup entrepreneurship" },
      { id: "electronics-hw", name: "Electronics & Hardware / Coding", code: "420", icon: Atom, career: "Hardware engineering, IoT devices, robotics, embedded systems" },
      { id: "fin-markets-910", name: "Introduction to Financial Markets", code: "405", icon: TrendingUp, career: "Stock trading, investment banking, mutual funds, personal wealth management" },
      { id: "elem-biz", name: "Elements of Business", code: "154", icon: Briefcase, career: "Commerce foundation → MBA, marketing strategy, supply chain management" },
      { id: "elem-accounts", name: "Elements of Book Keeping & Accountancy", code: "254", icon: TrendingUp, career: "Chartered Accountancy (CA), financial auditing, corporate banking" },
      { id: "marketing-sales-910", name: "Marketing & Sales", code: "412", icon: Briefcase, career: "Digital marketing, brand strategy, sales operations, e-commerce" },
      { id: "healthcare-910", name: "Healthcare", code: "413", icon: Leaf, career: "Public healthcare, paramedical services, hospital management, nursing" },
      { id: "tourism-910", name: "Introduction to Tourism", code: "406", icon: Globe, career: "Travel operations, international tourism, aviation management" },
      { id: "beauty-wellness-910", name: "Beauty & Wellness", code: "407", icon: Palette, career: "Cosmetology, skincare science, wellness consulting, salon management" },
      { id: "agriculture-910", name: "Agriculture", code: "408", icon: Leaf, career: "Agronomy, precision farming, agri-biotechnology, food processing" },
      { id: "automotive-910", name: "Automotive", code: "404", icon: Atom, career: "Electric Vehicles (EV), automobile engineering, mechatronics" },
      { id: "physical-trainer-910", name: "Physical Activity Trainer", code: "418", icon: Dumbbell, career: "Sports coaching, fitness training, athletic conditioning" },
      { id: "home-sci", name: "Home Science", code: "064", icon: Leaf, career: "Clinical nutrition, interior design, textile merchandising, hospitality" },
      { id: "painting", name: "Painting", code: "049", icon: Palette, career: "Fine arts, visual graphics, animation, UI design, game art" },
      { id: "music-910", name: "Music (Hindustani / Carnatic)", code: "034", icon: Music, career: "Acoustic engineering, vocal performance, music direction" },
      { id: "ncc-910", name: "National Cadet Corps (NCC)", code: "076", icon: Users, career: "Defense services (NDA/CDS), paramilitary forces, disaster management" },
    ],
  },
];

// Senior Secondary (Classes 11–12) — CBSE 2026-27
const cbseSeniorGroups: SubjectGroup[] = [
  {
    id: "language-comp",
    label: "Languages (Group L)",
    subtitle: "Compulsory Language & Advanced Literature",
    icon: Languages,
    color: "text-indigo-600",
    subjects: [
      { id: "eng-core", name: "English Core", code: "301", icon: BookOpen, career: "Communication, law, media, corporate governance – base for all professional fields" },
      { id: "eng-elective", name: "English Elective", code: "001", icon: BookOpen, career: "Advanced literature, creative writing, journalism, international publishing" },
      { id: "hindi-core", name: "Hindi Core", code: "302", icon: Languages, career: "Civil services, vernacular journalism, state administrative roles" },
      { id: "hindi-elective", name: "Hindi Elective", code: "002", icon: Languages, career: "Hindi literature research, publishing, cultural curation" },
      { id: "sanskrit-core", name: "Sanskrit Core", code: "322", icon: BookOpen, career: "Indian knowledge systems, Indology, civil services, academic research" },
      { id: "other-lang-sr", name: "Other Regional / Foreign Languages (French, German, Spanish, Japanese, Tamil, Telugu...)", icon: Languages, career: "International relations, global trade, diplomacy, translation" },
    ],
  },
  {
    id: "science",
    label: "Science Stream Subjects",
    subtitle: "STEM, Medicine, Engineering & Pure Sciences",
    icon: Atom,
    color: "text-blue-600",
    subjects: [
      { id: "physics", name: "Physics", code: "042", icon: Atom, career: "Engineering (all disciplines), aviation, aerospace, quantum physics, robotics" },
      { id: "chemistry", name: "Chemistry", code: "043", icon: FlaskConical, career: "Medicine (MBBS), pharmacy, chemical engineering, materials science, nanotechnology" },
      { id: "maths-sr", name: "Mathematics", code: "041", icon: Calculator, career: "Engineering (JEE), data science, AI, quantitative finance, actuarial science" },
      { id: "biology", name: "Biology", code: "044", icon: Leaf, career: "Medicine (NEET), dentistry, genetics, biotechnology, neuroscience, microbiology" },
      { id: "biotech", name: "Biotechnology", code: "045", icon: Leaf, career: "Biotech R&D, genomics, CRISPR research, pharmaceutical engineering" },
      { id: "eng-graphics", name: "Engineering Graphics", code: "046", icon: Atom, career: "Mechanical/civil engineering, CAD/CAM drafting, architectural modeling" },
    ],
  },
  {
    id: "commerce",
    label: "Commerce & Management Subjects",
    subtitle: "Finance, Accounting, Economics & Enterprise",
    icon: Briefcase,
    color: "text-amber-600",
    subjects: [
      { id: "accountancy", name: "Accountancy", code: "055", icon: TrendingUp, career: "Chartered Accountant (CA), CMA, corporate audit, investment banking, forensic accounting" },
      { id: "biz-studies", name: "Business Studies", code: "054", icon: Briefcase, career: "MBA, strategic consulting, corporate management, marketing leadership" },
      { id: "economics", name: "Economics", code: "030", icon: TrendingUp, career: "Economic research, policy advisory, investment analysis, central banking (RBI)" },
      { id: "entrepreneurship", name: "Entrepreneurship", code: "066", icon: Briefcase, career: "Startup founding, venture capital, product incubation, business development" },
      { id: "applied-maths", name: "Applied Mathematics", code: "241", icon: Calculator, career: "Commerce + Math pathway → data analytics, actuarial science, financial modeling" },
    ],
  },
  {
    id: "humanities",
    label: "Humanities & Social Sciences",
    subtitle: "Governance, Law, Behaviour & Society",
    icon: Globe,
    color: "text-purple-600",
    subjects: [
      { id: "history", name: "History", code: "027", icon: Globe, career: "Civil Services (UPSC CSE), legal history, archaeology, diplomacy, journalism" },
      { id: "pol-sci", name: "Political Science", code: "028", icon: Scale, career: "Civil services (IAS/IPS/IFS), constitutional law, public administration, international relations" },
      { id: "geography", name: "Geography", code: "029", icon: Globe, career: "Urban planning, GIS & remote sensing, environmental management, climatology" },
      { id: "sociology", name: "Sociology", code: "039", icon: Users, career: "Public policy, social research, human resources, NGO management" },
      { id: "psychology", name: "Psychology", code: "037", icon: Users, career: "Clinical psychology, neuropsychology, cognitive counseling, UX research, HR" },
      { id: "legal-studies", name: "Legal Studies", code: "074", icon: Scale, career: "Corporate law (CLAT / LLB), judiciary, constitutional advocacy, public policy" },
      { id: "philosophy", name: "Philosophy", code: "040", icon: BookOpen, career: "Ethics consulting, legal analysis, civil services, academic philosophy" },
      { id: "human-rights", name: "Human Rights and Gender Studies", code: "075", icon: Users, career: "Human rights advocacy, UN agencies, non-profit leadership, social reform" },
    ],
  },
  {
    id: "tech-electives",
    label: "New-Age Tech, Creative & Applied Electives",
    subtitle: "NEP 2020 Cross-Stream Flexibility",
    icon: Zap,
    color: "text-emerald-600",
    subjects: [
      { id: "comp-sci", name: "Computer Science", code: "083", icon: Monitor, career: "Software engineering, algorithms, AI systems, full-stack development, cybersecurity" },
      { id: "inf-prac", name: "Informatics Practices", code: "065", icon: Monitor, career: "Data analytics, SQL database engineering, Python data science" },
      { id: "ai-sr", name: "Artificial Intelligence", code: "843", icon: Monitor, career: "AI/ML engineering, neural networks, computer vision, natural language processing" },
      { id: "data-sci-sr", name: "Data Science", code: "844", icon: Monitor, career: "Big data analytics, predictive modeling, statistical learning" },
      { id: "design-sr", name: "Design", code: "830", icon: Palette, career: "Industrial design, UI/UX architecture, creative product development" },
      { id: "fin-markets-sr", name: "Financial Markets Management", code: "805", icon: TrendingUp, career: "Equity research, algorithmic trading, wealth portfolio management" },
      { id: "banking-sr", name: "Banking", code: "811", icon: TrendingUp, career: "Commercial banking, risk management, FinTech operations" },
      { id: "web-apps-sr", name: "Web Application", code: "803", icon: Monitor, career: "Web architecture, cloud services, interactive frontend engineering" },
      { id: "mass-media-sr", name: "Mass Media Studies", code: "835", icon: Globe, career: "Broadcast journalism, digital film production, public relations, advertising" },
      { id: "pe-sr", name: "Physical Education", code: "048", icon: Dumbbell, career: "Sports science, athletic training, physiotherapy, sports management" },
      { id: "fine-arts-sr", name: "Fine Arts / Painting", code: "049", icon: Palette, career: "Visual design, digital illustration, animation, fine arts curation" },
      { id: "music-sr", name: "Music (Hindustani / Carnatic)", code: "034", icon: Music, career: "Sound design, music composition, acoustic engineering" },
      { id: "home-sci-sr", name: "Home Science", code: "064", icon: Leaf, career: "Dietetics, interior architecture, food technology, hospitality" },
      { id: "ncc-sr", name: "NCC", code: "076", icon: Users, career: "Defense forces officer entry, national security, administrative leadership" },
    ],
  },
];

// ─────────────────────────────────────────────────────────────
// 2. ICSE / ISC CURRICULUM — 2026-27 (CISCE REGULATIONS)
// ─────────────────────────────────────────────────────────────

// ICSE Primary (Classes 1–5)
const icsePrimaryGroups: SubjectGroup[] = [
  {
    id: "core",
    label: "Core Academic Foundations",
    subtitle: "English Language, Mathematics & Environment",
    icon: BookOpen,
    color: "text-blue-600",
    subjects: [
      { id: "icse-english-pri", name: "English (Language & Literature)", icon: BookOpen, career: "Foundation for global communication, creative writing, law, media" },
      { id: "icse-second-lang-pri", name: "Second Language (Hindi / Regional)", icon: Languages, career: "Bilingual fluency for public service, regional communication, journalism" },
      { id: "icse-maths-pri", name: "Mathematics", icon: Calculator, career: "Mathematical logic, numeracy, foundation for STEM disciplines" },
      { id: "icse-evs-pri", name: "Environmental Studies (EVS / General Science)", icon: Leaf, career: "Scientific inquiry, nature observation, health & ecological awareness" },
      { id: "icse-social-pri", name: "Social Studies", icon: Globe, career: "Early geography, community systems, history and citizenship" },
    ],
  },
  {
    id: "co-scholastic",
    label: "Digital Literacy, Arts & Co-Curricular",
    subtitle: "Computing, Creative Arts & Physical Education",
    icon: Palette,
    color: "text-purple-600",
    subjects: [
      { id: "icse-comp-pri", name: "Computer Studies & Coding Basics", icon: Monitor, career: "Digital literacy, early coding logic, software foundation" },
      { id: "icse-art-pri", name: "Art & Craft", icon: Palette, career: "Visual expression, spatial design, fine arts" },
      { id: "icse-pe-pri", name: "Physical Education & Games", icon: Dumbbell, career: "Physical fitness, athletic motor skills, sportsmanship" },
      { id: "icse-moral-pri", name: "Moral Science & Value Education", icon: Users, career: "Ethical reasoning, emotional intelligence, leadership" },
    ],
  },
];

// ICSE Middle School (Classes 6–8)
const icseMiddleGroups: SubjectGroup[] = [
  {
    id: "languages",
    label: "Languages (Three-Language Formula)",
    subtitle: "English, Vernacular & Classical/Foreign",
    icon: Languages,
    color: "text-indigo-600",
    subjects: [
      { id: "icse-eng-mid", name: "English (Language & Literature in English)", icon: BookOpen, career: "Rigorous ICSE English training for international careers, law, media" },
      { id: "icse-second-lang-mid", name: "Second Language (Hindi / Regional)", icon: Languages, career: "Bilingual mastery for public administration and media" },
      { id: "icse-third-lang-mid", name: "Third Language (Sanskrit / French / German / Regional)", icon: Languages, career: "Multilingual advantage in foreign service, international relations" },
    ],
  },
  {
    id: "sciences-maths",
    label: "Sciences & Mathematics",
    subtitle: "Differentiated Pure Sciences",
    icon: FlaskConical,
    color: "text-blue-600",
    subjects: [
      { id: "icse-maths-mid", name: "Mathematics", icon: Calculator, career: "Foundation for engineering, quantitative finance, computing" },
      { id: "icse-physics-mid", name: "Physics", icon: Atom, career: "Mechanics, optics, energy – base for all engineering disciplines" },
      { id: "icse-chemistry-mid", name: "Chemistry", icon: FlaskConical, career: "Chemical reactions, matter, periodic table – base for medicine & chemical R&D" },
      { id: "icse-biology-mid", name: "Biology", icon: Leaf, career: "Life processes, botany, human anatomy – foundation for medical careers" },
    ],
  },
  {
    id: "social-skills",
    label: "Social Sciences & Applied Technologies",
    subtitle: "History, Geography, Computer Studies & Arts",
    icon: Globe,
    color: "text-emerald-600",
    subjects: [
      { id: "icse-hcg-mid", name: "History & Civics", icon: Globe, career: "Historical analysis, democratic governance, base for civil services" },
      { id: "icse-geo-mid", name: "Geography", icon: Globe, career: "Topography, map work, climate systems, environmental management" },
      { id: "icse-comp-mid", name: "Computer Studies (Java & Coding Basics)", icon: Monitor, career: "Object-oriented programming, algorithms, web technology" },
      { id: "icse-art-mid", name: "Art Education & Performing Arts", icon: Palette, career: "Creative visualization, performing arts, design thinking" },
      { id: "icse-pe-mid", name: "Physical Education & Yoga", icon: Dumbbell, career: "Sports science, athletic training, holistic wellness" },
    ],
  },
];

// ICSE Secondary (Classes 9–10)
const icseSecondaryGroups: SubjectGroup[] = [
  {
    id: "group1",
    label: "Group I: Compulsory Subjects",
    subtitle: "All Subjects are Mandatory for ICSE",
    icon: BookOpen,
    color: "text-blue-600",
    subjects: [
      { id: "icse-english", name: "English (Paper 1: Language & Paper 2: Literature)", icon: BookOpen, career: "Critical reasoning, high-order communication, base for law, media, corporate leadership" },
      { id: "icse-second-lang", name: "Second Language (Hindi / Regional / Modern Foreign)", icon: Languages, career: "Bilingual communication, government civil services, international diplomacy" },
      { id: "icse-hcg", name: "History, Civics & Geography (HCG 1 & 2)", icon: Globe, career: "Civil services (UPSC CSE), judiciary, diplomacy, town planning" },
    ],
  },
  {
    id: "group2",
    label: "Group II: Elective Subjects (Choose 2 or 3)",
    subtitle: "Core Academic & Scientific Disciplines",
    icon: Atom,
    color: "text-emerald-600",
    subjects: [
      { id: "icse-maths", name: "Mathematics", icon: Calculator, career: "Engineering (JEE), quantitative finance, computing, data science" },
      { id: "icse-science", name: "Science (Physics, Chemistry & Biology)", icon: FlaskConical, career: "Essential for Medicine (NEET-UG) and Engineering (JEE Main/Adv)" },
      { id: "icse-economics", name: "Economics", icon: TrendingUp, career: "Macroeconomic analysis, banking, corporate finance, policy consulting" },
      { id: "icse-commerce", name: "Commercial Studies", icon: Briefcase, career: "Commerce fundamentals, CA foundation, corporate governance, marketing" },
      { id: "icse-cs", name: "Computer Science", icon: Monitor, career: "Java programming, software architecture, algorithm design, cybersecurity" },
      { id: "icse-env-sci", name: "Environmental Science", icon: Leaf, career: "Sustainability engineering, climate policy, ecological conservation" },
      { id: "icse-tech-draw", name: "Technical Drawing Applications", icon: Atom, career: "Architecture, mechanical engineering, CAD drafting" },
      { id: "icse-agri", name: "Agricultural Science", icon: Leaf, career: "Agronomy, agricultural research, food security, agri-business" },
      { id: "icse-foreign-lang", name: "Modern Foreign Language (French / German / Spanish)", icon: Languages, career: "International diplomacy, global trade, MNC leadership" },
      { id: "icse-classical", name: "Classical Language (Sanskrit / Arabic / Persian)", icon: BookOpen, career: "Classical literature, civil services, archival research" },
    ],
  },
  {
    id: "group3",
    label: "Group III: Applied & Skill Subjects (Choose 1)",
    subtitle: "Practical, Vocational & Creative Specializations",
    icon: Zap,
    color: "text-purple-600",
    subjects: [
      { id: "icse-comp-apps", name: "Computer Applications (Java Programming)", icon: Monitor, career: "Software development, web design, IT operations, data management" },
      { id: "icse-robotics-ai", name: "Robotics and Artificial Intelligence", icon: Monitor, career: "Robotics engineering, AI/ML models, automation systems, smart IoT" },
      { id: "icse-econ-apps", name: "Economic Applications", icon: TrendingUp, career: "Applied economics, financial literacy, business strategy, commerce" },
      { id: "icse-comm-apps", name: "Commercial Applications", icon: Briefcase, career: "Business operations, bookkeeping, retail management, corporate trade" },
      { id: "icse-art", name: "Art (Drawing & Painting)", icon: Palette, career: "Fine arts, graphic design, illustration, interior styling, art therapy" },
      { id: "icse-performing", name: "Performing Arts (Dance / Drama / Music)", icon: Music, career: "Theatre, film production, stage performance, cultural management" },
      { id: "icse-home-sci", name: "Home Science", icon: Leaf, career: "Clinical nutrition, interior design, child development, hospitality" },
      { id: "icse-fashion", name: "Fashion Designing", icon: Palette, career: "Fashion styling, garment technology, textile merchandising" },
      { id: "icse-pe", name: "Physical Education", icon: Dumbbell, career: "Sports science, athletic coaching, physiotherapy, fitness management" },
      { id: "icse-yoga", name: "Yoga", icon: Dumbbell, career: "Holistic health consulting, yoga instruction, wellness centres" },
      { id: "icse-cookery", name: "Cookery", icon: Leaf, career: "Culinary arts, food technology, hospitality & hotel management" },
      { id: "icse-media", name: "Mass Media & Communication", icon: Globe, career: "Broadcast journalism, public relations, digital media, advertising" },
      { id: "icse-hospitality", name: "Hospitality Management", icon: Briefcase, career: "Hotel operations, tourism management, luxury event planning" },
      { id: "icse-beauty", name: "Beauty & Wellness", icon: Palette, career: "Cosmetology, dermatology assistance, wellness consulting" },
    ],
  },
];

// ISC Senior Secondary (Classes 11–12)
const iscSeniorGroups: SubjectGroup[] = [
  {
    id: "compulsory",
    label: "Compulsory Subject",
    subtitle: "Mandatory for All ISC Candidates",
    icon: BookOpen,
    color: "text-blue-600",
    subjects: [
      { id: "isc-english", name: "English (Paper 1: Language & Paper 2: Literature in English)", icon: BookOpen, career: "Communication, law, media, corporate governance – base for all professional fields" },
    ],
  },
  {
    id: "science",
    label: "Science Electives",
    subtitle: "Engineering, Medicine & Scientific Research",
    icon: Atom,
    color: "text-blue-600",
    subjects: [
      { id: "isc-physics", name: "Physics", icon: Atom, career: "Engineering (JEE), aerospace, quantum research, robotics, data science" },
      { id: "isc-chemistry", name: "Chemistry", icon: FlaskConical, career: "Medicine (NEET), chemical engineering, pharmacy, materials research" },
      { id: "isc-biology", name: "Biology", icon: Leaf, career: "MBBS, BDS, biotechnology, clinical research, genetics, neuroscience" },
      { id: "isc-maths", name: "Mathematics", icon: Calculator, career: "Engineering, pure mathematics, data science, quantitative finance, actuarial" },
      { id: "isc-applied-maths", name: "Applied Mathematics", icon: Calculator, career: "Financial modeling, statistics, commerce & economics pathway" },
      { id: "isc-cs", name: "Computer Science (Java / Data Structures)", icon: Monitor, career: "Software engineering, algorithms, AI systems, cloud architecture" },
      { id: "isc-biotech", name: "Biotechnology", icon: Leaf, career: "Biotech R&D, genetic engineering, pharmaceutical manufacturing" },
      { id: "isc-env-sci", name: "Environmental Science", icon: Leaf, career: "Sustainability, ecological conservation, climate change policy" },
      { id: "isc-electronics", name: "Electricity & Electronics", icon: Atom, career: "Hardware design, VLSI, telecommunications engineering" },
    ],
  },
  {
    id: "commerce",
    label: "Commerce & Management Electives",
    subtitle: "Finance, Corporate Management & Economics",
    icon: Briefcase,
    color: "text-amber-600",
    subjects: [
      { id: "isc-accounts", name: "Accounts / Accountancy", icon: TrendingUp, career: "Chartered Accountancy (CA), CMA, corporate audit, investment banking" },
      { id: "isc-commerce-subj", name: "Commerce", icon: Briefcase, career: "Business operations, international trade, supply chain management" },
      { id: "isc-biz-studies", name: "Business Studies", icon: Briefcase, career: "MBA, organizational strategy, marketing management, entrepreneurship" },
      { id: "isc-economics", name: "Economics", icon: TrendingUp, career: "Economic research, policy advisory, financial analytics, civil services" },
    ],
  },
  {
    id: "humanities",
    label: "Humanities & Social Science Electives",
    subtitle: "Law, Governance, Behaviour & Society",
    icon: Globe,
    color: "text-purple-600",
    subjects: [
      { id: "isc-history", name: "History", icon: Globe, career: "Civil services (UPSC CSE), law, diplomacy, historical research, journalism" },
      { id: "isc-pol-sci", name: "Political Science", icon: Scale, career: "Civil services (IAS/IPS/IFS), constitutional law, public policy, diplomacy" },
      { id: "isc-geography", name: "Geography", icon: Globe, career: "Urban town planning, GIS spatial modeling, environmental management" },
      { id: "isc-sociology", name: "Sociology", icon: Users, career: "Social research, human resources, public relations, non-profit leadership" },
      { id: "isc-psychology", name: "Psychology", icon: Users, career: "Clinical psychology, neuropsychology, counseling, HR, UX research" },
      { id: "isc-legal", name: "Legal Studies", icon: Scale, career: "Corporate law (CLAT / LLB), judicial services, legal advocacy" },
      { id: "isc-elective-eng", name: "Elective English", icon: BookOpen, career: "Literature analysis, creative writing, journalism, publishing" },
      { id: "isc-mass-media", name: "Mass Media & Communication", icon: Globe, career: "Broadcast media, digital filmmaking, advertising, PR strategy" },
    ],
  },
  {
    id: "applied-arts",
    label: "Applied, Creative & Vocational Electives",
    subtitle: "Sports Science, Arts, Hospitality & Design",
    icon: Palette,
    color: "text-emerald-600",
    subjects: [
      { id: "isc-pe", name: "Physical Education", icon: Dumbbell, career: "Sports science, athletic coaching, sports management, physiotherapy" },
      { id: "isc-art", name: "Art", icon: Palette, career: "Fine arts, visual graphics, animation, interior design" },
      { id: "isc-music", name: "Music (Indian / Western)", icon: Music, career: "Music performance, audio engineering, music production" },
      { id: "isc-home-sci", name: "Home Science", icon: Leaf, career: "Dietetics, clinical nutrition, interior styling, hospitality management" },
      { id: "isc-fashion", name: "Fashion Designing", icon: Palette, career: "Apparel design, textile technology, fashion styling" },
      { id: "isc-hospitality", name: "Hospitality Management", icon: Briefcase, career: "Hotel administration, culinary arts, international tourism" },
    ],
  },
];

// ─────────────────────────────────────────────────────────────
// 3. IB CURRICULUM — PYP, MYP & DP (INTERNATIONAL BACCALAUREATE)
// ─────────────────────────────────────────────────────────────

// IB Primary Years Programme (PYP - Classes 1–5)
const ibPypGroups: SubjectGroup[] = [
  {
    id: "language",
    label: "Language & Inquiry",
    subtitle: "Language A (English / Mother Tongue)",
    icon: BookOpen,
    color: "text-blue-600",
    subjects: [
      { id: "ib-pyp-lang", name: "Language (English / Language A)", icon: BookOpen, career: "Foundation for global communication, creative expression, inquiry-based learning" },
      { id: "ib-pyp-second-lang", name: "Additional Language (French / Spanish / Hindi / German / Mandarin)", icon: Languages, career: "Multilingual development for global citizenship, diplomacy, international careers" },
    ],
  },
  {
    id: "maths-inquiry",
    label: "Mathematics & Scientific Inquiry",
    subtitle: "Units of Inquiry (Programme of Inquiry - POI)",
    icon: Calculator,
    color: "text-emerald-600",
    subjects: [
      { id: "ib-pyp-maths", name: "Mathematics (Inquiry, Numbers & Geometry)", icon: Calculator, career: "Mathematical thinking, pattern analysis, quantitative reasoning" },
      { id: "ib-pyp-uoi", name: "Units of Inquiry (Science & Social Studies Interdisciplinary)", icon: Globe, career: "Inquiry into ecological systems, scientific discovery, social history, culture" },
    ],
  },
  {
    id: "arts-pspe",
    label: "Arts & Physical, Social and Personal Education",
    subtitle: "Holistic Wellbeing & Creative Expression",
    icon: Palette,
    color: "text-purple-600",
    subjects: [
      { id: "ib-pyp-arts", name: "The Arts (Visual Arts, Music & Drama)", icon: Palette, career: "Creative arts, performing arts, design intuition, acoustic expression" },
      { id: "ib-pyp-pspe", name: "PSPE (Physical, Social and Personal Education)", icon: Dumbbell, career: "Physical health, social-emotional learning, sports, collaborative teamwork" },
    ],
  },
];

// IB Middle Years Programme (MYP - Classes 6–10)
const ibMypGroups: SubjectGroup[] = [
  {
    id: "myp-languages",
    label: "MYP Language Groups",
    subtitle: "Language & Literature and Language Acquisition",
    icon: Languages,
    color: "text-indigo-600",
    subjects: [
      { id: "ib-myp-langlit", name: "Language and Literature (English / First Language)", icon: BookOpen, career: "Literary critique, rhetoric, journalism, media, international law" },
      { id: "ib-myp-langacq", name: "Language Acquisition (French / Spanish / Hindi / German / Mandarin)", icon: Languages, career: "Multilingual proficiency for global diplomacy, international commerce" },
    ],
  },
  {
    id: "myp-individuals",
    label: "Individuals and Societies",
    subtitle: "History, Geography, Economics & Global Politics",
    icon: Globe,
    color: "text-emerald-600",
    subjects: [
      { id: "ib-myp-indsoc", name: "Individuals and Societies (Integrated Humanities)", icon: Globe, career: "Civil services, global politics, economics, sociology, international relations" },
      { id: "ib-myp-history", name: "MYP History", icon: Globe, career: "Historical analysis, geopolitical strategy, diplomacy, legal research" },
      { id: "ib-myp-geography", name: "MYP Geography", icon: Globe, career: "Urban geography, geospatial systems, environmental policy" },
      { id: "ib-myp-economics", name: "MYP Economics", icon: TrendingUp, career: "Market economics, financial consulting, banking, trade analysis" },
    ],
  },
  {
    id: "myp-sciences-maths",
    label: "Sciences & Mathematics",
    subtitle: "Experimental Sciences & Standard / Extended Maths",
    icon: FlaskConical,
    color: "text-blue-600",
    subjects: [
      { id: "ib-myp-math-std", name: "Mathematics (Standard Mathematics)", icon: Calculator, career: "Mathematical foundations for business, social sciences, general science" },
      { id: "ib-myp-math-ext", name: "Mathematics (Extended Mathematics)", icon: Calculator, career: "Advanced algebra, trigonometry & calculus for Engineering, Physics, Pure Math" },
      { id: "ib-myp-sciences", name: "Sciences (Integrated Physics, Chemistry & Biology)", icon: FlaskConical, career: "Scientific experimental design, medicine, biotechnology, engineering" },
      { id: "ib-myp-physics", name: "MYP Physics", icon: Atom, career: "Mechanics, waves, electromagnetism – engineering and aerospace" },
      { id: "ib-myp-chemistry", name: "MYP Chemistry", icon: FlaskConical, career: "Chemical bonding, thermodynamics – medicine, chemical engineering" },
      { id: "ib-myp-biology", name: "MYP Biology", icon: Leaf, career: "Cellular biology, genetics, ecology – medical sciences & biotechnology" },
    ],
  },
  {
    id: "myp-design-arts",
    label: "Design, Arts & Physical Education",
    subtitle: "Product Design, Digital Tech, Arts & Health",
    icon: Zap,
    color: "text-purple-600",
    subjects: [
      { id: "ib-myp-design", name: "Design (Digital Design / Product Design / Robotics)", icon: Monitor, career: "UI/UX architecture, robotics engineering, 3D product design, tech innovation" },
      { id: "ib-myp-arts", name: "Arts (Visual Arts, Performing Arts, Music, Drama)", icon: Palette, career: "Fine arts, animation, filmmaking, musical composition, theatre" },
      { id: "ib-myp-phe", name: "Physical and Health Education (PHE)", icon: Dumbbell, career: "Sports science, athletic coaching, kinesiology, physical therapy" },
      { id: "ib-myp-personal-proj", name: "MYP Personal Project & Interdisciplinary Unit", icon: Sparkles, career: "Independent research, project management, entrepreneurial innovation" },
    ],
  },
];

// IB Diploma Programme (DP - Classes 11–12) — 6 Subject Groups with HL/SL
const ibDpGroups: SubjectGroup[] = [
  {
    id: "group1",
    label: "Group 1: Studies in Language & Literature",
    subtitle: "Choose at least 1 Subject (HL or SL)",
    icon: BookOpen,
    color: "text-indigo-600",
    subjects: [
      { id: "ib-eng-lit", name: "English A: Literature (HL/SL)", level: "HL", icon: BookOpen, career: "Advanced literary critique, media, law, international publishing, journalism" },
      { id: "ib-eng-langlit", name: "English A: Language and Literature (HL/SL)", level: "HL", icon: BookOpen, career: "Strategic communications, rhetoric, media analysis, corporate leadership" },
      { id: "ib-lang-a-selftaught", name: "Language A: Literature (School-Supported Self-Taught SL)", level: "SL", icon: Languages, career: "Mother-tongue literary mastery, comparative linguistics, translation" },
    ],
  },
  {
    id: "group2",
    label: "Group 2: Language Acquisition",
    subtitle: "Second Language (Language B HL/SL or Ab Initio SL)",
    icon: Languages,
    color: "text-blue-600",
    subjects: [
      { id: "ib-french-b", name: "French B (HL/SL)", icon: Languages, career: "International diplomacy, UN agencies, global commerce, European trade" },
      { id: "ib-spanish-b", name: "Spanish B (HL/SL)", icon: Languages, career: "Global trade, international relations, Latin American business" },
      { id: "ib-hindi-b", name: "Hindi B (HL/SL)", icon: Languages, career: "South Asian regional governance, business relations, media" },
      { id: "ib-german-b", name: "German B (HL/SL)", icon: Languages, career: "German engineering, automotive industry, European scientific research" },
      { id: "ib-mandarin-b", name: "Mandarin B (HL/SL)", icon: Languages, career: "Global supply chain, East Asian trade, international business" },
      { id: "ib-french-abinitio", name: "French Ab Initio (SL)", level: "SL", icon: Languages, career: "Entry-level international language for global travel, commerce" },
      { id: "ib-spanish-abinitio", name: "Spanish Ab Initio (SL)", level: "SL", icon: Languages, career: "Entry-level global language proficiency for international career readiness" },
    ],
  },
  {
    id: "group3",
    label: "Group 3: Individuals and Societies",
    subtitle: "Humanities, Business, Economics & Social Sciences",
    icon: Globe,
    color: "text-emerald-600",
    subjects: [
      { id: "ib-eco", name: "Economics (HL/SL)", icon: TrendingUp, career: "Investment banking, quantitative finance, economic policy, management consulting" },
      { id: "ib-busman", name: "Business Management (HL/SL)", icon: Briefcase, career: "Corporate strategy, venture entrepreneurship, marketing management" },
      { id: "ib-psych", name: "Psychology (HL/SL)", icon: Users, career: "Clinical psychology, behavioral economics, cognitive counseling, UX research" },
      { id: "ib-history", name: "History (HL/SL)", icon: Globe, career: "International law, diplomacy, geopolitical analysis, academic research" },
      { id: "ib-global-politics", name: "Global Politics (HL/SL)", icon: Scale, career: "Foreign service, international relations, policy think tanks, human rights" },
      { id: "ib-geography", name: "Geography (HL/SL)", icon: Globe, career: "Urban town planning, GIS modeling, global resource management" },
      { id: "ib-philosophy", name: "Philosophy (HL/SL)", icon: BookOpen, career: "Ethics research, legal jurisprudence, constitutional analysis, civil services" },
      { id: "ib-ess-g3", name: "Environmental Systems & Societies (ESS SL)", level: "SL", icon: Leaf, career: "Environmental law, sustainability consulting, ecological management" },
    ],
  },
  {
    id: "group4",
    label: "Group 4: Sciences",
    subtitle: "Experimental Sciences & Computer Science (HL/SL)",
    icon: FlaskConical,
    color: "text-amber-600",
    subjects: [
      { id: "ib-physics", name: "Physics (HL/SL)", icon: Atom, career: "Engineering (all fields), aerospace, robotics, quantum computing, pure physics" },
      { id: "ib-chem", name: "Chemistry (HL/SL)", icon: FlaskConical, career: "Medicine (MBBS), chemical engineering, pharmacology, materials science" },
      { id: "ib-bio", name: "Biology (HL/SL)", icon: Leaf, career: "Medicine, biotechnology, genetics, biomedical sciences, neuroscience" },
      { id: "ib-cs", name: "Computer Science (HL/SL)", icon: Monitor, career: "Software engineering, algorithms, AI/ML, cybersecurity, data architecture" },
      { id: "ib-design-tech", name: "Design Technology (HL/SL)", icon: Monitor, career: "Product engineering, industrial design, ergonomic systems, manufacturing" },
      { id: "ib-sehs", name: "Sports, Exercise and Health Science (HL/SL)", icon: Dumbbell, career: "Sports medicine, physiotherapy, athletic training, kinesiology" },
      { id: "ib-ess-g4", name: "Environmental Systems & Societies (ESS SL)", level: "SL", icon: Leaf, career: "Climate science, renewable energy policy, conservation biology" },
    ],
  },
  {
    id: "group5",
    label: "Group 5: Mathematics",
    subtitle: "Analysis & Approaches (AA) or Applications & Interpretation (AI)",
    icon: Calculator,
    color: "text-purple-600",
    subjects: [
      { id: "ib-math-aa-hl", name: "Mathematics: Analysis and Approaches (AA HL)", level: "HL", icon: Calculator, career: "Essential for Pure Math, Physics, Top Engineering (IIT/MIT/Cambridge), CS" },
      { id: "ib-math-aa-sl", name: "Mathematics: Analysis and Approaches (AA SL)", level: "SL", icon: Calculator, career: "Calculus & analytical math for Economics, Medicine, Chemistry, Data Analytics" },
      { id: "ib-math-ai-hl", name: "Mathematics: Applications and Interpretation (AI HL)", level: "HL", icon: Calculator, career: "Statistical modeling, big data, applied finance, social science analytics" },
      { id: "ib-math-ai-sl", name: "Mathematics: Applications and Interpretation (AI SL)", level: "SL", icon: Calculator, career: "Practical numeracy, statistical literacy for Business, Law, Design, Humanities" },
    ],
  },
  {
    id: "group6",
    label: "Group 6: The Arts & Electives",
    subtitle: "Visual Arts, Music, Theatre, Film (or Extra Science/Humanities)",
    icon: Palette,
    color: "text-pink-600",
    subjects: [
      { id: "ib-visarts", name: "Visual Arts (HL/SL)", icon: Palette, career: "Fine arts, architecture, industrial design, creative direction, animation" },
      { id: "ib-music", name: "Music (HL/SL)", icon: Music, career: "Music production, acoustic composition, sound engineering, performance" },
      { id: "ib-theatre", name: "Theatre (HL/SL)", icon: Music, career: "Dramatic arts, stage production, screenwriting, creative direction" },
      { id: "ib-film", name: "Film (HL/SL)", icon: Globe, career: "Filmmaking, cinematography, digital media production, visual effects" },
      { id: "ib-dp-core", name: "IB DP Core (Theory of Knowledge - TOK & Extended Essay)", icon: Sparkles, career: "Epistemology, critical academic research, independent thesis defense" },
    ],
  },
];

// ─────────────────────────────────────────────────────────────
// STREAM COMBOS (Class 11-12)
// ─────────────────────────────────────────────────────────────
const cbseStreamCombos: StreamCombo[] = [
  {
    id: "pcm",
    label: "PCM (Engineering & Tech)",
    description: "Physics (042) + Chemistry (043) + Maths (041) + English Core (301) + Computer Science (083)",
    subjects: ["eng-core", "physics", "chemistry", "maths-sr", "comp-sci"],
    color: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30 hover:bg-blue-500/20",
    badge: "JEE / B.Tech / CS",
  },
  {
    id: "pcb",
    label: "PCB (Medical & Healthcare)",
    description: "Physics (042) + Chemistry (043) + Biology (044) + English Core (301) + Physical Education (048)",
    subjects: ["eng-core", "physics", "chemistry", "biology", "pe-sr"],
    color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20",
    badge: "NEET / MBBS / Pharma",
  },
  {
    id: "pcmb",
    label: "PCMB (Broad Scientific Spectrum)",
    description: "Physics (042) + Chemistry (043) + Maths (041) + Biology (044) + English Core (301)",
    subjects: ["eng-core", "physics", "chemistry", "maths-sr", "biology"],
    color: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/20",
    badge: "JEE + NEET + Biotech",
  },
  {
    id: "pcm-ai",
    label: "PCM + AI / Data Science (New-Age Tech)",
    description: "Physics (042) + Chemistry (043) + Maths (041) + English Core (301) + Artificial Intelligence (843)",
    subjects: ["eng-core", "physics", "chemistry", "maths-sr", "ai-sr"],
    color: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/20",
    badge: "AI / Data Science",
  },
  {
    id: "commerce-maths",
    label: "Commerce with Applied Maths",
    description: "Accountancy (055) + Business Studies (054) + Economics (030) + English Core (301) + Applied Maths (241)",
    subjects: ["eng-core", "accountancy", "biz-studies", "economics", "applied-maths"],
    color: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30 hover:bg-amber-500/20",
    badge: "CA / Finance / FinTech",
  },
  {
    id: "commerce-cs",
    label: "Commerce with Computer Science",
    description: "Accountancy (055) + Business Studies (054) + Economics (030) + English Core (301) + Computer Science (083)",
    subjects: ["eng-core", "accountancy", "biz-studies", "economics", "comp-sci"],
    color: "bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/30 hover:bg-orange-500/20",
    badge: "BBA / Analytics / E-Com",
  },
  {
    id: "humanities-civil",
    label: "Humanities — Civil Services & Law",
    description: "History (027) + Political Science (028) + Geography (029) + Legal Studies (074) + English Core (301)",
    subjects: ["eng-core", "history", "pol-sci", "geography", "legal-studies"],
    color: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30 hover:bg-purple-500/20",
    badge: "IAS / IPS / Law (CLAT)",
  },
  {
    id: "humanities-psych",
    label: "Humanities — Psychology & Social Sciences",
    description: "Psychology (037) + Sociology (039) + Political Science (028) + Economics (030) + English Core (301)",
    subjects: ["eng-core", "psychology", "sociology", "pol-sci", "economics"],
    color: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30 hover:bg-rose-500/20",
    badge: "Clinical Psychology / HR",
  },
];

const iscStreamCombos: StreamCombo[] = [
  {
    id: "isc-pcm",
    label: "ISC Science (PCM + CS)",
    description: "English + Physics + Chemistry + Mathematics + Computer Science",
    subjects: ["isc-english", "isc-physics", "isc-chemistry", "isc-maths", "isc-cs"],
    color: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30 hover:bg-blue-500/20",
    badge: "Engineering / JEE",
  },
  {
    id: "isc-pcb",
    label: "ISC Medical (PCB + Biotech)",
    description: "English + Physics + Chemistry + Biology + Biotechnology",
    subjects: ["isc-english", "isc-physics", "isc-chemistry", "isc-biology", "isc-biotech"],
    color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20",
    badge: "NEET / Medical",
  },
  {
    id: "isc-comm",
    label: "ISC Commerce with Maths",
    description: "English + Accounts + Commerce + Economics + Mathematics",
    subjects: ["isc-english", "isc-accounts", "isc-commerce-subj", "isc-economics", "isc-maths"],
    color: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30 hover:bg-amber-500/20",
    badge: "CA / Banking / MBA",
  },
  {
    id: "isc-hum",
    label: "ISC Humanities (Law & Policy)",
    description: "English + History + Political Science + Psychology + Legal Studies",
    subjects: ["isc-english", "isc-history", "isc-pol-sci", "isc-psychology", "isc-legal"],
    color: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30 hover:bg-purple-500/20",
    badge: "Law / Civil Services",
  },
];

const ibDpStreamCombos: StreamCombo[] = [
  {
    id: "ib-stem",
    label: "IB DP STEM & Engineering",
    description: "Math AA HL + Physics HL + Chemistry HL + English A LangLit SL + French B SL + Economics SL",
    subjects: ["ib-math-aa-hl", "ib-physics", "ib-chem", "ib-eng-langlit", "ib-french-b", "ib-eco"],
    color: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30 hover:bg-blue-500/20",
    badge: "Global Engineering / CS",
  },
  {
    id: "ib-med",
    label: "IB DP Pre-Med & Life Sciences",
    description: "Biology HL + Chemistry HL + Psychology HL + English A Lit SL + Spanish B SL + Math AA SL",
    subjects: ["ib-bio", "ib-chem", "ib-psych", "ib-eng-lit", "ib-spanish-b", "ib-math-aa-sl"],
    color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20",
    badge: "Pre-Med / BioTech",
  },
  {
    id: "ib-biz",
    label: "IB DP Business & Economics",
    description: "Economics HL + Business Management HL + English A LangLit HL + Math AI HL + French B SL + Computer Science SL",
    subjects: ["ib-eco", "ib-busman", "ib-eng-langlit", "ib-math-ai-hl", "ib-french-b", "ib-cs"],
    color: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30 hover:bg-amber-500/20",
    badge: "Finance / Management",
  },
  {
    id: "ib-humanities",
    label: "IB DP Liberal Arts & Law",
    description: "Global Politics HL + History HL + English A Lit HL + Psychology SL + Spanish Ab Initio SL + Math AI SL",
    subjects: ["ib-global-politics", "ib-history", "ib-eng-lit", "ib-psych", "ib-spanish-abinitio", "ib-math-ai-sl"],
    color: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30 hover:bg-purple-500/20",
    badge: "Law / Diplomacy / Media",
  },
];

// ─────────────────────────────────────────────────────────────
// STAGE HELPERS
// ─────────────────────────────────────────────────────────────
const GRADE_STAGES = [
  { stageId: "preparatory", stageLabel: "Preparatory / Primary", ageRange: "Classes 1–5", grades: [1, 2, 3, 4, 5] },
  { stageId: "middle", stageLabel: "Middle School", ageRange: "Classes 6–8", grades: [6, 7, 8] },
  { stageId: "secondary", stageLabel: "Secondary", ageRange: "Classes 9–10", grades: [9, 10] },
  { stageId: "senior", stageLabel: "Senior Secondary", ageRange: "Classes 11–12", grades: [11, 12] },
];

function getStageInfo(gradeNum: number): GradeStageInfo {
  if (gradeNum <= 5) return { stageId: "preparatory", stageLabel: "Preparatory (Classes 1–5)", ageRange: "Age 6–11", gradeNum };
  if (gradeNum <= 8) return { stageId: "middle", stageLabel: "Middle (Classes 6–8)", ageRange: "Age 11–14", gradeNum };
  if (gradeNum <= 10) return { stageId: "secondary", stageLabel: "Secondary (Classes 9–10)", ageRange: "Age 14–16", gradeNum };
  return { stageId: "senior", stageLabel: "Senior Secondary (Classes 11–12)", ageRange: "Age 16–18", gradeNum };
}

function getSubjectGroups(board: BoardType, gradeNum: number): SubjectGroup[] {
  if (board === "cbse") {
    if (gradeNum <= 5) return cbsePrimaryGroups;
    if (gradeNum <= 8) return cbseMiddleGroups;
    if (gradeNum <= 10) return cbseSecondaryGroups;
    return cbseSeniorGroups;
  }
  if (board === "icse") {
    if (gradeNum <= 5) return icsePrimaryGroups;
    if (gradeNum <= 8) return icseMiddleGroups;
    if (gradeNum <= 10) return icseSecondaryGroups;
    return iscSeniorGroups;
  }
  // IB
  if (gradeNum <= 5) return ibPypGroups;
  if (gradeNum <= 10) return ibMypGroups;
  return ibDpGroups;
}

const MIN_SUBJECTS = 3;

// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────
export const SubjectSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { grade?: string; stage?: string; board?: BoardType } | undefined;

  const initialGradeStr = state?.grade || "Grade 10";
  const initialGradeNum = parseInt(initialGradeStr.replace(/\D/g, "")) || 10;

  const [selectedGradeNum, setSelectedGradeNum] = useState<number>(initialGradeNum);
  const [board, setBoard] = useState<BoardType>(state?.board || "cbse");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [showError, setShowError] = useState(false);
  const [customSubjectInput, setCustomSubjectInput] = useState("");
  const [customLanguageNames, setCustomLanguageNames] = useState<Record<string, string>>({});
  const [showGrading, setShowGrading] = useState(false);

  const stageInfo = getStageInfo(selectedGradeNum);
  const isSenior = selectedGradeNum >= 11;

  const groups = useMemo(() => {
    return getSubjectGroups(board, selectedGradeNum);
  }, [board, selectedGradeNum]);

  const streamCombos = useMemo(() => {
    if (!isSenior) return [];
    if (board === "cbse") return cbseStreamCombos;
    if (board === "icse") return iscStreamCombos;
    return ibDpStreamCombos;
  }, [board, isSenior]);

  const isCustomizableLanguage = (id: string) => {
    return [
      "hindi", "hindi-a", "hindi-b", "hindi-core", "hindi-elective",
      "icse-second-lang", "other-lang-sr", "third-lang", "third-lang-mid",
      "sanskrit", "urdu", "urdu-a", "urdu-b", "other-lang",
      "icse-second-lang-pri", "icse-third-lang-mid", "ib-pyp-second-lang"
    ].includes(id);
  };

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
    setShowError(false);
  };

  const applyCombo = (combo: StreamCombo) => {
    setSelected(new Set(combo.subjects));
    setShowError(false);
  };

  const addCustomSubject = () => {
    const trimmed = customSubjectInput.trim();
    if (!trimmed) return;
    const customId = `custom_${trimmed.toLowerCase().replace(/\s+/g, "-")}`;
    setSelected((prev) => {
      const next = new Set(prev);
      next.add(customId);
      return next;
    });
    setCustomSubjectInput("");
    setShowError(false);
  };

  const handleNext = () => {
    if (selected.size < MIN_SUBJECTS) {
      setShowError(true);
      return;
    }

    const finalSelected = new Set<string>();
    selected.forEach((id) => {
      if (isCustomizableLanguage(id) && customLanguageNames[id]?.trim()) {
        finalSelected.add(`custom_${customLanguageNames[id].trim().replace(/\s+/g, "-")}`);
      } else {
        finalSelected.add(id);
      }
    });

    navigate("/subject-quiz", {
      state: {
        grade: `Grade ${selectedGradeNum}`,
        stage: stageInfo.stageId,
        board,
        selectedSubjects: Array.from(finalSelected),
      },
    });
  };

  // Filter groups by search query
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return groups;
    const query = searchQuery.toLowerCase().trim();

    return groups
      .map((g) => ({
        ...g,
        subjects: g.subjects.filter(
          (s) =>
            s.name.toLowerCase().includes(query) ||
            (s.code && s.code.toLowerCase().includes(query)) ||
            s.career.toLowerCase().includes(query)
        ),
      }))
      .filter((g) => g.subjects.length > 0);
  }, [groups, searchQuery]);

  const allSubjects = groups.flatMap((g) => g.subjects);
  const gradingData = board === "ib" ? IB_GRADES : board === "cbse" ? CBSE_GRADES : ICSE_GRADES;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Select Your Subjects — Zertainity"
        description="Select your syllabus subjects for CBSE, ICSE, or IB curriculum to personalize your academic and career analysis."
        canonical="/subject-selection"
      />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="mx-auto max-w-[1080px] px-6 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-border/60 hover:bg-muted transition-all"
              aria-label="Back"
            >
              <ArrowLeft className="w-4 h-4 text-muted-foreground" />
            </button>
            <div>
              <h1 className="text-[15px] font-medium leading-tight">Subject Selection</h1>
              <p className="text-[12px] text-muted-foreground truncate">
                Class {selectedGradeNum} · {stageInfo.stageLabel} · {board.toUpperCase()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {selected.size > 0 && (
              <Badge variant="secondary" className="px-3 py-1 text-xs font-semibold">
                {selected.size} Selected
              </Badge>
            )}
            <Button
              size="sm"
              onClick={handleNext}
              disabled={selected.size < MIN_SUBJECTS}
              className="h-8 px-4 text-xs font-medium"
            >
              Continue
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[820px] px-6 py-8">
        <AssessmentStepper currentStep={3} totalSteps={5} />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-8"
        >
          {/* Main Title */}
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-3 px-3 py-1 text-xs uppercase tracking-widest text-primary border-primary/30">
              2026–2027 Updated Syllabus
            </Badge>
            <h2 className="text-[32px] sm:text-[40px] font-light tracking-tight leading-tight font-serif mb-2">
              Select your academic subjects
            </h2>
            <p className="text-[15px] text-muted-foreground max-w-xl mx-auto font-light">
              Choose your current classes and curriculum subjects to calibrate your career compatibility, skill mapping, and academic diagnostics.
            </p>
          </div>

          {/* Class / Grade Stage Switcher */}
          <Card className="mb-6 border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <School className="w-4 h-4 text-primary" />
                    Select Class / Grade
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Current stage: <span className="font-semibold text-foreground">{stageInfo.stageLabel}</span> ({stageInfo.ageRange})
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="text-xs font-mono">
                  Grade {selectedGradeNum}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-1.5">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((g) => {
                  const isSelected = selectedGradeNum === g;
                  return (
                    <button
                      key={g}
                      onClick={() => {
                        setSelectedGradeNum(g);
                        setSelected(new Set());
                      }}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                        isSelected
                          ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                          : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/40"
                      )}
                    >
                      Class {g}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Board Selector & Grading Toggle */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-1.5 p-1 bg-muted/50 rounded-xl border border-border/50 w-full sm:w-auto">
              {(["cbse", "icse", "ib"] as BoardType[]).map((b) => {
                const isActive = board === b;
                const boardLabel =
                  b === "cbse"
                    ? "CBSE (NCF-SE)"
                    : b === "icse"
                    ? selectedGradeNum > 10
                      ? "ISC (11-12)"
                      : "ICSE"
                    : selectedGradeNum <= 5
                    ? "IB PYP"
                    : selectedGradeNum <= 10
                    ? "IB MYP"
                    : "IB DP";

                return (
                  <button
                    key={b}
                    onClick={() => {
                      setBoard(b);
                      setSelected(new Set());
                    }}
                    className={cn(
                      "flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-medium transition-all text-center",
                      isActive
                        ? "bg-background text-foreground shadow-sm font-semibold border border-border/80"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {boardLabel}
                  </button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowGrading(!showGrading)}
              className="text-xs h-9 border-border/60 shrink-0 w-full sm:w-auto"
            >
              <BarChart className="w-3.5 h-3.5 mr-1.5 text-primary" />
              {showGrading ? "Hide Grading Scale" : "View Grading Scale"}
            </Button>
          </div>

          {/* Grading Scale Popout */}
          <AnimatePresence>
            {showGrading && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-6"
              >
                <Card className="border border-border/60 bg-muted/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      {board === "ib"
                        ? "IB 1–7 Performance Descriptors"
                        : board === "cbse"
                        ? "CBSE Positional Grading Reference"
                        : "CISCE 9-Point Grading Scale"}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {board === "cbse"
                        ? "CBSE awards positional percentiles (A1 to E). Scores below 33% require remedial reinforcement."
                        : board === "ib"
                        ? "IB marks are evaluated on a 1 (lowest) to 7 (highest) holistic achievement scale."
                        : "CISCE uses numerical pass credits from Grade 1 (highest) to Grade 9."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {gradingData.map((g: any) => (
                        <div
                          key={g.grade}
                          className="p-2.5 rounded-lg border border-border/50 bg-background/80 flex flex-col justify-between text-xs"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-primary">{g.grade}</span>
                            <span className="text-[11px] text-muted-foreground">{g.range}</span>
                          </div>
                          <span className="text-[10px] text-muted-foreground/80 leading-tight">
                            {g.remark || `Grade Point: ${g.points}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Curated Stream Combos (Class 11-12) */}
          {isSenior && streamCombos.length > 0 && (
            <Card className="mb-8 border-border/60 bg-muted/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Quick Stream Packages (Classes 11–12)
                  </CardTitle>
                  <Badge variant="outline" className="text-[10px]">
                    1-Click Select
                  </Badge>
                </div>
                <CardDescription className="text-xs">
                  Select standard board-aligned combination packages or customize individual subjects below.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {streamCombos.map((combo) => {
                    const isAllSelected = combo.subjects.every((s) => selected.has(s));
                    return (
                      <button
                        key={combo.id}
                        onClick={() => applyCombo(combo)}
                        className={cn(
                          "p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between",
                          isAllSelected
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-border/60 bg-background hover:border-border hover:bg-muted/30"
                        )}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <span className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                            {combo.label}
                          </span>
                          <Badge variant="secondary" className="text-[10px] py-0 px-2 shrink-0">
                            {combo.badge}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                          {combo.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Search / Filter Bar */}
          <div className="relative mb-6">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-muted-foreground" />
            <Input
              type="text"
              placeholder={`Search subjects for Class ${selectedGradeNum} (${board.toUpperCase()})...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-9 h-10 text-xs border-border/60 bg-background"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Subject Groups & Pills */}
          <div className="space-y-6">
            {filteredGroups.map((group) => {
              const GroupIcon = group.icon;
              return (
                <Card key={group.id} className="border-border/60 overflow-hidden shadow-sm">
                  <CardHeader className="py-3 px-5 bg-muted/20 border-b border-border/40">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-background flex items-center justify-center border border-border/60">
                        <GroupIcon className={cn("w-4 h-4", group.color)} />
                      </div>
                      <div>
                        <CardTitle className="text-xs font-semibold">{group.label}</CardTitle>
                        {group.subtitle && (
                          <CardDescription className="text-[11px] font-light">
                            {group.subtitle}
                          </CardDescription>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="grid sm:grid-cols-2 gap-2">
                      {group.subjects.map((subject) => {
                        const isSelected = selected.has(subject.id);
                        const SubjectIcon = subject.icon;
                        const isCustomLang = isCustomizableLanguage(subject.id);

                        return (
                          <div
                            key={subject.id}
                            className={cn(
                              "p-3 rounded-xl border transition-all cursor-pointer select-none relative flex flex-col justify-between gap-1.5",
                              isSelected
                                ? "border-primary bg-primary/5 shadow-sm"
                                : "border-border/50 bg-background/50 hover:bg-muted/30 hover:border-border"
                            )}
                            onClick={() => toggle(subject.id)}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <div
                                  className={cn(
                                    "w-6 h-6 rounded-md flex items-center justify-center shrink-0 text-xs",
                                    isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                  )}
                                >
                                  <SubjectIcon className="w-3.5 h-3.5" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-medium text-foreground truncate">
                                    {subject.name}
                                  </p>
                                  {subject.code && (
                                    <span className="text-[10px] text-muted-foreground font-mono">
                                      Code: {subject.code}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div
                                className={cn(
                                  "w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-all",
                                  isSelected
                                    ? "bg-primary border-primary text-primary-foreground"
                                    : "border-border/80 bg-background"
                                )}
                              >
                                {isSelected && <Check className="w-3.5 h-3.5" />}
                              </div>
                            </div>

                            <p className="text-[11px] text-muted-foreground font-light line-clamp-2 leading-relaxed pl-8">
                              {subject.career}
                            </p>

                            {/* Customizable Language Text Box if selected */}
                            {isSelected && isCustomLang && (
                              <div
                                className="mt-2 pt-2 border-t border-border/40"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Input
                                  type="text"
                                  placeholder="Specify exact language / paper name (optional)"
                                  value={customLanguageNames[subject.id] || ""}
                                  onChange={(e) =>
                                    setCustomLanguageNames((prev) => ({
                                      ...prev,
                                      [subject.id]: e.target.value,
                                    }))
                                  }
                                  className="h-7 text-[11px] bg-background border-border/60"
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {filteredGroups.length === 0 && (
              <div className="text-center py-12 border border-dashed border-border/60 rounded-xl">
                <p className="text-sm text-muted-foreground font-light">
                  No subjects found matching "{searchQuery}".
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                  className="mt-2 text-xs"
                >
                  Clear filter
                </Button>
              </div>
            )}
          </div>

          {/* Add Custom / Other Subject */}
          <Card className="mt-6 border-border/60 bg-muted/10">
            <CardHeader className="py-3 px-5">
              <CardTitle className="text-xs font-semibold flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-primary" />
                Don't see your specific subject?
              </CardTitle>
              <CardDescription className="text-[11px]">
                Add any elective, regional language, or vocational course taught in your school.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-5 pb-4">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="e.g. Japanese, Food Nutrition, Astronomy..."
                  value={customSubjectInput}
                  onChange={(e) => setCustomSubjectInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustomSubject();
                    }
                  }}
                  className="h-9 text-xs bg-background border-border/60"
                />
                <Button size="sm" onClick={addCustomSubject} className="h-9 px-4 text-xs shrink-0">
                  Add Subject
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Error Message if < MIN_SUBJECTS */}
          {showError && (
            <div className="mt-6 p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs font-medium flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0" />
              Please select at least {MIN_SUBJECTS} subjects to continue to the assessment quiz.
            </div>
          )}

          {/* Bottom Sticky Action Bar */}
          <div className="mt-8 flex items-center justify-between pt-6 border-t border-border/50">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-xs h-9 border-border/60"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              Back
            </Button>

            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground hidden sm:inline">
                {selected.size} of {MIN_SUBJECTS} minimum subjects selected
              </span>
              <Button
                size="sm"
                onClick={handleNext}
                disabled={selected.size < MIN_SUBJECTS}
                className="text-xs h-9 px-5 font-semibold"
              >
                Proceed to Quiz
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default SubjectSelection;
