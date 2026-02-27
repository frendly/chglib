#!/usr/bin/env tsx

/**
 * Скрипт преобразования жирных заголовков в теги h2
 *
 * Описание:
 * Этот скрипт находит отдельно стоящие теги <b> с названиями разделов
 * и преобразует их в семантические теги заголовков <h2>.
 *
 * Преобразования:
 * - <b>КНИГИ</b> → <h2>КНИГИ</h2>
 * - <b>ЖУРНАЛЫ</b> → <h2>ЖУРНАЛЫ</h2>
 * - <b>ДИССЕРТАЦИИ</b> → <h2>ДИССЕРТАЦИИ</h2>
 *
 * Это улучшает семантическую структуру HTML и помогает правильно
 * преобразовать документы в Markdown.
 *
 * Использование:
 *   yarn tsx scripts/convert-legacy-bold-to-h2.ts
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LEGACY_BNP_DIR = path.join(__dirname, '..', 'pages', 'LEGACY_BNP');

interface ConversionStats {
  total: number;
  converted: number;
  skipped: number;
  errors: string[];
}

/**
 * Convert standalone bold section headers to h2 tags
 * Examples:
 *   <b>КНИГИ</b> → <h2>КНИГИ</h2>
 *   <b>ЖУРНАЛЫ</b> → <h2>ЖУРНАЛЫ</h2>
 *   <b>ДИССЕРТАЦИИ</b> → <h2>ДИССЕРТАЦИИ</h2>
 */
function convertBoldToH2(content: string): { content: string; changed: boolean } {
  const original = content;

  // Match standalone bold tags on their own line for section headers
  // Only match these specific section headers in uppercase
  // Allow for optional leading whitespace
  const result = content.replace(/^\s*<b>(КНИГИ|ЖУРНАЛЫ|ДИССЕРТАЦИИ)<\/b>\s*$/gm, '<h2>$1</h2>');

  return {
    content: result,
    changed: result !== original,
  };
}

/**
 * Process a single HTML file
 */
function processFile(filePath: string): boolean {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const { content: convertedContent, changed } = convertBoldToH2(content);

    if (changed) {
      fs.writeFileSync(filePath, convertedContent, 'utf-8');
      return true;
    }

    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    throw error;
  }
}

/**
 * Recursively find all HTML files in a directory
 */
function findHtmlFiles(dir: string): string[] {
  const files: string[] = [];

  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      files.push(...findHtmlFiles(fullPath));
    } else if (item.isFile() && item.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Main execution
 */
function main() {
  console.log('Starting bold to h2 conversion...');
  console.log(`Source directory: ${LEGACY_BNP_DIR}`);
  console.log('Converting: <b>КНИГИ|ЖУРНАЛЫ|ДИССЕРТАЦИИ</b> → <h2>...</h2>\n');

  // Find all HTML files
  const htmlFiles = findHtmlFiles(LEGACY_BNP_DIR);
  console.log(`Found ${htmlFiles.length} HTML files\n`);

  const stats: ConversionStats = {
    total: htmlFiles.length,
    converted: 0,
    skipped: 0,
    errors: [],
  };

  // Process each file
  for (const filePath of htmlFiles) {
    const relativePath = path.relative(LEGACY_BNP_DIR, filePath);
    process.stdout.write(`Processing ${relativePath}... `);

    try {
      const changed = processFile(filePath);
      if (changed) {
        stats.converted++;
        console.log('✓ converted');
      } else {
        stats.skipped++;
        console.log('- skipped (no changes)');
      }
    } catch (_error) {
      stats.errors.push(relativePath);
      console.log('✗ error');
    }
  }

  // Print summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('CONVERSION SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total files: ${stats.total}`);
  console.log(`Converted: ${stats.converted}`);
  console.log(`Skipped: ${stats.skipped}`);
  console.log(`Failed: ${stats.errors.length}`);

  if (stats.errors.length > 0) {
    console.log('\nFailed files:');
    for (const error of stats.errors) {
      console.log(`  - ${error}`);
    }
  }

  console.log('\nConversion complete!');
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
