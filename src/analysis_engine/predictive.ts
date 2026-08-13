import type { ExaminationInput } from "./types.ts";
export function predictiveStatus(history: ExaminationInput[] | undefined) { return { status: "insufficient_data" as const, reason: history && history.length >= 3 ? "Forecasting is intentionally not enabled in Analysis Engine v1.0." : "At least three historical examinations are required before a future predictive module may run." }; }
