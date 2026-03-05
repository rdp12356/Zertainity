import { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
    ArrowLeft,
    ArrowRight,
    GraduationCap,
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
} from "lucide-react";

import { Input } from "@/components/ui/input";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────
interface Subject {
    id: string;
    name: string;
    icon: React.ElementType;
    career: string; // tooltip text
    required?: boolean; // auto-checked, cannot deselect
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
    subjects: string[]; // subject IDs
    color: string;
    badge: string;
}

// ─────────────────────────────────────────────────────────────
// SUBJECT DATA – CBSE 2025-26
// ─────────────────────────────────────────────────────────────

// Primary (Classes 1-5)
const primaryGroups: SubjectGroup[] = [
    {
        id: "core",
        label: "Core Subjects",
        icon: BookOpen,
        color: "text-amber-600",
        subjects: [
            { id: "english", name: "English", icon: BookOpen, career: "Foundation for all professional careers – communication, law, media, literature" },
            { id: "hindi", name: "Hindi (Course A/B or Regional Language)", icon: Languages, career: "Hindi/vernacular proficiency opens government jobs, journalism, translation" },
            { id: "maths", name: "Mathematics", icon: Calculator, career: "Foundation for engineering, finance, data science, and all STEM fields" },
            { id: "evs", name: "Environmental Studies (EVS)", icon: Leaf, career: "Builds curiosity about science & society; foundation for environment, biology, geography" },
        ],
    },
    {
        id: "optional",
        label: "Optional / Co-Scholastic",
        icon: Palette,
        color: "text-emerald-600",
        subjects: [
            { id: "third-lang", name: "Third Language (Sanskrit / Regional / Foreign)", icon: Languages, career: "Additional language skills useful in civil services, foreign affairs, diplomacy" },
            { id: "art-craft", name: "Art & Craft", icon: Palette, career: "Creative thinking leads to careers in design, architecture, fine arts, animation" },
            { id: "pe-primary", name: "Physical Education", icon: Dumbbell, career: "Sports & fitness careers — coach, physiotherapist, sports scientist, athlete" },
            { id: "music-dance", name: "Music / Dance", icon: Music, career: "Performing arts, entertainment, music production, cultural programmes" },
        ],
    },
];

// Middle (Classes 6-8)
const middleGroups: SubjectGroup[] = [
    {
        id: "core",
        label: "Core Subjects",
        icon: BookOpen,
        color: "text-blue-600",
        subjects: [
            { id: "english", name: "English", icon: BookOpen, career: "Foundation for all professional careers – communication, law, media, literature" },
            { id: "hindi", name: "Hindi Course A / Course B", icon: Languages, career: "Hindi proficiency opens government jobs, journalism, translation" },
            { id: "maths", name: "Mathematics", icon: Calculator, career: "Foundation for engineering, finance, data science, and all STEM fields" },
            { id: "science", name: "Science", icon: FlaskConical, career: "Gateway to Physics, Chemistry, Biology – engineering, medicine, research" },
            { id: "social-sci", name: "Social Science", icon: Globe, career: "History, Geography, Civics – civil services, law, journalism, social work" },
        ],
    },
    {
        id: "elective",
        label: "Additional Subjects",
        icon: Palette,
        color: "text-emerald-600",
        subjects: [
            { id: "third-lang-mid", name: "Third Language (Sanskrit / Regional / French / German)", icon: Languages, career: "Additional language opens foreign services, diplomacy, translation careers" },
            { id: "computer-ict", name: "Computer Applications / ICT", icon: Monitor, career: "Tech literacy → software development, data science, digital marketing" },
            { id: "art-ed", name: "Art Education", icon: Palette, career: "Design, animation, fine arts, interior design, art therapy" },
            { id: "health-pe", name: "Health & Physical Education", icon: Dumbbell, career: "Sports science, physiotherapy, coaching, fitness management" },
            { id: "work-ed", name: "Work Education", icon: Briefcase, career: "Vocational skills, entrepreneurship, hands-on technical careers" },
        ],
    },
];

