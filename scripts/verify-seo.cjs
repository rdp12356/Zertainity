const fs = require("node:fs");
const assert = require("node:assert/strict");
const cp = require("node:child_process");

cp.execFileSync(process.execPath, ["scripts/generate-sitemap.cjs"], { stdio: "inherit" });
const xml = fs.readFileSync("public/sitemap.xml", "utf8");
const robots = fs.readFileSync("public/robots.txt", "utf8");
const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

assert(locs.length > 10, "Sitemap contains too few URLs");
assert.equal(locs.length, new Set(locs).size, "Sitemap contains duplicate URLs");
assert(locs.includes("https://www.zertainity.in/quiz"), "Public quiz route missing");
for (const url of locs) {
  const parsed = new URL(url);
  assert.equal(parsed.origin, "https://www.zertainity.in", "Unexpected sitemap origin");
  assert(!/^\/(?:admin|auth|dashboard|results|settings|reset-password)(?:\/|$)/.test(parsed.pathname), "Private sitemap route: " + url);
  assert(!/[?#]/.test(url), "Sitemap URLs must not contain queries or fragments");
}

assert(robots.includes("Sitemap: https://www.zertainity.in/sitemap.xml"), "Incorrect sitemap location in robots.txt");
assert(!robots.includes("Disallow:"), "robots.txt must allow crawlers to read noindex on private pages");

const restrictedRoutes = [
  "/admin", "/dashboard", "/auth", "/reset-password", "/settings",
  "/results", "/setup", "/grade-selection", "/subject-selection",
  "/subject-quiz", "/marks-entry"
];
const headers = fs.readFileSync("public/_headers", "utf8");
const redirects = fs.readFileSync("public/_redirects", "utf8");
for (const route of [...restrictedRoutes, "/r/*"]) {
  assert(headers.includes("\n" + route + "\n  X-Robots-Tag: noindex, nofollow"), "Missing Cloudflare Pages noindex: " + route);
}
assert(!redirects.split("\n").some((line) => /^\/\*\s+\/index\.html\s+200\s*$/.test(line.trim())), "Wildcard Pages rewrite overrides noindex headers");

const vercel = JSON.parse(fs.readFileSync("vercel.json", "utf8"));
for (const route of restrictedRoutes) {
  const rule = vercel.headers?.find((item) => item.source === route);
  assert(rule?.headers?.some((header) => header.key.toLowerCase() === "x-robots-tag" && /noindex/.test(header.value)), "Missing Vercel fallback noindex: " + route);
}
assert(vercel.headers?.some((rule) => rule.source === "/r/(.*)" && rule.headers?.some((header) => header.key.toLowerCase() === "x-robots-tag" && /noindex/.test(header.value))), "Missing Vercel share route noindex");

console.log("SEO checks passed:", locs.length, "unique sitemap URLs and route-level rules");
