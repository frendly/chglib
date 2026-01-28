#!/usr/bin/env tsx

/**
 * Fix Numbered Lists Script
 *
 * This script converts manually numbered lists in HTML files into proper <ol> and <li> tags.
 * It processes files in the LEGACY_BNP folder and:
 * - Detects numbered items (lines starting with "  N. ")
 * - Groups consecutive items into <ol> tags
 * - Wraps each item in <li> tags
 * - Removes the number prefix (since <ol> auto-numbers)
 * - Standardizes indentation to 2 spaces inside <li>
 * - Maintains one blank line between list items
 *
 * Usage:
 *   # Process all years
 *   yarn tsx scripts/fix-numbered-lists.ts
 *   # Or: yarn fix-numbered-lists
 *
 *   # Process specific year
 *   yarn tsx scripts/fix-numbered-lists.ts 2012
 *   # Or: yarn fix-numbered-lists 2012
 *
 *   # Dry run (preview changes without modifying files)
 *   yarn tsx scripts/fix-numbered-lists.ts 2012 --dry-run
 *   # Or: yarn fix-numbered-lists 2012 --dry-run
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
 * Fix numbered lists in HTML
 * Converts manual numbering like "  1. " into proper <ol><li> structure
 */
function fixNumberedLists(html: string): { content: string; modified: boolean } {
  const lines = html.split('\n');
  const result: string[] = [];
  let modified = false;
  let inList = false;
  let currentItemLines: string[] = [];
  let i = 0;

  // Pattern to detect numbered list items: 2 spaces + number + dot + space
  const listItemPattern = /^\s{2}(\d+)\.\s(.*)$/;

  function flushListItem() {
    if (currentItemLines.length > 0) {
      result.push('  <li>');
      // Add item content with standardized 2-space indentation
      for (const line of currentItemLines) {
        result.push(`  ${line}`);
      }
      result.push('  </li>');
      currentItemLines = [];
    }
  }

  function closeList() {
    if (inList) {
      flushListItem();
      result.push('</ol>');
      inList = false;
    }
  }

  while (i < lines.length) {
    const line = lines[i];
    const match = line.match(listItemPattern);

    if (match) {
      // Found a numbered list item
      modified = true;

      if (!inList) {
        // Start a new list
        result.push('<ol>');
        inList = true;
      } else {
        // Flush previous item and add blank line between items
        flushListItem();
        result.push('');
      }

      // Start new item (remove number prefix)
      const content = match[2];
      currentItemLines = [content];
      i++;

      // Collect all lines belonging to this item
      // Continue while lines start with 2 spaces, are closing tags, or are blank lines followed by item content
      while (i < lines.length) {
        const nextLine = lines[i];

        // Check if this is a new numbered item
        if (listItemPattern.test(nextLine)) {
          break; // Start of next item
        }

        // If line is blank, look ahead to determine if it's part of the item
        if (nextLine.trim() === '') {
          // Look ahead to see if there's more item content after blank line(s)
          let nextContentType = 'none';
          for (let j = i + 1; j < lines.length; j++) {
            const lookahead = lines[j];
            if (lookahead.trim() === '') continue; // Skip more blanks
            if (listItemPattern.test(lookahead)) {
              nextContentType = 'list_item';
            } else if (lookahead.startsWith('  ')) {
              nextContentType = 'item_content';
            } else if (/^<\/\w+>/.test(lookahead.trim())) {
              nextContentType = 'closing_tag';
            } else {
              nextContentType = 'other';
            }
            break;
          }

          // Include blank if followed by item content or closing tag
          if (nextContentType === 'item_content' || nextContentType === 'closing_tag') {
            currentItemLines.push('');
            i++;
            continue;
          } else {
            // End of item (but list might continue if next is list_item)
            break;
          }
        }

        // If line starts with 2 spaces, it's part of item
        if (nextLine.startsWith('  ')) {
          currentItemLines.push(nextLine.substring(2));
          i++;
          continue;
        }

        // Check if it's a closing tag (</span>, </div>, etc.) at the start of line
        if (/^<\/\w+>/.test(nextLine.trim())) {
          currentItemLines.push(nextLine);
          i++;
          continue;
        }

        // Otherwise, end of list item
        break;
      }

      // Remove trailing blank lines from item
      while (
        currentItemLines.length > 0 &&
        currentItemLines[currentItemLines.length - 1].trim() === ''
      ) {
        currentItemLines.pop();
      }
    } else if (inList && line.trim() === '') {
      // Blank line while in list - check if next line is a list item
      let nextIsListItem = false;
      for (let j = i + 1; j < lines.length; j++) {
        const lookahead = lines[j];
        if (lookahead.trim() === '') continue;
        if (listItemPattern.test(lookahead)) {
          nextIsListItem = true;
        }
        break;
      }

      if (nextIsListItem) {
        // Skip blank lines between items (we'll add our own spacing)
        i++;
      } else {
        // End of list
        closeList();
        result.push(line);
        i++;
      }
    } else {
      // Not a list item
      closeList();
      result.push(line);
      i++;
    }
  }

  // Close any remaining list
  closeList();

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

    // Fix numbered lists in the body
    const { content: fixedBody, modified } = fixNumberedLists(body);

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
  console.log('Fix Numbered Lists');
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
