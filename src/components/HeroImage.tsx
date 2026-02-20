import React from "react";

export function HeroImage({ className }: { className?: string }) {
  return (
    <img
      src="/hero.svg"
      alt="Hero Illustration"
      className={`w-full h-auto max-w-[500px] drop-shadow-2xl animate-float-up ${className || ""}`}
    />
  );
}
