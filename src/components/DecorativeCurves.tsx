


import React from "react";

import { Curve, useCurves } from "./CurvesContext";

export default function DecorativeCurves({ curves, className }: { curves?: Curve[]; className?: string }) {
  const ctxCurves = useCurves();
  const used = curves ?? ctxCurves;
  if (!used || used.length === 0) return null;

  const base = "absolute inset-0 w-full h-full pointer-events-none";
  const classes = className ? `${base} ${className}` : base + " -z-10";

  return (
    <svg
      className={classes}
      viewBox="0 0 1440 720"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      {used.map((c, i) => (
        <path
          key={i}
          d={c.d}
          stroke={c.stroke || "hsl(var(--curve-primary))"}
          strokeOpacity={c.strokeOpacity ?? 0.5}
          strokeWidth={c.strokeWidth ?? 1.4}
          fill="none"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}
