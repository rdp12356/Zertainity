const fs = require("node:fs");
const assert = require("node:assert/strict");
const read = (path) => fs.readFileSync(path, "utf8");

const html = read("index.html");
const ads = read("public/ads.txt");
const logo = read("src/components/Logo.tsx");
const auth = read("src/pages/Auth.tsx");
const recovery = read("src/pages/ResetPassword.tsx");
const app = read("src/App.tsx");
const adUnit = read("src/components/AdUnit.tsx");
const consent = read("src/components/CookieConsent.tsx");
const privacy = read("src/pages/PrivacyPolicy.tsx");
const footer = read("src/components/Footer.tsx");
const robots = read("public/robots.txt");

const adsense = html.match(/name="google-adsense-account" content="(ca-pub-[0-9]{16})"/);
assert(adsense, "Missing or malformed AdSense ownership meta tag");
assert(ads.includes(`google.com, ${adsense[1].replace("ca-", "")}, DIRECT, f08c47fec0942fa0`), "ads.txt does not authorize the head meta publisher");
assert(html.includes('href="/favicon.svg"') && fs.existsSync("public/favicon.svg"), "SVG browser icon missing");
assert(html.includes('rel="apple-touch-icon" href="/favicon.png"') && fs.existsSync("public/favicon.png"), "Apple touch fallback missing");
assert(logo.includes('src="/favicon.svg"'), "App logo and browser favicon must match");
assert(!html.includes("zdrqfllzydwsqbjjqgks"), "Remove the obsolete Supabase preconnect");
assert(robots.includes("Sitemap: https://www.zertainity.in/sitemap.xml"), "Crawlers need a public sitemap");

assert(footer.includes('path: "/education-level"'), "Footer group link must lead to an existing route");
assert(!footer.includes('path: "/platform"'), "Dead footer URL");
assert(footer.includes('mailto:support@zertainity.in'), "Use working support contact");

assert(auth.includes('.in("role", ["owner", "admin"])'), "Studio sign-in must verify current database roles");
assert(auth.includes('emailRedirectTo: `${window.location.origin}/`'), "Signup confirmation must use the existing allowed site callback");
assert(auth.includes('redirectTo: `${window.location.origin}/reset-password`'), "Password resets need a dedicated callback");
assert(auth.includes('redirectTo: `${window.location.origin}/`'), "OAuth callbacks must use the existing allowed site destination");
assert(auth.includes('await supabase.auth.signOut()'), "Deny unauthorized Studio sessions");
assert(auth.includes('get("view") === "forgot"'), "Reset-link retry must open the recovery request screen");
assert(recovery.includes('supabase.auth.getSession()'), "Recover sessions even when the recovery event fired before mount");
assert(recovery.includes('event === "PASSWORD_RECOVERY"'), "Retain actual password recovery event handling");
assert(recovery.includes('query.get("error_code")') && recovery.includes('hash.get("error_code")'), "Handle expired recovery redirects");
assert(recovery.includes('navigate("/auth?view=forgot")'), "Expired recovery links must offer a working retry");
assert(recovery.includes('finally {') && recovery.includes('setLoading(false)'), "Reset submission must clear loading on network failure");
assert(app.includes('window.cancelIdleCallback(idleId)') && app.includes('window.clearTimeout(timeoutId)'), "Delayed ad scripts must be cancelled on route changes");
assert(app.includes('window.location.hostname !== "admin.zertainity.in"'), "No ads in Studio");
assert(adUnit.includes('if (isDisabled) return null;') && !adUnit.includes('ca-pub-0000000000000000'), "Do not send placeholder ad IDs");
assert(html.includes('localStorage.getItem("zertainity_optional_cookies") !== "accepted"'), "Analytics must not load without consent");
assert(html.includes('window.addEventListener("zertainity:tracking-consent", loadAnalytics)'), "Consent should activate optional analytics");
assert(app.includes('trackingAllowed') && app.includes('if (!trackingAllowed)'), "AdSense must require consent");
assert(app.includes('<CookieConsent />'), "Public site needs privacy controls");
assert(consent.includes('Reject optional cookies') && consent.includes('Accept optional cookies'), "Both cookie choices must be present");
assert(footer.includes('zertainity:open-cookie-settings'), "Allow changes to cookie preferences");
assert(privacy.includes('only after optional-cookie consent'), "Disclosures must reflect tracker behavior");

console.log("PASS: auth callbacks, Studio RBAC, branding and AdSense readiness invariants");
