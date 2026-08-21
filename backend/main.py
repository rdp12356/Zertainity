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
from fastapi import FastAPI, HTTPException, Request
from fastapi.concurrency import run_in_threadpool
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from weasyprint import HTML, CSS
import pikepdf
import uvicorn


def _render_blocking(html_content: str, css_string: str) -> bytes:
    """WeasyPrint render — CPU/GTK bound and blocking; must not run on the
    event loop. hinting=False trades a negligible glyph-fit difference for a
    faster render."""
    css_obj = CSS(string=css_string) if css_string else None
    return HTML(string=html_content).write_pdf(
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
    # Shared-secret gate (only enforced when PDF_SERVICE_SECRET is configured).
    pdf_secret = os.environ.get("PDF_SERVICE_SECRET", "").strip()
    if pdf_secret and request.headers.get("x-pdf-secret", "") != pdf_secret:
        logger.warning("Rejected request: missing or invalid x-pdf-secret header.")
        raise HTTPException(status_code=403, detail="Forbidden")

    logger.info("Starting PDF generation request.")
    try:
        try:
            body = await request.json()
        except Exception as json_err:
            logger.error(f"Failed to parse JSON body: {str(json_err)}")
            raise HTTPException(status_code=400, detail="Invalid JSON body")

        html_content = body.get("html")
        if not html_content:
            logger.warning("Request rejected: HTML content is missing.")
            raise HTTPException(status_code=400, detail="HTML content is required")
        
        css_string = body.get("css", "")

        # Optional metadata overrides from the request body
        meta_author = body.get("author", "Zertainity")
        meta_subject = body.get("subject", "Career Assessment Report")
        meta_keywords = body.get("keywords", "career, assessment, guidance, zertainity, student")
        meta_producer = body.get("producer", "Zertainity PDF Engine v1.0")
        meta_filename = sanitize_filename(body.get("filename", "zertainity-results.pdf"))
        
        logger.info(f"Received request to generate PDF: filename={meta_filename}, author={meta_author}")

        # ── Step 1: Generate raw PDF with WeasyPrint ──
        logger.info("Rendering PDF with WeasyPrint...")
        try:
            raw_pdf_bytes = await run_in_threadpool(_render_blocking, html_content, css_string)
            logger.info(f"WeasyPrint render successful. Raw PDF size: {len(raw_pdf_bytes)} bytes.")
        except Exception as wp_err:
            logger.exception("WeasyPrint PDF generation failed")
            raise HTTPException(status_code=500, detail=f"WeasyPrint rendering failed: {str(wp_err)}")

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
        except Exception as pike_err:
            logger.exception("Pikepdf post-processing failed")
            raise HTTPException(status_code=500, detail=f"PDF post-processing failed: {str(pike_err)}")
        
        return Response(
            content=final_pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={meta_filename}"}
        )
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        logger.exception("Unexpected error during PDF generation")
        raise HTTPException(status_code=500, detail=f"Unexpected PDF generation error: {str(e)}")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    logger.info(f"Starting server on port {port}...")
    uvicorn.run(app, host="0.0.0.0", port=port)
