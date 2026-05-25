



import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { GraduationCap, BookOpen, School, Star } from "lucide-react";

import { useSetCurves } from "@/components/CurvesContext";
import { SEO } from "@/components/SEO";

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
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Start Your Assessment — Zertainity"
        description="Choose your educational stage to get personalised career guidance. Supports school students, post-10th, and post-12th streams."
        canonical="/education-level"
      />

      <header className="sticky top-0 z-50 z-page-header">
        <div className="mx-auto max-w-[1080px] px-6 py-4 flex items-center gap-3">
          <button onClick={() => navigate("/")} className="w-8 h-8 flex items-center justify-center rounded-full z-icon-button">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="text-[15px] font-normal text-foreground">Start Your Journey</h1>
        </div>
      </header>

      <main className="mx-auto max-w-[900px] px-6 py-16">
        <div className="text-center mb-14">
          <h2 className="text-[36px] sm:text-[44px] font-light tracking-[-1px] leading-[1.1] mb-4 font-serif text-foreground">
            Where Are You Headed?
          </h2>
          <p className="text-[17px] font-light text-muted-foreground">
            Select your current educational stage to get personalised guidance
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Currently in School */}
          <div
            onClick={() => navigate("/grade-selection")}
            className="rounded-xl p-8 flex flex-col items-center text-center cursor-pointer transition-all duration-300 bg-[color:var(--z-canvas-soft)] border border-border hover:border-[color:var(--z-cream-text)] hover:-translate-y-1 hover:shadow-lg group"
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5 bg-[color:var(--z-cream)] border border-[color:var(--z-cream-border)]">
              <Star className="h-7 w-7 text-[color:var(--z-cream-text)]" />
            </div>
            <h3 className="text-[18px] font-normal mb-2 text-foreground">Currently in School</h3>
            <p className="text-[13px] font-light mb-6 text-muted-foreground">
              Grade 1–12 · Discover your subject strengths and get stream guidance
            </p>
            <button
              className="w-full text-[14px] font-normal px-4 py-2.5 rounded-full transition-all duration-200 bg-background border border-border text-foreground hover:bg-[color:var(--z-cream)] hover:text-[color:var(--z-cream-text)] hover:border-[color:var(--z-cream-border)]"
            >
              Select Grade
            </button>
          </div>

          {/* After 10th */}
          <div
            onClick={() => handleSelection('after-10th')}
            className="rounded-xl p-8 flex flex-col items-center text-center cursor-pointer transition-all duration-300 bg-[color:var(--z-canvas-soft)] border border-border hover:border-primary hover:-translate-y-1 hover:shadow-lg group"
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5 bg-background border border-border group-hover:border-primary/30 transition-colors">
              <BookOpen className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-[18px] font-normal mb-2 text-foreground">After 10th Grade</h3>
            <p className="text-[13px] font-light mb-6 text-muted-foreground">
              Planning to choose your stream for 11th and 12th
            </p>
            <button
              className="w-full text-[14px] font-normal px-4 py-2.5 rounded-full transition-all duration-200 active:scale-[0.96] bg-primary text-primary-foreground font-medium hover:bg-primary/90 shadow-sm"
            >
              Continue
            </button>
          </div>

          {/* After 12th */}
          <div
            onClick={() => handleSelection('after-12th')}
            className="rounded-xl p-8 flex flex-col items-center text-center cursor-pointer transition-all duration-300 bg-[color:var(--z-canvas-soft)] border border-border hover:border-primary hover:-translate-y-1 hover:shadow-lg group"
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5 bg-background border border-border group-hover:border-primary/30 transition-colors">
              <School className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-[18px] font-normal mb-2 text-foreground">After 12th Grade</h3>
            <p className="text-[13px] font-light mb-6 text-muted-foreground">
              Planning to choose your college course and career path
            </p>
            <button
              className="w-full text-[14px] font-normal px-4 py-2.5 rounded-full transition-all duration-200 active:scale-[0.96] bg-primary text-primary-foreground font-medium hover:bg-primary/90 shadow-sm"
            >
              Continue
            </button>
          </div>
        </div>

        {/* Quick access stage badges */}
        <div className="mt-14 text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.1em] mb-4 text-muted-foreground">Quick Access by Stage</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: "Foundation (Age 3–8)", stage: "foundation" },
              { label: "Preparatory (Grade 3–5)", stage: "preparatory" },
              { label: "Middle (Grade 6–8)", stage: "middle" },
              { label: "Classes (Grade 9–12)", stage: "classes" },
            ].map((item) => (
              <button
                key={item.stage}
                onClick={() => navigate("/grade-selection")}
                className="px-4 py-2 rounded-full text-[13px] font-light transition-all duration-200 border border-border bg-background text-muted-foreground hover:text-foreground hover:border-primary"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default EducationLevel;