// Secondary (Classes 9-10)
const secondaryGroups: SubjectGroup[] = [
    {
        id: "languages",
        label: "Languages (Group-L) — Choose 1 or 2",
        icon: Languages,
        color: "text-indigo-600",
        subjects: [
            { id: "eng-lit", name: "English Language & Literature / Communicative", icon: BookOpen, career: "Communication, media, law, civil services, literature – base for most careers" },
            { id: "hindi-a", name: "Hindi Course-A / Course-B", icon: Languages, career: "Government jobs, journalism, Hindi literature, administrative roles" },
            { id: "sanskrit", name: "Sanskrit", icon: BookOpen, career: "Classical studies, civil services, research, Vedic studies" },
            { id: "urdu", name: "Urdu Course-A / Course-B", icon: BookOpen, career: "Journalism, civil services, literature, diplomatic services" },
            { id: "other-lang", name: "Other Languages (Tamil, French, German, Japanese, Spanish…)", icon: Languages, career: "Foreign language skills open diplomacy, export trade, translation, MNCs" },
        ],
    },
    {
        id: "compulsory",
        label: "Compulsory Core Subjects",
        icon: BookOpen,
        color: "text-blue-600",
        subjects: [
            { id: "maths-std", name: "Mathematics (Standard)", icon: Calculator, career: "Essential for engineering, data science, finance; required for PCM stream in Class 11" },
            { id: "maths-basic", name: "Mathematics (Basic)", icon: Calculator, career: "General numeracy; suitable for Commerce or Humanities streams" },
            { id: "science-910", name: "Science", icon: FlaskConical, career: "Foundation for Physics, Chemistry, Biology; essential for Medical & Engineering" },
            { id: "soc-sci", name: "Social Science", icon: Globe, career: "History, Geography, Economics – civil services, law, journalism" },
        ],
    },
    {
        id: "optional-skill",
        label: "Optional / Additional (Group-A2 / Skill)",
        icon: Zap,
        color: "text-purple-600",
        subjects: [
            { id: "comp-apps", name: "Computer Applications", icon: Monitor, career: "Software development, web design, IT support, data analysis" },
            { id: "it-skill", name: "Information Technology (IT)", icon: Monitor, career: "IT careers, digital marketing, network administration" },
            { id: "home-sci", name: "Home Science", icon: Leaf, career: "Nutrition, dietetics, interior design, hospitality management" },
            { id: "elem-biz", name: "Elements of Business", icon: Briefcase, career: "Commerce foundation → MBA, marketing, retail management" },
            { id: "elem-accounts", name: "Elements of Book Keeping & Accountancy", icon: TrendingUp, career: "Accounting, finance, CA foundation, banking" },
            { id: "painting", name: "Painting", icon: Palette, career: "Fine arts, graphic design, animation, art therapy" },
            { id: "music-hind", name: "Hindustani / Carnatic Music", icon: Music, career: "Performing arts, music production, cultural institutions" },
            { id: "ncc-910", name: "National Cadet Corps (NCC)", icon: Users, career: "Defence services, leadership, civil services advantage" },
        ],
    },
];

