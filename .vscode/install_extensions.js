import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const extensionsJsonPath = path.join(__dirname, 'extensions.json');

if (!fs.existsSync(extensionsJsonPath)) {
  console.error('extensions.json not found');
  process.exit(1);
}

const extensionsJson = JSON.parse(fs.readFileSync(extensionsJsonPath, 'utf8'));
const recommendations = extensionsJson.recommendations || [];

// Получить список установленных расширений
let installedExtensions = new Set();
try {
  const installed = execSync('code --list-extensions', { encoding: 'utf8' });
  installedExtensions = new Set(installed.trim().split('\n').filter(Boolean));
} catch (error) {
  // Если команда недоступна, выводим все рекомендованные (fallback поведение)
}

// Фильтруем только не установленные расширения
const toInstall = recommendations.filter(ext => !installedExtensions.has(ext));

if (toInstall.length > 0) {
  console.log(toInstall.join('\n'));
} else if (recommendations.length > 0) {
  // Все рекомендованные уже установлены
  // Не выводим ничего, чтобы избежать ошибок при установке
} else {
  console.log('No recommended extensions found.');
}
