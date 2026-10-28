// Run after a Cloudflare production deployment: node scripts/verify-live-cloudflare.cjs
const assert = require("node:assert/strict");
const origin = "https://www.zertainity.in";

async function get(path) {
  const response = await fetch(origin + path, {
    redirect: "follow",
    signal: AbortSignal.timeout(20000),
    headers: { "User-Agent": "Zertainity-production-release-smoke/1.0" },
  });
  const text = await response.text();
  assert.equal(response.status, 200, path + " did not return HTTP 200 (got " + response.status + ")");
  assert(!/<title>Just a moment/i.test(text), path + " returned a Cloudflare bot challenge");
  return { response, text };
}

async function main() {
  const home = await get("/");
  assert(/<title>[^<]+<\/title>/i.test(home.text), "Homepage lacks an HTML title");
  assert(/<meta\s+name=["']description["']/i.test(home.text), "Homepage lacks an HTML description");
  const ads = await get("/ads.txt");
  assert(/text\/plain/i.test(ads.response.headers.get("content-type") || ""),
    "Live ads.txt must be served as text, not a SPA fallback");
  assert(ads.text.trim().includes("google.com, pub-4407603057931203, DIRECT, f08c47fec0942fa0"),
    "Live ads.txt publisher does not match the verified site declaration");
  const robots = await get("/robots.txt");
  assert(robots.text.includes("Sitemap: https://www.zertainity.in/sitemap.xml"), "Production robots.txt sitemap reference is wrong");
  const sitemap = await get("/sitemap.xml");
  assert(sitemap.text.includes("https://www.zertainity.in/careers"), "Missing careers URLs in production sitemap");
  assert(!sitemap.text.includes("<loc>https://www.zertainity.in/results</loc>"), "Private results are present in sitemap");
  for (const page of ["/careers", "/exams", "/about", "/contact", "/methodology", "/privacy-policy", "/terms-of-service", "/quiz"]) {
    await get(page);
  }
  for (const page of ["/results", "/auth", "/admin", "/r/testing-noindex"]) {
    const { response } = await get(page);
    assert((response.headers.get("x-robots-tag") || "").includes("noindex"), "Missing Cloudflare noindex header: " + page);
  }
  console.log("PASS: live Cloudflare SEO smoke checks, public routes and private noindex headers");
}
main().catch((error) => {
  console.error("Production smoke test failed:", error.message);
  process.exitCode = 1;
});
