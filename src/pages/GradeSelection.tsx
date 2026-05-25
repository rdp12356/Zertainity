



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
  },
  {
    id: "preparatory",
    label: "Preparatory",
    subtitle: "Grade 3–5",
    icon: BookOpen,
    grades: ["Grade 3", "Grade 4", "Grade 5"],
    description: "Building core academic competencies",
  },
  {
    id: "middle",
    label: "Middle",
    subtitle: "Grade 6–8",
    icon: Layers,
    grades: ["Grade 6", "Grade 7", "Grade 8"],
    description: "Subject exploration & critical thinking",
  },
  {
    id: "classes",
    label: "Classes",
    subtitle: "Grade 9–12",
    icon: School,
    grades: ["Grade 9", "Grade 10", "Grade 11", "Grade 12"],
    description: "Board exams, streams & career prep",
  },
];

const GradeSelection = () => {
  const navigate = useNavigate();

  const handleGradeSelect = (stageId: string, grade: string) => {
    navigate("/subject-selection", { state: { grade, stage: stageId } });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title="Select Your Stage — Zertainity" description="Choose your educational stage and grade to get personalised career guidance." canonical="/grade-selection" />

      <header className="sticky top-0 z-50 z-page-header">
        <div className="mx-auto max-w-[1080px] px-6 py-4 flex items-center gap-3">
          <button onClick={() => navigate("/education-level")} className="w-8 h-8 flex items-center justify-center rounded-full z-icon-button">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="text-[15px] font-normal text-foreground">Select Your Stage</h1>
        </div>
      </header>

      <main className="mx-auto max-w-[800px] px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-[32px] sm:text-[40px] font-light tracking-[-0.8px] leading-[1.1] mb-3 font-serif text-foreground">
            Which stage are you in?
          </h2>
          <p className="text-[16px] font-light text-muted-foreground">
            Select your stage to get personalised subject and career guidance
          </p>
        </div>

        <div className="space-y-5">
          {stages.map((stage) => {
            const Icon = stage.icon;
            return (
              <div
                key={stage.id}
                className="rounded-xl p-6 transition-all duration-300 bg-[color:var(--z-canvas-soft)] border border-border hover:border-primary hover:shadow-xs group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-background border border-border group-hover:border-primary/30 transition-colors">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-[17px] font-normal text-foreground">{stage.label}</h3>
                    <p className="text-[13px] font-light text-muted-foreground">{stage.subtitle} · {stage.description}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 pl-[52px]">
                  {stage.grades.map((grade) => (
                    <button
                      key={grade}
                      onClick={() => handleGradeSelect(stage.id, grade)}
                      className="px-4 py-2 rounded-full text-[13px] font-light transition-all duration-200 active:scale-[0.96] cursor-pointer bg-background border border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary"
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
