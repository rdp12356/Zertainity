const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/** Escape untrusted text before interpolating it into an HTML template. */
export function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(/[&<>"']/g, (char) => HTML_ESCAPE_MAP[char]);
}

/** Alias kept for call sites that interpolate into quoted HTML attributes. */
export function escapeHtmlAttribute(value: unknown): string {
  return escapeHtml(value);
}

/** Keep generated download names as a plain local PDF filename. */
export function sanitizePdfFilename(value: unknown, fallback = 'zertainity-report.pdf'): string {
  const baseName = String(value ?? '')
    .split(/[\\/]+/)
    .pop()
    ?.replace(/[^a-zA-Z0-9._-]+/g, '_')
    .replace(/^\.+/, '')
    .slice(0, 120);

  if (!baseName) return fallback;
  return baseName.toLowerCase().endsWith('.pdf') ? baseName : `${baseName}.pdf`;
}
