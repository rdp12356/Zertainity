

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────



import { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
    ArrowLeft,
    ArrowRight,
    Info,
    CheckSquare,
    Square,
    Atom,
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
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface Subject {
    id: string;
    name: string;
    code?: string;          // CBSE/ICSE numeric code
    icon: React.ElementType;
    career: string;         // tooltip text
    required?: boolean;
}

interface SubjectGroup {
    id: string;
    label: string;
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

type BoardType = "cbse" | "icse";

// ─────────────────────────────────────────────────────────────
// GRADING REFERENCE DATA
// ─────────────────────────────────────────────────────────────
export const CBSE_GRADES = [
    { grade: "A1", range: "91–100", points: 10 },
    { grade: "A2", range: "81–90",  points: 9 },
    { grade: "B1", range: "71–80",  points: 8 },
    { grade: "B2", range: "61–70",  points: 7 },
    { grade: "C1", range: "51–60",  points: 6 },
    { grade: "C2", range: "41–50",  points: 5 },
    { grade: "D",  range: "33–40",  points: 4 },
    { grade: "E",  range: "Below 33", points: 0 },
];

export const ICSE_GRADES = [
    { grade: "1",  range: "90–100", remark: "Outstanding" },
    { grade: "2",  range: "80–89",  remark: "Excellent" },
    { grade: "3",  range: "70–79",  remark: "Very Good" },
    { grade: "4",  range: "60–69",  remark: "Good" },
    { grade: "5",  range: "50–59",  remark: "Credit" },
    { grade: "6",  range: "40–49",  remark: "Pass" },
    { grade: "7",  range: "33–39",  remark: "Pass" },
    { grade: "8",  range: "21–32",  remark: "Fail" },
    { grade: "9",  range: "0–20",   remark: "Fail" },
];

// ─────────────────────────────────────────────────────────────
// CBSE SUBJECT DATA — 2026-27 (NEP 2020 + NCF-SE 2023)
// ─────────────────────────────────────────────────────────────

// Primary (Classes 1-5)
const cbsePrimaryGroups: SubjectGroup[] = [
    {
        id: "core",
        label: "Core Subjects",
        icon: BookOpen,
        color: "text-amber-600",
        subjects: [
            { id: "english", name: "English", code: "184", icon: BookOpen, career: "Foundation for all professional careers – communication, law, media, literature" },
            { id: "hindi", name: "Hindi / Mother Tongue (R1)", code: "002", icon: Languages, career: "Hindi/vernacular proficiency opens government jobs, journalism, translation" },
            { id: "maths", name: "Mathematics", code: "041", icon: Calculator, career: "Foundation for engineering, finance, data science, and all STEM fields" },
            { id: "evs", name: "Environmental Studies (EVS)", icon: Leaf, career: "Builds curiosity about science & society; foundation for environment, biology, geography" },
        ],
    },
    {
        id: "languages",
        label: "Languages (R2 & R3 — Three-Language Formula)",
        icon: Languages,
        color: "text-indigo-600",
        subjects: [
            { id: "second-lang", name: "Second Language (R2)", icon: Languages, career: "Bilingual communication skills for government, media, and diplomatic careers" },
            { id: "third-lang", name: "Third Language (R3)", icon: Languages, career: "Additional language skills useful in civil services, foreign affairs, diplomacy" },
        ],
    },
    {
        id: "optional",
        label: "Co-Scholastic",
        icon: Palette,
        color: "text-emerald-600",
        subjects: [
            { id: "art-craft", name: "Art & Craft", icon: Palette, career: "Creative thinking leads to careers in design, architecture, fine arts, animation" },
            { id: "pe-primary", name: "Physical Education", icon: Dumbbell, career: "Sports & fitness careers — coach, physiotherapist, sports scientist, athlete" },
            { id: "music-dance", name: "Music / Dance", icon: Music, career: "Performing arts, entertainment, music production, cultural programmes" },
        ],
    },
];

// Middle (Classes 6-8)
const cbseMiddleGroups: SubjectGroup[] = [
    {
        id: "core",
        label: "Core Subjects",
        icon: BookOpen,
        color: "text-blue-600",
        subjects: [
            { id: "english", name: "English", code: "184", icon: BookOpen, career: "Foundation for all professional careers – communication, law, media, literature" },
            { id: "hindi", name: "Hindi / Mother Tongue (R1)", code: "002", icon: Languages, career: "Hindi proficiency opens government jobs, journalism, translation" },
            { id: "maths", name: "Mathematics", code: "041", icon: Calculator, career: "Foundation for engineering, finance, data science, and all STEM fields" },
            { id: "science", name: "Science", code: "086", icon: FlaskConical, career: "Gateway to Physics, Chemistry, Biology – engineering, medicine, research" },
            { id: "social-sci", name: "Social Science", code: "087", icon: Globe, career: "History, Geography, Civics – civil services, law, journalism, social work" },
        ],
    },
    {
        id: "languages",
        label: "Languages (R2 & R3 — Three-Language Formula)",
        icon: Languages,
        color: "text-indigo-600",
        subjects: [
            { id: "second-lang-mid", name: "Second Language (R2)", icon: Languages, career: "Bilingual proficiency for government, translation, diplomacy" },
            { id: "third-lang-mid", name: "Third Language (R3) — Sanskrit / Regional / Foreign", icon: Languages, career: "Additional language opens foreign services, diplomacy, translation careers" },
        ],
    },
    {
        id: "elective",
        label: "Elective / Co-Scholastic",
        icon: Palette,
        color: "text-emerald-600",
        subjects: [
            { id: "computer-ict", name: "Computer Applications / ICT", icon: Monitor, career: "Tech literacy → software development, data science, digital marketing" },
            { id: "ai-middle", name: "Artificial Intelligence (AI)", code: "417", icon: Monitor, career: "AI/ML careers, automation, data analysis, emerging technology" },
            { id: "art-ed", name: "Art Education", icon: Palette, career: "Design, animation, fine arts, interior design, art therapy" },
            { id: "health-pe", name: "Health & Physical Education", icon: Dumbbell, career: "Sports science, physiotherapy, coaching, fitness management" },
            { id: "work-ed", name: "Work Education", icon: Briefcase, career: "Vocational skills, entrepreneurship, hands-on technical careers" },
        ],
    },
];

// Secondary (Classes 9-10) — CBSE 2026-27
const cbseSecondaryGroups: SubjectGroup[] = [
    {
        id: "languages",
        label: "Languages (R1 + R2 + R3 — Three-Language Formula)",
        icon: Languages,
        color: "text-indigo-600",
        subjects: [
            { id: "eng-lit", name: "English Language & Literature", code: "184", icon: BookOpen, career: "Communication, media, law, civil services, literature – base for most careers" },
            { id: "eng-comm", name: "English Communicative", code: "101", icon: BookOpen, career: "Spoken English, media, corporate communication, content creation" },
            { id: "hindi-a", name: "Hindi Course-A", code: "002", icon: Languages, career: "Government jobs, journalism, Hindi literature, administrative roles" },
            { id: "hindi-b", name: "Hindi Course-B", code: "085", icon: Languages, career: "Government jobs, Hindi media, teaching, translation" },
            { id: "sanskrit", name: "Sanskrit", code: "122", icon: BookOpen, career: "Classical studies, civil services, research, Vedic studies" },
            { id: "urdu-a", name: "Urdu Course-A", code: "003", icon: BookOpen, career: "Journalism, civil services, literature, diplomatic services" },
            { id: "urdu-b", name: "Urdu Course-B", code: "303", icon: BookOpen, career: "Urdu media, translation, government services" },
            { id: "tamil", name: "Tamil", code: "033", icon: Languages, career: "Tamil Nadu government services, regional media, literature" },
            { id: "telugu", name: "Telugu", code: "034", icon: Languages, career: "Andhra/Telangana government, media, film industry" },
            { id: "kannada", name: "Kannada", code: "035", icon: Languages, career: "Karnataka state services, regional media, literature" },
            { id: "malayalam", name: "Malayalam", code: "036", icon: Languages, career: "Kerala government, media, translation, literature" },
            { id: "marathi", name: "Marathi", code: "009", icon: Languages, career: "Maharashtra state services, Marathi media, publishing" },
            { id: "gujarati", name: "Gujarati", code: "010", icon: Languages, career: "Gujarat state services, business communication" },
            { id: "punjabi", name: "Punjabi", code: "011", icon: Languages, career: "Punjab state services, media, literature" },
            { id: "bengali", name: "Bengali", code: "006", icon: Languages, career: "West Bengal services, Bengali literature, media" },
            { id: "odia", name: "Odia", code: "014", icon: Languages, career: "Odisha state services, literature, regional media" },
            { id: "assamese", name: "Assamese", code: "015", icon: Languages, career: "Assam state services, NE India media" },
            { id: "maithili", name: "Maithili", code: "019", icon: Languages, career: "Bihar/Jharkhand services, classical literature" },
            { id: "dogri", name: "Dogri", code: "020", icon: Languages, career: "J&K state services, eighth schedule language" },
            { id: "bodo", name: "Bodo", code: "022", icon: Languages, career: "Assam BTR services, Bodo literature" },
            { id: "santali", name: "Santali", code: "099", icon: Languages, career: "Jharkhand/WB tribal development, Santali literature" },
            { id: "manipuri", name: "Manipuri (Meitei)", code: "016", icon: Languages, career: "Manipur state services, NE India cultural jobs" },
            { id: "konkani", name: "Konkani", code: "112", icon: Languages, career: "Goa state services, Konkani media" },
            { id: "nepali", name: "Nepali", code: "017", icon: Languages, career: "Sikkim/WB hill services, Indo-Nepal liaison" },
            { id: "kashmiri", name: "Kashmiri", code: "018", icon: Languages, career: "J&K state services, Kashmiri literature" },
            { id: "sindhi", name: "Sindhi", code: "013", icon: Languages, career: "Sindhi community media, government translation" },
            { id: "french", name: "French", code: "164", icon: Languages, career: "MNCs, diplomacy, export trade, UN agencies, French-speaking Africa" },
            { id: "german", name: "German", code: "120", icon: Languages, career: "German engineering firms, EU diplomacy, automotive industry" },
            { id: "spanish", name: "Spanish", code: "166", icon: Languages, career: "Latin American trade, diplomacy, international NGOs" },
            { id: "japanese", name: "Japanese", code: "096", icon: Languages, career: "Japanese tech companies, anime/manga industry, JICA projects" },
            { id: "arabic", name: "Arabic", code: "303", icon: Languages, career: "Gulf jobs, diplomacy, Islamic studies, translation" },
        ],
    },
    {
        id: "compulsory",
        label: "Compulsory Core Subjects",
        icon: BookOpen,
        color: "text-blue-600",
        subjects: [
            { id: "maths-std", name: "Mathematics (Standard)", code: "041", icon: Calculator, career: "Essential for engineering, data science, finance; required for PCM stream in Class 11" },
            { id: "maths-basic", name: "Mathematics (Basic)", code: "241", icon: Calculator, career: "General numeracy; suitable for Commerce or Humanities streams" },
            { id: "science-910", name: "Science", code: "086", icon: FlaskConical, career: "Foundation for Physics, Chemistry, Biology; essential for Medical & Engineering" },
            { id: "soc-sci", name: "Social Science", code: "087", icon: Globe, career: "History, Geography, Economics – civil services, law, journalism" },
        ],
    },
    {
        id: "optional-skill",
        label: "Elective / Skill Subjects",
        icon: Zap,
        color: "text-purple-600",
        subjects: [
            { id: "comp-apps", name: "Computer Applications", code: "165", icon: Monitor, career: "Software development, web design, IT support, data analysis" },
            { id: "it-skill", name: "Information Technology", code: "402", icon: Monitor, career: "IT careers, digital marketing, network administration" },
            { id: "ai-910", name: "Artificial Intelligence", code: "417", icon: Monitor, career: "AI/ML engineering, automation, data science, future tech" },
            { id: "data-sci-910", name: "Data Science", code: "419", icon: Monitor, career: "Data analytics, business intelligence, predictive modelling" },
            { id: "design-thinking", name: "Design Thinking & Innovation", code: "422", icon: Palette, career: "Product design, UX strategy, innovation consulting, startups" },
            { id: "electronics-hw", name: "Electronics & Hardware", code: "420", icon: Atom, career: "Electronics design, IoT, embedded systems, hardware engineering" },
            { id: "home-sci", name: "Home Science", icon: Leaf, career: "Nutrition, dietetics, interior design, hospitality management" },
            { id: "elem-biz", name: "Elements of Business", icon: Briefcase, career: "Commerce foundation → MBA, marketing, retail management" },
            { id: "elem-accounts", name: "Elements of Book Keeping & Accountancy", icon: TrendingUp, career: "Accounting, finance, CA foundation, banking" },
            { id: "painting", name: "Painting", icon: Palette, career: "Fine arts, graphic design, animation, art therapy" },
            { id: "music-hind", name: "Hindustani / Carnatic Music", icon: Music, career: "Performing arts, music production, cultural institutions" },
            { id: "ncc-910", name: "National Cadet Corps (NCC)", icon: Users, career: "Defence services, leadership, civil services advantage" },
        ],
    },
];

// Senior Secondary (Classes 11-12) — CBSE 2026-27 with cross-stream flexibility
const cbseSeniorGroups: SubjectGroup[] = [
    {
        id: "language-comp",
        label: "Compulsory Language (Choose 1)",
        icon: Languages,
        color: "text-indigo-600",
        subjects: [
            { id: "eng-core", name: "English Core", code: "301", icon: BookOpen, career: "Communication, media, law, literature – base for all careers" },
            { id: "eng-elective", name: "English Elective", code: "001", icon: BookOpen, career: "Advanced literature, creative writing, journalism, publishing" },
            { id: "hindi-core", name: "Hindi Core", code: "302", icon: Languages, career: "Hindi journalism, civil services, literature, state government roles" },
            { id: "hindi-elective", name: "Hindi Elective", code: "002", icon: Languages, career: "Hindi literature research, publishing, advanced translation" },
            { id: "other-lang-sr", name: "Other Languages (Sanskrit, Urdu, Tamil, Telugu, Kannada, Malayalam, Marathi, Bengali, Gujarati, Punjabi, French, German, Japanese, Spanish…)", icon: Languages, career: "Foreign services, translation, international trade, diplomacy" },
        ],
    },
    {
        id: "science",
        label: "Science Subjects",
        icon: Atom,
        color: "text-blue-600",
        subjects: [
            { id: "physics", name: "Physics", code: "042", icon: Atom, career: "Engineering (all branches), architecture, pilot, space science, data science" },
            { id: "chemistry", name: "Chemistry", code: "043", icon: FlaskConical, career: "Medicine, pharmacy, chemical engineering, materials science, research" },
            { id: "maths-sr", name: "Mathematics", code: "041", icon: Calculator, career: "PCM: engineering, IT, architecture, data science, quantitative finance" },
            { id: "biology", name: "Biology", code: "044", icon: Leaf, career: "PCB: MBBS, dentistry, pharmacy, biotech, nursing, nutrition" },
            { id: "biotech", name: "Biotechnology", code: "045", icon: Leaf, career: "BioTech research, pharma, genomics, agri-biotech, medical devices" },
        ],
    },
    {
        id: "commerce",
        label: "Commerce Subjects",
        icon: Briefcase,
        color: "text-amber-600",
        subjects: [
            { id: "accountancy", name: "Accountancy", code: "055", icon: TrendingUp, career: "CA, CMA, banking, financial reporting, audit, taxation" },
            { id: "biz-studies", name: "Business Studies", code: "054", icon: Briefcase, career: "MBA, marketing, HR, entrepreneurship, retail management" },
            { id: "economics", name: "Economics", code: "030", icon: TrendingUp, career: "Economics research, IAS/IPS, banking, financial analysis, policy" },
            { id: "entrepreneurship", name: "Entrepreneurship", code: "066", icon: Briefcase, career: "Startups, business management, innovation, venture capital" },
        ],
    },
    {
        id: "humanities",
        label: "Humanities / Social Science Subjects",
        icon: Globe,
        color: "text-purple-600",
        subjects: [
            { id: "history", name: "History", code: "027", icon: Globe, career: "Civil services, law, archaeology, museum curation, journalism" },
            { id: "pol-sci", name: "Political Science", code: "028", icon: Scale, career: "IAS/IPS, law, journalism, political career, NGOs, international relations" },
            { id: "geography", name: "Geography", code: "029", icon: Globe, career: "Town planning, GIS, environmental management, civil services" },
            { id: "sociology", name: "Sociology", code: "039", icon: Users, career: "Social work, NGOs, HR, counselling, civil services, research" },
            { id: "psychology", name: "Psychology", code: "037", icon: Users, career: "Clinical psychology, counselling, HR, research, education" },
            { id: "philosophy", name: "Philosophy", code: "040", icon: BookOpen, career: "Civil services, law, ethics research, academia, journalism" },
            { id: "legal-studies", name: "Legal Studies", code: "074", icon: Scale, career: "Law (LLB), judiciary, NGOs, corporate legal, public policy" },
        ],
    },
    {
        id: "electives",
        label: "Cross-Stream Electives (NEP 2020 — Mix Freely)",
        icon: Zap,
        color: "text-emerald-600",
        subjects: [
            { id: "comp-sci", name: "Computer Science", code: "083", icon: Monitor, career: "Software engineering, AI/ML, data science, cybersecurity, product management" },
            { id: "inf-prac", name: "Informatics Practices", code: "065", icon: Monitor, career: "IT roles, data analytics, web development, digital business" },
            { id: "applied-maths", name: "Applied Mathematics", code: "840", icon: Calculator, career: "Commerce + Maths pathway → data analyst, actuary, finance" },
            { id: "pe-sr", name: "Physical Education", code: "048", icon: Dumbbell, career: "Sports science, physiotherapy, coaching, sports management" },
            { id: "home-sci-sr", name: "Home Science", code: "064", icon: Leaf, career: "Nutrition, dietetics, interior design, hospitality, child development" },
            { id: "fine-arts", name: "Fine Arts / Painting", code: "049", icon: Palette, career: "Graphic design, animation, film, advertising, fine arts" },
            { id: "eng-graphics", name: "Engineering Graphics", code: "046", icon: Atom, career: "Mechanical/civil engineering, CAD design, architecture" },
            { id: "multimedia", name: "Multimedia & Web Technology", code: "067", icon: Monitor, career: "Web development, UX/UI design, digital marketing, content creation" },
            { id: "dance", name: "Dance (Indian Classical Forms)", icon: Music, career: "Performing arts, choreography, dance therapy, cultural programmes" },
            { id: "music-sr", name: "Music (Hindustani/Carnatic)", icon: Music, career: "Performing arts, music production, teaching, film industry" },
            { id: "ncc-sr", name: "NCC", icon: Users, career: "Defence services, police, civil services – extra marks & leadership" },
        ],
    },
    {
        id: "skill-subjects",
        label: "Skill Subjects (Vocational — CBSE 2026-27)",
        icon: GraduationCap,
        color: "text-rose-600",
        subjects: [
            { id: "ai-sr", name: "Artificial Intelligence", code: "417", icon: Monitor, career: "AI/ML engineering, automation, intelligent systems, future tech" },
            { id: "data-sci-sr", name: "Data Science", code: "419", icon: Monitor, career: "Data analytics, business intelligence, ML pipelines" },
            { id: "design-thinking-sr", name: "Design Thinking & Innovation", code: "422", icon: Palette, career: "Product innovation, UX strategy, startup methodology" },
            { id: "electronics-sr", name: "Electronics & Hardware", code: "420", icon: Atom, career: "Electronics design, IoT, embedded systems, VLSI" },
            { id: "it-402", name: "Information Technology", code: "402", icon: Monitor, career: "IT careers, web development, network administration" },
            { id: "retail", name: "Retail", code: "401", icon: Briefcase, career: "Retail management, visual merchandising, supply chain" },
            { id: "fin-markets", name: "Introduction to Financial Markets", code: "405", icon: TrendingUp, career: "Stock trading, mutual funds, wealth management" },
            { id: "beauty-wellness", name: "Beauty & Wellness", code: "407", icon: Palette, career: "Cosmetology, spa management, wellness industry" },
            { id: "food-prod", name: "Food Production", code: "409", icon: Leaf, career: "Culinary arts, food technology, hotel industry" },
            { id: "front-office", name: "Front Office Operations", code: "410", icon: Briefcase, career: "Hotel front desk, hospitality management, tourism" },
            { id: "banking-ins", name: "Banking & Insurance", code: "411", icon: TrendingUp, career: "Banking operations, insurance, financial services" },
            { id: "marketing-sales", name: "Marketing & Sales", code: "412", icon: Briefcase, career: "Brand management, sales strategy, digital marketing" },
            { id: "healthcare-sr", name: "Healthcare", code: "413", icon: Leaf, career: "Paramedical, nursing assistance, public health" },
            { id: "physical-trainer", name: "Physical Activity Trainer", code: "418", icon: Dumbbell, career: "Fitness coaching, sports training, wellness centres" },
            { id: "automotive", name: "Automotive", code: "404", icon: Atom, career: "Automobile service, EV technology, motor mechanics" },
        ],
    },
];

// ─────────────────────────────────────────────────────────────
// ICSE / ISC SUBJECT DATA — 2026-27
// ─────────────────────────────────────────────────────────────

// ICSE Secondary (Classes 9-10)
const icseSecondaryGroups: SubjectGroup[] = [
    {
        id: "group1",
        label: "Group I — Compulsory Subjects",
        icon: BookOpen,
        color: "text-blue-600",
        subjects: [
            { id: "icse-english", name: "English (Language + Literature)", icon: BookOpen, career: "Communication, media, law, civil services, literature" },
            { id: "icse-second-lang", name: "Second Language (Hindi / Regional / Foreign)", icon: Languages, career: "Bilingual communication, government, diplomacy" },
            { id: "icse-hcg", name: "History, Civics & Geography", icon: Globe, career: "Civil services, law, journalism, social work, government" },
        ],
    },
    {
        id: "group2",
        label: "Group II — Elective Subjects (Choose 2-3)",
        icon: Atom,
        color: "text-emerald-600",
        subjects: [
            { id: "icse-maths", name: "Mathematics", icon: Calculator, career: "Engineering, data science, finance, actuarial science" },
            { id: "icse-science", name: "Science (Physics + Chemistry + Biology)", icon: FlaskConical, career: "Medicine, engineering, research, pharmacy, biotech" },
            { id: "icse-economics", name: "Economics", icon: TrendingUp, career: "Banking, policy analysis, business, civil services" },
            { id: "icse-commerce", name: "Commercial Studies", icon: Briefcase, career: "Business, CA, retail, marketing management" },
            { id: "icse-cs", name: "Computer Science", icon: Monitor, career: "Software development, data science, cybersecurity" },
            { id: "icse-env-sci", name: "Environmental Science", icon: Leaf, career: "Environmental management, sustainability, conservation" },
            { id: "icse-tech-draw", name: "Technical Drawing", icon: Atom, career: "Architecture, mechanical design, CAD drafting" },
            { id: "icse-agri", name: "Agricultural Science", icon: Leaf, career: "Agronomy, horticulture, agricultural research" },
            { id: "icse-foreign-lang", name: "Modern Foreign Language", icon: Languages, career: "International trade, diplomacy, MNC roles" },
            { id: "icse-classical", name: "Classical Language (Sanskrit / Arabic / Persian)", icon: BookOpen, career: "Classical literature, research, civil services" },
        ],
    },
    {
        id: "group3",
        label: "Group III — Skill-Based Subjects (Choose 1)",
        icon: Zap,
        color: "text-purple-600",
        subjects: [
            { id: "icse-comp-apps", name: "Computer Applications", icon: Monitor, career: "Web development, IT support, office automation" },
            { id: "icse-econ-apps", name: "Economic Applications", icon: TrendingUp, career: "Financial literacy, business planning, commerce" },
            { id: "icse-comm-apps", name: "Commercial Applications", icon: Briefcase, career: "Business operations, accounting basics, retail" },
            { id: "icse-art", name: "Art", icon: Palette, career: "Fine arts, graphic design, illustration, art therapy" },
            { id: "icse-performing", name: "Performing Arts", icon: Music, career: "Theatre, dance, music, cultural programmes" },
            { id: "icse-home-sci", name: "Home Science", icon: Leaf, career: "Nutrition, interior design, child development" },
            { id: "icse-fashion", name: "Fashion Designing", icon: Palette, career: "Fashion design, textile industry, styling" },
            { id: "icse-pe", name: "Physical Education", icon: Dumbbell, career: "Sports, coaching, physiotherapy, fitness" },
            { id: "icse-yoga", name: "Yoga", icon: Dumbbell, career: "Yoga instruction, wellness, holistic health" },
            { id: "icse-robotics", name: "Robotics and Artificial Intelligence", icon: Monitor, career: "Robotics engineering, AI/ML, automation" },
            { id: "icse-hospitality", name: "Hospitality Management", icon: Briefcase, career: "Hotel management, tourism, event management" },
            { id: "icse-media", name: "Mass Media & Communication", icon: Globe, career: "Journalism, PR, digital media, broadcasting" },
        ],
    },
];

// ISC Senior Secondary (Classes 11-12)
const iscSeniorGroups: SubjectGroup[] = [
    {
        id: "compulsory",
        label: "Compulsory — English",
        icon: BookOpen,
        color: "text-blue-600",
        subjects: [
            { id: "isc-english", name: "English (Compulsory)", icon: BookOpen, career: "Communication, media, law – mandatory for all ISC students" },
        ],
    },
    {
        id: "science",
        label: "Science Electives",
        icon: Atom,
        color: "text-blue-600",
        subjects: [
            { id: "isc-physics", name: "Physics", icon: Atom, career: "Engineering, research, space science, data science" },
            { id: "isc-chemistry", name: "Chemistry", icon: FlaskConical, career: "Medicine, pharmacy, chemical engineering, research" },
            { id: "isc-biology", name: "Biology", icon: Leaf, career: "MBBS, BDS, biotech, nursing, nutrition, genetics" },
            { id: "isc-maths", name: "Mathematics", icon: Calculator, career: "Engineering, data science, finance, actuarial" },
            { id: "isc-cs", name: "Computer Science", icon: Monitor, career: "Software, AI/ML, cybersecurity, product management" },
            { id: "isc-biotech", name: "Biotechnology", icon: Leaf, career: "Biotech R&D, pharma, genomics, medical devices" },
            { id: "isc-env-sci", name: "Environmental Science", icon: Leaf, career: "Sustainability, conservation, climate policy" },
            { id: "isc-home-sci", name: "Home Science", icon: Leaf, career: "Nutrition, dietetics, interior design, child development" },
        ],
    },
    {
        id: "commerce",
        label: "Commerce Electives",
        icon: Briefcase,
        color: "text-amber-600",
        subjects: [
            { id: "isc-accounts", name: "Accounts", icon: TrendingUp, career: "CA, CMA, banking, audit, financial reporting" },
            { id: "isc-commerce-subj", name: "Commerce", icon: Briefcase, career: "Business management, trade, logistics" },
            { id: "isc-biz-studies", name: "Business Studies", icon: Briefcase, career: "MBA, marketing, HR, entrepreneurship" },
            { id: "isc-economics", name: "Economics", icon: TrendingUp, career: "IAS, banking, financial analysis, policy research" },
        ],
    },
    {
        id: "humanities",
        label: "Humanities / Social Science Electives",
        icon: Globe,
        color: "text-purple-600",
        subjects: [
            { id: "isc-history", name: "History", icon: Globe, career: "Civil services, law, archaeology, journalism" },
            { id: "isc-pol-sci", name: "Political Science", icon: Scale, career: "IAS, law, journalism, NGOs, international relations" },
            { id: "isc-geography", name: "Geography", icon: Globe, career: "Town planning, GIS, environmental management" },
            { id: "isc-sociology", name: "Sociology", icon: Users, career: "Social work, HR, counselling, civil services" },
            { id: "isc-psychology", name: "Psychology", icon: Users, career: "Clinical psychology, counselling, HR, research" },
            { id: "isc-elective-eng", name: "Elective English", icon: BookOpen, career: "Literature, creative writing, journalism, publishing" },
            { id: "isc-pe", name: "Physical Education", icon: Dumbbell, career: "Sports science, coaching, fitness management" },
        ],
    },
];


// ─────────────────────────────────────────────────────────────
// STREAM COMBO SUGGESTIONS (Class 11-12, both boards)
// ─────────────────────────────────────────────────────────────
const cbseStreamCombos: StreamCombo[] = [
    {
        id: "pcm",
        label: "PCM (Engineering)",
        description: "Physics + Chemistry + Maths + English Core + Computer Science (083)",
        subjects: ["eng-core", "physics", "chemistry", "maths-sr", "comp-sci"],
        color: "bg-blue-500/10 text-blue-700 border-blue-500/30 hover:bg-blue-500/20",
        badge: "⚛️ JEE / NIT / IIIT",
    },
    {
        id: "pcb",
        label: "PCB (Medical)",
        description: "Physics + Chemistry + Biology + English Core + Physical Education (048)",
        subjects: ["eng-core", "physics", "chemistry", "biology", "pe-sr"],
        color: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30 hover:bg-emerald-500/20",
        badge: "🧬 NEET / MBBS",
    },
    {
        id: "pcmb",
        label: "PCMB (Broad Science)",
        description: "Physics + Chemistry + Maths + Biology + English Core",
        subjects: ["eng-core", "physics", "chemistry", "maths-sr", "biology"],
        color: "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20",
        badge: "🔬 JEE + NEET",
    },
    {
        id: "commerce-maths",
        label: "Commerce with Maths",
        description: "Accountancy + Business Studies + Economics + English Core + Applied Maths (840)",
        subjects: ["eng-core", "accountancy", "biz-studies", "economics", "applied-maths"],
        color: "bg-amber-500/10 text-amber-700 border-amber-500/30 hover:bg-amber-500/20",
        badge: "💰 CA / Finance",
    },
    {
        id: "commerce-cs",
        label: "Commerce with CS",
        description: "Accountancy + Business Studies + Economics + English Core + Computer Science (083)",
        subjects: ["eng-core", "accountancy", "biz-studies", "economics", "comp-sci"],
        color: "bg-orange-500/10 text-orange-700 border-orange-500/30 hover:bg-orange-500/20",
        badge: "💼 FinTech",
    },
    {
        id: "humanities-polsci",
        label: "Humanities — Civil Services",
        description: "History + Political Science + Geography + Economics + English Core",
        subjects: ["eng-core", "history", "pol-sci", "geography", "economics"],
        color: "bg-purple-500/10 text-purple-700 border-purple-500/30 hover:bg-purple-500/20",
        badge: "🏛️ IAS / IPS / Law",
    },
    {
        id: "humanities-psych",
        label: "Humanities — Psychology",
        description: "History + Psychology + Sociology + Political Science + English Core",
        subjects: ["eng-core", "history", "psychology", "sociology", "pol-sci"],
        color: "bg-rose-500/10 text-rose-700 border-rose-500/30 hover:bg-rose-500/20",
        badge: "🧠 Counselling",
    },
    {
        id: "pcm-ai",
        label: "PCM + AI (New-Age Tech)",
        description: "Physics + Chemistry + Maths + English Core + AI (417)",
        subjects: ["eng-core", "physics", "chemistry", "maths-sr", "ai-sr"],
        color: "bg-cyan-500/10 text-cyan-700 border-cyan-500/30 hover:bg-cyan-500/20",
        badge: "🤖 AI / ML",
    },
];

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
function getCbseGroupsForGrade(gradeNum: number): SubjectGroup[] {
    if (gradeNum <= 5) return cbsePrimaryGroups;
    if (gradeNum <= 8) return cbseMiddleGroups;
    if (gradeNum <= 10) return cbseSecondaryGroups;
    return cbseSeniorGroups;
}

function getIcseGroupsForGrade(gradeNum: number): SubjectGroup[] {
    if (gradeNum <= 10) return icseSecondaryGroups;
    return iscSeniorGroups;
}

function getStageName(gradeNum: number): string {
    if (gradeNum <= 5) return "Primary (Classes 1–5)";
    if (gradeNum <= 8) return "Middle (Classes 6–8)";
    if (gradeNum <= 10) return "Secondary (Classes 9–10)";
    return "Senior Secondary (Classes 11–12)";
}

const MIN_SUBJECTS = 3;

// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────
const SubjectSelection = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { grade, stage } = (location.state as { grade: string; stage: string }) || {
        grade: "Grade 10",
        stage: "classes",
    };

    const gradeNum = parseInt(grade.replace(/\D/g, "")) || 10;
    const isSenior = gradeNum >= 11;
    const stageName = getStageName(gradeNum);

    const [board, setBoard] = useState<BoardType>("cbse");
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [showError, setShowError] = useState(false);
    const [customSubjectInput, setCustomSubjectInput] = useState("");
    const [showGrading, setShowGrading] = useState(false);

    const groups = useMemo(() => {
        return board === "cbse" ? getCbseGroupsForGrade(gradeNum) : getIcseGroupsForGrade(gradeNum);
    }, [gradeNum, board]);

    const streamCombos = board === "cbse" ? cbseStreamCombos : [];

    const addCustomSubject = () => {
        const trimmed = customSubjectInput.trim();
        if (!trimmed) return;
        const customId = `custom_${trimmed.toLowerCase().replace(/\s+/g, '-')}`;
        setSelected((prev) => {
            const next = new Set(prev);
            next.add(customId);
            return next;
        });
        setCustomSubjectInput("");
        setShowError(false);
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
        window.scrollTo({ top: 300, behavior: "smooth" });
    };

    const handleNext = () => {
        if (selected.size < MIN_SUBJECTS) {
            setShowError(true);
            return;
        }
        navigate("/subject-quiz", {
            state: { grade, stage, board, selectedSubjects: Array.from(selected) },
        });
    };

    const allSubjects = groups.flatMap((g) => g.subjects);
    const selectedNames = Array.from(selected).map((id) => {
        if (id.startsWith("custom_")) {
            const namePart = id.replace("custom_", "").replace(/-/g, " ");
            return namePart.replace(/\b\w/g, l => l.toUpperCase());
        }
        const found = allSubjects.find((s) => s.id === id);
        return found ? found.name : id;
    });

    const gradingData = board === "cbse" ? CBSE_GRADES : ICSE_GRADES;

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--z-canvas)' }}>
            {/* Header */}
            <header className="sticky top-0 z-50 backdrop-blur-xl transition-colors duration-300" style={{ backgroundColor: 'var(--z-nav-bg)', borderBottom: '1px solid var(--z-border)' }}>
                <div className="mx-auto max-w-[1080px] px-6 py-4 flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center rounded-full" style={{ border: '1px solid var(--z-border)' }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="var(--z-ink-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="min-w-0">
                            <h1 className="text-[15px] font-normal leading-tight" style={{ color: 'var(--z-ink)' }}>Select Your Subjects</h1>
                            <p className="text-[12px] font-light truncate" style={{ color: 'var(--z-ink-muted)' }}>{grade} · {stageName} · {board.toUpperCase()}</p>
                        </div>
                    </div>
                    {selected.size > 0 && (
                        <Badge variant="secondary" className="shrink-0 text-xs">
                            {selected.size} selected
                        </Badge>
                    )}
                </div>
            </header>

            <main className="mx-auto max-w-[720px] px-6 py-8">
                {/* Heading */}
                <div className="text-center mb-8">
                    <h2 className="text-[28px] sm:text-[36px] font-light tracking-[-0.8px] leading-[1.1] mb-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--z-ink)' }}>
                        Which subjects do you study?
                    </h2>
                    <p className="text-[15px] font-light max-w-xl mx-auto" style={{ color: 'var(--z-ink-muted)' }}>
                        Select your current subjects so we can personalise your career guidance.
                        Choose at least <span className="font-normal" style={{ color: 'var(--z-ink)' }}>{MIN_SUBJECTS} subjects</span> to continue.
                    </p>
                </div>

                {/* Board Selector */}
                <div className="flex items-center justify-center gap-2 mb-6">
                    {(["cbse", "icse"] as BoardType[]).map((b) => (
                        <button
                            key={b}
                            onClick={() => { setBoard(b); setSelected(new Set()); }}
                            className="px-4 py-2 rounded-full text-[13px] font-medium transition-all"
                            style={{
                                backgroundColor: board === b ? 'var(--z-primary)' : 'var(--z-canvas-soft)',
                                color: board === b ? 'var(--z-primary-fg)' : 'var(--z-ink-muted)',
                                border: `1px solid ${board === b ? 'var(--z-primary)' : 'var(--z-border)'}`,
                            }}
                        >
                            {b.toUpperCase()} {b === "icse" && gradeNum > 10 ? "(ISC)" : ""}
                        </button>
                    ))}
                    <button
                        onClick={() => setShowGrading(!showGrading)}
                        className="px-3 py-2 rounded-full text-[12px] font-light transition-all ml-2"
                        style={{ backgroundColor: 'var(--z-canvas-soft)', border: '1px solid var(--z-border)', color: 'var(--z-ink-muted)' }}
                    >
                        📊 Grading Scale
                    </button>
                </div>

                {/* Grading Reference (Collapsible) */}
                {showGrading && (
                    <Card className="mb-6 border border-border/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm">{board === "cbse" ? "CBSE Grading Scale (Positional)" : "ICSE/ISC Grading Scale"}</CardTitle>
                            <CardDescription className="text-xs">
                                {board === "cbse"
                                    ? "Grades are relative — top 1/8th of passed students get A1, next 1/8th get A2, and so on. Indicative ranges below."
                                    : "CISCE uses a 9-point numerical scale. Minimum 35% to pass (ICSE: 33%)."}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                                {board === "cbse"
                                    ? CBSE_GRADES.map((g) => (
                                        <div key={g.grade} className="flex items-center gap-2 p-2 rounded-lg text-xs" style={{ backgroundColor: 'var(--z-canvas-soft)', border: '1px solid var(--z-border)' }}>
                                            <span className="font-semibold" style={{ color: 'var(--z-primary)' }}>{g.grade}</span>
                                            <span style={{ color: 'var(--z-ink-muted)' }}>{g.range}</span>
                                            <span className="ml-auto text-[10px]" style={{ color: 'var(--z-ink-secondary)' }}>GP:{g.points}</span>
                                        </div>
                                    ))
                                    : ICSE_GRADES.map((g) => (
                                        <div key={g.grade} className="flex items-center gap-2 p-2 rounded-lg text-xs" style={{ backgroundColor: 'var(--z-canvas-soft)', border: '1px solid var(--z-border)' }}>
                                            <span className="font-semibold" style={{ color: 'var(--z-primary)' }}>Gr.{g.grade}</span>
                                            <span style={{ color: 'var(--z-ink-muted)' }}>{g.range}</span>
                                            <span className="ml-auto text-[10px]" style={{ color: 'var(--z-ink-secondary)' }}>{g.remark}</span>
                                        </div>
                                    ))
                                }
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Stream combo suggestions – only for Class 11-12 */}
                {isSenior && streamCombos.length > 0 && (
                    <Card className="mb-6 border border-border/50 bg-muted/40">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Zap className="h-4 w-4 text-primary" />
                                Popular Stream Combinations — Quick Select
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Under NEP 2020, you can mix subjects freely across streams. These are popular combos to get started.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {streamCombos.map((combo) => (
                                    <button
                                        key={combo.id}
                                        onClick={() => applyCombo(combo)}
                                        className={`text-left p-3 rounded-xl border transition-all hover:scale-[1.01] active:scale-[0.99] ${combo.color}`}
                                    >
                                        <div className="flex items-center justify-between gap-2 mb-1">
                                            <span className="text-sm font-semibold leading-tight">{combo.label}</span>
                                            <span className="text-xs shrink-0 px-1.5 py-0.5 bg-background/50 rounded-full border border-current/20">
                                                {combo.badge}
                                            </span>
                                        </div>
                                        <p className="text-xs opacity-75 leading-snug">{combo.description}</p>
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Subject groups */}
                <div className="space-y-5">
                    {groups.map((group) => {
                        const GroupIcon = group.icon;
                        return (
                            <Card key={group.id} className="border border-border/40">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center gap-2">
                                        <GroupIcon className={`h-4 w-4 ${group.color}`} />
                                        <CardTitle className="text-sm font-semibold">{group.label}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {group.subjects.map((subject) => {
                                            const SubIcon = subject.icon;
                                            const isSelected = selected.has(subject.id);
                                            return (
                                                <div key={subject.id} className="flex items-start gap-2">
                                                    <button
                                                        onClick={() => toggle(subject.id)}
                                                        className={`flex-1 flex items-start gap-3 p-3 rounded-xl border text-left transition-all hover:scale-[1.01] active:scale-[0.99] ${isSelected
                                                            ? "border-primary bg-primary/8 shadow-sm"
                                                            : "border-border/50 hover:border-border hover:bg-muted/40"
                                                            }`}
                                                    >
                                                        <div
                                                            className={`shrink-0 mt-0.5 p-1.5 rounded-lg ${isSelected ? "bg-primary/15" : "bg-muted"
                                                                }`}
                                                        >
                                                            {isSelected ? (
                                                                <CheckSquare className={`h-4 w-4 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                                                            ) : (
                                                                <Square className="h-4 w-4 text-muted-foreground" />
                                                            )}
                                                        </div>
                                                        <div className="flex items-start gap-2 flex-1 min-w-0">
                                                            <SubIcon
                                                                className={`h-4 w-4 shrink-0 mt-0.5 ${isSelected ? group.color : "text-muted-foreground"
                                                                    }`}
                                                            />
                                                            <div className="min-w-0">
                                                                <span
                                                                    className={`text-sm leading-snug block ${isSelected ? "font-medium text-foreground" : "text-foreground/80"
                                                                        }`}
                                                                >
                                                                    {subject.name}
                                                                </span>
                                                                {subject.code && (
                                                                    <span className="text-[10px] text-muted-foreground">Code: {subject.code}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </button>

                                                    {/* Tooltip */}
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <button className="mt-3 shrink-0 text-muted-foreground hover:text-foreground transition-colors" aria-label="Subject information">
                                                                <Info className="h-3.5 w-3.5" />
                                                            </button>
                                                        </TooltipTrigger>
                                                        <TooltipContent
                                                            side="top"
                                                            className="max-w-[220px] text-xs leading-snug"
                                                        >
                                                            <p>
                                                                <span className="font-semibold">{subject.name}:</span>{" "}
                                                                {subject.career}
                                                            </p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}

                    {/* Custom Subject Input */}
                    <Card className="border border-border/40 overflow-hidden">
                        <CardHeader className="pb-3 bg-muted/20">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <Plus className="h-4 w-4 text-primary" />
                                Other / Custom Subject
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="flex items-center gap-3">
                                <Input
                                    placeholder="E.g., Robotics, Artificial Intelligence..."
                                    value={customSubjectInput}
                                    onChange={(e) => setCustomSubjectInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addCustomSubject();
                                        }
                                    }}
                                    className="flex-1"
                                />
                                <Button
                                    onClick={addCustomSubject}
                                    disabled={!customSubjectInput.trim()}
                                    variant="secondary"
                                >
                                    Add Subject
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Selected subjects preview */}
                {selectedNames.length > 0 && (
                    <div className="mt-5 p-4 rounded-xl bg-muted/50 border border-border/40">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                            Your selected subjects
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            {selectedNames.map((name) => (
                                <Badge key={name} variant="secondary" className="text-xs">
                                    {name}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {/* Error */}
                {showError && (
                    <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                        <Info className="h-4 w-4 shrink-0" />
                        <span>
                            Please select at least <strong>{MIN_SUBJECTS} subjects</strong> to
                            continue. This helps us give you more accurate career guidance.
                        </span>
                    </div>
                )}

                {/* Navigation */}
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                    <Button
                        variant="outline"
                        className="sm:w-auto"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                    <Button
                        className="flex-1 sm:flex-none sm:ml-auto"
                        size="lg"
                        onClick={handleNext}
                        disabled={selected.size < MIN_SUBJECTS}
                    >
                        Next: Interest Quiz
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>

                <p className="text-center text-xs text-muted-foreground mt-3">
                    Subjects based on official {board === "cbse" ? "CBSE" : "CISCE"} curriculum 2026-27 ({board === "cbse" ? "cbseacademic.nic.in" : "cisce.org"})
                </p>
            </main>
        </div>
    );
};

export default SubjectSelection;
