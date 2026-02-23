// @ts-nocheck
// Deno Edge Function: career-analysis
// Route: POST /functions/v1/career-analysis
// =============================================================================
// Orchestrates the full career analysis pipeline:
//   1. Validate request + check daily AI quota
//   2. Save interest_answers to DB
//   3. Run rule-based scoring engine (Layer 1) — always works
//   4. Try AI explanation (Layer 2): Gemini → OpenRouter → rule-based
//   5. Save career_results to DB
//   6. Log AI call to ai_logs + increment usage_tracking
//   7. Trigger send-career-email (non-blocking)
//   8. Return result to client
// =============================================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Inline the scoring engine types (Edge Functions can't import from src/)
interface StudentProfile {
    educationLevel: '10th' | '12th' | 'graduate';
    marks: Record<string, number>;
    interestScores: Record<string, number>;
}

interface CareerMatch {
    rank: number;
    career: string;
    domain: string;
    matchScore: number;
    strengths: string[];
    weakAreas: string[];
    readinessLevel: 'High' | 'Medium' | 'Low';
    requiredExams: string[];
    topJobRoles: string[];
    growthOutlook: 'high' | 'stable' | 'declining';
    avgSalaryLpa?: number;
}

// ─── Embedded scoring engine ──────────────────────────────────────────────────