// Senior Secondary (Classes 11-12)
const seniorGroups: SubjectGroup[] = [
    {
        id: "language-comp",
        label: "Compulsory Language (Choose 1)",
        icon: Languages,
        color: "text-indigo-600",
        subjects: [
            { id: "eng-core", name: "English Core / English Elective", icon: BookOpen, career: "Communication, media, law, literature – base for all careers" },
            { id: "hindi-core", name: "Hindi Core / Hindi Elective", icon: Languages, career: "Hindi journalism, civil services, literature, state government roles" },
            { id: "other-lang-sr", name: "Other Languages (Sanskrit, Urdu, Arabic, French, German, Japanese, Spanish, Tamil…)", icon: Languages, career: "Foreign services, translation, international trade, diplomacy" },
        ],
    },
    {
        id: "science",
        label: "Science Stream",
        icon: Atom,
        color: "text-blue-600",
        subjects: [
            { id: "physics", name: "Physics", icon: Atom, career: "Engineering (all branches), architecture, pilot, space science, data science" },
            { id: "chemistry", name: "Chemistry", icon: FlaskConical, career: "Medicine, pharmacy, chemical engineering, materials science, research" },
            { id: "maths-sr", name: "Mathematics", icon: Calculator, career: "PCM: engineering, IT, architecture, data science, quantitative finance" },
            { id: "biology", name: "Biology", icon: Leaf, career: "PCB: MBBS, dentistry, pharmacy, biotech, nursing, nutrition" },
        ],
    },
    {
        id: "commerce",
        label: "Commerce Stream",
        icon: Briefcase,
        color: "text-amber-600",
        subjects: [
            { id: "accountancy", name: "Accountancy", icon: TrendingUp, career: "CA, CMA, banking, financial reporting, audit, taxation" },
            { id: "biz-studies", name: "Business Studies", icon: Briefcase, career: "MBA, marketing, HR, entrepreneurship, retail management" },
            { id: "economics", name: "Economics", icon: TrendingUp, career: "Economics research, IAS/IPS, banking, financial analysis, policy" },
        ],
    },
    {
        id: "humanities",
        label: "Humanities / Arts Stream",
        icon: Globe,
        color: "text-purple-600",
        subjects: [
            { id: "history", name: "History", icon: Globe, career: "Civil services, law, archaeology, museum curation, journalism" },
            { id: "pol-sci", name: "Political Science", icon: Scale, career: "IAS/IPS, law, journalism, political career, NGOs, international relations" },
            { id: "geography", name: "Geography", icon: Globe, career: "Town planning, GIS, environmental management, civil services" },
            { id: "sociology", name: "Sociology", icon: Users, career: "Social work, NGOs, HR, counselling, civil services, research" },
            { id: "psychology", name: "Psychology", icon: Users, career: "Clinical psychology, counselling, HR, research, education" },
            { id: "philosophy", name: "Philosophy", icon: BookOpen, career: "Civil services, law, ethics research, academia, journalism" },
        ],
    },
    {
        id: "electives",
        label: "Cross-Stream Electives",
        icon: Zap,
        color: "text-emerald-600",
        subjects: [
            { id: "comp-sci", name: "Computer Science", icon: Monitor, career: "Software engineering, AI/ML, data science, cybersecurity, product management" },
            { id: "inf-prac", name: "Informatics Practices", icon: Monitor, career: "IT roles, data analytics, web development, digital business" },
            { id: "applied-maths", name: "Applied Mathematics", icon: Calculator, career: "Commerce + Maths pathway → data analyst, actuary, finance" },
            { id: "pe-sr", name: "Physical Education", icon: Dumbbell, career: "Sports science, physiotherapy, coaching, sports management" },
            { id: "home-sci-sr", name: "Home Science", icon: Leaf, career: "Nutrition, dietetics, interior design, hospitality, child development" },
            { id: "entrepreneurship", name: "Entrepreneurship", icon: Briefcase, career: "Startups, business management, innovation, venture capital" },
            { id: "fine-arts", name: "Fine Arts / Painting", icon: Palette, career: "Graphic design, animation, film, advertising, fine arts" },
            { id: "legal-studies", name: "Legal Studies", icon: Scale, career: "Law (LLB), judiciary, NGOs, corporate legal, public policy" },
            { id: "biotech", name: "Biotechnology", icon: Leaf, career: "BioTech research, pharma, genomics, agri-biotech, medical devices" },
            { id: "eng-graphics", name: "Engineering Graphics", icon: Atom, career: "Mechanical/civil engineering, CAD design, architecture" },
            { id: "multimedia", name: "Multimedia & Web Technology", icon: Monitor, career: "Web development, UX/UI design, digital marketing, content creation" },
            { id: "dance", name: "Dance (Indian Classical Forms)", icon: Music, career: "Performing arts, choreography, dance therapy, cultural programmes" },
            { id: "music-sr", name: "Music (Hindustani/Carnatic – Vocal/Instrumental)", icon: Music, career: "Performing arts, music production, teaching, film industry" },
            { id: "ncc-sr", name: "NCC", icon: Users, career: "Defence services, police, civil services – extra marks & leadership" },
        ],
    },
];

