#!/usr/bin/env tsx

/**
 * Скрипт добавления пустых строк до и после заголовков <h2>
 *
 * Описание:
 * Этот скрипт добавляет пустые строки до и после тегов <h2>...</h2>
 * в HTML-файлах из папки LEGACY_BNP. Это необходимо для корректной
 * обработки нумерованных списков в Markdown - если после заголовка h2
 * нет пустой строки, нумерованный список не распознается.
 *
 * Операции:
 * - Добавляет пустую строку перед <h2>, если её нет
 * - Добавляет пустую строку после </h2>, если её нет
 * - Избегает дублирования пустых строк
 * - Сохраняет frontmatter из исходных файлов
 *
 * Использование:
 *   # Обработать все годы
 *   yarn tsx scripts/fix-h2-spacing.ts
 *   # Или: yarn fix-h2-spacing
 *
 *   # Обработать конкретный год
 *   yarn tsx scripts/fix-h2-spacing.ts 2025
 *   # Или: yarn fix-h2-spacing 2025
 *
 *   # Пробный запуск (предварительный просмотр изменений без записи)
 *   yarn tsx scripts/fix-h2-spacing.ts 2025 --dry-run
 *   # Или: yarn fix-h2-spacing 2025 --dry-run
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LEGACY_BNP_DIR = path.join(__dirname, '..', 'pages', 'LEGACY_BNP');

interface ProcessingStats {
  totalFiles: number;
  processedFiles: number;
  modifiedFiles: number;
  errors: string[];
}

/**
 * Parse frontmatter from HTML content
 */
function parseFrontmatter(content: string): {
  frontmatter: string;
  body: string;
} {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (match) {
    return {
      frontmatter: match[1],
      body: match[2],
    };
  }
  return { frontmatter: '', body: content };
}

/**
 * Fix spacing around h2 tags
 * Adds empty line before <h2> and after </h2> if not already present
 */
function fixH2Spacing(html: string): { content: string; modified: boolean } {
  let modified = false;
  let result = html;

  // Step 1: Ensure empty line before <h2>
  // Match: (start of string OR newline) + optional whitespace + <h2>
  // Replace with proper spacing
  const beforePattern = /(^|[^\n])(\s*<h2>)/gm;
  result = result.replace(beforePattern, (match, before, h2part) => {
    // If it's the start of file, no need for empty line before
    if (before === '') {
      return h2part.trim();
    }

    // Check if there's already an empty line
    const hasEmptyLineBefore = before.endsWith('\n\n') || before === '\n';

    if (!hasEmptyLineBefore) {
      modified = true;
      // Add newline to create empty line before h2
      return `${before}\n\n${h2part.trim()}`;
    }

    return match;
  });

  // Step 2: Ensure empty line after </h2>
  // Match: </h2> + optional whitespace + (non-empty line OR end)
  const afterPattern = /(<\/h2>)(\s*)(\S|$)/gm;
  result = result.replace(afterPattern, (match, closingTag, whitespace, nextChar) => {
    // If end of file, no need for empty line after
    if (nextChar === '' || nextChar === '$') {
      return `${closingTag}${whitespace}`;
    }

    // Check if there's already an empty line
    const hasEmptyLineAfter = whitespace.includes('\n\n');

    if (!hasEmptyLineAfter) {
      modified = true;
      // Add empty line after </h2>
      return `${closingTag}\n\n${nextChar}`;
    }

    return match;
  });

  // Step 3: Normalize multiple empty lines to double newlines (one empty line)
  // This prevents accumulation of empty lines on repeated runs
  result = result.replace(/\n{3,}/g, '\n\n');

  return { content: result, modified };
}

/**
 * Process a single HTML file
 */
