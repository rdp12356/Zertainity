const fs = require('fs');
const url = 'http://localhost:8001/generate-pdf';
const html = `<!doctype html><html><body><h1>Hello PDF</h1><p>This is a test.</p></body></html>`;

(async () => {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html })
    });
    if (!res.ok) {
      const text = await res.text();
      console.error('Server error', res.status, text);
      process.exit(1);
    }
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync('test.pdf', buf);
    console.log('Wrote test.pdf,', buf.length, 'bytes');
  } catch (e) {
    console.error('Request failed', e);
    process.exit(2);
  }
})();
