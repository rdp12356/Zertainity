



import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, ArrowLeft, Search, Briefcase, Lock, Sparkles, Filter, SlidersHorizontal, Info } from "lucide-react";

import CurvedCard from "@/components/CurvedCard";
import { useSetCurves } from "@/components/CurvesContext";
import DecorativeCurves from "@/components/DecorativeCurves";
import { SEO } from "@/components/SEO";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { COMPREHENSIVE_CAREERS } from "@/data/careersCatalog";
import { hasCareerRoleDetail, getCareerSlugForListName } from "@/data/careerRoleDetails";
import { usePermission } from "@/hooks/usePermission";

// Category-matched premium gradient glows
const getCategoryGlow = (category: string): string => {
  const cat = category.toLowerCase();
  if (cat.includes("tech")) return "hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:border-blue-500/30";
  if (cat.includes("med") || cat.includes("health")) return "hover:shadow-[0_0_30px_rgba(244,63,94,0.15)] hover:border-rose-500/30";
  if (cat.includes("eng")) return "hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] hover:border-violet-500/30";
  if (cat.includes("gov") || cat.includes("law") || cat.includes("legal")) return "hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] hover:border-amber-500/30";
  if (cat.includes("fin") || cat.includes("bank")) return "hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] hover:border-emerald-500/30";
  if (cat.includes("design") || cat.includes("art")) return "hover:shadow-[0_0_30px_rgba(236,72,153,0.15)] hover:border-pink-500/30";
  return "hover:shadow-[0_0_30px_rgba(218,165,32,0.15)] hover:border-amber-500/30";
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

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 18 } }
};