function processFile(filePath: string, dryRun = false): { success: boolean; modified: boolean } {
  try {
    const originalContent = fs.readFileSync(filePath, 'utf-8');

    // Parse frontmatter and body
    const { frontmatter, body } = parseFrontmatter(originalContent);

    // Fix h2 spacing in the body
    const { content: fixedBody, modified } = fixH2Spacing(body);

    if (!modified) {
      return { success: true, modified: false };
    }

    // Reassemble with frontmatter
    let finalContent: string;
    if (frontmatter) {
      finalContent = `---\n${frontmatter}\n---\n${fixedBody}`;
    } else {
      finalContent = fixedBody;
    }

    // Write file if not dry run
    if (!dryRun) {
      fs.writeFileSync(filePath, finalContent, 'utf-8');
    }

    return { success: true, modified: true };
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return { success: false, modified: false };
  }
}

/**
 * Recursively find all HTML files in a directory
 */
function findHtmlFiles(dir: string): string[] {
  const files: string[] = [];

  try {
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(dir, item.name);

      if (item.isDirectory()) {
        files.push(...findHtmlFiles(fullPath));
      } else if (item.isFile() && item.name.endsWith('.html')) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
  }

  return files;
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2);

  // Parse arguments
  const dryRun = args.includes('--dry-run');
  const yearArg = args.find((arg) => !arg.startsWith('--'));

  // Determine target directory
  let targetDir = LEGACY_BNP_DIR;
  let targetDescription = 'all years';

  if (yearArg) {
    targetDir = path.join(LEGACY_BNP_DIR, yearArg);
    targetDescription = `year ${yearArg}`;

    // Validate year directory exists
    if (!fs.existsSync(targetDir)) {
      console.error(`Error: Directory ${targetDir} does not exist`);
      console.error(`Available years:`);
      const years = fs
        .readdirSync(LEGACY_BNP_DIR, { withFileTypes: true })
        .filter((item) => item.isDirectory() && /^\d{4}$/.test(item.name))
        .map((item) => item.name)
        .sort();
      for (const year of years) {
        console.error(`  - ${year}`);
      }
      process.exit(1);
    }
  }

  console.log('='.repeat(60));
  console.log('Fix H2 Tag Spacing');
  console.log('='.repeat(60));
  console.log(`Target: ${targetDescription}`);
  console.log(`Directory: ${targetDir}`);
  if (dryRun) {
    console.log('Mode: DRY RUN (no files will be modified)');
  }
  console.log('='.repeat(60));
  console.log();

  // Find all HTML files
  const htmlFiles = findHtmlFiles(targetDir);
  console.log(`Found ${htmlFiles.length} HTML files\n`);

  if (htmlFiles.length === 0) {
    console.log('No HTML files to process.');
    return;
  }

  const stats: ProcessingStats = {
    totalFiles: htmlFiles.length,
    processedFiles: 0,
    modifiedFiles: 0,
    errors: [],
  };

  // Process each file
  for (const filePath of htmlFiles) {
    const relativePath = path.relative(LEGACY_BNP_DIR, filePath);
    process.stdout.write(`Processing ${relativePath}... `);

    const result = processFile(filePath, dryRun);

    if (result.success) {
      stats.processedFiles++;
      if (result.modified) {
        stats.modifiedFiles++;
        console.log(dryRun ? '✓ (would be modified)' : '✓ modified');
      } else {
        console.log('- (no changes)');
      }
    } else {
      stats.errors.push(relativePath);
      console.log('✗ error');
    }
  }

  // Print summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total files: ${stats.totalFiles}`);
  console.log(`Processed: ${stats.processedFiles}`);
  console.log(`Modified: ${stats.modifiedFiles}`);
  console.log(`Unchanged: ${stats.processedFiles - stats.modifiedFiles}`);
  console.log(`Errors: ${stats.errors.length}`);

  if (stats.errors.length > 0) {
    console.log('\nFailed files:');
    for (const error of stats.errors) {
      console.log(`  - ${error}`);
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  if (dryRun) {
    console.log('Dry run complete! Run without --dry-run to apply changes.');
  } else {
    console.log('Processing complete!');
  }
  console.log('='.repeat(60));
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