// ─────────────────────────────────────────────────────────────
// STREAM COMBO SUGGESTIONS (Class 11-12 only)
// ─────────────────────────────────────────────────────────────
const streamCombos: StreamCombo[] = [
    {
        id: "pcm",
        label: "PCM (Science – Engineering)",
        description: "Physics + Chemistry + Maths + English Core + Computer Science",
        subjects: ["eng-core", "physics", "chemistry", "maths-sr", "comp-sci"],
        color: "bg-blue-500/10 text-blue-700 border-blue-500/30 hover:bg-blue-500/20",
        badge: "⚛️ Engineering / IIT",
    },
    {
        id: "pcb",
        label: "PCB (Science – Medical)",
        description: "Physics + Chemistry + Biology + English Core + Physical Education",
        subjects: ["eng-core", "physics", "chemistry", "biology", "pe-sr"],
        color: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30 hover:bg-emerald-500/20",
        badge: "🧬 MBBS / NEET",
    },
    {
        id: "pcmb",
        label: "PCMB (Maths + Bio – Broad Science)",
        description: "Physics + Chemistry + Maths + Biology + English Core",
        subjects: ["eng-core", "physics", "chemistry", "maths-sr", "biology"],
        color: "bg-cyan-500/10 text-cyan-700 border-cyan-500/30 hover:bg-cyan-500/20",
        badge: "🔬 PCM + PCB Both",
    },
    {
        id: "commerce-maths",
        label: "Commerce with Maths",
        description: "Accountancy + Business Studies + Economics + English Core + Applied Maths",
        subjects: ["eng-core", "accountancy", "biz-studies", "economics", "applied-maths"],
        color: "bg-amber-500/10 text-amber-700 border-amber-500/30 hover:bg-amber-500/20",
        badge: "💰 CA / Finance / MBA",
    },
    {
        id: "commerce-cs",
        label: "Commerce with CS",
        description: "Accountancy + Business Studies + Economics + English Core + Computer Science",
        subjects: ["eng-core", "accountancy", "biz-studies", "economics", "comp-sci"],
        color: "bg-orange-500/10 text-orange-700 border-orange-500/30 hover:bg-orange-500/20",
        badge: "💼 FinTech / Digital Business",
    },
    {
        id: "humanities-polsci",
        label: "Humanities – Civil Services",
        description: "History + Political Science + Geography + Economics + English Core",
        subjects: ["eng-core", "history", "pol-sci", "geography", "economics"],
        color: "bg-purple-500/10 text-purple-700 border-purple-500/30 hover:bg-purple-500/20",
        badge: "🏛️ IAS / IPS / Law",
    },
    {
        id: "humanities-psych",
        label: "Humanities – Psychology",
        description: "History + Psychology + Sociology + Political Science + English Core",
        subjects: ["eng-core", "history", "psychology", "sociology", "pol-sci"],
        color: "bg-rose-500/10 text-rose-700 border-rose-500/30 hover:bg-rose-500/20",
        badge: "🧠 Counselling / Social Work",
    },
];

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
function getGroupsForGrade(gradeNum: number): SubjectGroup[] {
    if (gradeNum <= 5) return primaryGroups;
    if (gradeNum <= 8) return middleGroups;
    if (gradeNum <= 10) return secondaryGroups;
    return seniorGroups;
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
    const groups = useMemo(() => getGroupsForGrade(gradeNum), [gradeNum]);
    const stageName = getStageName(gradeNum);

    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [showError, setShowError] = useState(false);
    const [customSubjectInput, setCustomSubjectInput] = useState("");

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
        // Scroll to top of subject list after applying combo
        window.scrollTo({ top: 300, behavior: "smooth" });
    };

    const handleNext = () => {
        if (selected.size < MIN_SUBJECTS) {
            setShowError(true);
            return;
        }
        navigate("/subject-quiz", {
            state: { grade, stage, selectedSubjects: Array.from(selected) },
        });
    };

    // Build selected subject names for display
    const allSubjects = groups.flatMap((g) => g.subjects);

    // Determine names, separating predefined from custom
    const selectedNames = Array.from(selected).map((id) => {
        if (id.startsWith("custom_")) {
            // Reconstruct a readable name from "custom_some-subject"
            // Wait, actually let's just reverse the ID transform or simply store the typed name.
            // Better yet, we can format the ID back to Title Case, or just find it.
            // Since we lose the original capitalization in the ID, let's just capitalize it nicely.
            const namePart = id.replace("custom_", "").replace(/-/g, " ");
            return namePart.replace(/\b\w/g, l => l.toUpperCase());
        }
        const found = allSubjects.find((s) => s.id === id);
        return found ? found.name : id;
    });

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border/40 bg-card/80 sticky top-0 z-50 backdrop-blur-xl">
                <div className="container mx-auto px-6 py-4 flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        <GraduationCap className="h-6 w-6 text-primary shrink-0" />
                        <div className="min-w-0">
                            <h1 className="text-base font-semibold text-foreground leading-tight">
                                Select Your Subjects
                            </h1>
                            <p className="text-xs text-muted-foreground truncate">{grade} · {stageName}</p>
                        </div>
                    </div>
                    {selected.size > 0 && (
                        <Badge variant="secondary" className="shrink-0 text-xs">
                            {selected.size} selected
                        </Badge>
                    )}
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-3xl">
                {/* Heading */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-foreground">
                        Which subjects do you study?
                    </h2>
                    <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
                        Select your current subjects so we can personalise your career guidance.
                        Choose at least <span className="font-semibold text-foreground">{MIN_SUBJECTS} subjects</span> to continue.
                    </p>
                </div>

                {/* Stream combo suggestions – only for Class 11-12 */}
                {isSenior && (
                    <Card className="mb-6 border border-border/50 bg-muted/40">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Zap className="h-4 w-4 text-primary" />
                                Popular Stream Combinations – Quick Select
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Click any combo to auto-fill subjects, then customise as needed
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
                                                            <span
                                                                className={`text-sm leading-snug ${isSelected ? "font-medium text-foreground" : "text-foreground/80"
                                                                    }`}
                                                            >
                                                                {subject.name}
                                                            </span>
                                                        </div>
                                                    </button>

                                                    {/* Tooltip */}
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <button className="mt-3 shrink-0 text-muted-foreground hover:text-foreground transition-colors">
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
                    Subjects based on the official CBSE curriculum 2025-26 (cbseacademic.nic.in)
                </p>
            </main>
        </div>
    );
};

export default SubjectSelection;
