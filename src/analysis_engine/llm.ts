import type { AnalysisResult } from "./types.ts";
/** Boundary for an optional narration provider. It receives calculations, never raw authority to recalculate them. */
export interface AnalysisNarrator { explain(analysis: AnalysisResult): Promise<string> }
