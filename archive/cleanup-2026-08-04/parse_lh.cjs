const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./lh-local.json', 'utf8'));

console.log('Scores:');
Object.values(data.categories).forEach(c => {
    console.log(c.title + ': ' + (c.score * 100));
});

console.log('\nFailed Audits:');
Object.values(data.audits).filter(a => a.score !== null && a.score < 1 && a.scoreDisplayMode !== 'manual' && a.scoreDisplayMode !== 'notApplicable' && a.scoreDisplayMode !== 'informative').forEach(a => {
    console.log('- ' + a.id + ': ' + a.title + ' (Score: ' + a.score + ') \n  => ' + a.description.split('.')[0]);
});
