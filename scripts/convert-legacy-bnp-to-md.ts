#!/usr/bin/env tsx

/**
 * Скрипт конвертации HTML в Markdown для файлов LEGACY_BNP
 *
 * Описание:
 * Этот скрипт преобразует HTML-файлы из папки LEGACY_BNP в формат Markdown.
 * Выполняет следующие операции:
 * - Очищает проблемные HTML-теги (сломанные закрывающие теги, пустые теги)
 * - Удаляет устаревшие блоки <span class="content"> и <span class="content-link">
 * - Конвертирует HTML-ссылки (<a href>) в синтаксис Markdown ([текст](ссылка))
 * - Преобразует заголовки разделов (<b>КНИГИ</b>) в заголовки Markdown (## КНИГИ)
 * - Конвертирует теги <b> в синтаксис Markdown (**текст**)
 * - Исправляет URL-адреса с %20 в начале
 * - Сохраняет frontmatter из исходных файлов
 *
 * После конвертации оригинальные HTML-файлы удаляются, остаются только .md файлы.
 *
 * Использование:
 *   yarn tsx scripts/convert-legacy-bnp-to-md.ts
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
 * Clean up problematic HTML tags
 */
function cleanupProblematicTags(html: string): string {
  let cleaned = html;

  // 1. Fix broken closing tags: </b\n> -> </b>
  cleaned = cleaned.replace(/<\/b\s*\n\s*>/g, '</b>');

  // 2. Remove orphan closing </font> tags
  cleaned = cleaned.replace(/<\/font>\s*$/gim, '');

  // 3. Remove empty <b></b> tags
  cleaned = cleaned.replace(/<b><\/b>/g, '');

  // 4. Fix incorrect </br> -> <br> or remove
  cleaned = cleaned.replace(/<\/br>/g, '<br>');

  // 5. Fix URLs starting with %20
  cleaned = cleaned.replace(/href="%20+/g, 'href="');
  cleaned = cleaned.replace(/href="%20%20+/g, 'href="');

  // 6. Fix specific incorrect path: jpg01ZhFizHim_1816-1851/.jpg
  cleaned = cleaned.replace(/jpg01ZhFizHim_/g, 'jpg01/ZhFizHim_');
  cleaned = cleaned.replace(/\.\/(\.jpg)/g, '$1');

  return cleaned;
}

/**
 * Remove <span class="content-link"> and <span class="content"> blocks
 * These appear in older files (2012-2021)
 */
function removeSpanBlocks(html: string): string {
  let result = html;

  // Remove <span class="content"> blocks entirely (including nested links)
  result = result.replace(/<span class="content">\s*(?:<a[^>]*>.*?<\/a>\s*)*<\/span>/gs, '');

  // Remove <span class="content-link"> but keep the text inside
  result = result.replace(/<span class="content-link">(.*?)<\/span>/gs, '$1');

  return result;
}

/**
 * Convert HTML links to Markdown links
 */
function convertLinks(html: string): string {
  return html.replace(/<a\s+href=["']([^"']+)["']>([^<]*)<\/a>/g, (_match, href, text) => {
    // If URL contains spaces, wrap in <>
    if (href.includes(' ')) {
      return `[${text}](<${href}>)`;
    }
    return `[${text}](${href})`;
  });
}

/**
 * Convert section headers: <b>КНИГИ</b> -> ## КНИГИ
 */
function convertSectionHeaders(html: string): string {
  let result = html;

  // Match patterns like <b>КНИГИ</b> or <b>ЖУРНАЛЫ</b> at the start of a line
  result = result.replace(/^\s*<b>(КНИГИ|ЖУРНАЛЫ)<\/b>\s*$/gm, '## $1');

  return result;
}

/**
 * Convert bold tags to markdown
 * Strategy: Convert <b>text</b> to **text**, but be careful with section headers
 */
function convertBoldTags(html: string): string {
  let result = html;

  // Convert remaining <b>...</b> to **...**
  // Use a non-greedy match to handle multiple bold tags on one line
  result = result.replace(/<b>(.*?)<\/b>/gs, '**$1**');

  return result;
}

/**
 * Clean up extra whitespace and normalize line endings
 */
function normalizeWhitespace(content: string): string {
  // Don't change too much - preserve structure
  return content;
}

/**
 * Main conversion function
 */
function convertHtmlToMarkdown(htmlContent: string): string {
  // 1. Parse frontmatter
  const { frontmatter, body } = parseFrontmatter(htmlContent);

  // 2. Clean up problematic tags
  let markdown = cleanupProblematicTags(body);

  // 3. Remove span blocks (for old files)
  markdown = removeSpanBlocks(markdown);

  // 4. Convert section headers first (before converting other bold tags)
  markdown = convertSectionHeaders(markdown);

  // 5. Convert links
  markdown = convertLinks(markdown);

  // 6. Convert bold tags
  markdown = convertBoldTags(markdown);

  // 7. Normalize whitespace
  markdown = normalizeWhitespace(markdown);

  // 8. Reassemble with frontmatter
  if (frontmatter) {
    return `---\n${frontmatter}\n---\n${markdown}`;
  }

  return markdown;
}

/**
 * Process a single HTML file
 */
function processFile(filePath: string): boolean {
  try {
    const htmlContent = fs.readFileSync(filePath, 'utf-8');
    const markdownContent = convertHtmlToMarkdown(htmlContent);

    // Generate output path (replace .html with .md)
    const mdPath = filePath.replace(/\.html$/, '.md');

    // Write markdown file
    fs.writeFileSync(mdPath, markdownContent, 'utf-8');

    // Delete original HTML file
    fs.unlinkSync(filePath);

    return true;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return false;
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
  console.log('Starting HTML to Markdown conversion...');
  console.log(`Source directory: ${LEGACY_BNP_DIR}`);

  // Find all HTML files
  const htmlFiles = findHtmlFiles(LEGACY_BNP_DIR);
  console.log(`Found ${htmlFiles.length} HTML files`);

  const stats: ConversionStats = {
    total: htmlFiles.length,
    converted: 0,
    errors: [],
  };

  // Process each file
  for (const filePath of htmlFiles) {
    const relativePath = path.relative(LEGACY_BNP_DIR, filePath);
    process.stdout.write(`Converting ${relativePath}... `);

    if (processFile(filePath)) {
      stats.converted++;
      console.log('✓');
    } else {
      stats.errors.push(relativePath);
      console.log('✗');
    }
  }

  // Print summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('CONVERSION SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total files: ${stats.total}`);
  console.log(`Converted: ${stats.converted}`);
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
