const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Replace static imports with lazy
code = code.replace(/import ([A-Z][a-zA-Z0-9_]*) from "\.\/pages\/([^"]+)";/g, 'const $1 = lazy(() => import("./pages/$2"));');

// Add Suspense and lazy to react imports
if (code.includes('import { useEffect, useState } from "react";')) {
  code = code.replace('import { useEffect, useState } from "react";', 'import { useEffect, useState, lazy, Suspense } from "react";');
}

// Ensure the first Routes block (for Admin subdomain) is wrapped in Suspense
if (!code.includes('<Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div></div>}>\n          <Routes>\n            <Route path="/" element={<Admin />} />')) {
  code = code.replace(
    '          <Routes>\n            <Route path="/" element={<Admin />} />\n            <Route path="*" element={<NotFound />} />\n          </Routes>',
    '          <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div></div>}>\n            <Routes>\n              <Route path="/" element={<Admin />} />\n              <Route path="*" element={<NotFound />} />\n            </Routes>\n          </Suspense>'
  );
}

// Wrap the main Routes block with Suspense
if (!code.includes('<Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div></div>}>\n          <Routes>\n            <Route path="/" element={isAdminSubdomain ? <Admin /> : <Index />} />')) {
  code = code.replace(
    /        <Routes>\n          <Route path="\/" element=\{isAdminSubdomain \? <Admin \/> : <Index \/>\} \/>/,
    '        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div></div>}>\n          <Routes>\n            <Route path="/" element={isAdminSubdomain ? <Admin /> : <Index />} />'
  );
  
  code = code.replace(
    /          \{\/\* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "\*" ROUTE \*\/}\n          <Route path="\*" element=\{<NotFound \/>\} \/>\n        <\/Routes>/,
    '          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}\n            <Route path="*" element={<NotFound />} />\n          </Routes>\n        </Suspense>'
  );
}

fs.writeFileSync('src/App.tsx', code);
