# Zertainity PDF Service

Python backend service for PDF generation using WeasyPrint 70.0.

## Setup

1. Install Python 3.10 or higher (WeasyPrint 70.0 requires Python 3.10+)
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

## Security

The PDF renderer is designed to be isolated from arbitrary network access:

- WeasyPrint is configured to reject remote and local-file resource fetching during rendering.
- Only embedded `data:` resources are permitted.
- Production requests require `PDF_SERVICE_SECRET`.
- Production deployments should expose the renderer only to the Zertainity Edge Function/private network where possible.
- Request HTML and CSS payloads are size-limited.
- Never run the production service with `CORS_ORIGINS=*`.

## Environment Variables

- `PORT`: Server port (default: 8000)
- `ENVIRONMENT`: Set to `production` in deployed environments.
- `PDF_SERVICE_SECRET`: Strong random shared secret required in production.
- `CORS_ORIGINS`: Comma-separated list of allowed browser origins.
- `PDF_LINEARIZE`: Optional PDF linearization flag (`1`, `true`, or `yes`).
