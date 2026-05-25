

import React, { createContext, useCallback, useContext, useState } from "react";

export type Curve = {
  d: string;
  stroke?: string; // hsl var or color
  strokeOpacity?: number;
  strokeWidth?: number;
  layer?: "halo" | "line";
};

type CurvesContextState = {
  curves: Curve[];
  setCurves: (c: Curve[]) => void;
};

const CurvesContext = createContext<CurvesContextState>({
  curves: [],
  setCurves: () => {},
});

export const CurvesProvider = ({ children }: { children: React.ReactNode }) => {
  const [curves, setCurves] = useState<Curve[]>([]);
  const setter = useCallback((c: Curve[]) => setCurves(c), []);
  return (
    <CurvesContext.Provider value={{ curves, setCurves: setter }}>
      {children}
    </CurvesContext.Provider>
  );
};

export const useCurves = () => useContext(CurvesContext).curves;
export const useSetCurves = () => useContext(CurvesContext).setCurves;

export default CurvesContext;
