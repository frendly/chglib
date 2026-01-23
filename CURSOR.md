# CURSOR.md - Project Documentation

Project documentation for Cursor AI to understand structure, architecture, and development processes.

> 📚 Additional docs: [DeepWiki](https://deepwiki.com/frendly/chglib) | [GitHub Wiki](https://github.com/frendly/chglib/wiki)

> ⚠️ **Important**: All responses and comments must be in Russian.

> 🔄 **Critical**: Always update this file when making changes (filters, logic, structure, etc.) so AI knows the current state.

---

## 📋 Overview

**chglib** — static site for **Library of Natural Sciences RAS (BEN RAS)** in Chernogolovka.

**Type**: JAMstack static site
**Architecture**: Zero-storage directory service (curated links to external platforms, no content storage)
**Stack**: Eleventy 3.0, TypeScript 5.3+, tsx, Node.js >=20 (22.x recommended), Yarn 1.22.22, dayjs, esbuild, PostCSS
**Repo**: `git@github.com:frendly/chglib.git`

Provides access to scientific literature via 4 content systems and 3 resource access systems. All links point to external platforms (elibrary.ru, mathnet.ru, koha.benran.ru, etc.).

---

## 🗂️ Content Systems

### 1. Bulletins

#### BENex — Foreign Journal Exhibitions
- **Path**: `pages/BENex/YYYY/*.md`
- **Update**: Every Wednesday
- **Format**: Markdown → HTML (Eleventy)
- **Naming**: `BENexNN.md` (NN = 01-21)
- **Platforms**: elibrary.ru, mathnet.ru
- **Auto-collection**: `benexByYear` via `makeBENexCollection()`
- **Auto-pages**: Yearly index pages via pagination (`BENex_by_years.njk`)
- **Auto-archive**: Year archive via `getYears` filter
- **Homepage logic**: Shows previous year if current year has no bulletins

#### BNP — New Arrivals
- **Path**: `pages/BNP/YYYY/*.html`
- **Update**: Every Thursday
- **Format**: HTML (passthrough)
- **Naming**: `bnpNN.html` (NN = 01-10)
- **Platforms**: koha.benran.ru, icp.ac.ru

#### News — News & Announcements
- **Path**: `pages/news/YYYY/*.md`
- **Format**: `YYYY-MM-DD.md` (required for auto-processing)
- **Auto-collection**: `newsByYear` via `makeCollection()`
- **Auto-archive**: Year archive via `getYears` filter
- **Homepage logic** (`pages/index.njk`):
  - Current year has news → show 2 latest from current year (no year in title)
  - No current year news → show 2 latest from all years (with year in title)
  - Uses `getAllNews` filter

### 2. Exhibitions

#### SubjEx — Thematic Exhibitions
- **Path**: `pages/subjex/`
- **Types**: By institutions, by personalities (anniversaries), by topics
- **Update**: Monthly/periodically

### 3. Resource Access Systems

- **Electronic Reading Room** (`pages/resbnc/index.html`): Permanent DB/e-journal access. JS: `resbncBbTable.js` (responsive tables)
- **Test Access Portal** (`pages/restmp/index.html`): Trial subscriptions. JS: `openLinksInPortal.js` (modal windows)
- **Electronic Catalog** (`pages/ec/index.html`): Alphabetical navigation. JS: `elcatToggleList.js` (expandable lists with Mutation Observer)

---

## 🔗 External Platform Integration

| Platform | Link Pattern | Usage | Purpose |
|----------|-------------|-------|---------|
| elibrary.ru | `contents.asp?id=XXXXX` | BENex | Journal contents |
| mathnet.ru | `archive.phtml?jrnid=rm&volume=...` | BENex | Math journal archive |
| koha.benran.ru | `opac-detail.pl?biblionumber=XXXXX` | BNP | Book catalog records |
| icp.ac.ru | `/DISS/AuthorName/Disser_*.pdf` | BNP | Dissertation PDFs |

---

## 📁 Project Structure

```
chglib/
├── .eleventy.ts              # Eleventy config (TS)
├── build-assets.ts           # JS/CSS build (esbuild + PostCSS)
├── tsconfig.json             # TS config
├── postcss.config.cjs        # PostCSS config
├── package.json, yarn.lock
│
├── pages/                    # Source pages
│   ├── BENex/                # Journal exhibitions
│   ├── BNP/                  # New arrivals
│   ├── news/                 # News (Markdown)
│   ├── subjex/               # Thematic exhibitions
│   ├── ec/                   # Electronic catalog
│   ├── resbnc/               # Reading room
│   ├── restmp/               # Test access
│   ├── libweb/               # Additional resources
│   ├── more/                 # Additional pages
│   ├── about/, contacts/
│   ├── index.njk             # Homepage
│   ├── sitemap.xml.njk       # Dynamic sitemap generator
│   └── pages.json
│
├── src/
│   ├── _data/                # Global data
│   │   ├── meta.ts           # Site metadata
│   │   ├── eleventyComputed.ts
│   │   └── getNewsDescription.ts
│   ├── types/eleventy.d.ts   # Eleventy API types
│   ├── const/dateFormats.ts  # dayjs format constants
│   ├── eleventy/             # Eleventy modules
│   │   ├── index.ts          # Export all registrations
│   │   ├── collections/      # Collection creators
│   │   │   ├── index.ts
│   │   │   ├── makeCollection.ts
│   │   │   └── makeBENexCollection.ts
│   │   ├── filters/          # Custom filters
│   │   │   ├── index.ts
│   │   │   ├── dateFilters.ts
│   │   │   └── collectionFilters.ts
│   │   ├── shortcodes/index.ts
│   │   └── globalData.ts
│   ├── _includes/            # Nunjucks templates
│   │   ├── layouts/base.njk
│   │   ├── components/       # nav, head, footer, critical_css, counters
│   │   └── pages/            # Page templates
│   └── assets/
│       ├── js/index.js       # Main JS (bundled)
│       ├── styles/           # CSS (PostCSS)
│       ├── images/           # Images (copied as-is)
│       └── static/           # robots.txt, favicon.ico, .htaccess (sitemap.xml generated dynamically)
│
├── dist/                     # Generated site
└── src/LEGACY/               # Old HTML (not used)
```

---

## 🚀 Commands

### Development
```bash
yarn start  # or yarn watch
# Dev server with hot reload (localhost:8080)
```

### Production
```bash
yarn build
# NODE_ENV=production, minified JS/CSS, no source maps
```

### Deploy
```bash
yarn deploy  # build && transfer (rsync via SSH)
# Uses $SSH_HOST, $SSH_PATH from .env
```

---

## ⚙️ Build Process

1. **Before Build Hook**: `buildAssets()` from `build-assets.ts`
   - JS: esbuild (entry: `src/assets/js/index.js` → `dist/assets/js/`)
   - CSS: PostCSS (entry: `src/assets/styles/*.css` → `dist/assets/styles/`)
   - Minification: production only
   - Source maps: development only

2. **Eleventy Processing**: Templates (`.md`, `.njk`, `.html`) → HTML

3. **Asset Copying**: Images and static files to `dist/`

**PostCSS plugins**: `postcss-import`, `postcss-custom-media`, `postcss-preset-env` (stage 1)

### Auto Collections

**`makeCollection()`** (`src/eleventy/collections/makeCollection.ts`):
- Creates collections from folders (e.g., `newsByYear`)
- Parses date from `fileSlug` using dayjs
- Validates format with `DATE_FORMAT_ISO` from `src/const/dateFormats.ts`
- Groups by year from file path
- Sorts by date (newest first)

**`makeBENexCollection()`** (`src/eleventy/collections/makeBENexCollection.ts`):
- Creates `benexByYear` collection
- Filters `BENex*.md` files
- Extracts year from folder path
- Groups and sorts by year

---

## 🔧 Key Files & Directories

### Config Files
- **`.eleventy.ts`**: Main Eleventy config, registers plugins, imports from `src/eleventy/`, uses `tsx/esm` for TS data files
- **`tsconfig.json`**: `moduleResolution: "bundler"` (imports without `.js`), `noEmit: true`, `strict: true`
- **`src/types/eleventy.d.ts`**: Custom Eleventy API types (no official types)
- **`src/eleventy/`**: Modular Eleventy config
  - `collections/`: `makeCollection`, `makeBENexCollection`
  - `filters/`: `getHumanDate`, `getHumanDateWithYear`, `getSitemapDate`, `limit`, `getYears`, `getAllNews`, `hasPrefix`
  - `shortcodes/`: `version` (cache busting)
  - `globalData.ts`: `getGlobalCurrentYear`, `meta`
- **`build-assets.ts`**: JS/CSS build function for `beforeBuild` hook
- **`postcss.config.cjs`**: PostCSS plugins

### Content Directories
- **`pages/`**: Source pages (`.md`, `.njk`, `.html`), structure mirrors site structure
- **`src/_includes/`**: Nunjucks templates (layouts, components, pages)
- **`src/_data/`**: Global data (available in all templates)
  - **Note**: TS files from `_data/` don't auto-load, register via `addGlobalData()` in `globalData.ts`
- **`src/const/dateFormats.ts`**: dayjs format constants (used in Eleventy and frontend)
- **`src/assets/`**: Static resources (JS bundled, CSS processed, images/static copied)

---

## 🎨 Features & Configuration

### Templating
- **Nunjucks (.njk)**: Main template engine (inheritance, components, filters, macros)
- **Formats**: `.md` (Markdown → HTML), `.njk` (Nunjucks), `.html` (passthrough/processed)

### Eleventy Plugins
1. **`@11ty/eleventy-navigation`**: Hierarchical navigation (via `eleventyNavigation` front matter)
2. **`EleventyRenderPlugin`**: Render files via `{% renderFile %}` (used in `pages/libweb/resbnc/index.njk`)

### Custom Filters (`src/eleventy/filters/`)
1. **`getHumanDate`**: `{{ date | getHumanDate }}` → "11 февраля" (RU locale, `DATE_FORMAT_HUMAN`)
2. **`getHumanDateWithYear`**: `{{ date | getHumanDateWithYear }}` → "11 февраля 2025" (`DATE_FORMAT_HUMAN_WITH_YEAR`)
3. **`getSitemapDate`**: `{{ page.date | getSitemapDate }}` → ISO 8601 (RFC 3339) format for sitemap.xml
4. **`limit`**: `{{ collection | limit(5) }}` → first 5 items
5. **`getYears`**: `{{ collections.benexByYear | getYears }}` → sorted years array (for auto-archives)
6. **`getAllNews`**: `{{ collections.newsByYear | getAllNews }}` → all news merged, sorted by date (for homepage)
7. **`hasPrefix`**: `{{ urlPath | hasPrefix("/news/") }}` → true if string starts with prefix

### Shortcodes
- **`version`**: `{% version %}` → timestamp for cache busting

### Global Data
- **`getGlobalCurrentYear`**: Current year (via dayjs)
- **`meta`**: Site metadata (registered via `globalData.ts`)

### Watch Targets
- `./src/assets/` changes trigger rebuild

### TypeScript Support
- All config/modules use `.ts`
- `tsx` executes TS files
- Imports work without `.js` (via `moduleResolution: "bundler"`)
- Custom types in `src/types/eleventy.d.ts`
- TS data files registered via `addGlobalData()`

---

## 🚢 CI/CD & Deploy

### GitHub Actions
- Auto-deploy on push to `master`
- File: `.github/workflows/main.yml`
- Node.js 22, Yarn with `--frozen-lockfile`
- Production build with `NODE_ENV=production`
- Deploy via rsync with SSH keys from GitHub Secrets
- Env vars: `$SSH_HOST`, `$SSH_PATH`

### Local Deploy
```bash
yarn deploy  # build && transfer
# Requires .env or env vars
```

---

## 💻 Client-Side Features

**Main file**: `src/assets/js/index.js`

**Modules**:
1. `resbncBbTable.js` (pages/resbnc.js): Responsive tables
2. `openLinksInPortal.js` (features.js): Modal windows for external links
3. `elcatToggleList.js` (pages/elcat.js): Expandable lists with Mutation Observer
4. `menuMobile.js` (features.js): Mobile navigation menu
5. `targetBlank.js` (utils.js): Auto `target="_blank"` for external links
6. `setCurrentYear.js` (utils.js): Set current year in DOM
7. `getHolidays.js` (features.js): Holiday handling
8. `analytics.js` (analytics.js): Analytics integration (Yandex.Metrica, etc.)

**Initialization**: All modules init in `DOMContentLoaded`. Mutation Observer used for `elcatToggleList` and `targetBlank`.

---

## 📝 File Formats & Conventions

### News
- **Naming**: `YYYY-MM-DD.md` (validated via dayjs in `makeCollection()`)
- **Front matter**:
  ```yaml
  ---
  title: News Title
  date: 2025-01-15
  ---
  ```

### BENex Bulletins
- **Naming**: `BENexNN.md` (NN = 01-21)
- **Format**: Markdown → HTML
- **Front matter**: `title` field
- **Auto-pages**: `BENex_by_years.njk` generates `/BENex/YYYY/` pages using `benexByYear` collection

### BNP Bulletins
- **Naming**: `bnpNN.html` (NN = 01-10)
- **Format**: HTML passthrough

### Page Templates
- **Navigation front matter**:
  ```yaml
  ---
  title: Page Title
  eleventyNavigation:
    key: nav-key
    order: 5
  ---
  ```

---

## 🔍 Links

- [DeepWiki](https://deepwiki.com/frendly/chglib)
- [GitHub Wiki](https://github.com/frendly/chglib/wiki)
- [Eleventy Docs](https://www.11ty.dev/docs/)
- [Nunjucks Docs](https://mozilla.github.io/nunjucks/)
- [esbuild Docs](https://esbuild.github.io/)
- [PostCSS Docs](https://postcss.org/)

---

## ⚠️ Important Notes

1. **Always update CURSOR.md** when making changes (filters, functions, logic, structure, etc.)
2. **Node.js**: >=20 (22.x recommended, see `.nvmrc`)
3. **Yarn**: Fixed version 1.22.22 in `package.json`
4. **TypeScript**: All config/modules use `.ts`
5. **Imports**: No `.js` extension needed (via `moduleResolution: "bundler"`)
6. **Dates**: Use **dayjs** instead of native Date. Formats in `src/const/dateFormats.ts`
7. **News format**: `YYYY-MM-DD.md` required (uses `DATE_FORMAT_ISO`)
8. **TS data files**: Register via `addGlobalData()` in `globalData.ts` (not auto-loaded)
9. **LEGACY**: `src/LEGACY/` not used in build, reference only
10. **Production**: Always uses `NODE_ENV=production` for minification
11. **Watch**: Auto-tracks `src/assets/` changes
12. **Layout**: Only `src/_includes/layouts/base.njk` used

---

## 🐛 Debugging

1. **JS build errors**: Check `src/assets/js/index.js` and imports
2. **CSS build errors**: Check `src/assets/styles/index.css` and PostCSS syntax
3. **Collection issues**: Verify date format in news filenames and folder structure
4. **Deploy issues**: Check `$SSH_HOST`, `$SSH_PATH` env vars and SSH keys in GitHub Secrets

---

---

## 🗺️ Sitemap

- **Dynamic generation**: `pages/sitemap.xml.njk` generates sitemap from `collections.all`
- **Output**: `/sitemap.xml` in root
- **Includes**: All HTML pages (static files like PDF/images excluded)
- **Base URL**: `https://chglib.icp.ac.ru` (HTTPS)
- **Priority logic**: Homepage (1.0), main sections (0.8), others (0.6)
- **Change frequency**: Homepage (daily), sections (weekly), others (monthly)
- **Date format**: ISO 8601 (RFC 3339) via `getSitemapDate` filter

---

*Last update: 2025-01-15*
*Doc version: 3.1 (sitemap, filters update)*
*Project version: 4.1.0 (TypeScript)*