const CAREER_WEIGHTS: Record<string, {
    domain: string;
    weights: Record<string, number>;
    exams: string[];
    roles: string[];
    growth: 'high' | 'stable' | 'declining';
    salaryLpa: number;
}> = {
    'Software Engineer': { domain: 'engineering', weights: { math: 0.35, science: 0.25, interest_tech: 0.30, english: 0.10 }, exams: ['JEE Main', 'JEE Advanced', 'BITSAT'], roles: ['Software Developer', 'Backend Engineer', 'Full Stack Developer'], growth: 'high', salaryLpa: 12 },
    'Data Scientist': { domain: 'engineering', weights: { math: 0.40, science: 0.20, interest_tech: 0.30, english: 0.10 }, exams: ['JEE Main', 'GATE'], roles: ['Data Scientist', 'ML Engineer', 'AI Researcher'], growth: 'high', salaryLpa: 14 },
    'Civil Engineer': { domain: 'engineering', weights: { math: 0.35, science: 0.30, interest_tech: 0.20, social: 0.15 }, exams: ['JEE Main', 'JEE Advanced'], roles: ['Site Engineer', 'Structural Designer', 'Urban Planner'], growth: 'stable', salaryLpa: 7.5 },
    'Mechanical Engineer': { domain: 'engineering', weights: { math: 0.35, science: 0.35, interest_tech: 0.20, english: 0.10 }, exams: ['JEE Main', 'JEE Advanced', 'GATE'], roles: ['Mechanical Designer', 'Manufacturing Engineer', 'Automotive Engineer'], growth: 'stable', salaryLpa: 8 },
    'Electronics Engineer': { domain: 'engineering', weights: { math: 0.35, science: 0.35, interest_tech: 0.25, english: 0.05 }, exams: ['JEE Main', 'JEE Advanced', 'GATE'], roles: ['Circuit Designer', 'Embedded Systems Engineer', 'VLSI Engineer'], growth: 'high', salaryLpa: 9 },
    'Doctor (MBBS)': { domain: 'medical', weights: { science: 0.45, math: 0.15, interest_bio: 0.30, english: 0.10 }, exams: ['NEET UG'], roles: ['General Physician', 'Surgeon', 'Medical Researcher'], growth: 'stable', salaryLpa: 10 },
    'Dentist (BDS)': { domain: 'medical', weights: { science: 0.40, math: 0.15, interest_bio: 0.35, english: 0.10 }, exams: ['NEET UG'], roles: ['General Dentist', 'Oral Surgeon', 'Orthodontist'], growth: 'stable', salaryLpa: 7 },
    'Pharmacist': { domain: 'medical', weights: { science: 0.45, math: 0.20, interest_bio: 0.25, english: 0.10 }, exams: ['NEET UG', 'GPAT'], roles: ['Clinical Pharmacist', 'Drug Researcher', 'Regulatory Affairs'], growth: 'stable', salaryLpa: 5.5 },
    'Biomedical Engineer': { domain: 'engineering', weights: { science: 0.35, math: 0.30, interest_bio: 0.20, interest_tech: 0.15 }, exams: ['JEE Main', 'NEET UG'], roles: ['Biomedical Engineer', 'Medical Device Designer', 'Clinical Engineer'], growth: 'high', salaryLpa: 8 },
    'Chartered Accountant': { domain: 'commerce', weights: { math: 0.30, commerce: 0.40, interest_biz: 0.20, english: 0.10 }, exams: ['CA Foundation', 'CA Intermediate', 'CA Final'], roles: ['CA', 'Auditor', 'Tax Consultant', 'CFO'], growth: 'stable', salaryLpa: 10 },
    'Business Analyst': { domain: 'commerce', weights: { math: 0.25, commerce: 0.30, interest_biz: 0.30, english: 0.15 }, exams: ['CAT', 'XAT', 'GMAT'], roles: ['Business Analyst', 'Management Consultant', 'Product Manager'], growth: 'high', salaryLpa: 11 },
    'Investment Banker': { domain: 'commerce', weights: { math: 0.30, commerce: 0.35, interest_biz: 0.25, english: 0.10 }, exams: ['CAT', 'CFA', 'MBA'], roles: ['Investment Banker', 'Financial Analyst', 'Portfolio Manager'], growth: 'high', salaryLpa: 15 },
    'Journalist': { domain: 'arts', weights: { english: 0.45, social: 0.30, interest_social: 0.15, art: 0.10 }, exams: ['CUET', 'IIMC Entrance'], roles: ['Reporter', 'Editor', 'Content Strategist', 'News Anchor'], growth: 'stable', salaryLpa: 5 },
    'Psychologist': { domain: 'arts', weights: { social: 0.40, english: 0.30, interest_social: 0.20, science: 0.10 }, exams: ['CUET', 'NET', 'RCI'], roles: ['Clinical Psychologist', 'Counsellor', 'HR Manager', 'UX Researcher'], growth: 'high', salaryLpa: 6 },
    'Graphic Designer': { domain: 'design', weights: { art: 0.45, interest_art: 0.35, english: 0.10, interest_tech: 0.10 }, exams: ['NID DAT', 'NIFT', 'CEED'], roles: ['Graphic Designer', 'UI Designer', 'Brand Designer', 'Art Director'], growth: 'high', salaryLpa: 6 },
    'Fashion Designer': { domain: 'design', weights: { art: 0.45, interest_art: 0.40, english: 0.10, social: 0.05 }, exams: ['NIFT Entrance', 'NID DAT', 'Pearl Academy'], roles: ['Fashion Designer', 'Stylist', 'Textile Designer', 'Creative Director'], growth: 'stable', salaryLpa: 5 },
    'Lawyer': { domain: 'law', weights: { english: 0.40, social: 0.30, interest_law: 0.20, math: 0.10 }, exams: ['CLAT', 'AILET', 'LSAT India'], roles: ['Advocate', 'Corporate Lawyer', 'Criminal Lawyer', 'Judge'], growth: 'stable', salaryLpa: 8 },
    'Corporate Lawyer': { domain: 'law', weights: { english: 0.35, social: 0.25, interest_law: 0.25, commerce: 0.15 }, exams: ['CLAT', 'AILET', 'LLM'], roles: ['Corporate Counsel', 'M&A Lawyer', 'Compliance Officer'], growth: 'high', salaryLpa: 14 },
    'UX Designer': { domain: 'design', weights: { art: 0.35, interest_art: 0.25, interest_tech: 0.25, english: 0.15 }, exams: ['CEED', 'NID DAT', 'BDes Entrance'], roles: ['UX Designer', 'Product Designer', 'UX Researcher', 'Interaction Designer'], growth: 'high', salaryLpa: 10 },
    'Civil Services (IAS/IPS)': { domain: 'arts', weights: { social: 0.35, english: 0.30, math: 0.15, interest_social: 0.20 }, exams: ['UPSC CSE'], roles: ['IAS Officer', 'IPS Officer', 'IFS Officer', 'IRS Officer'], growth: 'stable', salaryLpa: 8 },
};

