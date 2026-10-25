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
// Private page noindex needs to be visible to crawlers, not blocked in robots.txt.
assert(!robots.includes("Disallow:"), "Robots rules hide private-page noindex");
const vercel = JSON.parse(fs.readFileSync("vercel.json", "utf8"));
for (const route of ["/admin","/dashboard","/auth","/reset-password","/settings","/results","/setup","/grade-selection","/subject-selection","/subject-quiz","/marks-entry"]) {
  const match = vercel.headers?.find((rule) => rule.source === route);
  assert(match?.headers?.some((h) => h.key.toLowerCase() === "x-robots-tag" && /noindex/.test(h.value)), "Missing noindex header: " + route);
}
assert(vercel.headers?.some((rule) => rule.source === "/r/(.*)" && rule.headers?.some((h) => h.key.toLowerCase() === "x-robots-tag" && /noindex/.test(h.value))), "Missing noindex on share links");
// Cloudflare Pages is the primary deployment target; Vercel headers alone do not suffice.
const pagesHeaders = fs.readFileSync("public/_headers", "utf8");
const pagesRedirects = fs.readFileSync("public/_redirects", "utf8");
for (const route of ["/admin","/dashboard","/auth","/reset-password","/settings","/results","/setup","/grade-selection","/subject-selection","/subject-quiz","/marks-entry","/r/*"]) {
  const escaped = route.replace(/[.*+?^${}()|[\]\\]/g, "\\console.log("SEO checks passed:"");
  const pattern = new RegExp("^" + escaped + "\\n\\s+X-Robots-Tag: noindex", "m");
  assert(pattern.test(pagesHeaders), "Cloudflare Pages is missing noindex for " + route);
}
assert(!/^\\/\\*\\s+\\/index\\.html\\s+200\\s*$/m.test(pagesRedirects), "Blanket SPA rewrite takes precedence over Cloudflare noindex response headers");
console.log("SEO checks passed:", locs.length, "unique URLs");
