const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer-core');
const chromeLauncher = require('chrome-launcher');
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

// Browser manager (uses system Chrome via chrome-launcher + puppeteer-core)
let browser = null; // puppeteer Browser
let chromeProcess = null; // chrome-launcher instance
let isLaunching = false;

async function getBrowser() {
  if (browser && browser.isConnected()) return browser;

  if (isLaunching) {
    await new Promise((r) => setTimeout(r, 300));
    return getBrowser();
  }

  isLaunching = true;
  log('INFO', 'Launching or attaching to system Chrome using chrome-launcher...');

  try {
    // If user provided a remote WS endpoint, try connecting first
    const remoteWs = process.env.CHROME_WS_ENDPOINT;
    if (remoteWs) {
      browser = await puppeteer.connect({ browserWSEndpoint: remoteWs });
      log('INFO', 'Connected to remote Chrome via CHROME_WS_ENDPOINT');
      return browser;
    }

    // Launch a local Chrome instance using chrome-launcher (will use installed Chrome)
    chromeProcess = await chromeLauncher.launch({
      chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
    });

    // Retrieve WebSocket endpoint
    const versionUrl = `http://127.0.0.1:${chromeProcess.port}/json/version`;
    const res = await fetch(versionUrl, { timeout: 30000 });
    const info = await res.json();
    const wsEndpoint = info.webSocketDebuggerUrl;

    if (!wsEndpoint) throw new Error('Could not obtain webSocketDebuggerUrl from Chrome');

    browser = await puppeteer.connect({ browserWSEndpoint: wsEndpoint });

    log('INFO', 'Connected puppeteer to launched Chrome');

    // Handle disconnect
    browser.on('disconnected', () => {
      log('WARNING', 'Puppeteer browser disconnected');
      browser = null;
    });

    return browser;
  } catch (error) {
    log('ERROR', 'Failed to launch or connect to Chrome', { error: error.message, stack: error.stack });
    // cleanup any chrome process
    if (chromeProcess) {
      try { await chromeProcess.kill(); } catch (e) {}
      chromeProcess = null;
    }
    browser = null;
    throw error;
  } finally {
    isLaunching = false;
  }
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

    log('INFO', 'Creating new page and generating PDF buffer', { reqId });
    page = await browserInstance.newPage();

    await page.setContent(html, { waitUntil: 'load', timeout: 30000 });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '2cm', right: '2cm', bottom: '2cm', left: '2cm' }
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
      try { await page.close(); } catch (err) { log('WARNING', 'Failed to close page', { reqId, error: err.message }); }
    }
    // do not close the shared browser here; keep it warm
    if (context) {
      try { await context.close(); } catch (err) { /* no-op */ }
    }
  }
});

// Graceful shutdown
async function shutdown() {
  log('INFO', 'Shutdown signal received. Cleaning up resources...');
  if (browser) {
    try {
      await browser.close();
      log('INFO', 'Shared puppeteer browser closed successfully.');
    } catch (error) {
      log('ERROR', 'Error closing shared puppeteer browser', { error: error.message });
    }
    browser = null;
  }
  if (chromeProcess) {
    try {
      await chromeProcess.kill();
      log('INFO', 'Launched chrome process killed.');
    } catch (e) {
      log('WARNING', 'Error killing chrome process', { error: e && e.message });
    }
    chromeProcess = null;
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
