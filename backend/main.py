from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from weasyprint import HTML, CSS
import os

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
    return {"message": "Zertainity PDF Service - WeasyPrint 62.3"}

@app.post("/generate-pdf")
async def generate_pdf(request: Request):
    try:
        body = await request.json()
        html_content = body.get("html")
        
        if not html_content:
            raise HTTPException(status_code=400, detail="HTML content is required")
        
        css_string = body.get("css", "")
        
        html_obj = HTML(string=html_content)
        css_obj = CSS(string=css_string) if css_string else None
        
        pdf_bytes = html_obj.write_pdf(stylesheets=[css_obj] if css_obj else None)
        
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=zertainity-results.pdf"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
