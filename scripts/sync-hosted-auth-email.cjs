#!/usr/bin/env node
/**
 * Safe Supabase hosted Auth email template sync.
 * - Dry-run by default. --apply requires an explicitly supplied management token.
 * - Changes ONLY 13 HTML template content fields, never sender settings, secrets,
 *   email notification enablement, subjects, rate limits or redirect configuration.
 * - Compares against the current hosted configuration to avoid unnecessary writes.
 *
 * Read https://supabase.com/docs/guides/auth/auth-email-templates before using.
 */
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const baseDir = path.resolve(__dirname, "..");
const sourceDir = path.join(baseDir, "supabase", "templates", "auth");

const authTypes = ["confirmation", "invite", "recovery", "magic_link", "email_change", "reauthentication"];
const notificationTypes = [
  "password_changed", "email_changed", "phone_changed",
  "identity_linked", "identity_unlinked", "mfa_factor_enrolled", "mfa_factor_unenrolled",
];

function configKey(type) {
  return "mailer_templates_" + type + (notificationTypes.includes(type) ? "_notification" : "") + "_content";
}

function expectedTemplates() {
  const result = {};
  for (const type of [...authTypes, ...notificationTypes]) {
    const fullPath = path.join(sourceDir, type + ".html");
    const html = fs.readFileSync(fullPath, "utf8");
    if (!html.includes("https://www.zertainity.in/zertainity-email-logo.png"))
      throw new Error(type + ": official hosted logo not present");
    if (!html.includes('alt="Zertainity logo"') || /<script\b/i.test(html))
      throw new Error(type + ": unsafe or inaccessible template");
    const imageCount = (html.match(/<img\b/gi) || []).length;
    if (imageCount !== 1) throw new Error(type + ": unexpected image count " + imageCount);
    if (type === "reauthentication") {
      if (!html.includes("{{ .Token }}")) throw new Error(type + ": OTP placeholder missing");
    } else if (authTypes.includes(type)) {
      if (!html.includes("{{ .ConfirmationURL }}"))
        throw new Error(type + ": confirmation token URL missing");
    }
    result[configKey(type)] = html;
  }
  return result;
}

async function main() {
  const apply = process.argv.includes("--apply");
  const args = process.argv.filter(x => x.startsWith("--"));
  if (args.some(x => x !== "--apply" && x !== "--help"))
    throw new Error("Supported flags: --apply, --help");
  if (args.includes("--help")) {
    console.log("Usage: node scripts/sync-hosted-auth-email.cjs [--apply]");
    console.log("Dry-run without access: validate local templates only.");
    console.log("SUPABASE_ACCESS_TOKEN + SUPABASE_PROJECT_REF: compare hosted templates.");
    console.log("--apply: patch only mismatched hosted HTML template content.");
    return;
  }

  const templates = expectedTemplates();
  const token = process.env.SUPABASE_ACCESS_TOKEN;
  const projectRef = process.env.SUPABASE_PROJECT_REF;
  console.log("Validated " + Object.keys(templates).length + " local email HTML templates.");
  if (!token || !projectRef) {
    if (apply) throw new Error("SUPABASE_ACCESS_TOKEN and SUPABASE_PROJECT_REF required for --apply");
    console.log("No management credentials supplied; read-only local validation completed.");
    return;
  }
  if (!/^[a-z0-9]{20}$/.test(projectRef)) throw new Error("Invalid Supabase project ref");
  const url = "https://api.supabase.com/v1/projects/" + projectRef + "/config/auth";
  const headers = {Authorization: "Bearer " + token, Accept: "application/json"};
  const response = await fetch(url, {method: "GET", headers, signal: AbortSignal.timeout(20000)});
  if (!response.ok) throw new Error("Supabase auth configuration read failed (HTTP " + response.status + ")");
  const remote = await response.json();
  const changes = Object.fromEntries(Object.entries(templates).filter(([key, value]) => remote[key] !== value));
  console.log("Hosted templates differing: " + Object.keys(changes).length + " / " + Object.keys(templates).length);
  for (const key of Object.keys(changes)) console.log("  " + key);

  if (!apply) {
    console.log("Dry run; no hosted settings changed. Pass --apply when authorized.");
    return;
  }
  if (!Object.keys(changes).length) {
    console.log("Already synchronized. No changes needed.");
    return;
  }
  const patch = await fetch(url, {
    method: "PATCH",
    headers: {...headers, "Content-Type": "application/json"},
    body: JSON.stringify(changes),
    signal: AbortSignal.timeout(30000),
  });
  if (!patch.ok) throw new Error("Supabase Auth template patch failed (HTTP " + patch.status + ")");
  const verify = await fetch(url, {method: "GET", headers, signal: AbortSignal.timeout(20000)});
  if (!verify.ok) throw new Error("Patch completed but verification GET failed (HTTP " + verify.status + ")");
  const updated = await verify.json();
  const mismatches = Object.entries(templates).filter(([key, value]) => updated[key] !== value).map(([key]) => key);
  if (mismatches.length) throw new Error("Template verification failed: " + mismatches.join(", "));
  console.log("All 13 hosted email HTML templates verified after update.");
  console.log("Subjects, SMTP configuration, auth policies and notification toggles left unchanged.");
}

main().catch(err => {console.error("Hosted Auth sync failed: " + err.message); process.exitCode = 1;});
