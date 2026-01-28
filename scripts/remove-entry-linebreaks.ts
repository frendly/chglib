#!/usr/bin/env tsx

/**
 * Remove Entry Line Breaks Script
 *
 * This script removes unnecessary line breaks in bibliography entries in HTML files
 * within the LEGACY_BNP folder. It joins continuation lines that are part of the same
 * entry but were split across multiple lines.
 *
 * Usage:
 *   # Process all years
 *   yarn tsx scripts/remove-entry-linebreaks.ts
 *
 *   # Process specific year
 *   yarn tsx scripts/remove-entry-linebreaks.ts 2012
 *
 *   # Dry run (preview changes without modifying files)
 *   yarn tsx scripts/remove-entry-linebreaks.ts 2012 --dry-run
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
 * Remove line breaks by joining continuation lines with previous lines
 * 
 * A line is considered a continuation if:
 * - It starts with whitespace
 * - It is NOT a numbered entry (e.g., "  1. ", "  10. ")
 * - It is NOT an HTML tag (e.g., "  <a href=...")
 * - It is not empty
 * - The previous line exists and is not empty
 */
function removeLinebreaks(html: string): { content: string; modified: boolean } {
  const lines = html.split('\n');
  const result: string[] = [];
  let modified = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const prevLine = result[result.length - 1];

    // Check if this is a continuation line that should be joined
    if (
      /^\s+/.test(line) &&           // Starts with whitespace
      !/^\s+\d+\.\s/.test(line) &&   // NOT a numbered entry
      !/^\s+</.test(line) &&         // NOT an HTML tag
      line.trim() !== '' &&          // NOT empty
      prevLine !== undefined &&      // Has previous line
      prevLine.trim() !== ''         // Previous line not empty
    ) {
      // Join with previous line
      result[result.length - 1] = prevLine + ' ' + line.trim();
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

    // Remove linebreaks in the body
    const { content: fixedBody, modified } = removeLinebreaks(body);

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
  console.log('Remove Entry Line Breaks');
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