const SUBJECT_LABELS: Record<string, string> = {
    math: 'Mathematics', science: 'Science', english: 'English', social: 'Social Studies',
    art: 'Arts', commerce: 'Commerce', interest_tech: 'Technology', interest_bio: 'Biology/Medical',
    interest_law: 'Law', interest_art: 'Design/Art', interest_biz: 'Business', interest_social: 'Social Sciences',
};

function buildSignalMap(profile: StudentProfile): Record<string, number> {
    const signals: Record<string, number> = {};
    for (const [k, v] of Object.entries(profile.marks)) signals[k.toLowerCase()] = Math.min(100, Math.max(0, v));
    for (const [k, v] of Object.entries(profile.interestScores)) signals[k.toLowerCase()] = Math.min(100, Math.max(0, ((v - 1) / 4) * 100));
    signals._edu_boost = profile.educationLevel === 'graduate' ? 5 : 0;
    return signals;
}

function computeScore(signals: Record<string, number>, weights: Record<string, number>): number {
    let score = 0, total = 0;
    for (const [k, w] of Object.entries(weights)) { score += (signals[k] ?? 50) * w; total += w; }
    return total > 0 ? score / total : 0;
}

function getStrengths(signals: Record<string, number>, weights: Record<string, number>) {
    const strengths: string[] = [], weakAreas: string[] = [];
    for (const k of Object.keys(weights)) {
        const v = signals[k] ?? 50;
        const label = SUBJECT_LABELS[k] ?? k;
        if (v >= 75) strengths.push(label);
        else if (v < 55) weakAreas.push(label);
    }
    return { strengths, weakAreas };
}

function readiness(score: number): 'High' | 'Medium' | 'Low' {
    return score >= 72 ? 'High' : score >= 52 ? 'Medium' : 'Low';
}

function scoreCareers(profile: StudentProfile): CareerMatch[] {
    const signals = buildSignalMap(profile);
    const results = Object.entries(CAREER_WEIGHTS).map(([name, meta]) => {
        const raw = computeScore(signals, meta.weights) + (signals._edu_boost ?? 0);
        const finalScore = Math.round(Math.min(100, raw));
        const { strengths, weakAreas } = getStrengths(signals, meta.weights);
        return { career: name, domain: meta.domain, matchScore: finalScore, strengths, weakAreas, readinessLevel: readiness(finalScore), requiredExams: meta.exams, topJobRoles: meta.roles, growthOutlook: meta.growth, avgSalaryLpa: meta.salaryLpa, rawScore: finalScore };
    });
    results.sort((a, b) => b.rawScore - a.rawScore);
    return results.slice(0, 3).map((r, i) => ({ rank: i + 1, career: r.career, domain: r.domain, matchScore: r.matchScore, strengths: r.strengths, weakAreas: r.weakAreas, readinessLevel: r.readinessLevel, requiredExams: r.requiredExams, topJobRoles: r.topJobRoles, growthOutlook: r.growthOutlook, avgSalaryLpa: r.avgSalaryLpa }));
}

