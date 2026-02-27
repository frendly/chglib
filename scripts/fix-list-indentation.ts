#!/usr/bin/env tsx

/**
 * Скрипт исправления отступов в нумерованных списках
 *
 * Описание:
 * Этот скрипт удаляет начальные пробелы (любое количество) перед нумерованными
 * списками в HTML-файлах из папки LEGACY_BNP. Это позволяет Markdown правильно
 * распознавать и преобразовывать эти списки в теги <ol> и <li>.
 *
 * Дополнительно скрипт обеспечивает наличие пустой строки после тегов <h2>
 * перед нумерованными списками, что улучшает читаемость и корректность разметки.
 *
 * Проблема возникает из-за того, что Markdown не распознаёт списки с отступами,
 * поэтому необходимо выравнивать их по левому краю.
 *
 * Использование:
 *   # Обработать все годы
 *   yarn tsx scripts/fix-list-indentation.ts
 *   # Или: yarn fix-list-indentation
 *
 *   # Обработать конкретный год
 *   yarn tsx scripts/fix-list-indentation.ts 2012
 *   # Или: yarn fix-list-indentation 2012
 *
 *   # Пробный запуск (предварительный просмотр изменений без записи)
 *   yarn tsx scripts/fix-list-indentation.ts 2012 --dry-run
 *   # Или: yarn fix-list-indentation 2012 --dry-run
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
 * Fix list indentation by removing leading spaces (2 or 4) before numbered lists
 * Also ensures blank line after <h2> tags before lists
 */
function fixListIndentation(html: string): { content: string; modified: boolean } {
  const lines = html.split('\n');
  const result: string[] = [];
  let modified = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const nextLine = i + 1 < lines.length ? lines[i + 1] : null;

    // Check if current line is an h2 tag and next line starts with indented numbered list
    if (line.match(/<h2>.*<\/h2>/) && nextLine && /^\s+\d+\.\s+/.test(nextLine)) {
      result.push(line);
      // Check if we need to add a blank line
      if (nextLine.trim() !== '') {
        result.push(''); // Add blank line after h2
        modified = true;
      }
      continue;
    }

    // Match lines with any amount of leading spaces followed by numbered list
    // Pattern: /^(\s+)(\d+\.\s+)/
    if (/^\s+\d+\.\s+/.test(line)) {
      // Remove all leading spaces
      const fixed = line.replace(/^(\s+)/, '');
      result.push(fixed);
      modified = true;
    } else {
      result.push(line);
    }
  }

  return { content: result.join('\n'), modified };
}

/**
 * Process a single HTML file
 */
function processFile(filePath: string, dryRun = false): { success: boolean; modified: boolean } {
  try {
    const originalContent = fs.readFileSync(filePath, 'utf-8');

    // Parse frontmatter and body
    const { frontmatter, body } = parseFrontmatter(originalContent);

    // Fix list indentation in the body
    const { content: fixedBody, modified } = fixListIndentation(body);

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
  console.log('Fix List Indentation');
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
