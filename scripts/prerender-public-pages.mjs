import fs from "node:fs";
import path from "node:path";
import React from "react";
import { renderToString } from "react-dom/server";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { createServer } from "vite";

const rootDir = process.cwd();
const distDir = path.join(rootDir, "dist");
const templatePath = path.join(distDir, "index.html");
const template = fs.readFileSync(templatePath, "utf8");

const vite = await createServer({
  configFile: path.join(rootDir, "vite.config.ts"),
  mode: "production",
  server: { middlewareMode: true, hmr: false },
  appType: "custom",
});

try {
  const [{ CurvesProvider }, { TooltipProvider }, { Footer }] = await Promise.all([
    vite.ssrLoadModule("/src/components/CurvesContext.tsx"),
    vite.ssrLoadModule("/src/components/ui/tooltip.tsx"),
    vite.ssrLoadModule("/src/components/Footer.tsx"),
  ]);

  const pages = [
    { url: "/", route: "/", module: "/src/pages/Index.tsx", output: "index.html", ads: true },
    { url: "/careers/software-engineer", route: "/careers/:slug", module: "/src/pages/CareerRolePage.tsx", output: "careers/software-engineer/index.html" , ads: true },
    { url: "/careers/doctor-mbbs", route: "/careers/:slug", module: "/src/pages/CareerRolePage.tsx", output: "careers/doctor-mbbs/index.html" , ads: true },
    { url: "/careers/chartered-accountant-ca", route: "/careers/:slug", module: "/src/pages/CareerRolePage.tsx", output: "careers/chartered-accountant-ca/index.html" , ads: true },
    { url: "/careers/civil-services-ias-ips-ifs", route: "/careers/:slug", module: "/src/pages/CareerRolePage.tsx", output: "careers/civil-services-ias-ips-ifs/index.html" , ads: true },
    { url: "/careers/data-scientist", route: "/careers/:slug", module: "/src/pages/CareerRolePage.tsx", output: "careers/data-scientist/index.html" , ads: true },
    { url: "/careers/ai-ml-engineer", route: "/careers/:slug", module: "/src/pages/CareerRolePage.tsx", output: "careers/ai-ml-engineer/index.html" , ads: true },
    { url: "/careers/architect", route: "/careers/:slug", module: "/src/pages/CareerRolePage.tsx", output: "careers/architect/index.html" , ads: true },
    { url: "/careers/investment-banker", route: "/careers/:slug", module: "/src/pages/CareerRolePage.tsx", output: "careers/investment-banker/index.html" , ads: true },
    { url: "/about", route: "/about", module: "/src/pages/About.tsx", output: "about/index.html" },
    { url: "/contact", route: "/contact", module: "/src/pages/Contact.tsx", output: "contact/index.html" },
    { url: "/privacy-policy", route: "/privacy-policy", module: "/src/pages/PrivacyPolicy.tsx", output: "privacy-policy/index.html" },
    { url: "/terms-of-service", route: "/terms-of-service", module: "/src/pages/TermsOfService.tsx", output: "terms-of-service/index.html" },
    { url: "/disclaimer", route: "/disclaimer", module: "/src/pages/Disclaimer.tsx", output: "disclaimer/index.html" },
  ];

  for (const page of pages) {
    const { default: Page } = await vite.ssrLoadModule(page.module);
    const helmetContext = {};
    const tree = React.createElement(
      HelmetProvider,
      { context: helmetContext },
      React.createElement(
        CurvesProvider,
        null,
        React.createElement(
          TooltipProvider,
          null,
          React.createElement(
            MemoryRouter,
            { initialEntries: [page.url] },
            React.createElement(
              React.Fragment,
              null,
              React.createElement(
                Routes,
                null,
                React.createElement(Route, {
                  path: page.route,
                  element: React.createElement(Page),
                }),
              ),
              React.createElement(Footer),
            ),
          ),
        ),
      ),
    );

    const markup = renderToString(tree);
    if (markup.length < 800 || !markup.includes("<")) {
      throw new Error("Prerender produced unexpectedly little HTML for " + page.url);
    }

    const helmet = helmetContext.helmet;
    let html = template.replace(/<title>[\s\S]*?<\/title>/i, helmet?.title?.toString() || "");
    html = html.replace(/<meta name="description"[^>]*>\s*/i, "");
    html = html.replace(/<meta name="keywords"[^>]*>\s*/i, "");
    html = html.replace(/<meta property="og:[^"]+"[^>]*>\s*/gi, "");
    html = html.replace(/<meta name="twitter:[^"]+"[^>]*>\s*/gi, "");
    html = html.replace(/<meta name="robots"[^>]*>\s*/gi, "");
    html = html.replace(/<link rel="canonical"[^>]*>\s*/gi, "");

    const headTags = [
      helmet?.meta?.toString?.() || "",
      helmet?.link?.toString?.() || "",
      helmet?.script?.toString?.() || "",
      page.ads && process.env.VITE_ADSENSE_CLIENT_ID
        ? '<script async id="zertainity-adsbygoogle" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + process.env.VITE_ADSENSE_CLIENT_ID.trim() + '" crossorigin="anonymous"></script>'
        : "",
    ].filter(Boolean).join("\n");
    html = html.replace("</head>", headTags + "\n</head>");
    html = html.replace('<div id="root"></div>', '<div id="root" data-prerendered="true">' + markup + "</div>");

    const outputPath = path.join(distDir, page.output);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, html, "utf8");
    process.stdout.write("Prerendered " + page.url + " -> " + page.output + " (" + markup.length + " chars)\n");
  }
} finally {
  await vite.close();
}
