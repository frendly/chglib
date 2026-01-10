
import os
import re

DIR = "pages/BENex/2025"

def convert_files():
    """
    Converts all HTML files in the target directory to Markdown using a robust
    Python-based approach.
    """
    if not os.path.exists(DIR):
        print(f"Directory not found: {DIR}")
        return

    html_files = [f for f in os.listdir(DIR) if f.endswith(".html")]
    if not html_files:
        print("No HTML files found to convert.")
        return

    for html_file in html_files:
        html_path = os.path.join(DIR, html_file)
        md_path = os.path.splitext(html_path)[0] + ".md"
        print(f"Processing: {html_path}")

        with open(html_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # 1. Separate frontmatter and body
        parts = content.split('---', 2)
        if len(parts) < 3:
            print(f"Skipping {html_file}: could not find frontmatter.")
            continue

        frontmatter = f"---{parts[1]}---"
        body = parts[2]

        # 2. Pre-clean the HTML body to handle malformed <a> tags
        def clean_a_tag(match):
            tag_content = match.group(0)
            # Replace all whitespace sequences (including newlines) with a single space
            return re.sub(r'\s+', ' ', tag_content)

        body = re.sub(r'<a.*?</a>', clean_a_tag, body, flags=re.DOTALL | re.IGNORECASE)

        # 3. Perform conversions
        body = re.sub(r'<hr>', '', body, flags=re.IGNORECASE)
        body = re.sub(r'<font>.*?</font>', '', body, flags=re.DOTALL | re.IGNORECASE)
        body = re.sub(r'<b>\s*', '**', body, flags=re.IGNORECASE)
        body = re.sub(r'\s*</b>', '**', body, flags=re.IGNORECASE)

        # Robustly convert <a> tags and trim link text
        def a_tag_to_markdown(match):
            url = match.group(1).strip()
            text = match.group(2).strip()
            return f"[{text}]({url})"

        body = re.sub(r'<a href="([^"]*)".*?>\s*(.*?)\s*</a>', a_tag_to_markdown, body, flags=re.IGNORECASE)

        # 4. Write the new Markdown file
        with open(md_path, 'w', encoding='utf-8') as f:
            f.write(frontmatter)
            f.write('\n\n')
            # Write body line by line to preserve original line breaks
            f.write(body.strip())

        # 5. Remove the original HTML file
        os.remove(html_path)
        print(f"Created: {md_path}")

    print("All files converted successfully.")

if __name__ == "__main__":
    convert_files()
