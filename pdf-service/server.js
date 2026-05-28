const express = require('express');
const cors = require('cors');
const { chromium } = require('playwright');
const { PDFDocument } = require('pdf-lib');
const app = express();

// Configure CORS Origins dynamically from env
const corsOriginsEnv = process.env.CORS_ORIGINS || '*';
let corsOptions;
if (corsOriginsEnv === '*') {
  corsOptions = { origin: '*', credentials: false };
} else {
  const allowedOrigins = corsOriginsEnv.split(',').map(o => o.trim()).filter(Boolean);
  corsOptions = {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  };
}

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

// Helper log function
function log(level, message, meta = {}) {
  const timestamp = new Date().toISOString();
  console.log(JSON.stringify({ timestamp, level, message, ...meta }));
}

// Browser manager
let browser = null;
let isLaunching = false;

async function getBrowser() {
  if (browser && browser.isConnected()) {
    return browser;
  }

  if (isLaunching) {
    // Wait a bit and try again or yield
    await new Promise(resolve => setTimeout(resolve, 500));
    return getBrowser();
  }

  isLaunching = true;
  log('INFO', 'Launching shared Playwright Chromium instance...');
  try {
    browser = await chromium.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });
    log('INFO', 'Shared Playwright Chromium browser launched successfully.');
    
    browser.on('disconnected', () => {
      log('WARNING', 'Shared browser disconnected.');
      browser = null;
    });
  } catch (error) {
    log('ERROR', 'Failed to launch browser', { error: error.message, stack: error.stack });
    browser = null;
    throw error;
  } finally {
    isLaunching = false;
  }
  
  return browser;
}

app.get('/', (req, res) => {
  log('INFO', 'Health check endpoint called.');
  res.json({ message: 'Zertainity PDF Service - Playwright' });
});

app.post('/generate-pdf', async (req, res) => {
  const reqId = Math.random().toString(36).substring(7);
  log('INFO', 'Starting PDF generation request', { reqId });
  
  let page = null;
  let context = null;
  
  try {
    const { html } = req.body;
    
    if (!html) {
      log('WARNING', 'Request rejected: HTML content missing', { reqId });
      return res.status(400).json({ error: 'HTML content is required' });
    }
    
    const browserInstance = await getBrowser();
    
    log('INFO', 'Creating new browser context and page', { reqId });
    context = await browserInstance.newContext();
    page = await context.newPage();
    
    // Set content and generate PDF
    log('INFO', 'Setting HTML content and generating PDF buffer', { reqId });
    await page.setContent(html, { waitUntil: 'load', timeout: 30000 });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '2cm',
        right: '2cm',
        bottom: '2cm',
        left: '2cm',
      },
    });
    
    log('INFO', `Raw PDF generated. Size: ${pdfBuffer.length} bytes. Injecting metadata...`, { reqId });
    
    // Set PDF Metadata and Version using pdf-lib
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    pdfDoc.setTitle('Zertainity Career Assessment Report');
    pdfDoc.setAuthor('Zertainity');
    pdfDoc.setSubject('Career Assessment Results and Pathway Recommendation');
    pdfDoc.setKeywords(['Zertainity', 'Career Assessment', 'Report', 'Student Pathway', 'India']);
    pdfDoc.setCreator('Zertainity PDF Service');
    pdfDoc.setProducer('Zertainity PDF Engine v2.0');
    
    let finalPdfBytes = await pdfDoc.save();
    
    // Update PDF header version to 1.7 (maximum standard version)
    if (finalPdfBytes.length > 8) {
      const headerStr = Buffer.from(finalPdfBytes.subarray(0, 8)).toString('utf-8');
      if (headerStr.startsWith('%PDF-1.')) {
        finalPdfBytes[7] = 55; // ASCII character '7' is 55
      }
    }
    
    log('INFO', `PDF generation and metadata injection complete. Final size: ${finalPdfBytes.length} bytes. Sending response.`, { reqId });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=zertainity-results.pdf');
    res.send(Buffer.from(finalPdfBytes));
  } catch (error) {
    log('ERROR', 'PDF generation failed', { reqId, error: error.message, stack: error.stack });
    res.status(500).json({ error: 'PDF generation failed: ' + error.message });
  } finally {
    if (page) {
      try {
        await page.close();
      } catch (err) {
        log('WARNING', 'Failed to close page', { reqId, error: err.message });
      }
    }
    if (context) {
      try {
        await context.close();
      } catch (err) {
        log('WARNING', 'Failed to close context', { reqId, error: err.message });
      }
    }
  }
});

// Graceful shutdown
async function shutdown() {
  log('INFO', 'Shutdown signal received. Cleaning up resources...');
  if (browser) {
    try {
      await browser.close();
      log('INFO', 'Shared browser closed successfully.');
    } catch (error) {
      log('ERROR', 'Error closing shared browser', { error: error.message });
    }
  }
  process.exit(0);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

const PORT = process.env.PORT || 8001;
app.listen(PORT, async () => {
  log('INFO', `PDF service running on http://localhost:${PORT}`);
  // Eagerly launch browser on startup to speed up first request
  try {
    await getBrowser();
  } catch (error) {
    log('WARNING', 'Failed to eagerly launch browser on startup. Will retry on first request.');
  }
});
