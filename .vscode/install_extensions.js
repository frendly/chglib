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

// Определить редактор (VS Code или Cursor)
function detectEditor() {
  // Проверка переменных окружения
  if (process.env.CURSOR_PID || process.env.CURSOR_SESSION_ID) {
    return 'cursor';
  }
  if (process.env.VSCODE_PID || process.env.VSCODE_INJECTION) {
    return 'code';
  }
  
  // Попробовать выполнить команды для определения доступности
  try {
    execSync('cursor --version', { stdio: 'ignore' });
    return 'cursor';
  } catch {
    try {
      execSync('code --version', { stdio: 'ignore' });
      return 'code';
    } catch {
      // По умолчанию используем code (VS Code)
      return 'code';
    }
  }
}

const editor = detectEditor();

const extensionsJson = JSON.parse(fs.readFileSync(extensionsJsonPath, 'utf8'));
const recommendations = extensionsJson.recommendations || [];

// Получить список установленных расширений
let installedExtensions = new Set();
try {
  const listCommand = `${editor} --list-extensions`;
  const installed = execSync(listCommand, { encoding: 'utf8' });
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
