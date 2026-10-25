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
  return { response, text };
}

async function main() {
  const home = await get("/");
  assert(/<title>[^<]+<\/title>/i.test(home.text), "Homepage lacks an HTML title");
  assert(/<meta\s+name=["']description["']/i.test(home.text), "Homepage lacks an HTML description");
  const robots = await get("/robots.txt");
  assert(robots.text.includes("Sitemap: https://www.zertainity.in/sitemap.xml"), "Production robots.txt sitemap reference is wrong");
  const sitemap = await get("/sitemap.xml");
  assert(sitemap.text.includes("https://www.zertainity.in/careers"), "Missing careers URLs in production sitemap");
  assert(!sitemap.text.includes("<loc>https://www.zertainity.in/results</loc>"), "Private results are present in sitemap");
  for (const page of ["/careers", "/exams", "/quiz"]) {
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
