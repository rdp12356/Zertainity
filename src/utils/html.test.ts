import { escapeHtml, escapeHtmlAttribute, sanitizePdfFilename } from './html';

describe('HTML escaping utilities', () => {
  it('escapes characters that can break out of text nodes', () => {
    expect(escapeHtml('<script>alert("x")</script> & ok')).toBe('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; ok');
  });

  it('escapes attribute-breaking characters', () => {
    expect(escapeHtmlAttribute('a" onerror="alert(1)')).toBe('a&quot; onerror=&quot;alert(1)');
  });

  it('normalizes unsafe PDF filenames', () => {
    expect(sanitizePdfFilename('../evil<report>.pdf')).toBe('evil_report_.pdf');
  });
});