function buildPrompt(c: CareerMatch, p: StudentProfile): string {
    return `You are a senior career mentor in India. The student received their personalised career analysis.

Top Career: ${c.career} (${c.matchScore}% match)
Education: ${p.educationLevel}
Strengths: ${c.strengths.join(', ') || 'General aptitude'}
Required Exams: ${c.requiredExams.join(', ')}
Potential Roles: ${c.topJobRoles.slice(0, 3).join(', ')}
Industry Growth: ${c.growthOutlook}

Write a warm mentor-style explanation (max 500 words) covering:
1. Why this career fits them (reference their strengths)
2. A realistic 5-year growth path
3. 2-3 important entrance exams and how to prepare
4. One key industry insight or trend
5. A single actionable next step for this week

Be specific, encouraging, and honest. Second person. No bullet points in first paragraph.`;
}

function ruleBasedExplanation(c: CareerMatch): string {
    const strengthText = c.strengths.length > 0 ? `Your strength in ${c.strengths.join(' and ')} aligns perfectly.` : 'Your academic profile shows a solid foundation.';
    const growthMap = { high: 'a fast-growing sector with excellent demand', stable: 'a respected stable profession', declining: 'an evolving field requiring adaptability' };
    return `Based on your assessment, ${c.career} is your top career match at ${c.matchScore}% compatibility.\n\n${strengthText} This is ${growthMap[c.growthOutlook]}.\n\nTypical starting salaries are ₹${c.avgSalaryLpa ?? 6}–${(c.avgSalaryLpa ?? 6) + 2} LPA, growing significantly with experience.\n\nFocus on: ${c.requiredExams.slice(0, 2).join(' and ')}. Begin preparation early — consistency beats intensity.\n\nExciting roles to grow into: ${c.topJobRoles.slice(0, 3).join(', ')}.\n\nNext step: Research the ${c.requiredExams[0] ?? 'entrance exam'} syllabus and create a 6-month calendar.`;
}

// ─── AI callers ───────────────────────────────────────────────────────────────

async function callGemini(prompt: string): Promise<string> {
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) throw new Error('GEMINI_API_KEY not set');

    const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { maxOutputTokens: 600, temperature: 0.7 },
            }),
        }
    );

    if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

