import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, ArrowLeft, Search, Lock, BookOpen, Building2, Clock, IndianRupee, Trophy, ChevronRight, Layers, Star, Briefcase, FlaskConical, Scale, Palette, Landmark, HeartPulse, Code2, Sparkles, Lightbulb } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePermission } from "@/hooks/usePermission";
import { getPathwaysCareerMap } from "@/data/pathwayFromCatalog";
import type { CareerDetail } from "@/data/careersData";
import { SEO } from "@/components/SEO";
import { AdUnit } from "@/components/AdUnit";

/* ─────────────────────────── DATA ───────────────────────────────────── */



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

const phaseColors: Record<string, string> = {
  School: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  College: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
  Training: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  Preparation: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  Graduate: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  Bar: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  Service: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
  Career: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  MBA: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
};

const courseTypeColors: Record<string, string> = {
  UG: "bg-blue-500/10 text-blue-600 border-blue-200",
  PG: "bg-purple-500/10 text-purple-600 border-purple-200",
  Diploma: "bg-amber-500/10 text-amber-600 border-amber-200",
  Certificate: "bg-green-500/10 text-green-600 border-green-200",
  Professional: "bg-rose-500/10 text-rose-600 border-rose-200",
};

/** Built from `careersCatalog` + manual `careersData` + `careerRoleDetails` — stays aligned with /careers. */
const fullCareersMap = getPathwaysCareerMap();

/* ─────────────────────────── COMPONENT ─────────────────────────────── */

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

