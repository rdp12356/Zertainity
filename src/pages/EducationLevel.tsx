



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
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans">
      <SEO
        title="Start Your Assessment — Zertainity"
        description="Choose your educational stage to get personalised career guidance. Supports school students, post-10th, and post-12th streams."
        canonical="/education-level"
      />

      {/* Ambient background glows */}
      <div className="absolute top-[-10%] right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10">
        <div className="mx-auto max-w-[1080px] px-6 py-4 flex items-center gap-3">
          <button 
            onClick={() => navigate("/")} 
            className="w-8 h-8 flex items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200"
            aria-label="Go back"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="text-sm font-medium text-white/90">Start Your Journey</h1>
        </div>
      </header>

      <main className="mx-auto max-w-[900px] px-6 py-16 relative z-10">
        <div className="text-center mb-14">
          <h2 
            className="text-[36px] sm:text-[44px] font-light tracking-[-1px] leading-[1.1] mb-4 text-white"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Where Are You Headed?
          </h2>
          <p className="text-[17px] font-light text-white/70">
            Select your current educational stage to get personalised guidance
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Currently in School */}
          <div
            onClick={() => navigate("/grade-selection")}
            className="rounded-xl p-8 flex flex-col items-center text-center cursor-pointer transition-all duration-300 border border-white/10 bg-white/[0.02] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-md hover:border-amber-500/30 hover:shadow-[0_0_30px_rgba(218,165,32,0.15)] hover:-translate-y-1 group"
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5 bg-amber-500/10 border border-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform duration-300">
              <Star className="h-7 w-7" />
            </div>
            <h3 className="text-[18px] font-semibold mb-2 text-white group-hover:text-amber-400 transition-colors">Currently in School</h3>
            <p className="text-[13px] font-light mb-6 text-white/60">
              Grade 1–12 · Discover your subject strengths and get stream guidance
            </p>
            <button
              className="w-full text-[14px] font-semibold px-4 py-2.5 rounded-full transition-all duration-200 border border-white/10 bg-white/5 text-white/80 hover:bg-amber-500 hover:text-black hover:border-amber-500"
            >
              Select Grade
            </button>
          </div>

          {/* After 10th */}
          <div
            onClick={() => handleSelection('after-10th')}
            className="rounded-xl p-8 flex flex-col items-center text-center cursor-pointer transition-all duration-300 border border-white/10 bg-white/[0.02] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-md hover:border-purple-500/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:-translate-y-1 group"
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5 bg-purple-500/10 border border-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform duration-300">
              <BookOpen className="h-7 w-7" />
            </div>
            <h3 className="text-[18px] font-semibold mb-2 text-white group-hover:text-purple-400 transition-colors">After 10th Grade</h3>
            <p className="text-[13px] font-light mb-6 text-white/60">
              Planning to choose your stream for 11th and 12th
            </p>
            <button
              className="w-full text-[14px] font-bold px-4 py-2.5 rounded-full transition-all duration-200 active:scale-[0.96] bg-amber-500 text-black hover:bg-amber-600 shadow-md shadow-amber-500/10 hover:shadow-amber-500/20"
            >
              Continue
            </button>
          </div>

          {/* After 12th */}
          <div
            onClick={() => handleSelection('after-12th')}
            className="rounded-xl p-8 flex flex-col items-center text-center cursor-pointer transition-all duration-300 border border-white/10 bg-white/[0.02] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-md hover:border-indigo-500/30 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] hover:-translate-y-1 group"
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:scale-110 transition-transform duration-300">
              <School className="h-7 w-7" />
            </div>
            <h3 className="text-[18px] font-semibold mb-2 text-white group-hover:text-indigo-400 transition-colors">After 12th Grade</h3>
            <p className="text-[13px] font-light mb-6 text-white/60">
              Planning to choose your college course and career path
            </p>
            <button
              className="w-full text-[14px] font-bold px-4 py-2.5 rounded-full transition-all duration-200 active:scale-[0.96] bg-amber-500 text-black hover:bg-amber-600 shadow-md shadow-amber-500/10 hover:shadow-amber-500/20"
            >
              Continue
            </button>
          </div>
        </div>

        {/* Quick access stage badges */}
        <div className="mt-14 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] mb-4 text-white/40">Quick Access by Stage</p>
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
                className="px-4 py-2 rounded-full text-[13px] font-light transition-all duration-200 border border-white/10 bg-white/5 text-white/60 hover:text-white hover:border-amber-500/50 hover:bg-white/10"
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
