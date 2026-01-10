#!/bin/bash

# This script converts HTML files in pages/BENex/2025 to Markdown.
# It uses a multi-stage, POSIX-compliant process for maximum robustness.

set -e
DIR="pages/BENex/2025"

# --- Stage 1: Clean up malformed HTML ---
if ls "$DIR"/*.html >/dev/null 2>&1; then
    for HTML_FILE in "$DIR"/*.html; do
        perl -0777 -i -pe 's{<a.*?</a>}{ my $match = $&; $match =~ s/\s+/ /g; $match }ges' "$HTML_FILE"
    done
fi

# --- Stage 2: Convert HTML to Markdown ---
if ! ls "$DIR"/*.html >/dev/null 2>&1; then
    exit 0
fi

for HTML_FILE in "$DIR"/*.html; do
    MD_FILE="${HTML_FILE%.html}.md"

    # Separate frontmatter and body
    csplit -s -f body- "$HTML_FILE" /^---$/+1
    mv body-00 frontmatter.txt
    mv body-01 body.html

    # Process the body using a series of sed commands
    # Convert <hr>, <b>, and clean up the body
    sed -i -e 's/<hr>/\n/gi' \
           -e 's/<b>[[:space:]]*/\*\*/gi' \
           -e 's|[[:space:]]*<\/b>/\*\*/gi' \
           -e '/<font>/d' body.html

    # Convert <a> tags to Markdown
    sed -i -E 's/<a href="([^"]*)".*>\s*([^<]*)\s*<\/a>/[\2](\1)/g' body.html

    # Combine the frontmatter and the processed body
    cat frontmatter.txt > "$MD_FILE"
    echo "" >> "$MD_FILE"
    cat body.html >> "$MD_FILE"

    # Final cleanup of link text whitespace
    sed -i -E 's/\[[[:space:]]*(.*[^[:space:]])[[:space:]]*\]/[\1]/g' "$MD_FILE"

    # Clean up temporary files
    rm frontmatter.txt body.html
    rm "$HTML_FILE"
done

echo "All files converted successfully."
