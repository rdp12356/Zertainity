const fs = require('fs');
const path = require('path');
const markdownpdf = require('markdown-pdf');

let mdContent = '# Zertainity Platform Updates & Architecture Overview\n\n';
mdContent += 'This document outlines the recent implementations added to the Zertainity platform. We have focused heavily on **Advanced Security Hardening** and adding extensive **Non-AI Features** for student utility.\n\n';

mdContent += '## 1. Aggressive Security & Performance Hardening\n\n';
mdContent += 'To ensure that the platform cannot be easily hacked, replicated, or reverse-engineered by malicious users or scrapers, we deployed several layers of strict defense:\n\n';

mdContent += '### Build-Level JavaScript Obfuscation & Minification\n';
mdContent += '- **What it does**: Before the website goes live, the entire source code is heavily scrambled, compressed, and mangled. Variable names are shortened to hexadecimal hashes, and strings/functions are shuffled.\n';
mdContent += '- **Why it matters**: If a professional hacker tries to download the website source files, they will only see unintelligible code that is impossible to read or copy.\n\n';

mdContent += '### Advanced DevTools Blocking & Anti-Tampering\n';
mdContent += '- **What it does**: Active logic constantly monitors the user’s browser. It completely disables the **Right-Click / Context Menu**, blocks keyboard shortcuts like `F12`, `Ctrl+Shift+I` (Inspect), `Ctrl+Shift+J` (Console), and `Ctrl+U` (View Source).\n';
mdContent += '- **Why it matters**: If someone tries to force the Developer Tools open to analyze how the app works, a hidden infinite `debugger` loop will intentionally freeze and crash the application, sending them into an automatic reload loop.\n\n';

mdContent += '### Local Data Encryption (AES-Cryptography)\n';
mdContent += '- **What it does**: User data such as Bookmarks and Portfolios are stored offline in their browser. However, instead of storing it as plain text, we encrypt the data using the `crypto-js` AES algorithm with a hidden internal secret key.\n';
mdContent += '- **Why it matters**: Malicious extensions or scripts scanning the user’s cookies and storage will only see gibberish hashes instead of readable personal information.\n\n';

mdContent += '### Network Compression (Brotli & Gzip)\n';
mdContent += '- **What it does**: The entire application bundle is compressed heavily at the server level.\n';
mdContent += '- **Why it matters**: This guarantees that the website loads instantly, even on slower rural network connections.\n\n';


mdContent += '---\n\n';


mdContent += '## 2. New Student Features (Deterministic System)\n\n';

mdContent += 'We added completely deterministic, high-value tools that do not depend on external AI mentorship or premium paywalls, keeping the core app robust and fully accessible.\n\n';

mdContent += '### The Extracurricular Portfolio Builder\n';
mdContent += '- **Functionality**: A structured dashboard where students can log and organize their non-academic achievements (e.g., Sports, Clubs, Volunteer Work, Awards).\n';
mdContent += '- **Architecture**: Accessible directly from the Profile page. Data is saved directly to the user’s encrypted local storage.\n';
mdContent += '- **User Benefit**: Helps students build a holistic profile for college applications, ensuring they don’t forget critical milestones over their school years.\n\n';

mdContent += '### Seamless College Bookmarking Engine\n';
mdContent += '- **Functionality**: Integrated into the *College Finder* view. Students can click a “Save” button on any college card (e.g., IITs, NITs, Central Universities) to instantly add the institution to their personal shortlist.\n';
mdContent += '- **Architecture**: Saved states are universally managed offline in encrypted fast-storage. Students can view all their saved colleges via an aggregated dashboard on the Profile page without needing an internet connection to load the list.\n';
mdContent += '- **User Benefit**: Simplifies tracking target universities and organizing their admission roadmap.\n\n';

mdContent += '### Interactive Scholarships & Financial Aid Finder\n';
mdContent += '- **Functionality**: A dedicated, searchable database of active Indian government and private scholarships (e.g., NTSE, KVPY, Reliance Foundation, CBSE Merit).\n';
mdContent += '- **Architecture**: Built with highly responsive, real-time filtering (by Category, Keyword, and Means/Merit-Based filters). Highlighted via a premium banner on the main landing page to encourage use.\n';
mdContent += '- **User Benefit**: Demystifies funding opportunities, helping students from diverse backgrounds discover grants and stipends that match their educational level.\n\n';

mdContent += '---\n\n';

mdContent += '*Generated automatically by Zertainity system tools.*';

const mdOutPath = path.join(__dirname, 'Overview.md');
fs.writeFileSync(mdOutPath, mdContent);

console.log('Markdown generated. Now converting to PDF...');

markdownpdf()
    .from(mdOutPath)
    .to(path.join(__dirname, 'Zertainity_Overview.pdf'), function () {
        console.log('PDF Generation Complete: Zertainity_Overview.pdf');
    });
