import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Malformed JSON payload' }), { status: 400, headers: corsHeaders });
    }

    if (!Array.isArray(body?.messages)) {
      return new Response(JSON.stringify({ error: 'Messages payload must be an array' }), { status: 400, headers: corsHeaders });
    }

    let messages = body.messages;

    // Limit chat history length
    if (messages.length > 10) {
      messages = messages.slice(-10);
    }

    // Sanitize the latest user message
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === 'user' && typeof lastMsg.content === 'string') {
        if (lastMsg.content.length > 300) {
          return new Response(JSON.stringify({ error: 'Message too long (max 300 characters)' }), { status: 400, headers: corsHeaders });
        }
        lastMsg.content = lastMsg.content.replace(/ignore previous instructions/gi, '')
          .replace(/reveal system prompt/gi, '')
          .replace(/you are now/gi, '')
          .trim();
        if (lastMsg.content.length === 0) {
          return new Response(JSON.stringify({ error: 'Invalid message content' }), { status: 400, headers: corsHeaders });
        }
      }
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are Zertainity's support assistant. Be SHORT and DIRECT. Answer in 1-3 sentences max unless the user explicitly asks for a detailed or long explanation.

Key facts:
- Zertainity is an AI career guidance platform for students
- Students take a quiz to discover interests, get career/college recommendations
- For issues or suggestions: email zertainity@gmail.com

Rules:
- Default to the shortest accurate answer possible
- No filler, no unnecessary greetings in follow-ups
- Only give long answers when the user says "explain in detail", "tell me more", or similar
- Use bullet points for lists, keep them tight`
          },
          ...messages,
        ],
        stream: true,
      }),
    });


    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Too many requests. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("support-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
