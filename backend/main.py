import os
import sys

# Configure GTK path programmatically on Windows before importing WeasyPrint
if sys.platform == "win32":
    gtk_bin = r"C:\Program Files\GTK3-Runtime Win64\bin"
    if os.path.exists(gtk_bin):
        os.environ["WEASYPRINT_DLL_DIRECTORIES"] = gtk_bin
        os.environ["PATH"] = gtk_bin + os.pathsep + os.environ["PATH"]
        if hasattr(os, "add_dll_directory"):
            try:
                os.add_dll_directory(gtk_bin)
            except Exception:
                pass

import io
import logging
import re
import json
import asyncio
from urllib.parse import urlsplit
from fastapi import FastAPI, HTTPException, Request
from fastapi.concurrency import run_in_threadpool
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from weasyprint import HTML, CSS, default_url_fetcher
import pikepdf
import uvicorn

# Restrict the rendering service to trusted application requests and bounded work.
MAX_REQUEST_BYTES = 400_000
MAX_HTML_CHARS = 300_000
MAX_CSS_CHARS = 60_000
MAX_OUTPUT_BYTES = 9_000_000
_render_slots = asyncio.Semaphore(2)


def _safe_url_fetcher(url, *args, **kwargs):
    """Never fetch network, localhost, metadata service or file:// resources from student HTML."""
    parsed = urlsplit(url)
    if parsed.scheme != "data" or len(url) > 1_500_000:
        raise ValueError("External and oversized PDF resources are disabled")
    return default_url_fetcher(url, *args, **kwargs)


def _render_blocking(html_content: str, css_string: str) -> bytes:
    """WeasyPrint render — CPU/GTK bound and blocking; must not run on the
    event loop. hinting=False trades a negligible glyph-fit difference for a
    faster render."""
    css_obj = CSS(string=css_string, url_fetcher=_safe_url_fetcher) if css_string else None
    return HTML(string=html_content, url_fetcher=_safe_url_fetcher).write_pdf(
        stylesheets=[css_obj] if css_obj else None,
        hinting=False,
    )


def _postprocess_blocking(raw_pdf_bytes: bytes, meta_author, meta_subject, meta_keywords, meta_producer) -> bytes:
    """pikepdf metadata + optional linearization — also blocking.
    Linearization rewrites the whole file for byte-range streaming; it only
    benefits progressive viewing over slow links, so it is opt-in via
    PDF_LINEARIZE=1 (off by default to keep generation fast)."""
    pdf = pikepdf.Pdf.open(io.BytesIO(raw_pdf_bytes))
    with pdf.open_metadata() as meta:
        meta["dc:creator"] = [meta_author]
        meta["dc:title"] = "Zertainity Career Assessment Report"
        meta["dc:description"] = meta_subject
        meta["dc:subject"] = [kw.strip() for kw in meta_keywords.split(",")]
        meta["pdf:Producer"] = meta_producer
        meta["xmp:CreatorTool"] = "Zertainity Assessment Engine"
    pdf.docinfo["/Author"] = meta_author
    pdf.docinfo["/Title"] = "Zertainity Career Assessment Report"
    pdf.docinfo["/Subject"] = meta_subject
    pdf.docinfo["/Keywords"] = meta_keywords
    pdf.docinfo["/Producer"] = meta_producer
    pdf.docinfo["/Creator"] = "Zertainity Assessment Engine"
    out_buf = io.BytesIO()
    if os.environ.get("PDF_LINEARIZE", "").strip() in ("1", "true", "yes"):
        pdf.save(out_buf, linearize=True, min_version="1.7")
    else:
        pdf.save(out_buf)
    pdf.close()
    return out_buf.getvalue()


def sanitize_filename(name: str, default: str = "zertainity-results.pdf") -> str:
    """Strip path separators / control characters so the value is safe to
    place inside a Content-Disposition header."""
    cleaned = re.sub(r"[^A-Za-z0-9 ._()-]", "", str(name)).strip().lstrip(".")
    if not cleaned:
        return default
    if not cleaned.lower().endswith(".pdf"):
        cleaned = cleaned[:86] + ".pdf"
    return cleaned[:90]

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger("weasyprint_pdf_service")

app = FastAPI(title="Zertainity PDF Service", version="1.0.0")

# Configure CORS Origins. Defaults to the production app origins; override
# with CORS_ORIGINS="a,b,c". Set it to "*" explicitly only for local testing.
cors_origins_env = os.environ.get("CORS_ORIGINS", "https://www.zertainity.in,https://zertainity.in")
if cors_origins_env == "*":
    allow_origins = ["*"]
    allow_credentials = False  # Wildcard * cannot be used with allow_credentials=True in standard CORS
    logger.info("CORS configured with wildcard origin ('*'). Credentials disabled.")
