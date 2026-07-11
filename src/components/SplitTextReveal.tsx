import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface SplitTextRevealProps {
  text: string;
  className?: string;
}

export const SplitTextReveal = ({ text, className = "" }: SplitTextRevealProps) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-2%" });

  // Split text by spaces to preserve word wraps correctly
  const words = text.split(" ");

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.008 }
    }
  };

  const letterVariants = {
    hidden: { y: "115%", opacity: 0, rotate: 3 },
    visible: {
      y: "0%",
      opacity: 1,
      rotate: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <motion.span
      ref={containerRef}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={`inline-block ${className}`}
    >
      {words.map((word, wordIdx) => (
        <span 
          key={wordIdx} 
          className="inline-block whitespace-nowrap mr-[0.25em] overflow-hidden align-bottom"
        >
          {word.split("").map((char, charIdx) => (
            <span key={charIdx} className="inline-block overflow-hidden relative">
              <motion.span
                variants={letterVariants}
                className="inline-block"
              >
                {char}
              </motion.span>
            </span>
          ))}
        </span>
      ))}
    </motion.span>
  );
};