const Pathways = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const incomingCareer: string | undefined = location.state?.career;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCareer, setSelectedCareer] = useState<string | null>(
    incomingCareer ? resolveCareerKey(incomingCareer) : null
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { hasPermission, isLoading } = usePermission("edit_pathways");
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the active career into view in the sidebar when landing from Careers page
  useEffect(() => {
    if (!selectedCareer) return;
    const id = `nav-${selectedCareer.replace(/\W+/g, "-").toLowerCase()}`;
    const timer = setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ block: "center", behavior: "smooth" });
    }, 150);
    return () => clearTimeout(timer);
  }, [selectedCareer]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO 
        title={selected ? `${selected.title} Career Path` : "Career Pathways"}
        description={selected ? `Explore the complete roadmap to becoming a ${selected.title} in India, including salary, exams, and colleges.` : "Explore 100+ career paths with detailed roadmaps and educational requirements."}
        canonical="/pathways"
      />
      {/* ── Header ── */}
      <header className="border-b border-border/40 bg-card/80 sticky top-0 z-50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold text-foreground">Career Pathways</h1>
            </div>
          </div>
          {/* Mobile: sidebar toggle */}
          <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Layers className="h-4 w-4 mr-1" /> Careers
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ── LEFT SIDEBAR ── */}
        <motion.aside 
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          className={`
            fixed lg:sticky z-40 w-72 h-[calc(100vh-57px)] border-r border-border/40 
            bg-card/80 backdrop-blur-xl flex flex-col transition-transform duration-300 lg:transition-none
            top-[57px] bottom-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          {/* Search */}
          <div className="p-4 border-b border-border/40 bg-muted/20">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="pathway-search"
                placeholder="Search careers…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-sm bg-background/50 border-none shadow-inner focus-visible:ring-1 focus-visible:ring-primary/30"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pt-2">
            {Object.entries(grouped).map(([category, careers]) => (
              <div key={category} className="mb-4">
                <div className="px-4 py-1 flex items-center gap-2 sticky top-0 bg-card/95 backdrop-blur-sm z-10 border-b border-border/5">
                  {categoryIcons[category] ? React.createElement(categoryIcons[category], { className: "h-3.5 w-3.5 text-primary" }) : <Briefcase className="h-3.5 w-3.5" />}
                  <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground opacity-70">
                    {category}
                  </span>
                </div>
                <div className="space-y-0.5 px-2 mt-1">
                  {careers.map(c => (
                    <button
                      key={c}
                      id={`nav-${c.replace(/\W+/g, "-").toLowerCase()}`}
                      onClick={() => {
                        setSelectedCareer(c);
                        setSidebarOpen(false);
                      }}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all group
                        ${selectedCareer === c 
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]" 
                          : "text-muted-foreground hover:bg-muted hover:text-foreground hover:translate-x-1"}
                      `}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full transition-colors ${selectedCareer === c ? "bg-primary-foreground" : "bg-transparent group-hover:bg-primary/40"}`} />
                      <span className="truncate">{c}</span>
                      {selectedCareer === c && (
                        <motion.div layoutId="active-pill" className="ml-auto">
                          <ChevronRight className="h-3.5 w-3.5 opacity-70" />
                        </motion.div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            
            {Object.keys(grouped).length === 0 && (
              <div className="px-6 py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-muted mx-auto flex items-center justify-center">
                  <Search className="h-6 w-6 text-muted-foreground/40" />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">No careers found.</p>
              </div>
            )}
          </div>

          {/* Count */}
          <div className="p-3 border-t border-border/40 text-xs text-muted-foreground text-center">
            {allCareers.length} careers · {categoryOrder.length} categories
          </div>
          
          {/* Sidebar Ad Slot */}
          <div className="p-4 mt-auto">
            <AdUnit slot="2222222222" format="fluid" className="my-4" />
          </div>
        </motion.aside>

        {/* Mobile overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden" 
              onClick={() => setSidebarOpen(false)} 
            />
          )}
        </AnimatePresence>

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 overflow-y-auto bg-muted/10">
          <AnimatePresence mode="wait">
            {!selected ? (
              /* Empty state */
              <motion.div 
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="h-full flex flex-col items-center justify-center text-center p-12 space-y-8"
              >
                <div className="relative">
                  <motion.div 
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="w-24 h-24 rounded-[2rem] bg-primary/10 flex items-center justify-center relative z-10"
                  >
                    <GraduationCap className="h-12 w-12 text-primary" />
                  </motion.div>
                  <div className="absolute -inset-4 bg-primary/5 blur-2xl rounded-full" />
                </div>
                
                <div className="space-y-3 max-w-md">
                  <h2 className="text-3xl font-bold tracking-tight">Your Career Journey Starts Here</h2>
                  <p className="text-muted-foreground text-base leading-relaxed">
                    Select a profession from the sidebar. Every roadmap is generated from the same careers catalogue as{" "}
                    <Link to="/careers" className="text-primary underline font-medium">/careers</Link>—update the catalogue once and pathways stay aligned on deploy.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl w-full">
                  {Object.entries(categoryIcons).slice(0, 8).map(([cat, Icon]) => (
                    <div key={cat} className="flex flex-col items-center gap-2 bg-background/50 backdrop-blur-sm border border-border/40 rounded-xl p-4 transition-all hover:bg-background hover:shadow-glow hover:border-primary/20">
                      <Icon className="h-5 w-5 text-primary" />
                      <span className="text-[10px] uppercase font-bold tracking-wide opacity-60">{cat}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              /* Career Detail */
              <motion.div 
                key={selected.title}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="max-w-4xl mx-auto px-6 py-12 space-y-12"
              >
                {/* ── Hero banner with Overlays ── */}
                <div className="relative rounded-3xl p-10 text-white overflow-hidden shadow-2xl">
                  {/* Background Accents */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary via-indigo-600 to-violet-700" />
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full -mr-20 -mt-20" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/20 blur-[80px] rounded-full -ml-10 -mb-10" />
                  
                  {/* Glass Overlay Content */}
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30">
                        {categoryIcons[selected.category] ? React.createElement(categoryIcons[selected.category], { className: "h-6 w-6" }) : <Briefcase className="h-6 w-6" />}
                      </div>
                      <Badge className="bg-white/10 backdrop-blur-md text-white border-white/20 text-[10px] font-bold tracking-widest uppercase py-1">
                        {selected.category}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <h2 className="text-4xl md:text-5xl font-black tracking-tight">{selected.title}</h2>
                      <p className="text-white/80 text-xl font-medium italic opacity-90 leading-relaxed">
                        "{selected.tagline}"
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/20">
                      <p className="text-white/70 text-base max-w-2xl leading-relaxed">
                        {selected.overview}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ── Salary Snapshot ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: "Entry Level", value: selected.salaryRange.entry, color: "text-blue-500", icon: <Star className="h-4 w-4" /> },
                    { label: "Mid Career", value: selected.salaryRange.mid, color: "text-indigo-500", icon: <Trophy className="h-4 w-4" /> },
                    { label: "Senior Lead", value: selected.salaryRange.senior, color: "text-emerald-500", icon: <Landmark className="h-4 w-4" /> },
                  ].map(({ label, value, color, icon }) => (
                    <motion.div 
                      whileHover={{ y: -5 }}
                      key={label} 
                      className="bg-card/50 backdrop-blur-sm border border-border/40 rounded-2xl p-6 text-center shadow-sm hover:shadow-glow transition-all"
                    >
                      <div className={`w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center mx-auto mb-4 ${color}`}>
                        {icon}
                      </div>
                      <p className={`font-black text-lg tracking-tight ${color}`}>{value}</p>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mt-2 opacity-50">{label}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-8">
                    {/* ── Entrance Exams ── */}
                    <Card className="border-border/40 shadow-sm overflow-hidden rounded-2xl">
                      <div className="h-1.5 bg-amber-500/20 w-full" />
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-3 text-lg font-bold">
                          <Trophy className="h-5 w-5 text-amber-500" />
                          Verified Entrance Exams
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-wrap gap-2">
                        {selected.entranceExams.map(exam => (
                          <Badge key={exam} variant="outline" className="text-xs px-4 py-1.5 border-amber-500/20 text-amber-700 dark:text-amber-400 bg-amber-500/5 hover:bg-amber-500/10 transition-colors">
                            {exam}
                          </Badge>
                        ))}
                      </CardContent>
                    </Card>

                    {/* ── Courses ── */}
                    <Card className="border-border/40 shadow-sm overflow-hidden rounded-2xl">
                      <div className="h-1.5 bg-primary/20 w-full" />
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-3 text-lg font-bold">
                          <BookOpen className="h-5 w-5 text-primary" />
                          Recommended Education
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {selected.courses.map((course, i) => (
                          <div key={i} className="flex items-start justify-between gap-4 p-4 rounded-xl bg-muted/30 border border-border/30 hover:bg-muted/50 transition-colors group">
                            <div className="space-y-1">
                              <p className="text-sm font-bold text-foreground leading-snug group-hover:text-primary transition-colors">{course.name}</p>
                              <div className="flex items-center gap-3">
                                <Badge className={`text-[10px] px-2 py-0 border-none ${courseTypeColors[course.type]}`}>
                                  {course.type}
                                </Badge>
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                  <Clock className="h-3.5 w-3.5" />
                                  <span className="text-xs font-medium">{course.duration}</span>
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
                    <Card className="border-border/40 shadow-sm overflow-hidden rounded-2xl">
                      <div className="h-1.5 bg-indigo-500/20 w-full" />
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-3 text-lg font-bold">
                          <Sparkles className="h-5 w-5 text-indigo-500" />
                          High-Income Skills
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-wrap gap-2">
                        {selected.skills.map(skill => (
                          <div key={skill} className="px-3 py-1.5 rounded-full bg-secondary/50 text-secondary-foreground text-xs font-semibold border border-border/20">
                            {skill}
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    {/* ── Colleges ── */}
                    <Card className="border-border/40 shadow-sm overflow-hidden rounded-2xl">
                      <div className="h-1.5 bg-violet-500/20 w-full" />
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-3 text-lg font-bold">
                          <Building2 className="h-5 w-5 text-violet-500" />
                          Verified Institutions
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {selected.topColleges.map((college, i) => (
                          <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-muted/20 border border-border/20">
                            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center flex-shrink-0 text-violet-600 font-black text-xs">
                              #{i + 1}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-foreground leading-tight">{college.name}</p>
                              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <Landmark className="h-3 w-3" />
                                {college.location}
                              </p>
                              {college.rank && (
                                <Badge className="mt-2 text-[10px] bg-primary/5 text-primary border-primary/20 px-2 py-0 font-bold">
                                  {college.rank}
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* In-Content Ad */}
                <AdUnit slot="3333333333" type="in-article" className="my-8" />

                {/* ── Step-by-Step Roadmap ── */}
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <ChevronRight className="h-6 w-6" />
                      </div>
                      The Verified Roadmap
                    </h3>
                    <Badge variant="secondary" className="px-4 py-1 text-[10px] font-bold tracking-widest uppercase">
                      Synced with /careers catalogue
                    </Badge>
                  </div>

                  <div className="relative pl-8 space-y-12 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-gradient-to-b before:from-primary before:via-indigo-500 before:to-violet-500 before:rounded-full">
                    {selected.roadmap.map((step, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        key={idx} 
                        className="relative group"
                      >
                        {/* Bullet */}
                        <div className="absolute -left-10 top-1.5 w-5 h-5 rounded-full bg-background border-4 border-primary shadow-[0_0_15px_rgba(155,135,245,0.4)] z-10 transition-transform group-hover:scale-125" />
                        
                        <div className="space-y-4">
                          <div className="flex flex-wrap items-center gap-4">
                            <Badge className={`text-[10px] font-black tracking-widest uppercase px-3 py-1 border-none shadow-sm ${phaseColors[step.phase] || "bg-muted text-muted-foreground"}`}>
                              {step.phase}
                            </Badge>
                            <h4 className="text-xl font-bold text-foreground">{step.title}</h4>
                            <div className="flex items-center gap-2 text-muted-foreground bg-muted/30 px-3 py-1 rounded-full text-[10px] font-bold">
                              <Clock className="h-3.5 w-3.5" />
                              {step.duration}
                            </div>
                          </div>
                          
                          <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
                            {step.description}
                          </p>

                          <div className="flex flex-wrap gap-3 pt-2">
                            {step.tips.map((tip, i) => (
                              <div key={i} className="flex items-center gap-2 text-xs font-semibold text-primary/80 bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10">
                                <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                                {tip}
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* ── Pro Tip ── */}
                <Card className="border-amber-500/20 bg-amber-500/5 shadow-card">
                  <CardContent className="pt-5 pb-5">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-500/15 flex items-center justify-center flex-shrink-0">
                        <Star className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-1">Expert Tip</p>
                        <p className="text-sm text-foreground/80 leading-relaxed">{selected.proTip}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};


export default Pathways;
