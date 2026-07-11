import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 8;
const MAX_HTML_BYTES = 250_000;
const MAX_CSS_BYTES = 100_000;
const requestBuckets = new Map<string, { count: number; resetAt: number }>();

function jsonResponse(payload: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function getClientKey(req: Request) {
  const auth = req.headers.get("Authorization") ?? "anonymous";
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  return `${ip}:${auth.slice(-32)}`;
}

function checkRateLimit(req: Request) {
  const key = getClientKey(req);
  const now = Date.now();
  const bucket = requestBuckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    requestBuckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (bucket.count >= RATE_LIMIT_MAX_REQUESTS) return false;
  bucket.count += 1;
  return true;
}

function sanitizePdfFilename(value: unknown) {
  const baseName = String(value ?? "zertainity-results.pdf")
    .split(/[\\/]+/)
    .pop()
    ?.replace(/[^a-zA-Z0-9._-]+/g, "_")
    .replace(/^\.+/, "")
    .slice(0, 120) || "zertainity-results.pdf";
  return baseName.toLowerCase().endsWith(".pdf") ? baseName : `${baseName}.pdf`;
}

function sanitizeMetadata(value: unknown, fallback: string, max = 160) {
  const text = String(value ?? fallback).replace(/[\r\n\0]+/g, " ").trim().slice(0, max);
  return text || fallback;
}

function isPrivateHost(hostname: string) {
  const host = hostname.toLowerCase();
  if (
    host === "localhost" ||
    host.endsWith(".local") ||
    host.endsWith(".internal") ||
    host === "metadata.google.internal"
  ) return true;

  if (/^(127|10)\./.test(host)) return true;
  if (/^192\.168\./.test(host)) return true;
  if (/^169\.254\./.test(host)) return true;
  const private172 = host.match(/^172\.(\d{1,2})\./);
  if (private172) {
    const octet = Number(private172[1]);
    if (octet >= 16 && octet <= 31) return true;
  }
  if (host === "::1" || host.startsWith("fc") || host.startsWith("fd")) return true;
  return false;
}

function validateHtmlForPdf(html: string, css: string) {
  const combined = `${html}\n${css}`;
  if (new TextEncoder().encode(html).byteLength > MAX_HTML_BYTES) {
    return "HTML payload is too large";
  }
  if (new TextEncoder().encode(css).byteLength > MAX_CSS_BYTES) {
    return "CSS payload is too large";
  }
  if (/<\s*(script|iframe|object|embed|form|input|button|meta\s+http-equiv)/i.test(combined)) {
    return "PDF HTML contains disallowed active markup";
  }
  if (/\son[a-z]+\s*=/i.test(combined) || /javascript\s*:/i.test(combined)) {
    return "PDF HTML contains disallowed script-like attributes";
  }

  const urlPattern = /(?:src|href)\s*=\s*["']([^"']+)["']|url\(\s*["']?([^"')]+)["']?\s*\)|@import\s+(?:url\()?\s*["']([^"']+)["']/gi;
  let match: RegExpExecArray | null;
  while ((match = urlPattern.exec(combined))) {
    const rawUrl = (match[1] || match[2] || match[3] || "").trim();
    if (!rawUrl || rawUrl.startsWith("#")) continue;
    if (rawUrl.startsWith("data:image/")) continue;
    if (rawUrl.startsWith("/")) continue;

    let parsed: URL;
    try {
      parsed = new URL(rawUrl);
    } catch {
      return `Invalid resource URL in PDF HTML: ${rawUrl.slice(0, 80)}`;
    }

    if (!["https:", "http:"].includes(parsed.protocol)) {
      return `Disallowed resource protocol in PDF HTML: ${parsed.protocol}`;
    }
    if (isPrivateHost(parsed.hostname)) {
      return `Disallowed private resource host in PDF HTML: ${parsed.hostname}`;
    }
  }

  return null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const reqId = crypto.randomUUID().substring(0, 8);
  console.log(`[${reqId}] PDF Generator Edge Function triggered.`);

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed. Use POST." }, 405);
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return jsonResponse({ error: "Authorization required" }, 401);
  }

  if (!checkRateLimit(req)) {
    return jsonResponse({ error: "Too many PDF requests. Please try again later." }, 429);
  }

  try {
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch (e) {
      console.error(`[${reqId}] Failed to parse JSON body:`, e);
      return jsonResponse({ error: "Invalid JSON request body" }, 400);
    }

    const html = typeof body.html === "string" ? body.html : "";
    const css = typeof body.css === "string" ? body.css : "";

    if (!html) {
      console.warn(`[${reqId}] Rejected request: Missing HTML content.`);
      return jsonResponse({ error: "HTML content is required" }, 400);
    }

    const validationError = validateHtmlForPdf(html, css);
    if (validationError) {
      console.warn(`[${reqId}] Rejected unsafe PDF payload: ${validationError}`);
      return jsonResponse({ error: validationError }, 400);
    }

    const filename = sanitizePdfFilename(body.filename);
    const payload = {
      html,
      css,
      author: sanitizeMetadata(body.author, "Zertainity", 120),
      subject: sanitizeMetadata(body.subject, "Career Assessment Report", 160),
      keywords: sanitizeMetadata(body.keywords, "career, assessment, guidance, zertainity, student", 240),
      filename,
    };

    const primaryUrl = Deno.env.get("PRIMARY_PDF_SERVICE_URL") || "http://localhost:8001/generate-pdf";
    const fallbackUrl = Deno.env.get("FALLBACK_PDF_SERVICE_URL") || "http://localhost:8000/generate-pdf";
    const serviceToken = Deno.env.get("PDF_SERVICE_TOKEN")?.trim();
    const serviceHeaders: HeadersInit = {
      "Content-Type": "application/json",
      ...(serviceToken ? { "X-PDF-Service-Token": serviceToken } : {}),
    };

    console.log(`[${reqId}] Attempting PDF generation via primary service: ${primaryUrl}`);

    let response: Response | undefined;
    let primarySuccess = false;
    let errorDetails = "";

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20_000);

      response = await fetch(primaryUrl, {
        method: "POST",
        headers: serviceHeaders,
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        primarySuccess = true;
        console.log(`[${reqId}] PDF successfully generated by primary service.`);
      } else {
        const errorText = await response.text();
        errorDetails = `Status ${response.status}: ${errorText.slice(0, 300)}`;
        console.warn(`[${reqId}] Primary PDF service returned non-OK status: ${errorDetails}`);
      }
    } catch (primaryErr) {
      errorDetails = primaryErr instanceof Error ? primaryErr.message : String(primaryErr);
      console.warn(`[${reqId}] Primary PDF service connection failed: ${errorDetails}`);
    }

    if (!primarySuccess) {
      console.log(`[${reqId}] Falling back to secondary PDF service: ${fallbackUrl}`);
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 25_000);

        response = await fetch(fallbackUrl, {
          method: "POST",
          headers: serviceHeaders,
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Fallback service failed: Status ${response.status} - ${errorText.slice(0, 300)}`);
        }
        console.log(`[${reqId}] PDF successfully generated by fallback service.`);
      } catch (fallbackErr) {
        const fallbackMsg = fallbackErr instanceof Error ? fallbackErr.message : String(fallbackErr);
        console.error(`[${reqId}] Fallback service connection failed: ${fallbackMsg}`);
        return jsonResponse({ error: "Both PDF rendering services failed.", primaryError: errorDetails, fallbackError: fallbackMsg }, 502);
      }
    }

    if (!response) {
      throw new Error("No response received from any PDF service");
    }

    const pdfBuffer = await response.arrayBuffer();
    console.log(`[${reqId}] Returning generated PDF of size ${pdfBuffer.byteLength} bytes.`);

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`[${reqId}] Unexpected error in PDF Edge Function:`, errorMsg);
    return jsonResponse({ error: "Internal server error during PDF generation", details: errorMsg }, 500);
  }
});
