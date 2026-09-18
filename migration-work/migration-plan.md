# Migration Plan: Article Detail (Single Page)

**Mode:** Single Page
**Source:** https://wknd.site/us/en/magazine/san-diego-surf.html
**Template:** article-detail (12 pages)
**Generated:** 2026-09-18

## Steps
- [x] 1. Project Setup (type: da, already configured)
- [x] 2. Identify Page Templates (article-detail selected)
- [x] 2.5 Block Library Generation (quote generated; hero-article, author-bio, cards-related generated per-page; breadcrumbs/hero reused)
- [x] 3. Page Analysis (6 sections: hero-article, breadcrumbs, article-header, article-body, author-bio, sidebar)
- [x] 4. Block Mapping (4 blocks, 6 sections)
- [x] 5. Import Infrastructure (hero-article/author-bio/cards-related parsers; cleanup+sections transformers extended for sidebar chrome)
- [x] 6. Content Import (san-diego-surf imported, 96.7% completeness)

## Current Status
- **Active Step:** Complete — all 12 article-detail pages migrated

## Full article-detail set
- Re-imported all 12 article-detail URLs (7 CA incl. 2 members-only + 5 US) through the same pipeline. 12/12 success, 96.7–98.9% completeness.
- Verified per page: exactly 1 hero-article + breadcrumbs + cards-related + author-bio; in-body images stay default content.
- All template-level (parsers/transformers/section mapping/block CSS) so applied uniformly.
- Needs publish to render live.

## Notes
- New blocks: hero-article (forked hero, image-only lead banner), author-bio (avatar+name+role+social), cards-related (forked cards, related-articles list). quote block also generated for other article pages that have pull-quotes (this page has none).
- Fixed hero-article selector to match only the lead image (was over-matching in-body article images); in-body images now import as default content.
- 3 catalog "unknown-base" variants resolved to hero-article / cards-related during page analysis.
- Needs publish to render live.

## Design Migration (blocks-only, page scope)
- Styled from exact source computed values: hero-article (~98%, contained lead image at natural aspect ratio — corrected from full-bleed), author-bio (~95%, avatar + serif name + uppercase role + dark social buttons, divider above), cards-related (~95%, uppercase title + gray date + left accent strip).
- Full project lint passes.
- Known gaps (not block CSS):
  - author-bio social-icon cell is empty in imported content — the source's icon-font links (#jbarr placeholders) didn't survive the parser. Block CSS/JS support them if re-imported.

## Visual critique fix: author-bio social icons (arctic-surfing)
- Problem: social links imported as text labels ("Facebook/Twitter/Instagram") which rendered as cramped overlapping text jammed into the dark square buttons.
- Fix (block-level, applies to all article pages): author-bio.js now detects each link's platform, adds an author-bio-social-<platform> class, moves the label to aria-label, and empties the visible text; author-bio.css hides the text and draws the platform glyph as a masked SVG icon (icon-only buttons matching the source).
- No re-import needed — the decorate() runs at render time on the existing imported content. Verified via in-browser simulation: clean Facebook/Twitter/Instagram icons on dark squares. Lint passes.
  - Article body + related-list render stacked; source uses a 2-column article/sidebar layout. Same structural pattern as adventure-detail's sidebar — a page-layout concern, not block styling. [RESOLVED — see below]

## 2-column article layout (follow-up)
- Merged article-header + article-body + author-bio + sidebar into one `article-main` section (page-templates.json + import script; dropped rc4/rc5/rc6, blocks still parse). Re-imported all 12 pages (12/12, article-main present on every page).
- lazy-styles.css: `.section.article-main` uses CSS grid at ≥900px — article content (default content + author-bio) in a wide left column (1fr), cards-related "up next" list in a 300px right sidebar; stacks on mobile.
- Verified via in-browser simulation: content left column (120–972) + sidebar (1140, 300px wide) render side-by-side at the same top. Matches source.
- Full project lint passes. Needs publish to render live.

