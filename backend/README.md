# Zertainity PDF Service

Python backend service for PDF generation using WeasyPrint 62.3.

## Setup

1. Install Python 3.10 or higher
2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Install WeasyPrint system dependencies (Ubuntu/Debian):
```bash
sudo apt-get install python3-dev python3-pip libpango-1.0-0 libglib2.0-0 libgdk-pixbuf2.0-0
```

For macOS:
```bash
brew install pango gdk-pixbuf libffi
```

For Windows, WeasyPrint may require GTK+ libraries - see [WeasyPrint documentation](https://doc.courtbouillon.org/weasyprint/stable/first_steps.html).

## Running

```bash
python main.py
```

The service will run on `http://localhost:8000`

## API Endpoint

### POST /generate-pdf

Generates a PDF from HTML content.

**Request:**
```json
{
  "html": "<html>...</html>",
  "css": "body { font-family: Arial; }"
}
```

**Response:** PDF file (application/pdf)

## Environment Variables

- `PORT`: Server port (default: 8000)
- `PDF_SERVICE_SECRET`: **required**. Set a long random server-side secret here and set the identical value in the Supabase Edge Function secrets. Never put it in a `VITE_` variable, repository, or browser.
- `CORS_ORIGINS`: Restrict to your approved application origin(s). CORS is not authentication.
- `PDF_LINEARIZE`: Optional PDF linearization (`1` enables it).

## Production verification

1. Deploy the Python service on a host with a private network or strict ingress access policy. Require `x-pdf-secret` on every `/generate-pdf` request.
2. Verify missing and incorrect secrets return 403, while a correctly authenticated request returns a PDF. Never place the actual secret into an issue, screenshot, CI output, or chat.
3. Configure `PRIMARY_PDF_SERVICE_URL` and, when appropriate, `FALLBACK_PDF_SERVICE_URL` in Supabase secrets. Prefer HTTPS and distinct fault domains; do not depend on the development `localhost` defaults in production.
4. Limit CPU, memory, concurrency and request timeouts at the hosting layer. URL fetching is restricted to embedded `data:` assets in the implementation.
5. Check PDF downloads in both desktop and mobile browsers, and verify renderer failures create alerts through your hosting provider.

