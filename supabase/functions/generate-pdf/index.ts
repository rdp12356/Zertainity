import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeadersFor } from '../_shared/cors.ts';


serve(async (req) => {
  const corsHeaders = corsHeadersFor(req.headers.get("origin"));
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const reqId = crypto.randomUUID().substring(0, 8);

  // Require a valid Supabase user session before invoking the renderer.
  // This prevents the PDF endpoint from becoming an anonymous compute/relay service.
  const authHeader = req.headers.get("Authorization") ?? "";
  if (!authHeader.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Authentication required" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
  const token = authHeader.slice("Bearer ".length).trim();
  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );
  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Invalid authentication token" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
  console.log(`[${reqId}] PDF Generator Edge Function triggered.`);

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed. Use POST." }),
      {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  // Optional shared secret: when PDF_SERVICE_SECRET is configured, callers
  // must present it in the x-pdf-secret header; it is then forwarded to the
  // renderer services so they can verify it independently.
  const pdfSecret = Deno.env.get("PDF_SERVICE_SECRET") ?? "";
  if (pdfSecret && req.headers.get("x-pdf-secret") !== pdfSecret) {
    console.warn("Rejected request: missing or invalid x-pdf-secret header.");
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
  const upstreamHeaders: Record<string, string> = { "Content-Type": "application/json" };
  if (pdfSecret) upstreamHeaders["x-pdf-secret"] = pdfSecret;

  try {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      console.error(`[${reqId}] Failed to parse JSON body:`, e);
      return new Response(
        JSON.stringify({ error: "Invalid JSON request body" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { html, css, author, subject, keywords, filename } = body;
    if (typeof html !== "string" || new TextEncoder().encode(html).byteLength > 2_000_000) {
      return new Response(JSON.stringify({ error: "HTML content is missing or too large" }), { status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (css !== undefined && (typeof css !== "string" || new TextEncoder().encode(css).byteLength > 500_000)) {
      return new Response(JSON.stringify({ error: "CSS content is too large" }), { status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (!html) {
      console.warn(`[${reqId}] Rejected request: Missing HTML content.`);
      return new Response(
        JSON.stringify({ error: "HTML content is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Production renderer targets must be explicit HTTPS endpoints. This avoids
    // accidentally turning the Edge Function into an SSRF proxy.
    const environment = (Deno.env.get("ENVIRONMENT") ?? "development").trim().toLowerCase();
    const allowedHosts = new Set(
      (Deno.env.get("PDF_ALLOWED_HOSTS") ?? "zertainity-pdf-service.onrender.com")
        .split(",").map((host) => host.trim().toLowerCase()).filter(Boolean)
    );
    function rendererUrl(name: string, developmentDefault: string): string {
      const raw = Deno.env.get(name) ?? developmentDefault;
      let parsed: URL;
      try { parsed = new URL(raw); } catch { throw new Error(`Invalid ${name}`); }
      if (environment === "production" || environment === "prod") {
        if (parsed.protocol !== "https:") throw new Error(`${name} must use HTTPS in production`);
        if (!allowedHosts.has(parsed.hostname.toLowerCase())) throw new Error(`${name} host is not allow-listed`);
      } else if (!(parsed.protocol === "https:" || (parsed.protocol === "http:" && ["localhost", "127.0.0.1"].includes(parsed.hostname)))) {
        throw new Error(`${name} uses an unsupported protocol`);
      }
      return parsed.toString();
    }
    const primaryUrl = rendererUrl("PRIMARY_PDF_SERVICE_URL", "http://localhost:8001/generate-pdf");
    const fallbackUrl = rendererUrl("FALLBACK_PDF_SERVICE_URL", "http://localhost:8000/generate-pdf");

    // Sanitize the download filename: strip path separators and control
    // characters so it can never smuggle headers or paths into responses.
    const rawName = typeof filename === "string" ? filename : "";
    const safeName =
      (rawName.replace(/[^A-Za-z0-9 ._()-]/g, "").trim().replace(/^\.+/, "").slice(0, 80) || "zertainity-results") + ".pdf";

    const payload = {
      html,
      css: css || "",
      author: author || "Zertainity",
      subject: subject || "Career Assessment Report",
      keywords: keywords || "career, assessment, guidance, zertainity, student",
      filename: safeName,
    };

    console.log(`[${reqId}] Attempting PDF generation via primary service: ${primaryUrl}`);

    // Try Primary PDF Service
    let response;
    let primarySuccess = false;
    let errorDetails = "";

    try {
      const controller = new AbortController();
      // Fail fast to the fallback renderer instead of hanging on a cold/slow primary
      const timeoutDuration = parseInt(Deno.env.get("RENDER_TIMEOUT") || "12000", 10);
      const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);

      response = await fetch(primaryUrl, {
        method: "POST",
        headers: upstreamHeaders,
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        primarySuccess = true;
        console.log(`[${reqId}] PDF successfully generated by primary service.`);
      } else {
        const errorText = await response.text();
        errorDetails = `Status ${response.status}: ${errorText}`;
        console.warn(`[${reqId}] Primary PDF service returned non-OK status: ${errorDetails}`);
      }
    } catch (primaryErr) {
      errorDetails = primaryErr instanceof Error ? primaryErr.message : String(primaryErr);
      console.warn(`[${reqId}] Primary PDF service connection failed: ${errorDetails}`);
    }

    // Fallback PDF Service if primary failed
    if (!primarySuccess) {
      console.log(`[${reqId}] Falling back to secondary PDF service: ${fallbackUrl}`);
      try {
        const controller = new AbortController();
        const timeoutDuration = parseInt(Deno.env.get("RENDER_TIMEOUT") || "12000", 10);
        const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);

        response = await fetch(fallbackUrl, {
          method: "POST",
          headers: upstreamHeaders,
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          console.log(`[${reqId}] PDF successfully generated by fallback service.`);
        } else {
          const errorText = await response.text();
          console.error(`[${reqId}] Fallback service also failed. Status ${response.status}: ${errorText}`);
          throw new Error(`Fallback service failed: Status ${response.status} - ${errorText}`);
        }
      } catch (fallbackErr) {
        const fallbackMsg = fallbackErr instanceof Error ? fallbackErr.message : String(fallbackErr);
        console.error(`[${reqId}] Fallback service connection failed: ${fallbackMsg}`);
        return new Response(
          JSON.stringify({
            error: "Both PDF rendering services failed.",
            requestId: reqId,
          }),
          {
            status: 502,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // Return the PDF response from whichever service succeeded
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
        "Content-Disposition": `attachment; filename="${payload.filename}"`,
      },
    });

  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`[${reqId}] Unexpected error in PDF Edge Function:`, errorMsg);
    return new Response(
      JSON.stringify({ error: "Internal server error during PDF generation", requestId: reqId }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