else:
    allow_origins = [origin.strip() for origin in cors_origins_env.split(",") if origin.strip()]
    allow_credentials = True
    logger.info(f"CORS configured with allowed origins: {allow_origins}. Credentials enabled.")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    logger.info("Root endpoint healthcheck called.")
    return {"message": "Zertainity PDF Service - WeasyPrint 62.3 + pikepdf"}

@app.post("/generate-pdf")
async def generate_pdf(request: Request):
    # Fail closed. This service must never be an unauthenticated HTML-to-PDF proxy.
    pdf_secret = os.environ.get("PDF_SERVICE_SECRET", "").strip()
    if not pdf_secret:
        logger.error("PDF_SERVICE_SECRET is not configured; refusing to render")
        raise HTTPException(status_code=503, detail="PDF renderer not configured")
    import hmac
    if not hmac.compare_digest(request.headers.get("x-pdf-secret", ""), pdf_secret):
        logger.warning("Rejected request: missing or invalid x-pdf-secret header.")
        raise HTTPException(status_code=403, detail="Forbidden")

    logger.info("Starting PDF generation request.")
    try:
        if int(request.headers.get("content-length") or 0) > MAX_REQUEST_BYTES:
            raise HTTPException(status_code=413, detail="PDF request too large")
        raw_body = await request.body()
        if len(raw_body) > MAX_REQUEST_BYTES:
            raise HTTPException(status_code=413, detail="PDF request too large")
        try:
            body = json.loads(raw_body)
        except (ValueError, UnicodeDecodeError):
            raise HTTPException(status_code=400, detail="Invalid JSON body")
        if not isinstance(body, dict):
            raise HTTPException(status_code=400, detail="Expected a PDF request object")

        html_content = body.get("html")
        if not isinstance(html_content, str) or not html_content:
            logger.warning("Request rejected: HTML content is missing.")
            raise HTTPException(status_code=400, detail="HTML content is required")
        
        css_string = body.get("css", "")
        if not isinstance(css_string, str) or len(css_string) > MAX_CSS_CHARS or len(html_content) > MAX_HTML_CHARS:
            raise HTTPException(status_code=413, detail="PDF content too large")

        # Optional metadata overrides from the request body
        meta_author = body.get("author", "Zertainity")
        meta_subject = body.get("subject", "Career Assessment Report")
        meta_keywords = body.get("keywords", "career, assessment, guidance, zertainity, student")
        meta_producer = body.get("producer", "Zertainity PDF Engine v1.0")
        meta_filename = sanitize_filename(body.get("filename", "zertainity-results.pdf"))
        
        logger.info("Received authenticated PDF rendering request (document metadata omitted).")

        # ── Step 1: Generate raw PDF with WeasyPrint ──
        if _render_slots.locked():
            raise HTTPException(status_code=503, detail="PDF renderer is busy; retry later")
        logger.info("Rendering PDF with WeasyPrint...")
        try:
            async with _render_slots:
                raw_pdf_bytes = await run_in_threadpool(_render_blocking, html_content, css_string)
            if len(raw_pdf_bytes) > MAX_OUTPUT_BYTES:
                raise HTTPException(status_code=413, detail="Rendered report too large")
            logger.info(f"WeasyPrint render successful. Raw PDF size: {len(raw_pdf_bytes)} bytes.")
        except HTTPException:
            raise
        except Exception:
            logger.exception("WeasyPrint PDF generation failed")
            raise HTTPException(status_code=500, detail="PDF rendering failed")

        # ── Step 2: Post-process with pikepdf (metadata + linearization) ──
        logger.info("Post-processing PDF with pikepdf (metadata & linearization)...")
        try:
            final_pdf_bytes = await run_in_threadpool(
                _postprocess_blocking,
                raw_pdf_bytes,
                meta_author,
                meta_subject,
                meta_keywords,
                meta_producer,
            )
            logger.info(f"Post-processing complete. Linearized PDF size: {len(final_pdf_bytes)} bytes.")
        except Exception:
            logger.exception("Pikepdf post-processing failed")
            raise HTTPException(status_code=500, detail="PDF post-processing failed")
        
        if len(final_pdf_bytes) > MAX_OUTPUT_BYTES:
            raise HTTPException(status_code=413, detail="PDF output too large")
        return Response(
            content=final_pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={meta_filename}"}
        )
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        logger.exception("Unexpected error during PDF generation")
        raise HTTPException(status_code=500, detail="Unexpected PDF generation error")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    logger.info(f"Starting server on port {port}...")
    uvicorn.run(app, host="0.0.0.0", port=port)
