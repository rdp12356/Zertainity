import React, { useMemo, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, ArrowLeft, Search, BookOpen, Building2, Clock, IndianRupee, Trophy, ChevronRight, Layers, Star, Briefcase, FlaskConical, Scale, Palette, Landmark, HeartPulse, Code2, Sparkles } from "lucide-react";

import { useSetCurves } from "@/components/CurvesContext";
import CurvedCard from "@/components/CurvedCard";
import DecorativeCurves from "@/components/DecorativeCurves";
import { SEO } from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { findVerifiedExamsByLabel } from "@/data/examsCatalog";
import { getPathwaysCareerMap } from "@/data/pathwayFromCatalog";
import { usePermission } from "@/hooks/usePermission";

const categoryOrder = [
  "Technology", "Medical", "Engineering", "Government", "Finance", 
  "Law", "Design", "Science", "Business", "Banking", "Legal", "Education", 
  "Healthcare", "Media", "Marketing", "Hospitality", "Tourism", "Aviation", 
  "Maritime", "Agriculture", "Sports", "Social Sciences"
];

const categoryIcons: Record<string, any> = {
  Technology: Code2, Medical: HeartPulse, Engineering: Layers, Government: Landmark,
  Finance: IndianRupee, Law: Scale, Design: Palette, Science: FlaskConical,
};

const courseTypeColors: Record<string, string> = {
  UG: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  PG: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Diploma: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Certificate: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Professional: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

// Category-matched premium gradient glows with transition easing
const getCategoryGlow = (category: string): string => {
  const cat = category.toLowerCase();
  if (cat.includes("tech")) return "hover:shadow-[0_0_30px_rgba(59,130,246,0.18)] hover:border-blue-500/40";
  if (cat.includes("med") || cat.includes("health")) return "hover:shadow-[0_0_30px_rgba(244,63,94,0.18)] hover:border-rose-500/40";
  if (cat.includes("eng")) return "hover:shadow-[0_0_30px_rgba(139,92,246,0.18)] hover:border-violet-500/40";
  if (cat.includes("gov") || cat.includes("law") || cat.includes("legal")) return "hover:shadow-[0_0_30px_rgba(245,158,11,0.18)] hover:border-amber-500/40";
  if (cat.includes("fin") || cat.includes("bank")) return "hover:shadow-[0_0_30px_rgba(16,185,129,0.18)] hover:border-emerald-500/40";
  if (cat.includes("design") || cat.includes("art")) return "hover:shadow-[0_0_30px_rgba(236,72,153,0.18)] hover:border-pink-500/40";
  return "hover:shadow-[0_0_30px_rgba(99,102,241,0.18)] hover:border-amber-500/40";
};

// Category icon color mappings
const getCategoryIconStyles = (category: string): string => {
  const cat = category.toLowerCase();
  if (cat.includes("tech")) return "bg-blue-500/10 text-blue-400 border-blue-500/20";
  if (cat.includes("med") || cat.includes("health")) return "bg-rose-500/10 text-rose-400 border-rose-500/20";
  if (cat.includes("eng")) return "bg-violet-500/10 text-violet-400 border-violet-500/20";
  if (cat.includes("gov") || cat.includes("law") || cat.includes("legal")) return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  if (cat.includes("fin") || cat.includes("bank")) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  if (cat.includes("design") || cat.includes("art")) return "bg-pink-500/10 text-pink-400 border-pink-500/20";
  return "bg-amber-500/10 text-amber-400 border-amber-500/20";
};

/** Built from `careersCatalog` + manual `careersData` + `careerRoleDetails` — stays aligned with /careers. */
const fullCareersMap = getPathwaysCareerMap();

/** Resolve incoming career name (from Careers page) to the nearest key in the
 *  careers map. Handles substring matches, case differences, and partial names.
 */
const resolveCareerKey = (incoming: string): string | null => {
  if (!incoming) return null;
  const keys = Object.keys(fullCareersMap);
  const lower = incoming.toLowerCase();

  // 1. Exact match
  const exact = keys.find(k => k.toLowerCase() === lower);
  if (exact) return exact;

  // 2. Key is contained in incoming string or vice-versa
  const partial = keys.find(
    k => lower.includes(k.toLowerCase()) || k.toLowerCase().includes(lower)
  );
  if (partial) return partial;

  // 3. Any word overlap
  const incomingWords = lower.split(/\W+/).filter(Boolean);
  let bestKey: string | null = null;
  let bestScore = 0;
  for (const k of keys) {
    const kWords = k.toLowerCase().split(/\W+/).filter(Boolean);
    const overlap = incomingWords.filter(w => kWords.includes(w)).length;
    if (overlap > bestScore) { bestScore = overlap; bestKey = k; }
  }
  return bestScore > 0 ? bestKey : null;
};

// Ultra-snappy spring physics for high performance active state indicators
const transitionSpring = { type: "spring", stiffness: 450, damping: 35 };

// Ultra-snappy stagger entry configuration for lightning fast perceived load
const detailContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.02, // 20ms delay per child (twice as fast!)
    }
  }
};

