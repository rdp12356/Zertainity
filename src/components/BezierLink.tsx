import { useState } from "react";
import { motion } from "framer-motion";

interface BezierLinkProps {
  label: string;
  onClick: () => void;
  className?: string;
}

export const BezierLink = ({ label, onClick, className = "" }: BezierLinkProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <span
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative cursor-pointer py-1 select-none inline-block ${className}`}
    >
      {label}
      
      {/* Curved Underline Wrapper */}
      <svg
        className="absolute bottom-[-2px] left-0 w-full h-[6px] overflow-visible pointer-events-none"
        viewBox="0 0 100 10"
        preserveAspectRatio="none"
      >
        {/* Elastic spring curve */}
        <motion.path
          d={isHovered ? "M 0 5 Q 50 1 100 5" : "M 0 5 Q 50 5 100 5"}
          stroke="currentColor"
          strokeWidth="1.2"
          fill="none"
          initial={false}
          transition={{ type: "spring", stiffness: 450, damping: 10 }}
        />
        {/* Draw on hover entry indicator line */}
        <motion.path
          d="M 0 5 L 100 5"
          stroke="currentColor"
          strokeWidth="1.2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: isHovered ? 1 : 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        />
      </svg>
    </span>
  );
};
