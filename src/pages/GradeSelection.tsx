



import { useNavigate } from "react-router-dom";

import { Star, BookOpen, Layers, School } from "lucide-react";

import { SEO } from "@/components/SEO";
import { AssessmentStepper } from "@/components/AssessmentStepper";
import { motion } from "framer-motion";

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

      <header className="fixed top-0 w-full z-50 bg-background/60 backdrop-blur-2xl border-b border-border/40">
        <div className="mx-auto max-w-[1200px] px-6 h-16 flex items-center gap-4">
          <button 
            onClick={() => navigate("/education-level")} 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-[13px] font-semibold tracking-[0.2em] uppercase text-foreground/80">Stage Selection</span>
        </div>
      </header>

      <main className="mx-auto max-w-[1080px] px-6 pt-32 pb-24">
        <div className="max-w-2xl mb-16">
          <AssessmentStepper currentStep={2} totalSteps={4} />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        >
          <div className="mb-20">
            <h2 className="text-[44px] sm:text-[56px] font-light tracking-[-1.5px] leading-[1.05] mb-5 font-serif text-foreground">
              Define your<br/>
              <span className="italic text-muted-foreground">current level.</span>
            </h2>
            <p className="text-[18px] font-light text-muted-foreground max-w-xl leading-relaxed">
              Select your precise academic stage to calibrate the assessment for your learning curve.
            </p>
          </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            
            // Assign specific colors based on stage ID
            const colorClass = stage.id === 'foundation' ? 'amber' : 
                               stage.id === 'preparatory' ? 'blue' : 
                               stage.id === 'middle' ? 'emerald' : 'purple';

            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                className={`relative overflow-hidden rounded-[32px] p-8 sm:p-10 transition-all duration-500 bg-secondary/30 hover:bg-secondary/60 group`}
              >
                {/* Glow Effect */}
                <div className={`absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full blur-3xl transition-all duration-700
                  ${colorClass === 'amber' ? 'bg-amber-500/5 group-hover:bg-amber-500/15' : ''}
                  ${colorClass === 'blue' ? 'bg-blue-500/5 group-hover:bg-blue-500/15' : ''}
                  ${colorClass === 'emerald' ? 'bg-emerald-500/5 group-hover:bg-emerald-500/15' : ''}
                  ${colorClass === 'purple' ? 'bg-purple-500/5 group-hover:bg-purple-500/15' : ''}
                `} />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-10">
                    <div>
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 ease-out group-hover:scale-110
                        ${colorClass === 'amber' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' : ''}
                        ${colorClass === 'blue' ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20' : ''}
                        ${colorClass === 'emerald' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : ''}
                        ${colorClass === 'purple' ? 'bg-purple-500/10 text-purple-600 border border-purple-500/20' : ''}
                      `}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-[24px] font-medium tracking-[-0.5px] mb-2 text-foreground">{stage.label}</h3>
                      <p className="text-[14px] font-light text-muted-foreground">{stage.subtitle}</p>
                    </div>
                  </div>

                  <p className="text-[15px] font-light leading-[1.6] text-muted-foreground mb-8">
                    {stage.description}
                  </p>

                  <div className="flex flex-wrap gap-3">
                    {stage.grades.map((grade) => (
                      <button
                        key={grade}
                        onClick={() => handleGradeSelect(stage.id, grade)}
                        className={`px-5 py-3 rounded-xl text-[14px] font-medium transition-all duration-300 active:scale-[0.96] border border-border/50
                          bg-background text-foreground hover:-translate-y-1 hover:shadow-lg
                          ${colorClass === 'amber' ? 'hover:border-amber-500/30 hover:bg-amber-500/5' : ''}
                          ${colorClass === 'blue' ? 'hover:border-blue-500/30 hover:bg-blue-500/5' : ''}
                          ${colorClass === 'emerald' ? 'hover:border-emerald-500/30 hover:bg-emerald-500/5' : ''}
                          ${colorClass === 'purple' ? 'hover:border-purple-500/30 hover:bg-purple-500/5' : ''}
                        `}
                      >
                        {grade}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        </motion.div>
      </main>
    </div>
  );
};

export default GradeSelection;