const Careers = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { hasPermission, isLoading, userRole } = usePermission('edit_careers');

  const setCurves = useSetCurves();
  useEffect(() => {
    setCurves([
      { d: "M -170 520 C 40 460, 220 420, 420 460 S 700 540, 980 480", stroke: "rgba(255,255,255,0.06)", strokeOpacity: 0.18, strokeWidth: 4 },
      { d: "M -170 520 C 40 460, 220 420, 420 460 S 700 540, 980 480", stroke: "rgba(255,255,255,0.15)", strokeOpacity: 0.44, strokeWidth: 1.3 },
    ]);
    return () => setCurves([]);
  }, [setCurves]);

  // Extract unique categories for filter capsules
  const categories = Array.from(new Set(COMPREHENSIVE_CAREERS.map(c => c.category))).sort();

  const filteredCareers = COMPREHENSIVE_CAREERS.filter(career => {
    const matchesSearch = career.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      career.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? career.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-white/60 font-medium animate-pulse">Loading catalogue...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden selection:bg-neutral-800 font-sans">
      <DecorativeCurves />
      <SEO
        title="Browse 150+ Careers in India"
        description="Explore 150+ verified career paths for Indian students — engineering, medicine, law, design, government, finance, tech, and more. Each role includes education paths, exam tracks, and demand insights."
        canonical="/careers"
        keywords="careers in India, career list India, engineering careers, medical careers, government jobs, design careers, tech careers India, career options after 12th, career options after graduation"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Careers", path: "/careers" },
        ]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Careers in India",
          url: "https://www.zertainity.in/careers",
          description:
            "Comprehensive catalogue of careers available to Indian students, including required education, key entrance exams, and demand outlook.",
          inLanguage: "en-IN",
          isPartOf: {
            "@type": "WebSite",
            name: "Zertainity",
            url: "https://www.zertainity.in",
          },
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: COMPREHENSIVE_CAREERS.length,
            itemListElement: COMPREHENSIVE_CAREERS.slice(0, 20).map((c, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: c.name,
              url: `https://www.zertainity.in/careers`,
            })),
          },
        }}
      />

      {/* Ambient background glows */}
      <div className="absolute top-[-10%] left-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-1/4 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-1/3 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      {/* ━━━ Header ━━━ */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10 transition-all duration-300">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate("/")}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2.5">
                <GraduationCap className="h-6 w-6 text-amber-400 animate-pulse" />
                <h1 className="text-sm font-medium text-white/90">
                  Explore Careers
                </h1>
              </div>
            </div>
            
            <div className="hidden sm:flex border border-white/10 bg-white/5 text-white/80 text-xs font-semibold px-3 py-1 rounded-full gap-1.5 items-center shadow-inner">
              <Sparkles className="h-3 w-3 text-amber-400 animate-spin [animation-duration:8s]" /> {COMPREHENSIVE_CAREERS.length} Career Tracks
            </div>
          </div>
        </div>
      </header>

      {/* ━━━ Main Body ━━━ */}
      <main className="container mx-auto px-4 sm:px-6 py-12 max-w-6xl relative z-10">
        {!hasPermission && userRole && (
          <Alert className="mb-8 border-amber-500/20 bg-amber-500/5 text-amber-400 rounded-2xl flex items-center gap-3">
            <Lock className="h-5 w-5 shrink-0 text-amber-400" />
            <AlertDescription className="font-medium text-sm leading-none">
              You are currently browsing with view-only privileges. Contact an admin to unlock catalogue edits.
            </AlertDescription>
          </Alert>
        )}
        
        {/* Cinematic Header Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
        >
          <CurvedCard
            className="liquid-glass mb-10 rounded-[2rem] border border-white/10 bg-white/[0.02] shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] backdrop-blur-md p-8 sm:p-10 relative overflow-hidden group"
            curves={[
              { d: "M -140 220 C -10 180, 120 150, 340 190 S 620 260, 900 220", stroke: "rgba(255,255,255,0.06)", strokeOpacity: 0.12, strokeWidth: 6 },
              { d: "M -140 220 C -10 180, 120 150, 340 190 S 620 260, 900 220", stroke: "rgba(255,255,255,0.15)", strokeOpacity: 0.42, strokeWidth: 1.2 },
            ]}
          >
            {/* Ambient vector glow */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[80px] pointer-events-none -mr-16 -mt-16 transition-all duration-500 group-hover:bg-amber-500/10" />
            
            <div className="relative z-10">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-3.5 block">
                Zertainity Career Intelligence
              </span>
              <h2 
                className="text-3xl sm:text-5xl font-light tracking-tight mb-4 text-white leading-[1.1]"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                Occupational Catalogue
              </h2>
              <p className="text-white/60 mb-8 max-w-2xl text-base sm:text-lg font-light leading-relaxed">
                Discover your target field across engineering, humanities, medical, defense, and design frameworks in India. Filter by vertical or query directly below.
              </p>
              
              {/* Interactive Search & Filter Controls */}
              <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40 transition-colors" />
                  <Input
                    placeholder="Search roles, sectors, credentials, or keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 py-6 w-full bg-white/[0.03] border-white/10 hover:border-white/20 rounded-2xl shadow-inner focus-visible:ring-2 focus-visible:ring-amber-500/30 focus-visible:border-amber-500/50 transition-all duration-300 placeholder:text-white/30 text-white text-base"
                  />
                </div>
                
                {/* Category filters reset */}
                {selectedCategory && (
                  <Button
                    variant="outline"
                    onClick={() => setSelectedCategory(null)}
                    className="rounded-2xl px-5 py-6 border-dashed border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/50 font-semibold transition-all shrink-0"
                  >
                    Clear Filter
                  </Button>
                )}
              </div>
            </div>
          </CurvedCard>
        </motion.div>

        {/* Category Filters Carousel */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-3.5 px-1">
            <SlidersHorizontal className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-white/60">Filter by Sector</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-3 pt-1 px-1 scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20 scroll-smooth">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className={`rounded-full px-5 py-1.5 h-auto text-xs font-semibold shrink-0 transition-all ${
                selectedCategory === null 
                  ? "bg-amber-500 hover:bg-amber-600 text-black shadow-md shadow-amber-500/10 scale-105" 
                  : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:border-white/20"
              }`}
            >
              All Verticals
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-5 py-1.5 h-auto text-xs font-semibold shrink-0 transition-all ${
                  selectedCategory === category 
                    ? "bg-amber-500 hover:bg-amber-600 text-black shadow-md shadow-amber-500/10 scale-105" 
                    : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:border-white/20"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Career Grid with Staggered Framer Motion Reveal */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative"
        >
          <AnimatePresence mode="popLayout">
            {filteredCareers.map((career, index) => {
              const hasGuide = hasCareerRoleDetail(career.name);
              const hoverGlow = getCategoryGlow(career.category);
              const iconStyles = getCategoryIconStyles(career.category);
              
              return (
                <motion.div
                  key={career.name}
                  variants={itemVariants}
                  layout
                  exit={{ opacity: 0, scale: 0.9, y: 15 }}
                  className="h-full"
                >
                  <Card 
                    className={`h-full flex flex-col justify-between border border-white/10 bg-white/[0.02] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-md rounded-2xl transition-all duration-300 hover:-translate-y-1.5 hover:bg-white/[0.04] ${hoverGlow} group`}
                  >
                    <CardHeader className="p-6 pb-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`rounded-xl border p-2.5 transition-all duration-300 ${iconStyles} group-hover:scale-110`}>
                          <Briefcase className="h-5 w-5" />
                        </div>
                        <Badge 
                          variant={career.demand === "Very High" ? "default" : "secondary"} 
                          className={`rounded-full text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 border ${
                            career.demand === "Very High"
                              ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                              : "bg-white/5 text-white/60 border-white/10"
                          }`}
                        >
                          {career.demand} Demand
                        </Badge>
                      </div>
                      
                      <CardTitle className="text-xl font-semibold text-white leading-snug group-hover:text-amber-400 transition-colors duration-200">
                        {career.name}
                      </CardTitle>
                      <CardDescription className="text-xs font-semibold tracking-wide uppercase text-white/50 mt-1">
                        {career.category}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="p-6 pt-0 flex-1 flex flex-col justify-between">
                      <div className="space-y-4 flex-1 mb-6">
                        <div className="border-t border-white/10 pt-4">
                          <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-1.5">
                            Primary Education Requirement
                          </p>
                          <p className="text-sm font-light text-white/80 leading-normal">
                            {career.education}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2.5">
                        {hasGuide ? (
                          <div className="flex gap-2.5 w-full">
                            <Button
                              variant="default"
                              size="sm"
                              className="flex-1 bg-amber-500 hover:bg-amber-600 text-black shadow-md shadow-amber-500/10 hover:shadow-amber-500/20 rounded-full text-xs font-bold hover:scale-103 active:scale-97 transition-all duration-200 h-9"
                              onClick={() => {
                                const slug = getCareerSlugForListName(career.name);
                                if (slug) navigate(`/careers/${slug}`);
                              }}
                            >
                              In-Depth Guide
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:border-white/20 rounded-full text-xs font-semibold transition-colors h-9"
                              onClick={() => navigate("/pathways", { state: { career: career.name } })}
                            >
                              Path details
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full rounded-full text-xs font-semibold border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:border-white/20 transition-all h-9 group-hover:border-amber-500/30"
                            onClick={() => navigate("/pathways", { state: { career: career.name } })}
                          >
                            Explore career path
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Clean, Cinematic Empty Search State */}
        <AnimatePresence>
          {filteredCareers.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-20 px-4 max-w-md mx-auto flex flex-col items-center gap-5 border border-dashed border-white/10 rounded-[2rem] bg-white/[0.02] backdrop-blur-sm mt-8"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 shadow-inner">
                <Info className="h-8 w-8" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-xl font-semibold text-white">No careers found</h3>
                <p className="text-white/60 text-sm font-light leading-relaxed">
                  We couldn't find any career tracks matching your search or filters. Try adjusting your query or resetting the filter sector.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory(null);
                }}
                className="rounded-full px-5 py-2 font-semibold border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20 transition-all"
              >
                Clear Search & Filters
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Careers;
