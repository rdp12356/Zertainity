// @ts-nocheck
// Deno Edge Function: ask-mentor
// Route: POST /functions/v1/ask-mentor
// =============================================================================
// Provides interactive career mentorship by answering specific user questions.
// Context-aware: reads the user's career analysis result to provide tailored answers.
// =============================================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function callOpenRouter(prompt: string, history: any[]): Promise<string> {
    const apiKey = Deno.env.get('OPENROUTER_API_KEY');
    if (!apiKey) throw new Error('OPENROUTER_API_KEY not set');

    // Convert history format to OpenRouter format
    const messages = [
        { role: 'system', content: prompt },
        ...history.map(m => ({ role: m.role, content: m.content }))
    ];

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
            messages,
            max_tokens: 400,
        }),
    });

    if (!res.ok) throw new Error(`OpenRouter API error: ${res.status}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? '';
}

async function callGemini(prompt: string, history: any[]): Promise<string> {
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) throw new Error('GEMINI_API_KEY not set');

    // Format for Gemini API
    const contents = [
        { role: 'user', parts: [{ text: prompt }] },
        { role: 'model', parts: [{ text: "Understood. I'm ready to act as the mentor." }] },
        ...history.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
        }))
    ];

    const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents,
                generationConfig: { maxOutputTokens: 400, temperature: 0.7 },
            }),
        }
    );

    if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS_HEADERS });

    try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        const authHeader = req.headers.get('Authorization');
        if (!authHeader) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: CORS_HEADERS });
        const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
        if (authError || !user) return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401, headers: CORS_HEADERS });

        let body;
        try {
            body = await req.json();
        } catch {
            return new Response(JSON.stringify({ error: 'Malformed JSON payload' }), { status: 400, headers: CORS_HEADERS });
        }

        if (typeof body !== 'object' || body === null) {
            return new Response(JSON.stringify({ error: 'Invalid payload type' }), { status: 400, headers: CORS_HEADERS });
        }

        let { resultId, question, history = [] } = body;
        if (!resultId || typeof resultId !== 'string' || !question || typeof question !== 'string') {
            return new Response(JSON.stringify({ error: 'Missing or invalid resultId or question' }), { status: 400, headers: CORS_HEADERS });
        }

        if (question.length > 500) {
            return new Response(JSON.stringify({ error: 'Question too long (max 500 characters)' }), { status: 400, headers: CORS_HEADERS });
        }

        // Sanitize prompt injection
        question = question.replace(/ignore previous instructions/gi, '')
            .replace(/reveal system prompt/gi, '')
            .replace(/you are now/gi, '')
            .trim();

        if (question.length === 0) {
            return new Response(JSON.stringify({ error: 'Invalid question content' }), { status: 400, headers: CORS_HEADERS });
        }

        // Limit history length to prevent token abuse
        if (Array.isArray(history)) {
            history = history.slice(-5); // Keep only last 5 messages
        } else {
            history = [];
        }

        // Fetch the career result to inject context
        const { data: result } = await supabase
            .from('career_results')
            .select('top_careers, education_level')
            .eq('id', resultId)
            .eq('user_id', user.id)
            .single();

        if (!result) return new Response(JSON.stringify({ error: "Career result not found or unauthorized" }), { status: 404, headers: CORS_HEADERS });

        const topCareer = result.top_careers[0];

        // Build context-rich system prompt
        const systemPrompt = `You are a warm, expert AI Career Mentor for Indian students.
The student you are talking to is in ${result.education_level}.
Their top matched career is: **${topCareer.career}** (${topCareer.matchScore}% match).
Their strengths: ${topCareer.strengths?.join(', ') || 'general aptitude'}.
Required Exams for this path: ${topCareer.requiredExams?.join(', ') || 'None specifically'}.
Average Salary: ₹${topCareer.avgSalaryLpa || 6} LPA.

Instructions:
1. Answer their specific question based on this career path.
2. Be highly encouraging but realistic.
3. Keep answers concise (max 3-4 short paragraphs).
4. Do not use bullet points unless completely necessary. Use bold text for emphasis.
5. You must write in Indian English context (e.g. referring to Indian exams like JEE/NEET, talking in Lakhs per annum).`;

        let answer = "";

        // Route to Gemini first, OpenRouter fallback
        try {
            answer = await callGemini(systemPrompt, history);
        } catch (e1) {
            console.error("Gemini failed, trying OpenRouter:", e1);
            try {
                answer = await callOpenRouter(systemPrompt, history);
            } catch (e2) {
                throw new Error("Both AI providers failed");
            }
        }

        return new Response(JSON.stringify({ answer }), { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });

    } catch (err: any) {
        console.error('ask-mentor error:', err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: CORS_HEADERS });
    }
});
