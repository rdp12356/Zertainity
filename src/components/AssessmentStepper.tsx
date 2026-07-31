import { motion } from "framer-motion";

interface Step {
  id: string;
  label: string;
}

interface AssessmentStepperProps {
  currentStep: number;
  totalSteps: number;
}

export function AssessmentStepper({ currentStep, totalSteps }: AssessmentStepperProps) {
  return (
    <div className="w-full max-w-md mx-auto mb-8 px-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[12px] font-medium uppercase tracking-wider text-[color:var(--z-ink-muted)]">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-[12px] font-medium text-[color:var(--z-primary)]">
          {Math.round((currentStep / totalSteps) * 100)}%
        </span>
      </div>
      <div className="h-1.5 w-full bg-[color:var(--z-border)]/50 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-[color:var(--z-primary)] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
          transition={{ type: "spring", stiffness: 60, damping: 20 }}
        />
      </div>
    </div>
  );
}