### 2-column refinement (measured against source)
- Source geometry (1440px): hero img 152–1288; article left column 138–914 (776px); sidebar 1011–1302 (291px); gutter 97px; sidebar starts at top ~990 (aligned with title row).
- Bug found: grid was on `.section` but child wrappers kept styles.css `max-width:1200px; margin:auto; padding:0 32px`, so the left column re-centered as wide as the hero (text matched hero's left padding). Sidebar also flowed below content.
- Fix: put the centered container (max-width:1200px; margin:auto; padding:0 32px) on the `.article-main` grid itself; reset child wrappers (`> div { max-width:none; margin:0; padding:0 }`); columns `minmax(0,1fr) 291px` with 97px gutter; sidebar pinned `grid-row: 1 / span 99` so it starts at the top row.
- Re-verified via simulation: left column now 120–932 (distinct, narrower than hero); sidebar 1029–1320 starting at top 983. Matches source structure.

---

# Migration Plan: Adventure Detail (Single Page)

**Mode:** Single Page
**Source:** https://wknd.site/us/en/adventures/bali-surf-camp.html
**Template:** adventure-detail
**Generated:** 2026-09-18

## Steps
- [x] 1. Project Setup (type: da)
- [x] 2. Identify Page Templates (6 templates; migrating adventure-detail)
- [x] 2.5 Block Library Generation (adventure-detail scope: breadcrumbs, tabs generated; carousel augmented)
- [x] 3. Page Analysis (4 sections; breadcrumbs/carousel/tabs reused)
- [x] 4. Block Mapping (3 blocks, 4 sections mapped)
- [x] 5. Import Infrastructure (breadcrumbs/carousel/tabs parsers; cleanup+sections transformers)
- [x] 6. Content Import (bali-surf-camp imported, 93.9% completeness)

## Current Status
- **Active Step:** Complete — single adventure-detail page migrated + design applied

## Design Migration
- Phase 1: site design system confirmed WKND-tuned (Asar + Source Sans Pro, #ffea00 accent, #202020 dark); corrected link color to #202020 to match source.
- Phase 2: styled breadcrumbs (~95%), carousel mini variant (~95%), tabs (~97%) from exact source computed values, using design-token CSS vars.
- Fixed breadcrumbs.js: now collects authored `<li>` crumbs (linked + trailing current page), not just anchors.
- Full project lint passes.
- Note: localhost serves the remote-published DA content for this path, so a live full-page render awaits uploading content/us/en/adventures/bali-surf-camp.plain.html to Document Authoring.

## Visual Critique (page mode) + fixes
Compared migrated page vs original WKND page (1440px full-page). Blocks matched well; found and fixed:
1. Duplicate title — cleanup transformer now removes hidden `.cmp-contentfragment__title`; re-imported (single H1 confirmed).
2. Metadata layout — rc3 section given style `adventure-info`; lazy-styles.css styles it as a metadata sidebar (uppercase gray labels, bold values, divider lines, left float at desktop).
3. Title underline — yellow 84px accent bar under the H1 via `.adventure-info h1::after`.
- All fixes on disk + re-imported; full project lint passes. Re-publish the page to see them live (preview still shows the earlier published copy).

## Column fix (follow-up)
- Root cause: metadata and tabs were two separate EDS sections, so no CSS could place them side-by-side.
- Fix: merged tabs into the title-metadata section (rc3) in page-templates.json + import script (dropped rc4; tabs block still parses). Re-imported — metadata list, Share heading, and tabs block now sit in one `.adventure-info` section.
- lazy-styles.css: desktop 2-column layout — 280px metadata sidebar (left) + tabs (right), stacked on mobile.
- Verified via in-browser simulation of the merged DOM: sidebar and tabs render side-by-side at the same top (metadata 0–280px, tabs 280px+). Matches source.
- Needs re-publish to render live.

## Notes
- Block scope limited to adventure-detail per user choice (not full library).
- Skipped for now (other templates): hero-minimal-dark-withimg, tabs-minimal-dark-withimg, quote, and augments for hero/accordion/cards/header/footer.
- 7 catalog variants have an unknown base type and need manual review.
- DA Library registration (block-library-creator) still pending for the new blocks.

## Artifacts
_To be generated_
