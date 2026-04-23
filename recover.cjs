const fs = require('fs');
const log = fs.readFileSync('C:/Users/JM/.gemini/antigravity/brain/9906b9f3-4875-44bc-9b64-1bb97790ba92/.system_generated/logs/overview.txt', 'utf8');

fs.writeFileSync('C:/Users/JM/Downloads/Zertainity-main/Zertainity-main/log_dump.txt', log.slice(log.length - 100000));
console.log('Saved log dump');