const detailItem = {
  hidden: { opacity: 0, y: 8, scale: 0.99 }, // shorter travel distance for snappier motion
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { 
      type: "spring", 
      stiffness: 180, // snappier spring return rate
      damping: 22 
    } 
  }
};

const Pathways = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const incomingCareer: string | undefined = location.state?.career;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCareer, setSelectedCareer] = useState<string | null>(
    incomingCareer ? resolveCareerKey(incomingCareer) : null
  );
  const [selectedExamLabel, setSelectedExamLabel] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { hasPermission, isLoading } = usePermission("edit_pathways");

  // Auto-scroll the active career into view in the sidebar when landing from Careers page
  useEffect(() => {
    if (!selectedCareer) return;
    const id = `nav-${selectedCareer.replace(/\W+/g, "-").toLowerCase()}`;
    const timer = setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ block: "center", behavior: "smooth" });
    }, 120);
    return () => clearTimeout(timer);
  }, [selectedCareer]);

  useEffect(() => {
    setSelectedExamLabel(null);
  }, [selectedCareer]);

  const setCurves = useSetCurves();
  useEffect(() => {
    setCurves([
      { d: "M -120 420 C 20 360, 220 320, 420 360 S 700 440, 980 380", strokeOpacity: 0.08, strokeWidth: 5 },
      { d: "M -120 420 C 20 360, 220 320, 420 360 S 700 440, 980 380", strokeOpacity: 0.2, strokeWidth: 1.35 },
    ]);
    return () => setCurves([]);
  }, [setCurves]);

  const allCareers = Object.keys(fullCareersMap);
  const filtered = allCareers.filter(c =>
    c.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const grouped = categoryOrder.reduce((acc, cat) => {
    const list = filtered.filter(c => fullCareersMap[c]?.category === cat);
    if (list.length) acc[cat] = list;
    return acc;
  }, {} as Record<string, string[]>);

  const selected = selectedCareer ? fullCareersMap[selectedCareer] : null;
  const selectedExamMatches = useMemo(
    () => (selectedExamLabel ? findVerifiedExamsByLabel(selectedExamLabel) : []),
    [selectedExamLabel]
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-white/60 font-medium animate-pulse">Loading pathways...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative selection:bg-white/10 overflow-hidden font-sans">
      <DecorativeCurves />
      
      {/* Background Decorative Mesh Glows */}
      <div className="absolute top-[-10%] right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[40%] right-[10%] w-[350px] h-[350px] bg-amber-500/5 rounded-full blur-[90px] pointer-events-none" />

      {/* SEO metadata */}
      <SEO
        title={selected ? `How to become a ${selected.title}` : "Indian Student Career Pathways & Exams"}
        description={selected ? `Step-by-step career path guidelines to become a ${selected.title} in India. Details on verified colleges, courses, entrance exams, and skills.` : "Comprehensive step-by-step pathways to premium careers. Browse required degrees, entry requirements, salary milestones, and top Indian universities."}
        canonical={selected ? `/pathways?career=${encodeURIComponent(selected.title)}` : "/pathways"}
        keywords="career pathways India, entrance exams, degree pathways, how to become, educational planning class 10 12"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Pathways", path: "/pathways" },
        ]}
      />

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10">
        <div className="mx-auto max-w-[1080px] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate("/")} 
              className="w-9 h-9 flex items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200"
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-amber-500 animate-pulse" />
              <span className="text-sm font-semibold tracking-tight text-white/90">
                Career Pathways
              </span>
            </div>
          </div>
          {/* Mobile: sidebar toggle */}
          <Button 
            variant="outline" 
            size="sm" 
            className="lg:hidden rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-white hover:border-white/20 transition-all duration-150" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Layers className="h-4 w-4 mr-1.5 text-amber-500" /> Careers
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ── LEFT SIDEBAR ── */}
        <aside
          className={`
            fixed lg:sticky z-40 w-[88vw] max-w-[340px] lg:w-80 lg:max-w-none h-[calc(100vh-57px)]
            border-r border-white/10 bg-black/60 backdrop-blur-md flex flex-col
            transition-transform duration-300 cubic-bezier(0.16, 1, 0.3, 1) lg:transition-none
            top-[57px] bottom-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          {/* Search */}
          <div className="p-4 border-b border-white/10 bg-black/20">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 transition-colors group-focus-within:text-amber-500" />
              <Input
                id="pathway-search"
                placeholder="Search careers…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 h-10 text-sm bg-white/[0.02] border-white/10 rounded-xl text-white placeholder:text-white/30 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-amber-500/40 focus-visible:border-amber-500/50 hover:border-white/20"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pt-2 space-y-1">
            {Object.entries(grouped).map(([category, careers]) => (
              <div key={category} className="mb-4">
                <div className="px-4 py-2 flex items-center gap-2 sticky top-0 bg-black/95 backdrop-blur-md z-10 border-b border-white/5">
                  {categoryIcons[category] ? React.createElement(categoryIcons[category], { className: "h-3.5 w-3.5 text-amber-500" }) : <Briefcase className="h-3.5 w-3.5 text-white/50" />}
                  <span className="text-[10px] uppercase font-black tracking-widest text-white/60">
                    {category}
                  </span>
                </div>
                <div className="space-y-0.5 px-2 mt-2">
                  {careers.map(c => {
                    const isSelected = selectedCareer === c;
                    return (
                      <button
                        key={c}
                        id={`nav-${c.replace(/\W+/g, "-").toLowerCase()}`}
                        onClick={() => {
                          setSelectedCareer(c);
                          setSidebarOpen(false);
                        }}
                        className={`
                          w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cubic-bezier(0.16, 1, 0.3, 1) group relative
                          ${isSelected 
                            ? "bg-white/10 text-white border border-white/20 shadow-[0_4px_20px_rgba(255,255,255,0.05)]" 
                            : "text-white/60 hover:bg-white/5 hover:text-white hover:translate-x-0.5"}
                        `}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${isSelected ? "bg-amber-400" : "bg-transparent group-hover:bg-amber-400/40"}`} />
                        <span className="truncate">{c}</span>
                        {isSelected && (
                          <motion.div layoutId="active-pill" transition={transitionSpring} className="ml-auto flex items-center">
                            <ChevronRight className="h-3.5 w-3.5 text-amber-400" />
                          </motion.div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            
            {Object.keys(grouped).length === 0 && (
              <div className="px-6 py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 mx-auto flex items-center justify-center">
                  <Search className="h-5 w-5 text-white/30" />
                </div>
                <p className="text-sm text-white/40 leading-relaxed font-light">No careers found.</p>
              </div>
            )}
          </div>

          {/* Count + Sidebar */}
          <div className="border-t border-white/10 bg-black/40">
            <div className="p-3 text-xs text-white/40 text-center font-medium">
              {allCareers.length} careers · {categoryOrder.length} categories
            </div>
          </div>
        </aside>

        {/* Mobile overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="fixed inset-0 z-30 bg-black/80 lg:hidden" 
              onClick={() => setSidebarOpen(false)} 
            />
          )}
        </AnimatePresence>

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 overflow-y-auto bg-black/20 relative">
          <AnimatePresence mode="wait">
            {!selected ? (
              /* Empty state */
              <motion.div 
                key="empty"
                initial={{ opacity: 0, y: 10, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.99 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="h-full flex flex-col items-center justify-center text-center p-6 sm:p-12 space-y-6 max-w-2xl mx-auto"
              >
                <div className="w-20 h-20 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-md flex items-center justify-center shadow-lg relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent" />
                  <GraduationCap className="h-10 w-10 text-amber-500 group-hover:scale-110 transition-transform duration-250" />
                </div>
                
                <div className="space-y-3 max-w-md">
                  <h2 
                    className="text-2xl sm:text-3xl font-light tracking-tight text-white"
                    style={{ fontFamily: "'Instrument Serif', serif" }}
                  >
                    Choose a Career Path
                  </h2>
                  <p className="text-white/60 text-sm sm:text-base leading-relaxed font-light">
                    Select a profession from the sidebar. Every path is generated from the same careers catalogue as{" "}
                    <Link to="/careers" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors inline-flex items-center gap-1 hover:underline">
                      Explore Careers <Sparkles className="h-3 w-3" />
                    </Link>—update the catalogue once and pathways stay aligned on deploy.
                  </p>
                </div>
              </motion.div>
            ) : (
              /* Career Detail with sequential snappy spring loading */
              <motion.div 
                key={selected.title}
                variants={detailContainer}
                initial="hidden"
                animate="show"
                exit="hidden"
                className="max-w-4xl mx-auto px-6 py-10 space-y-8"
              >
                {/* ── Hero ── */}
                <motion.div variants={detailItem}>
                  <CurvedCard
                    className="rounded-3xl border border-white/10 bg-white/[0.02] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-xl p-8 md:p-10 shadow-xl relative overflow-hidden group"
                    curves={[
                      { d: "M -100 180 C 10 140, 140 110, 360 150 S 640 220, 920 180", strokeOpacity: 0.1, strokeWidth: 5 },
                      { d: "M -100 180 C 10 140, 140 110, 360 150 S 640 220, 920 180", strokeOpacity: 0.35, strokeWidth: 1.2 },
                    ]}
                  >
                    {/* Glowing ambient background corresponding to category */}
                    <div className="absolute top-0 right-0 w-[260px] h-[260px] bg-amber-500/5 rounded-full blur-[70px] pointer-events-none -mr-12 -mt-12 transition-all duration-300 group-hover:bg-amber-500/10" />
                    
                    <div className="space-y-6 relative z-10">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-2xl border ${getCategoryIconStyles(selected.category)}`}>
                          {categoryIcons[selected.category] ? React.createElement(categoryIcons[selected.category], { className: "h-6 w-6" }) : <Briefcase className="h-6 w-6" />}
                        </div>
                        <Badge variant="outline" className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 bg-white/5 border-white/10 text-white/80">
                          {selected.category}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <h2 
                          className="text-3xl md:text-5xl font-light tracking-[-0.5px] text-white leading-tight"
                          style={{ fontFamily: "'Instrument Serif', serif" }}
                        >
                          {selected.title}
                        </h2>
                        <p className="text-white/60 text-base md:text-lg italic font-light leading-relaxed">
                          "{selected.tagline}"
                        </p>
                      </div>

                      <div className="pt-5 border-t border-white/10">
                        <p className="text-white/80 text-sm md:text-base max-w-3xl leading-relaxed font-light">
                          {selected.overview}
                        </p>
                      </div>
                    </div>
                  </CurvedCard>
                </motion.div>

                {/* ── Salary Snapshot ── */}
                <motion.div variants={detailItem} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: "Entry Level", value: selected.salaryRange.entry, color: "text-blue-400", glow: "hover:shadow-[0_0_25px_rgba(59,130,246,0.15)]", border: "group-hover:border-blue-500/30", bg: "bg-blue-500/10", icon: <Star className="h-5 w-5" /> },
                    { label: "Mid Career", value: selected.salaryRange.mid, color: "text-purple-400", glow: "hover:shadow-[0_0_25px_rgba(168,85,247,0.15)]", border: "group-hover:border-purple-500/30", bg: "bg-purple-500/10", icon: <Trophy className="h-5 w-5" /> },
                    { label: "Senior Lead", value: selected.salaryRange.senior, color: "text-emerald-400", glow: "hover:shadow-[0_0_25px_rgba(16,185,129,0.15)]", border: "group-hover:border-emerald-500/30", bg: "bg-emerald-500/10", icon: <Landmark className="h-5 w-5" /> },
                  ].map(({ label, value, color, glow, border, bg, icon }) => (
                    <div 
                      key={label}
                      className={`group bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1) hover:-translate-y-1 ${glow}`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 border border-white/10 transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1) ${bg} ${color} ${border}`}>
                        {icon}
                      </div>
                      <p className={`font-semibold text-xl tracking-tight text-white`}>{value}</p>
                      <p className="text-[10px] uppercase font-black tracking-widest text-white/40 mt-2.5">{label}</p>
                    </div>
                  ))}
                </motion.div>

                <motion.div variants={detailItem} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-8">
                    {/* ── Entrance Exams ── */}
                    <Card className="border-white/10 bg-white/[0.02] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-md rounded-2xl overflow-hidden text-white">
                      <CardHeader className="pb-4 border-b border-white/10 bg-black/40">
                        <CardTitle className="flex items-center gap-3 text-base font-semibold text-white">
                          <Trophy className="h-5 w-5 text-amber-400" />
                          Verified Entrance Exams
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 flex flex-wrap gap-2.5">
                        {selected.entranceExams.map((exam) => {
                          const isSelected = selectedExamLabel === exam;
                          return (
                            <button
                              key={exam}
                              type="button"
                              onClick={() => setSelectedExamLabel(isSelected ? null : exam)}
                              className="focus:outline-none rounded-full"
                            >
                              <Badge 
                                variant="outline" 
                                className={`text-xs px-3.5 py-1.5 rounded-full transition-all duration-200 cubic-bezier(0.16, 1, 0.3, 1) border font-medium ${
                                  isSelected 
                                    ? "bg-amber-500 text-black border-amber-500 shadow-sm shadow-amber-500/20 scale-103" 
                                    : "bg-white/5 border-white/10 text-white/80 hover:border-amber-500/40 hover:text-white hover:bg-amber-500/10 hover:scale-101"
                                }`}
                              >
                                {exam}
                              </Badge>
                            </button>
                          );
                        })}
                      </CardContent>
                    </Card>

                    <AnimatePresence>
                      {selectedExamLabel && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.99 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.99 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <Card className="border-amber-500/20 bg-amber-500/5 backdrop-blur-md shadow-md rounded-2xl overflow-hidden text-white">
                            <CardHeader className="pb-3 border-b border-amber-500/10 bg-amber-500/10">
                              <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-3 text-sm font-semibold text-amber-300">
                                  <Trophy className="h-5 w-5 text-amber-400" />
                                  Verified Exam Details
                                </CardTitle>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => setSelectedExamLabel(null)}
                                  className="h-6 w-6 p-0 rounded-full hover:bg-white/10 text-white/70 hover:text-white"
                                >
                                  ×
                                </Button>
                              </div>
                              <CardDescription className="text-white/60 text-xs">
                                Information for {selectedExamLabel}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="p-5 space-y-4">
                              {selectedExamMatches.length > 0 ? (
                                selectedExamMatches.map((exam) => (
                                  <div key={exam.id} className="rounded-xl border border-white/10 bg-black/40 p-5 space-y-4 shadow-inner">
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                      <div>
                                        <p className="font-semibold text-white text-sm sm:text-base">{exam.name}</p>
                                        <p className="text-xs text-white/50 font-medium mt-0.5">{exam.authority}</p>
                                      </div>
                                      <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-300 text-[10px] font-bold py-0.5">
                                        Verified: {exam.lastVerifiedOn}
                                      </Badge>
                                    </div>
                                    <div className="grid gap-3 text-xs text-white/70 sm:grid-cols-2 pt-2 border-t border-white/5">
                                      <p className="flex items-center gap-2"><span className="font-bold text-white/90">Apply:</span> {exam.registrationWindow}</p>
                                      <p className="flex items-center gap-2"><span className="font-bold text-white/90">Exam:</span> {exam.examWindow}</p>
                                      <p className="flex items-center gap-2"><span className="font-bold text-white/90">Results:</span> {exam.resultWindow}</p>
                                      <p className="flex items-center gap-2"><span className="font-bold text-white/90">Attempts:</span> {exam.attempts}</p>
                                    </div>
                                    <div className="space-y-2 pt-3 border-t border-white/5">
                                      <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">Applies To Pathways</p>
                                      <div className="flex flex-wrap gap-1.5">
                                        {exam.pathways.map((path) => (
                                          <Badge key={path} variant="secondary" className="text-[10px] px-2 py-0.5 bg-white/5 text-white/80 border-none rounded-md">
                                            {path}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="rounded-xl border border-dashed border-white/10 bg-black/20 p-5 text-xs text-white/60 leading-relaxed">
                                  No exact exam record matched this label yet. Add the exam to the verified catalogue to surface its full data here.
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* ── Courses ── */}
                    <Card className="border-white/10 bg-white/[0.02] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-md rounded-2xl overflow-hidden text-white">
                      <CardHeader className="pb-4 border-b border-white/10 bg-black/40">
                        <CardTitle className="flex items-center gap-3 text-base font-semibold text-white">
                          <BookOpen className="h-5 w-5 text-indigo-400" />
                          Recommended Education
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-5 space-y-4">
                        {selected.courses.map((course, i) => (
                          <div key={i} className="flex items-start justify-between gap-4 p-4 rounded-xl bg-white/[0.01] border border-white/10 hover:border-white/20 transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1) group">
                            <div className="space-y-2.5">
                              <p className="text-sm font-semibold text-white leading-snug group-hover:text-amber-400 transition-colors duration-200">{course.name}</p>
                              <div className="flex flex-wrap items-center gap-3">
                                <Badge className={`text-[10px] font-bold px-2 py-0.5 rounded border transition-all duration-200 ${courseTypeColors[course.type] || "bg-white/5 text-white/60 border-white/10"}`}>
                                  {course.type}
                                </Badge>
                                <div className="flex items-center gap-1.5 text-white/60">
                                  <Clock className="h-3.5 w-3.5 text-white/40" />
                                  <span className="text-xs font-semibold">{course.duration}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-8">
                    {/* ── Key Skills ── */}
                    <Card className="border-white/10 bg-white/[0.02] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-md rounded-2xl overflow-hidden text-white">
                      <CardHeader className="pb-4 border-b border-white/10 bg-black/40">
                        <CardTitle className="flex items-center gap-3 text-base font-semibold text-white">
                          <Sparkles className="h-5 w-5 text-indigo-400 animate-spin [animation-duration:15s]" />
                          Core Skills
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 flex flex-wrap gap-2">
                        {selected.skills.map(skill => (
                          <div key={skill} className="px-3.5 py-1.5 rounded-xl bg-white/5 text-white/80 text-xs font-semibold border border-white/5 hover:border-white/20 hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-200 cubic-bezier(0.16, 1, 0.3, 1)">
                            {skill}
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    {/* ── Colleges ── */}
                    <Card className="border-white/10 bg-white/[0.02] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-md rounded-2xl overflow-hidden text-white">
                      <CardHeader className="pb-4 border-b border-white/10 bg-black/40">
                        <CardTitle className="flex items-center gap-3 text-base font-semibold text-white">
                          <Building2 className="h-5 w-5 text-purple-400" />
                          Verified Institutions
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-5 space-y-4">
                        {selected.topColleges.map((college, i) => (
                          <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.01] border border-white/10 hover:border-purple-500/20 transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1) group">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0 text-purple-400 font-bold text-sm group-hover:scale-105 transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1)">
                              #{i + 1}
                            </div>
                            <div className="min-w-0 space-y-1.5">
                              <p className="text-sm font-semibold text-white leading-tight group-hover:text-purple-400 transition-colors duration-200">{college.name}</p>
                              <p className="text-xs text-white/50 flex items-center gap-1.5 font-medium">
                                <Landmark className="h-3 w-3 text-white/40" />
                                {college.location}
                              </p>
                              {college.context && (
                                <p className="text-xs text-white/60 leading-relaxed font-light pt-1 border-t border-white/5 font-light">
                                  {college.context}
                                </p>
                              )}
                              {college.rank && (
                                <Badge className="mt-2 text-[10px] font-bold bg-purple-500/10 text-purple-300 border-purple-500/20 px-2.5 py-0.5">
                                  {college.rank}
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>

              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Pathways;
