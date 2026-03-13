const fs = require('fs');
const path = require('path');
const markdownpdf = require('markdown-pdf');

const filesToInclude = [
    'src/lib/security.ts',
    'src/pages/Portfolio.tsx',
    'src/pages/Bookmarks.tsx',
    'src/pages/Scholarships.tsx',
    'src/pages/CollegeRecommendations.tsx',
    'src/pages/Profile.tsx',
    'src/pages/Index.tsx',
    'src/App.tsx',
    'src/main.tsx',
    'vite.config.ts'
];

let mdContent = '# Zertainity New Feature Implementations\n\n';
mdContent += 'This document contains all the implementation files modified or created for the new features (Portfolio, Bookmarks, Scholarships) and the security hardening.\n\n';

for (const filepath of filesToInclude) {
    const fullPath = path.join(__dirname, filepath);
    if (fs.existsSync(fullPath)) {
        mdContent += `## File: \`${filepath}\`\n\n`;
        mdContent += '```typescript\n';
        mdContent += fs.readFileSync(fullPath, 'utf8');
        mdContent += '\n```\n\n';
    } else {
        mdContent += `## File: \`${filepath}\`\n\n`;
        mdContent += `> File not found.\n\n`;
    }
}

const mdOutPath = path.join(__dirname, 'implementations.md');
fs.writeFileSync(mdOutPath, mdContent);

console.log('Markdown generated. Now converting to PDF...');

markdownpdf()
    .from(mdOutPath)
    .to(path.join(__dirname, 'Zertainity_Implementation_Files.pdf'), function () {
        console.log('PDF Generation Complete: Zertainity_Implementation_Files.pdf');
    });
