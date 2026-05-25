


import React from "react";

import type { Curve } from "./CurvesContext";
import DecorativeCurves from "./DecorativeCurves";

export const CurvedCard = ({ curves, className, children }: { curves?: Curve[]; className?: string; children: React.ReactNode }) => {
  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      <DecorativeCurves curves={curves} className="z-0" />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default CurvedCard;
