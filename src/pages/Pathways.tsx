import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, ArrowLeft, Search, BookOpen, Building2, Clock, IndianRupee, Trophy, ChevronRight, Layers, Star, Briefcase, FlaskConical, Scale, Palette, Landmark, HeartPulse, Code2, Sparkles } from "lucide-react";
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
        description={selected ? `Explore the career path for ${selected.title} in India, including salary, exams, and colleges.` : "Explore 100+ career paths with clear education and exam details."}
        canonical="/pathways"
      />
      {/* ── Header ── */}
      <header className="border-b border-border/40 bg-card/80 sticky top-0 z-50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")} aria-label="Go back">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              <h1 className="text-lg font-semibold text-foreground">
                Zertainity
                <span className="text-muted-foreground mx-1.5">/</span>
                <span className="bg-gradient-primary bg-clip-text text-transparent">Pathways</span>
              </h1>
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
            bg-background flex flex-col transition-transform duration-300 lg:transition-none
            top-[57px] bottom-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          {/* Search */}
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="pathway-search"
                placeholder="Search careers…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pt-2">
            {Object.entries(grouped).map(([category, careers]) => (
              <div key={category} className="mb-4">
                <div className="px-4 py-1 flex items-center gap-2 sticky top-0 bg-background z-10 border-b border-border/20">
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
                        w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors group
                        ${selectedCareer === c 
                          ? "bg-primary text-primary-foreground" 
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"}
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
          <div className="p-3 border-t border-border text-xs text-muted-foreground text-center">
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
              className="fixed inset-0 z-30 bg-black/50 lg:hidden" 
              onClick={() => setSidebarOpen(false)} 
            />
          )}
        </AnimatePresence>

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 overflow-y-auto bg-background">
          <AnimatePresence mode="wait">
            {!selected ? (
              /* Empty state */
              <motion.div 
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="h-full flex flex-col items-center justify-center text-center p-12 space-y-5"
              >
                <div className="w-16 h-16 rounded-2xl border border-border flex items-center justify-center">
                  <GraduationCap className="h-8 w-8 text-primary" />
                </div>
                
                <div className="space-y-3 max-w-md">
                  <h2 className="text-2xl font-semibold tracking-tight">Choose a Career Path</h2>
                  <p className="text-muted-foreground text-base leading-relaxed">
                    Select a profession from the sidebar. Every path is generated from the same careers catalogue as{" "}
                    <Link to="/careers" className="text-primary underline font-medium">/careers</Link>—update the catalogue once and pathways stay aligned on deploy.
                  </p>
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
                className="max-w-4xl mx-auto px-6 py-10 space-y-8"
              >
                {/* ── Hero ── */}
                <div className="rounded-2xl border border-border bg-card p-8">
                  <div className="space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                        {categoryIcons[selected.category] ? React.createElement(categoryIcons[selected.category], { className: "h-6 w-6" }) : <Briefcase className="h-6 w-6" />}
                      </div>
                      <Badge variant="outline" className="text-[10px] font-semibold tracking-widest uppercase py-1">
                        {selected.category}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">{selected.title}</h2>
                      <p className="text-muted-foreground text-base italic leading-relaxed">
                        "{selected.tagline}"
                      </p>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <p className="text-muted-foreground text-sm max-w-2xl leading-relaxed">
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
                      key={label} 
                      className="bg-card border border-border rounded-xl p-5 text-center"
                    >
                      <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center mx-auto mb-3 ${color}`}>
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
                    <Card className="border-border shadow-none rounded-xl">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-3 text-lg font-bold">
                          <Trophy className="h-5 w-5 text-amber-500" />
                          Verified Entrance Exams
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-wrap gap-2">
                        {selected.entranceExams.map(exam => (
                          <Badge key={exam} variant="outline" className="text-xs px-3 py-1 border-border">
                            {exam}
                          </Badge>
                        ))}
                      </CardContent>
                    </Card>

                    {/* ── Courses ── */}
                    <Card className="border-border shadow-none rounded-xl">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-3 text-lg font-bold">
                          <BookOpen className="h-5 w-5 text-primary" />
                          Recommended Education
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {selected.courses.map((course, i) => (
                          <div key={i} className="flex items-start justify-between gap-4 p-3 rounded-lg bg-muted/30 border border-border/40">
                            <div className="space-y-1">
                              <p className="text-sm font-semibold text-foreground leading-snug">{course.name}</p>
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
                    <Card className="border-border shadow-none rounded-xl">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-3 text-lg font-bold">
                          <Sparkles className="h-5 w-5 text-indigo-500" />
                          Core Skills
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
                    <Card className="border-border shadow-none rounded-xl">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-3 text-lg font-bold">
                          <Building2 className="h-5 w-5 text-violet-500" />
                          Verified Institutions
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {selected.topColleges.map((college, i) => (
                          <div key={i} className="flex items-start gap-4 p-4 rounded-lg bg-muted/20 border border-border/30">
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

              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};


export default Pathways;
