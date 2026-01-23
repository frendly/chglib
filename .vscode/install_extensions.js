const fs = require('node:fs');
const path = require('node:path');

const extensionsJsonPath = path.join(__dirname, 'extensions.json');

if (!fs.existsSync(extensionsJsonPath)) {
  console.error('extensions.json not found');
  process.exit(1);
}

const extensionsJson = JSON.parse(fs.readFileSync(extensionsJsonPath, 'utf8'));
const recommendations = extensionsJson.recommendations || [];

if (recommendations.length > 0) {
  console.log(recommendations.join('\n'));
} else {
  console.log('No recommended extensions found.');
}
