const fs = require("node:fs");
const assert = require("node:assert/strict");
const cp = require("node:child_process");

cp.execFileSync(process.execPath, ["scripts/generate-sitemap.cjs"], { stdio: "inherit" });
const xml = fs.readFileSync("public/sitemap.xml", "utf8");
const robots = fs.readFileSync("public/robots.txt", "utf8");
const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
assert(locs.length > 10, "Sitemap contains too few URLs");
assert.equal(locs.length, new Set(locs).size, "Sitemap has duplicate URLs");
assert(locs.includes("https://www.zertainity.in/quiz"), "Public quiz entry missing");
for (const url of locs) {
  const parsed = new URL(url);
  assert.equal(parsed.origin, "https://www.zertainity.in", "Unexpected sitemap origin");
  assert(!/^\/(?:admin|auth|dashboard|results|settings|reset-password)(?:\/|$)/.test(parsed.pathname), "Private route in sitemap: " + url);
  assert(!/[?#]/.test(url), "Sitemap URL must be clean: " + url);
}
assert(robots.includes("Sitemap: https://www.zertainity.in/sitemap.xml"), "robots.txt sitemap URL mismatch");
for (const path of ["/admin", "/auth", "/dashboard", "/results"]) {
  assert(robots.includes("Disallow: " + path), "Missing crawler exclusion: " + path);
}
console.log("SEO checks passed:", locs.length, "unique URLs");
