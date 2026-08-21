const fs = require("fs");
const path = require("path");

const detailsDir = path.join(__dirname, "..", "src", "data", "career_details");
const files = fs.readdirSync(detailsDir).filter((f) => f.endsWith(".ts") && f !== "types.ts");

const careerSlugs = [];

files.forEach((file) => {
  const content = fs.readFileSync(path.join(detailsDir, file), "utf-8");
  const regex = /"([^"]+)":\s*\{\s*listName:/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    careerSlugs.push(match[1]);
  }
});

careerSlugs.sort();

const dateStr = "2026-08-18";

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <!-- Core discovery pages -->
  <url>
    <loc>https://www.zertainity.in/</loc>
    <lastmod>${dateStr}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="en-IN" href="https://www.zertainity.in/" />
  </url>
  <url>
    <loc>https://www.zertainity.in/education-level</loc>
    <lastmod>${dateStr}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.95</priority>
    <xhtml:link rel="alternate" hreflang="en-IN" href="https://www.zertainity.in/education-level" />
  </url>
  <url>
    <loc>https://www.zertainity.in/quiz</loc>
    <lastmod>${dateStr}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.95</priority>
    <xhtml:link rel="alternate" hreflang="en-IN" href="https://www.zertainity.in/quiz" />
  </url>
  <url>
    <loc>https://www.zertainity.in/results</loc>
    <lastmod>${dateStr}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <xhtml:link rel="alternate" hreflang="en-IN" href="https://www.zertainity.in/results" />
  </url>

  <!-- High-intent exploration pages -->
  <url>
    <loc>https://www.zertainity.in/careers</loc>
    <lastmod>${dateStr}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.95</priority>
    <xhtml:link rel="alternate" hreflang="en-IN" href="https://www.zertainity.in/careers" />
  </url>
  <url>
    <loc>https://www.zertainity.in/compare</loc>
    <lastmod>${dateStr}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.92</priority>
    <xhtml:link rel="alternate" hreflang="en-IN" href="https://www.zertainity.in/compare" />
  </url>
  <url>
    <loc>https://www.zertainity.in/pathways</loc>
    <lastmod>${dateStr}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.88</priority>
    <xhtml:link rel="alternate" hreflang="en-IN" href="https://www.zertainity.in/pathways" />
  </url>
  <url>
    <loc>https://www.zertainity.in/exams</loc>
    <lastmod>${dateStr}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.88</priority>
    <xhtml:link rel="alternate" hreflang="en-IN" href="https://www.zertainity.in/exams" />
  </url>
  <url>
    <loc>https://www.zertainity.in/methodology</loc>
    <lastmod>${dateStr}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
    <xhtml:link rel="alternate" hreflang="en-IN" href="https://www.zertainity.in/methodology" />
  </url>

  <!-- Individual In-Depth Sourced Career Guides -->
`;

careerSlugs.forEach((slug) => {
  xml += `  <url>
    <loc>https://www.zertainity.in/careers/${slug}</loc>
    <lastmod>${dateStr}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
    <xhtml:link rel="alternate" hreflang="en-IN" href="https://www.zertainity.in/careers/${slug}" />
  </url>\n`;
});

xml += `
  <!-- Trust & Platform Pages -->
  <url>
    <loc>https://www.zertainity.in/about</loc>
    <lastmod>${dateStr}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
    <xhtml:link rel="alternate" hreflang="en-IN" href="https://www.zertainity.in/about" />
  </url>
  <url>
    <loc>https://www.zertainity.in/contact</loc>
    <lastmod>${dateStr}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
    <xhtml:link rel="alternate" hreflang="en-IN" href="https://www.zertainity.in/contact" />
  </url>
  <url>
    <loc>https://www.zertainity.in/privacy-policy</loc>
    <lastmod>${dateStr}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
    <xhtml:link rel="alternate" hreflang="en-IN" href="https://www.zertainity.in/privacy-policy" />
  </url>
  <url>
    <loc>https://www.zertainity.in/terms-of-service</loc>
    <lastmod>${dateStr}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
    <xhtml:link rel="alternate" hreflang="en-IN" href="https://www.zertainity.in/terms-of-service" />
  </url>
  <url>
    <loc>https://www.zertainity.in/disclaimer</loc>
    <lastmod>${dateStr}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
    <xhtml:link rel="alternate" hreflang="en-IN" href="https://www.zertainity.in/disclaimer" />
  </url>
</urlset>
`;

const sitemapPath = path.join(__dirname, "..", "public", "sitemap.xml");
fs.writeFileSync(sitemapPath, xml.trim(), "utf-8");
console.log(`✅ Generated sitemap with ${careerSlugs.length} career detail URLs at ${sitemapPath}`);
