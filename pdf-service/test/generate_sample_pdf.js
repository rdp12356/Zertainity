const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

(async () => {
  try {
    const outDir = path.resolve(__dirname, '..', 'output');
    fs.mkdirSync(outDir, { recursive: true });

    // Read the favicon and convert it to Base64
    const faviconPath = path.resolve(__dirname, '..', '..', 'public', 'favicon.png');
    let faviconBase64 = '';
    try {
      const faviconBuffer = fs.readFileSync(faviconPath);
      faviconBase64 = `data:image/png;base64,${faviconBuffer.toString('base64')}`;
    } catch (err) {
      console.warn('Warning: favicon.png not found or could not be read, using fallback. Error:', err.message);
    }

    const html = `
      <!doctype html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Zertainity - Assessment Report</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="${faviconBase64}" />
        <style>
          :root { --brand: #0ea5a4; --muted: #6b7280; }
          body { font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; color:#111827; margin:0; padding:0; position: relative; }
          .page { padding:24mm; }
          header { display:flex; align-items:center; justify-content:between; border-bottom:2px solid var(--brand); padding-bottom:12px; margin-bottom:20px; }
          .logo-container { display:flex; align-items:center; gap:12px; }
          .logo-img { width:40px; height:40px; }
          .logo-title { font-size:24px; color:var(--brand); font-weight:700; margin:0; }
          .header-right { text-align:right; }
          h1 { margin:0; font-size:18px; color:#374151; }
          .meta { color:var(--muted); font-size:12px; }
          .section { margin-top:18px; }
          .cards { display:flex; gap:12px; margin-top:12px; }
          .card { flex:1; border:1px solid #e5e7eb; padding:12px; border-radius:8px; }
          table { width:100%; border-collapse:collapse; margin-top:8px; }
          th, td { text-align:left; padding:8px; border-bottom:1px solid #e6e9ee; }
          .rec { background:#f8fafc; border-left:4px solid var(--brand); padding:10px; border-radius:6px; }
          footer { margin-top:28px; font-size:11px; color:var(--muted); border-top:1px solid #e5e7eb; padding-top:12px; }
          
          /* Watermark CSS styling */
          .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-30deg);
            font-size: 72px;
            font-weight: 900;
            color: rgba(14, 165, 164, 0.05); /* Brand color at 5% opacity */
            z-index: -1000;
            pointer-events: none;
            white-space: nowrap;
            user-select: none;
            letter-spacing: 4px;
          }
        </style>
      </head>
      <body>
        <!-- Repeating Watermark on all pages -->
        <div class="watermark">zertainity.in</div>

        <div class="page">
          <header>
            <div class="logo-container">
              ${faviconBase64 ? `<img src="${faviconBase64}" class="logo-img" alt="Logo" />` : '<div style="width:40px; height:40px; background:var(--brand); border-radius:8px;"></div>'}
              <div>
                <div class="logo-title">Zertainity</div>
                <div class="meta">zertainity.in</div>
              </div>
            </div>
            <div class="header-right">
              <h1>Assessment Report</h1>
              <div class="meta">Generated: ${new Date().toLocaleString()}</div>
            </div>
          </header>

          <div class="section">
            <strong>Student:</strong> Ananya Sharma &nbsp; | &nbsp; <strong>Grade:</strong> 12
            <div class="cards">
              <div class="card">
                <strong>Overall Match</strong>
                <div style="font-size:28px; margin-top:8px; color:var(--brand);">85%</div>
                <div class="meta" style="margin-top:6px;">Top suggested career: Software Engineer</div>
              </div>
              <div class="card">
                <strong>Recommended Streams</strong>
                <ul style="margin:8px 0 0 18px; color:var(--muted);">
                  <li>Science (Computer Science)</li>
                  <li>Mathematics</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="section">
            <strong>Subject Scores</strong>
            <table>
              <thead>
                <tr><th>Subject</th><th>Marks</th><th>Weight</th></tr>
              </thead>
              <tbody>
                <tr><td>Mathematics</td><td>92</td><td>High</td></tr>
                <tr><td>Physics</td><td>88</td><td>High</td></tr>
                <tr><td>Computer Science</td><td>95</td><td>High</td></tr>
                <tr><td>English</td><td>82</td><td>Medium</td></tr>
              </tbody>
            </table>
          </div>

          <div class="section">
            <strong>Top Recommendations</strong>
            <div style="display:grid; gap:8px; margin-top:8px;">
              <div class="rec"><strong>Software Engineer</strong> — Strong math and CS skills; recommended pathway: B.Tech / B.E. in Computer Science.</div>
              <div class="rec"><strong>Data Scientist</strong> — High analytical aptitude; consider elective statistics and projects.</div>
            </div>
          </div>

          <footer>
            This report is generated by Zertainity's assessment engine. Use it as guidance alongside counselling and academic advice.
          </footer>
        </div>
      </body>
      </html>
    `;

    const browser = await chromium.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage({ viewport: { width: 1200, height: 1600 } });
    await page.setContent(html, { waitUntil: 'networkidle' });

    const pdfBuffer = await page.pdf({ 
      format: 'A4', 
      printBackground: true, 
      margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' } 
    });
    await browser.close();

    // Load PDF Document in pdf-lib to add metadata and version
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    
    // Set Metadata
    pdfDoc.setTitle('Zertainity Career Assessment Report');
    pdfDoc.setAuthor('Zertainity');
    pdfDoc.setSubject('Career Assessment Results and Pathway Recommendation');
    pdfDoc.setKeywords(['Zertainity', 'Career Assessment', 'Report', 'Student Pathway', 'India']);
    pdfDoc.setCreator('Zertainity PDF Service');
    pdfDoc.setProducer('Zertainity PDF Engine v2.0');

    let finalPdfBytes = await pdfDoc.save();

    // Force PDF Version Header to %PDF-1.7 (maximum standard version)
    if (finalPdfBytes.length > 8) {
      const headerStr = Buffer.from(finalPdfBytes.subarray(0, 8)).toString('utf-8');
      if (headerStr.startsWith('%PDF-1.')) {
        finalPdfBytes[7] = 55; // Set the version character to '7' (ASCII 55)
      }
    }

    const outPath = path.join(outDir, 'sample-assessment.pdf');
    fs.writeFileSync(outPath, finalPdfBytes);

    console.log('PDF generated with updated metadata and version 1.7:', outPath);
  } catch (err) {
    console.error('Failed to generate PDF', err);
    process.exit(1);
  }
})();
