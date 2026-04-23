const fs = require('fs');
const content = fs.readFileSync('src/pages/Admin.tsx', 'utf8');
const lines = content.split(/\r?\n/);
const newLines = [
  ...lines.slice(0, 1535),
  '                <TabsContent value="colleges">',
  '                  <div className="flex justify-between items-center mb-6">',
  '                    <div>',
  ...lines.slice(2062)
];
fs.writeFileSync('src/pages/Admin.tsx', newLines.join('\n'));
console.log('Replaced successfully');
