



import { useNavigate } from "react-router-dom";
import { Star, BookOpen, Layers, School } from "lucide-react";
import { SEO } from "@/components/SEO";

const stages = [
  {
    id: "foundation",
    label: "Foundation",
    subtitle: "Age 3–8 · Pre-Primary & Grade 1–2",
    icon: Star,
    grades: ["Pre-K", "KG", "Grade 1", "Grade 2"],
    description: "Early learning & foundational skills",
    glowClass: "hover:border-amber-500/30 hover:shadow-[0_0_30px_rgba(218,165,32,0.15)]",
    iconClass: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    textClass: "group-hover:text-amber-400",
    btnHoverClass: "hover:bg-amber-500 hover:text-black hover:border-amber-500",
  },
  {
    id: "preparatory",
    label: "Preparatory",
    subtitle: "Grade 3–5",
    icon: BookOpen,
    grades: ["Grade 3", "Grade 4", "Grade 5"],
    description: "Building core academic competencies",
    glowClass: "hover:border-purple-500/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]",
    iconClass: "bg-purple-500/10 border-purple-500/20 text-purple-400",
    textClass: "group-hover:text-purple-400",
    btnHoverClass: "hover:bg-purple-500 hover:text-white hover:border-purple-500",
  },
  {
    id: "middle",
    label: "Middle",
    subtitle: "Grade 6–8",
    icon: Layers,
    grades: ["Grade 6", "Grade 7", "Grade 8"],
    description: "Subject exploration & critical thinking",
    glowClass: "hover:border-indigo-500/30 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]",
    iconClass: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
    textClass: "group-hover:text-indigo-400",
    btnHoverClass: "hover:bg-indigo-500 hover:text-white hover:border-indigo-500",
  },
  {
    id: "classes",
    label: "Classes",
    subtitle: "Grade 9–12",
    icon: School,
    grades: ["Grade 9", "Grade 10", "Grade 11", "Grade 12"],
    description: "Board exams, streams & career prep",
    glowClass: "hover:border-rose-500/30 hover:shadow-[0_0_30px_rgba(244,63,94,0.15)]",
    iconClass: "bg-rose-500/10 border-rose-500/20 text-rose-400",
    textClass: "group-hover:text-rose-400",
    btnHoverClass: "hover:bg-rose-500 hover:text-white hover:border-rose-500",
  },
];

const GradeSelection = () => {
  const navigate = useNavigate();

  const handleGradeSelect = (stageId: string, grade: string) => {
    navigate("/subject-selection", { state: { grade, stage: stageId } });
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans">
      <SEO title="Select Your Stage — Zertainity" description="Choose your educational stage and grade to get personalised career guidance." canonical="/grade-selection" />

      {/* Ambient background glows */}
      <div className="absolute top-[-10%] right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10">
        <div className="mx-auto max-w-[1080px] px-6 py-4 flex items-center gap-3">
          <button 
            onClick={() => navigate("/education-level")} 
            className="w-8 h-8 flex items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200"
            aria-label="Go back"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="text-sm font-medium text-white/90">Select Your Stage</h1>
        </div>
      </header>

      <main className="mx-auto max-w-[800px] px-6 py-16 relative z-10">
        <div className="text-center mb-14">
          <h2 
            className="text-[36px] sm:text-[44px] font-light tracking-[-1px] leading-[1.1] mb-4 text-white"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Which stage are you in?
          </h2>
          <p className="text-[17px] font-light text-white/70">
            Select your stage to get personalised subject and career guidance
          </p>
        </div>

        <div className="space-y-6">
          {stages.map((stage) => {
            const Icon = stage.icon;
            return (
              <div
                key={stage.id}
                className={`rounded-xl p-6 transition-all duration-300 border border-white/10 bg-white/[0.02] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-md group ${stage.glowClass}`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all duration-300 ${stage.iconClass}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className={`text-[18px] font-medium text-white transition-colors duration-200 ${stage.textClass}`}>
                      {stage.label}
                    </h3>
                    <p className="text-[13px] font-light text-white/60">
                      {stage.subtitle} · {stage.description}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2.5 pl-[60px]">
                  {stage.grades.map((grade) => (
                    <button
                      key={grade}
                      onClick={() => handleGradeSelect(stage.id, grade)}
                      className={`px-4 py-2 rounded-full text-[13px] font-light transition-all duration-200 active:scale-[0.96] cursor-pointer bg-white/5 border border-white/10 text-white/80 ${stage.btnHoverClass}`}
                    >
                      {grade}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default GradeSelection;
