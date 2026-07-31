



import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { GraduationCap, BookOpen, School, Star } from "lucide-react";

import { useSetCurves } from "@/components/CurvesContext";
import { SEO } from "@/components/SEO";
import { AssessmentStepper } from "@/components/AssessmentStepper";
import { motion } from "framer-motion";

const EducationLevel = () => {
  const navigate = useNavigate();
  const setCurves = useSetCurves();
  useEffect(() => {
    setCurves([]);
    return () => setCurves([]);
  }, [setCurves]);

  const handleSelection = (level: 'after-10th' | 'after-12th') => {
    navigate("/marks-entry", { state: { educationLevel: level } });
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <SEO
        title="Start Your Assessment — Zertainity"
        description="Choose your educational stage to get personalised career guidance. Supports school students, post-10th, and post-12th streams."
        canonical="/education-level"
      />

      <header className="fixed top-0 w-full z-50 bg-background/60 backdrop-blur-2xl border-b border-border/40">
        <div className="mx-auto max-w-[1200px] px-6 h-16 flex items-center gap-4">
          <button 
            onClick={() => navigate("/")} 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-[13px] font-semibold tracking-[0.2em] uppercase text-foreground/80">Journey Setup</span>
        </div>
      </header>

      <main className="mx-auto max-w-[1080px] px-6 pt-32 pb-24">
        <div className="max-w-2xl mb-16">
          <AssessmentStepper currentStep={1} totalSteps={4} />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        >
          <div className="mb-20">
            <h2 className="text-[44px] sm:text-[56px] font-light tracking-[-1.5px] leading-[1.05] mb-5 font-serif text-foreground">
              Where are you currently<br/>
              <span className="italic text-muted-foreground">in your education?</span>
            </h2>
            <p className="text-[18px] font-light text-muted-foreground max-w-xl leading-relaxed">
              We tailor your career roadmap based on your current academic phase. Select the path that describes you best.
            </p>
          </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {/* Currently in School */}
          <div
            onClick={() => navigate("/grade-selection")}
            className="relative overflow-hidden rounded-[32px] p-8 sm:p-10 cursor-pointer transition-all duration-500 bg-secondary/30 hover:bg-secondary/60 border border-transparent hover:border-border/60 group"
          >
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all duration-700" />
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 bg-amber-500/10 text-amber-600 border border-amber-500/20 group-hover:scale-110 transition-transform duration-500 ease-out">
                  <Star className="h-6 w-6" />
                </div>
                <h3 className="text-[24px] font-medium tracking-[-0.5px] mb-3 text-foreground">Currently in School</h3>
                <p className="text-[15px] font-light leading-[1.6] text-muted-foreground mb-8">
                  From early foundation to Class 9. Discover subjects, strengths, and holistic development.
                </p>
              </div>
              <div className="flex items-center gap-2 text-[14px] font-medium text-amber-600 group-hover:text-amber-500 transition-colors">
                <span>Select Grade</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
            </div>
          </div>

          {/* After 10th */}
          <div
            onClick={() => handleSelection('after-10th')}
            className="relative overflow-hidden rounded-[32px] p-8 sm:p-10 cursor-pointer transition-all duration-500 bg-secondary/30 hover:bg-secondary/60 border border-transparent hover:border-border/60 group"
          >
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-700" />
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 bg-blue-500/10 text-blue-600 border border-blue-500/20 group-hover:scale-110 transition-transform duration-500 ease-out">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="text-[24px] font-medium tracking-[-0.5px] mb-3 text-foreground">After 10th Grade</h3>
                <p className="text-[15px] font-light leading-[1.6] text-muted-foreground mb-8">
                  Deciding between Science, Commerce, or Arts? Map your stream based on aptitude.
                </p>
              </div>
              <div className="flex items-center gap-2 text-[14px] font-medium text-blue-600 group-hover:text-blue-500 transition-colors">
                <span>Map your stream</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
            </div>
          </div>

          {/* After 12th */}
          <div
            onClick={() => handleSelection('after-12th')}
            className="relative overflow-hidden rounded-[32px] p-8 sm:p-10 cursor-pointer transition-all duration-500 bg-secondary/30 hover:bg-secondary/60 border border-transparent hover:border-border/60 group"
          >
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-700" />
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 group-hover:scale-110 transition-transform duration-500 ease-out">
                  <School className="h-6 w-6" />
                </div>
                <h3 className="text-[24px] font-medium tracking-[-0.5px] mb-3 text-foreground">After 12th Grade</h3>
                <p className="text-[15px] font-light leading-[1.6] text-muted-foreground mb-8">
                  Ready for university? Find the right degree, entrance exams, and college pathways.
                </p>
              </div>
              <div className="flex items-center gap-2 text-[14px] font-medium text-emerald-600 group-hover:text-emerald-500 transition-colors">
                <span>Find degrees</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick access stage tags */}
        <div className="mt-20 pt-10 border-t border-border/40">
          <p className="text-[12px] font-semibold uppercase tracking-[0.15em] mb-6 text-muted-foreground">Jump directly to your specific stage</p>
          <div className="flex flex-wrap gap-3">
            {[
              { label: "Foundation (Age 3–8)", stage: "foundation" },
              { label: "Preparatory (Grade 3–5)", stage: "preparatory" },
              { label: "Middle (Grade 6–8)", stage: "middle" },
              { label: "Classes (Grade 9–12)", stage: "classes" },
            ].map((item) => (
              <button
                key={item.stage}
                onClick={() => navigate("/grade-selection")}
                className="px-5 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-300 bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary hover:-translate-y-0.5"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        </motion.div>
      </main>
    </div>
  );
};

export default EducationLevel;
