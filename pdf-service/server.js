const express = require('express');
const { chromium } = require('playwright');
const cors = require('cors');
const { PDFDocument } = require('pdf-lib');
const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/', (req, res) => {
  res.json({ message: 'Zertainity PDF Service - Playwright' });
});

app.post('/generate-pdf', async (req, res) => {
  try {
    const { html } = req.body;
    
    if (!html) {
      return res.status(400).json({ error: 'HTML content is required' });
    }
    
    const browser = await chromium.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    
    await page.setContent(html);
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
    
    await browser.close();
    
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
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=zertainity-results.pdf');
    res.send(Buffer.from(finalPdfBytes));
  } catch (error) {
    console.error('PDF generation failed:', error);
    res.status(500).json({ error: 'PDF generation failed' });
  }
});

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log(`PDF service running on http://localhost:${PORT}`);
});
