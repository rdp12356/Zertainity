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
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from weasyprint import HTML, CSS
import pikepdf
import uvicorn


app = FastAPI(title="Zertainity PDF Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Zertainity PDF Service - WeasyPrint 62.3 + pikepdf"}

@app.post("/generate-pdf")
async def generate_pdf(request: Request):
    try:
        body = await request.json()
        html_content = body.get("html")
        
        if not html_content:
            raise HTTPException(status_code=400, detail="HTML content is required")
        
        css_string = body.get("css", "")

        # Optional metadata overrides from the request body
        meta_author = body.get("author", "Zertainity")
        meta_subject = body.get("subject", "Career Assessment Report")
        meta_keywords = body.get("keywords", "career, assessment, guidance, zertainity, student")
        meta_producer = body.get("producer", "Zertainity PDF Engine v1.0")
        meta_filename = body.get("filename", "zertainity-results.pdf")
        
        # ── Step 1: Generate raw PDF with WeasyPrint ──
        html_obj = HTML(string=html_content)
        css_obj = CSS(string=css_string) if css_string else None
        raw_pdf_bytes = html_obj.write_pdf(stylesheets=[css_obj] if css_obj else None)

        # ── Step 2: Post-process with pikepdf (metadata + linearization) ──
        pdf = pikepdf.Pdf.open(io.BytesIO(raw_pdf_bytes))

        # Set XMP metadata (modern, recommended)
        with pdf.open_metadata() as meta:
            meta["dc:creator"] = [meta_author]
            meta["dc:title"] = "Zertainity Career Assessment Report"
            meta["dc:description"] = meta_subject
            meta["dc:subject"] = [kw.strip() for kw in meta_keywords.split(",")]
            meta["pdf:Producer"] = meta_producer
            meta["xmp:CreatorTool"] = "Zertainity Assessment Engine"

        # Set legacy DocumentInfo dictionary (for older PDF readers)
        pdf.docinfo["/Author"] = meta_author
        pdf.docinfo["/Title"] = "Zertainity Career Assessment Report"
        pdf.docinfo["/Subject"] = meta_subject
        pdf.docinfo["/Keywords"] = meta_keywords
        pdf.docinfo["/Producer"] = meta_producer
        pdf.docinfo["/Creator"] = "Zertainity Assessment Engine"

        # Save with linearization (Fast Web View) and PDF version 1.7
        out_buf = io.BytesIO()
        pdf.save(out_buf, linearize=True, min_version="1.7")
        pdf.close()
        final_pdf_bytes = out_buf.getvalue()
        
        return Response(
            content=final_pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={meta_filename}"}
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
