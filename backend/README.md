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
