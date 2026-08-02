const fs = require('fs');
let code = fs.readFileSync('src/pages/Auth.tsx', 'utf-8');
code = code.replace('<div className="min-h-screen flex" className="min-h-screen flex bg-background/50 backdrop-blur-3xl">', '<div className="min-h-screen flex bg-background/50 backdrop-blur-3xl">');
code = code.replace('<div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12" className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 bg-gradient-to-br from-primary/5 via-background to-secondary/5 border-r border-border/40">', '<div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 bg-gradient-to-br from-primary/5 via-background to-secondary/5 border-r border-border/40">');
fs.writeFileSync('src/pages/Auth.tsx', code);
