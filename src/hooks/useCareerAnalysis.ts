import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { CareerMatch, StudentProfile, ScoringResult } from '@/lib/scoringEngine';

export interface CareerAnalysisState {
    loading: boolean;
    error: string | null;
    sessionId: string | null;
    resultId: string | null;
    topCareers: CareerMatch[];
    aiExplanation: string | null;
    aiModelUsed: 'gemini' | 'openrouter' | 'rule-based' | null;
    dailyCallsUsed: number;
    dailyCallLimit: number;
    emailSentTo: string | null;
}

const INITIAL_STATE: CareerAnalysisState = {
    loading: false,
    error: null,
    sessionId: null,
    resultId: null,
    topCareers: [],
    aiExplanation: null,
    aiModelUsed: null,
    dailyCallsUsed: 0,
    dailyCallLimit: 5,
    emailSentTo: null,
};

export function useCareerAnalysis() {
    const [state, setState] = useState<CareerAnalysisState>(INITIAL_STATE);

    const run = useCallback(async (profile: StudentProfile) => {
        setState(s => ({ ...s, loading: true, error: null }));

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('You must be signed in to run career analysis.');

            const { data, error } = await supabase.functions.invoke('career-analysis', {
                body: {
                    educationLevel: profile.educationLevel,
                    marks: profile.marks,
                    interestScores: profile.interestScores,
                },
                headers: {
                    Authorization: `Bearer ${session.access_token}`,
                },
            });

            if (error) throw new Error(error.message ?? 'Analysis failed');

            setState({
                loading: false,
                error: null,
                sessionId: data.sessionId,
                resultId: data.resultId,
                topCareers: data.topCareers ?? [],
                aiExplanation: data.aiExplanation ?? null,
                aiModelUsed: data.aiModelUsed ?? null,
                dailyCallsUsed: data.dailyAiCallsUsed ?? 0,
                dailyCallLimit: data.dailyAiCallLimit ?? 5,
                emailSentTo: session.user.email ?? null,
            });
        } catch (err) {
            setState(s => ({
                ...s,
                loading: false,
                error: (err as Error).message ?? 'Something went wrong. Please try again.',
            }));
        }
    }, []);

    const reset = useCallback(() => setState(INITIAL_STATE), []);

    return { ...state, run, reset };
}