async function callOpenRouter(prompt: string): Promise<string> {
    const apiKey = Deno.env.get('OPENROUTER_API_KEY');
    if (!apiKey) throw new Error('OPENROUTER_API_KEY not set');

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
            'HTTP-Referer': 'https://zertainity.in',
            'X-Title': 'Zertainity Career Mentor',
        },
        body: JSON.stringify({
            model: 'mistralai/mistral-7b-instruct:free',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 600,
        }),
    });

    if (!res.ok) throw new Error(`OpenRouter API error: ${res.status}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? '';
}

// ─── Main handler ─────────────────────────────────────────────────────────────

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const DAILY_LIMIT = 5;

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: CORS_HEADERS });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        // ── Auth ────────────────────────────────────────────────────────────────
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: CORS_HEADERS });

        const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
        if (authError || !user) return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401, headers: CORS_HEADERS });

        // ── Parse body ──────────────────────────────────────────────────────────
        const body = await req.json();
        const profile: StudentProfile = {
            educationLevel: body.educationLevel,
            marks: body.marks ?? {},
            interestScores: body.interestScores ?? {},
        };

        if (!['10th', '12th', 'graduate'].includes(profile.educationLevel)) {
            return new Response(JSON.stringify({ error: 'Invalid educationLevel' }), { status: 400, headers: CORS_HEADERS });
        }

        // ── Check daily AI quota ────────────────────────────────────────────────
        const today = new Date().toISOString().split('T')[0];
        const { data: usageRow } = await supabase
            .from('usage_tracking')
            .select('ai_calls')
            .eq('user_id', user.id)
            .eq('date', today)
            .single();

        const dailyCalls = usageRow?.ai_calls ?? 0;
        const aiEnabled = dailyCalls < DAILY_LIMIT;

        // ── Layer 1: Scoring engine ─────────────────────────────────────────────
        const topCareers = scoreCareers(profile);
        const sessionId = crypto.randomUUID();

        // ── Save interest_answers ───────────────────────────────────────────────
        await supabase.from('interest_answers').insert({
            user_id: user.id,
            session_id: sessionId,
            answers: profile.interestScores,
            education_level: profile.educationLevel,
            marks: profile.marks,
        });

        // ── Layer 2: AI explanation ─────────────────────────────────────────────
        let aiExplanation: string | null = null;
        let aiModelUsed: 'gemini' | 'openrouter' | 'rule-based' = 'rule-based';
        let aiTokens = 0;
        let aiLatency = 0;
        let aiSuccess = false;
        let aiError: string | null = null;

        const topCareer = topCareers[0];
        const prompt = buildPrompt(topCareer, profile);

        if (aiEnabled && topCareer) {
            const t0 = Date.now();

            try {
                aiExplanation = await callGemini(prompt);
                aiModelUsed = 'gemini';
                aiSuccess = true;
                aiTokens = Math.ceil(aiExplanation.length / 4); // approx
                aiLatency = Date.now() - t0;
            } catch (e1) {
                try {
                    aiExplanation = await callOpenRouter(prompt);
                    aiModelUsed = 'openrouter';
                    aiSuccess = true;
                    aiTokens = Math.ceil(aiExplanation.length / 4);
                    aiLatency = Date.now() - t0;
                } catch (e2) {
                    aiExplanation = ruleBasedExplanation(topCareer);
                    aiModelUsed = 'rule-based';
                    aiSuccess = false;
                    aiError = `Gemini: ${(e1 as Error).message} | OpenRouter: ${(e2 as Error).message}`;
                    aiLatency = Date.now() - t0;
                }
            }
        } else if (topCareer) {
            aiExplanation = ruleBasedExplanation(topCareer);
            aiModelUsed = 'rule-based';
        }

        // ── Save career_results ─────────────────────────────────────────────────
        const { data: savedResult } = await supabase.from('career_results').insert({
            user_id: user.id,
            session_id: sessionId,
            education_level: profile.educationLevel,
            marks: profile.marks,
            top_careers: topCareers,
            ai_explanation: aiExplanation,
            ai_model_used: aiModelUsed,
        }).select('id').single();

        // ── Save ai_logs ────────────────────────────────────────────────────────
        if (aiModelUsed !== 'rule-based' || aiError) {
            await supabase.from('ai_logs').insert({
                user_id: user.id,
                career_result_id: savedResult?.id ?? null,
                model: aiModelUsed,
                total_tokens: aiTokens,
                latency_ms: aiLatency,
                success: aiSuccess,
                error_message: aiError,
            });
        }

        // ── Increment usage_tracking ────────────────────────────────────────────
        if (aiEnabled && aiModelUsed !== 'rule-based') {
            await supabase.rpc('increment_ai_usage', { p_user_id: user.id, p_tokens: aiTokens });
        }

        // ── Trigger email (fire and forget) ────────────────────────────────────
        supabase.functions.invoke('send-career-email', {
            body: {
                userId: user.id,
                resultId: savedResult?.id,
                emailType: 'career_result',
                topCareer: topCareer?.career,
                matchScore: topCareer?.matchScore,
            },
        }).catch(() => { /* non-blocking */ });

        // ── Response ────────────────────────────────────────────────────────────
        return new Response(
            JSON.stringify({
                sessionId,
                resultId: savedResult?.id,
                topCareers,
                aiExplanation,
                aiModelUsed,
                dailyAiCallsUsed: dailyCalls + (aiModelUsed !== 'rule-based' ? 1 : 0),
                dailyAiCallLimit: DAILY_LIMIT,
            }),
            { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
        );

    } catch (err) {
        console.error('career-analysis error:', err);
        return new Response(
            JSON.stringify({ error: 'Internal server error', details: (err as Error).message }),
            { status: 500, headers: CORS_HEADERS }
        );
    }
});
