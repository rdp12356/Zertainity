// Runs against the locked dependency tree; fails the release gate for high/critical advisories.
const { spawnSync } = require("node:child_process");

const result = spawnSync("npm", ["audit", "--json"], {
  encoding: "utf8",
  maxBuffer: 12 * 1024 * 1024,
});
if (result.error || !result.stdout) {
  console.error("npm audit failed to produce results:", result.error?.message || result.stderr);
  process.exit(2);
}

let report;
try {
  report = JSON.parse(result.stdout);
} catch {
  console.error("npm audit produced invalid JSON; audit could not be verified");
  process.exit(2);
}
if (report.error || !report.vulnerabilities) {
  console.error("npm audit unavailable:", report.error?.summary || "missing vulnerabilities section");
  process.exit(2);
}

const advisories = Object.entries(report.vulnerabilities).map(([name, item]) => ({
  name,
  severity: item.severity,
  range: item.range,
  direct: item.isDirect,
  fix: typeof item.fixAvailable === "object"
    ? `${item.fixAvailable.name}@${item.fixAvailable.version}${item.fixAvailable.isSemVerMajor ? " (major)" : ""}`
    : item.fixAvailable === true ? "compatible update" : "manual review",
})).sort((a, b) => {
  const rank = { critical: 0, high: 1, moderate: 2, low: 3, info: 4 };
  return (rank[a.severity] ?? 9) - (rank[b.severity] ?? 9);
});
console.log("npm audit (locked dependencies):");
console.table(advisories);
console.log("Totals:", JSON.stringify(report.metadata?.vulnerabilities || {}));
if (advisories.some((item) => ["critical", "high"].includes(item.severity))) {
  console.error("Release blocked: high or critical dependency advisories remain.");
  process.exitCode = 1;
}
