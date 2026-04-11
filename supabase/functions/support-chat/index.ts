const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 10;
const requestBuckets = new Map<string, { count: number; resetAt: number }>();

declare const Deno: {
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
};

function buildSseResponse(reply: string, status = 200) {
  const payload = [
    `data: ${JSON.stringify({ choices: [{ delta: { content: reply } }] })}`,
    "",
    "data: [DONE]",
    "",
  ].join("\n");

  return new Response(payload, {
    status,
    headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
  });
}

function getClientKey(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || req.headers.get("x-real-ip")
    || req.headers.get("cf-connecting-ip")
    || "unknown";
}

function normalizeInput(input: string): string {
  return input.toLowerCase().replace(/\s+/g, " ").trim();
}

function getSupportReply(lastUserMessage?: string): string {
  const q = normalizeInput(lastUserMessage ?? "");
  const includesAny = (...terms: string[]) => terms.some((term) => q.includes(term));

  if (!q) {
    return "I can help with careers, exams, pathways, quiz results, account issues, and legal pages. Ask me what you want to do.";
  }

  if (/\b(hi|hello|hey|namaste)\b/.test(q)) {
    return "Hi. I can help with careers, exams, quiz flow, account settings, and contact info on Zertainity.";
  }

  if (includesAny("founder", "founded", "who built", "who made", "creator", "team", "viney", "johan")) {
    return "Zertainity was founded and built by Viney Ragesh and Johan Manoj. Their roles are co-founders and core developers of the platform.";
  }

  if (includesAny("start", "get started", "how to use", "where to begin", "begin")) {
    return "Start at /education-level, then continue through subject selection and quiz. After submission, your recommendations appear on /results with career options and next steps.";
  }

  if (includesAny("quiz", "assessment", "aptitude", "test")) {
    return "The assessment flow is: /education-level -> /grade-selection -> /subject-selection -> /subject-quiz or /quiz -> /results. Your answers are used to generate career recommendations.";
  }

  if (includesAny("result", "results", "share", "shared", "r/")) {
    return "Results are shown on /results. Shared links use /r/:slug and open a read-only result page. If a shared link fails, create a new result and share again.";
  }

  if (includesAny("career", "careers", "job", "profession")) {
    return "Use /careers to browse careers and search by name/category. For deeper mapping, open /pathways to view education path, exams, and role direction for each career.";
  }

  if (includesAny("pathway", "pathways", "roadmap")) {
    return "Open /pathways and pick a career from the left panel. You will see category, salary snapshot, entrance exams, recommended education, and colleges.";
  }

  if (includesAny("exam", "jee", "neet", "cat", "upsc", "clat", "gate")) {
    return "Use /exams for exam details. You can search and filter by category, then view official notice link, apply link, registration window, eligibility snapshot, documents checklist, and post-exam actions.";
  }

  if (includesAny("login", "sign in", "sign up", "account", "password", "auth")) {
    return "Account actions are on /auth. Use Forgot Password there to get a reset link, then complete the reset on /reset-password. After login, manage profile on /settings.";
  }

  if (includesAny("admin", "role", "permission", "editor", "owner")) {
    return "Admin tools are under /admin and require the right role. If you need access changes, contact your project owner or admin account.";
  }

  if (includesAny("privacy", "terms", "disclaimer", "legal", "policy")) {
    return "Legal pages are available at /privacy-policy, /terms-of-service, and /disclaimer. You can also open /about and /contact for platform and support details.";
  }

  if (includesAny("contact", "email", "support", "help", "bug", "issue")) {
    return "For direct help, email zertainity@gmail.com or open /contact. If you report an issue, include page URL, device, and exact error message for faster support.";
  }

  return "I can answer questions about careers, exams, pathways, quiz flow, results sharing, account access, and legal pages on Zertainity. For manual support, email zertainity@gmail.com.";
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const clientKey = getClientKey(req);
    const now = Date.now();
    const bucket = requestBuckets.get(clientKey);

    if (!bucket || bucket.resetAt <= now) {
      requestBuckets.set(clientKey, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    } else if (bucket.count >= RATE_LIMIT_MAX_REQUESTS) {
      return new Response(JSON.stringify({ error: "Too many requests. Please try again in a moment." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else {
      bucket.count += 1;
    }

    const { messages } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 20) {
      return new Response(JSON.stringify({ error: "Invalid chat payload" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const totalLength = messages.reduce((sum, message) => sum + String(message?.content ?? "").length, 0);
    if (totalLength > 8000) {
      return new Response(JSON.stringify({ error: "Conversation too long" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const lastUserMessage = [...messages].reverse().find((message) => message?.role === "user")?.content;
    const reply = getSupportReply(typeof lastUserMessage === "string" ? lastUserMessage : undefined);
    return buildSseResponse(reply);
  } catch (e) {
    console.error("support-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
