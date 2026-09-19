# Migration Plan: Content Landing (Single Page)

**Mode:** Template-Based (single representative page)
**Source:** https://wknd.site/us/en/magazine.html
**Template:** content-landing
**Generated:** 2026-09-19

## Steps
- [x] 1. Project Setup (type: da, verified against repo — no fstab, DA content mount)
- [x] 2. Identify Page Templates (skipped — content-landing already exists in page-templates.json)
- [~] 2.5 Block Library Generation (scoped to content-landing per user — site-wide batch deferred)
- [x] 3. Page Analysis (1 section, 9 sequences; blocks: teaser, article-list — both reused)
- [x] 3.5 Block Library Generation (nothing to generate — teaser + article-list already on disk, 100% reuse)
- [x] 4. Block Mapping (2 blocks, 1 section; teaser instances=featured/secure/list, article-list=image-list/cmp-image-list; block-context cached)
- [x] 5. Import Infrastructure (no DM/Scene7; wknd-cleanup/wknd-sections verified for single-section magazine page; teaser.js made variant-aware for .cmp-teaser--secure→members-only; article-list.js unchanged; teaser-members.js/article-list-all.js also present)
- [x] 6. Content Import (magazine.html imported 1/1 → content/us/en/magazine.plain.html; generated import-content-landing.js + bundle)

## Current Status
- **Active Step:** Complete — magazine.html (content-landing representative) migrated. Design not yet applied.

## Content Import result
- Imported https://wknd.site/us/en/magazine.html → content/us/en/magazine.plain.html (3 KB).
- Blocks present & correct: h1 "Magazine"; featured teaser (image + "Featured Article" eyebrow + h2 + description + Read More link to western-australia); "All Articles" h2 + article-list config block (path=/us/en/magazine/); "Members Only" h2 + "Sign in" rich text; 2 teaser (members-only) cards with INERT plain-text "Read More" (no href, gated); metadata (Title, Description).
- Completeness scored 72.9% (< 90% threshold) — EXPECTED, not a defect: the gap is the 5 "All Articles" card titles/descriptions, which are intentionally NOT inlined. article-list is a dynamic query-index.json-backed listing per the locked architecture (same as home template). Inlining them would violate that decision, so the standard validation "fix the gap" loop was NOT run against this block.
- New importer: tools/importer/import-content-landing.js (+ .bundle.js), urls-content-landing.txt. Distinct featured/secure teaser handling + config-only article-list, modeled on import-magazine-landing.js.
- Needs upload/publish to Document Authoring to render live.

## Design Migration (blocks-only, page scope)
- Site design system (Phase 1) already established from prior templates — reused as-is (#ffea00 accent, #202020 dark, Asar/Source Sans Pro). No brand.css (tokens live in styles/styles.css :root).
- teaser block styled ~95% from source computed values: featured = image-left split panel with light-grey content panel + yellow READ MORE button (bold uppercase eyebrow); members-only = compact image-on-top cards, 2-across at ≥600px, inert grey "Read More" pill. Featured design on base .teaser (shared with home template — verified no regression). stylelint clean.
- article-list block styled ~95%: 4-col desktop / 2-col tablet / 1-col mobile grid; uppercase Source-Sans title (not serif), gray #696969 description, 13/10 image aspect ratio. JS data logic untouched. stylelint clean.
- Section-heading underline accent: set content-landing section style="content-landing" (page-templates.json + embedded import PAGE_TEMPLATE), wired wknd-sections transformer to run for styled single-section pages (hasStyledSection guard in import-content-landing.js), and added lazy-styles.css rule `.section.content-landing .default-content-wrapper h2::after` = 84px×2px var(--accent-color) bar. Scoped to default-content h2 so featured teaser title + article card titles are unaffected. Re-imported so the Section Metadata block lands in content.
- Verified via live-DOM simulation (localhost serves remote-published copy, so content-landing class injected to represent post-publish): "All Articles"/"Members Only" get exact 84px×2px yellow Asar-serif underline; featured h2 no underline; teaser 2-col + yellow CTA; members CTA aria-disabled; article-list 4-col uppercase titles. Matches source.
- Full project lint (npm run lint) passes — JS + CSS clean.
- KNOWN: localhost still shows the earlier remote-published magazine copy (no section-metadata, no content-landing class); re-upload/publish content/us/en/magazine.plain.html to Document Authoring to render the styled version live. One hardcoded value: muted grey #696969 (no matching brand token).

## About Us page (content-landing, 2nd page) + visual critique
- Migrated https://wknd.site/us/en/about-us.html into the content-landing template. Structurally a TEAM page (not article-landing like magazine): 2 groups ("Our Contributors" ×4, "WKND Guides" ×3) of contributor profile cards.
- Block choice (user): REUSE generic `cards` block (not a new profile-cards block). import-about-us.js groups the 7 .cmp-experience-fragment--contributor cards by preceding H2 and emits two Cards blocks via parsers/profile-cards.js.
- Retargeted import-about-us.js to template name "content-landing" with a styled single section (style "content-landing") so the "Our Contributors"/"WKND Guides" H2s get the same yellow underline accent as magazine. Wired wknd-sections transformer via hasStyledSection guard. Re-imported (1/1, 87.4% completeness — gap is social-link label nuance, acceptable).
- profile-cards.js parser now emits "Cards (profiles)" → block renders class="cards profiles". Added `cards` instance (.cmp-experience-fragment--contributor) to content-landing template blocks[].
- DESIGN (scoped, no disruption to base cards or other pages):
  - cards.js: added an ADDITIVE branch guarded by block.classList.contains('profiles') — detects the social-links paragraph (p:last-child with ≥2 links), tags each link cards-social-<platform>, moves label to aria-label, empties text (same icon-only pattern as author-bio). Base cards path untouched.
  - cards.css: appended .cards.profiles variant rules ONLY (circular 164px avatars, centered Asar 24px name, uppercase 14px/600 role, 48px dark-square social icon buttons reusing author-bio's masked-SVG facebook/twitter/instagram glyphs, hover→yellow). Base .cards rules unchanged.
  - Verified base `cards` block is unaffected: a plain .cards test block still has 1px grey border, left-aligned text, square (0 radius) images, unconverted text links.
  - cards-related is a SEPARATE block dir — not touched. Magazine teaser/article-list not touched by about-us work.
- Verified post-publish render via live-DOM simulation (localhost serves the earlier remote-published about-us, which lacks images + profiles variant): section gets content-landing class; both blocks = cards profiles; avatars 164px circular; name Asar 24px centered; role uppercase 600 14px; social = flex row of 48px #202020 icon buttons with SVG masks; H2 underline 84×2px yellow. Matches source.
- Full project lint (npm run lint) passes — JS + CSS clean. Temp sim file removed.
- KNOWN: re-upload/publish content/us/en/about-us.plain.html to Document Authoring to render the profile-card styling + avatars live (the remote-published copy predates this import and shows plain left-aligned cards without images).

## Remaining content-landing pages (ca/en) — all 5 template URLs now migrated
- Scope note: project Instructions lock migration to /us/en; user explicitly asked to migrate the rest of the content-landing pages, so the 3 ca/en pages were migrated as a deliberate override.
- ca/en/magazine → import-content-landing.js (mirrors us/en/magazine: featured teaser + article-list + 2 members-only teasers + content-landing section). 73.0% completeness (dynamic article-list, expected).
- ca/en/magazine/members-only → import-content-landing.js. THIRD content-landing layout: just H1 "Members Only" + one article-list grid (2 gated articles), no teasers. The teaser selectors no-op; article-list matches. 26.5% completeness — expected/correct: the page is essentially only the dynamic list (2 cards live in query-index, not inlined).
- ca/en/about-us → import-about-us.js (mirrors us/en/about-us: 2 "cards profiles" blocks, 7 contributors, content-landing section). 87.4% completeness.
- PARSER FIX (locale-agnostic, no regression): parsers/article-list-all.js now derives the list `path` from the page's own document path (params.originalURL/url) instead of hardcoding /us/en/magazine/. Verified: us/en/magazine still → /us/en/magazine/; ca/en/magazine → /ca/en/magazine/; members-only → /ca/en/magazine/members-only/. Falls back to /us/en/magazine/ if no URL.
- All 5 content-landing pages present in content/ (us+ca). Styling (teaser/article-list/cards-profiles/heading-underline) is template/block-level CSS so it applies to the ca pages automatically — no per-page design work. Full project lint (npm run lint) passes clean.
- URL lists: urls-content-landing-ca-mag.txt, urls-about-us-ca.txt. Needs upload/publish to Document Authoring to render live.

---

# Migration Plan: Homepage (/us/en, home template) + design + critique

**Mode:** Template-Based (home already mapped) → import → design → visual critique
**Source:** https://wknd.site/us/en.html
**Generated:** 2026-09-19

## Import
- home template was already fully mapped (5 sections, 4 blocks: carousel, teaser, article-list, adventure-list — all on disk). Re-imported /us/en via existing import-home.js. 67.7% completeness (expected — two dynamic query-index lists whose cards aren't inlined).
- Verified content order matches source exactly: carousel(3 slides) → featured teaser "Camping WA" (section-metadata grey) → "Recent Articles" + article-list(path /us/en/magazine/) + "All Articles" → "Next Adventures" + teaser "Climbing NZ" → "Where do you want to go?" + adventure-list(path /us/en/adventures/) + "All Trips".

## Design migration (blocks-only, page scope) — site tokens already established
- carousel HERO variant (NEW): carousel.js now adds `carousel-hero` class when a slide's content cell has text (mini gallery authors an empty content cell → stays mini). carousel.css appends `.carousel.carousel-hero` rules: full-bleed image, content card overlay (desktop margin-top:-180px pull-up), yellow CTA button. ~95% match. ADVENTURE-DETAIL MINI CAROUSEL VERIFIED UNAFFECTED (bali-surf-camp: still 400px image-only, no hero class).
- teaser HERO variant (NEW): teaser.js adds `teaser-hero` class when content leads with a heading (no eyebrow) and isn't members-only → the "Next Adventures / Climbing NZ" promo. teaser.css: `.teaser.teaser-hero` = image-top/content-below, 18px description. Featured split-panel narrowed to `:not(.members-only, .teaser-hero)`. MAGAZINE TEASER (featured + members-only) VERIFIED UNAFFECTED.
- article-list / adventure-list: already styled from prior work; reused as-is.
- Featured "grey" section: confirmed the SOURCE has NO full-width grey section bg — only the teaser's content PANEL is grey (rgb(235,235,235)), which the teaser block CSS already renders. So NO .section.grey bg rule was added (adding one would diverge from source). Correct as-is.

## Visual critique (page mode) + fix
- Full content/structure/order comparison vs source: MATCH (all 5 sections, all blocks, correct sequence, correct list paths).
- Block designs verified 92–95% by design-expert screenshot iteration.
- FIX: stray empty `<div></div>` section (a spurious section break between the featured/recent-articles group and the article-list group) was adding ~80px dead whitespace. Added global `main > .section:empty { display:none; margin:0 }` to styles.css — safe, helps every page, collapses empty sections. Verified via live-DOM sim: empty section now display:none / height 0.
- Verified via live-DOM simulation (localhost serves remote-published homepage): carousel-hero, teaser-featured, teaser-hero, article-list, adventure-list all present & correct; empty section collapsed; grey content panel on featured teaser.
- Full project lint (npm run lint) passes — JS + CSS clean. Temp sim file removed.
- Regression checks: adventure-detail mini carousel intact; magazine teaser variants intact; base cards untouched.
- KNOWN: localhost serves the earlier remote-published /us/en; re-upload/publish content/us/en.plain.html to Document Authoring to render the imported+styled version (hero overlay, teaser-hero, collapsed empty section) live.

---

# Migration Plan: FAQs template (us/en + ca/en) + design + critique

**Mode:** Template-Based (faqs pre-existed unmapped) → map → import → design → critique
**Source:** https://wknd.site/us/en/faqs.html (+ ca/en)
**Generated:** 2026-09-19

## Structure
- Single light section: H1 "FAQs" + hero image + intro paragraph + accordion (7 Q&A) + "Need more help?" contact info. Accordion selector .accordion.panelcontainer / .cmp-accordion.

## Mapping + import
- faqs template had empty blocks[]/no sections. Mapped: block `accordion` (.accordion.panelcontainer, .cmp-accordion); one section rc1 "faqs-content" style "faqs" (blocks: accordion; defaultContent: .title/.image/.text/.separator).
- Pre-existing infra reused: parsers/accordion.js (emits Accordion block, native <details>/<summary>), blocks/accordion/*, import-faqs.js. Updated import-faqs.js to template-style "faqs" + wired wknd-sections transformer (hasStyledSection guard) so the Section Metadata lands.
- Imported us/en/faqs + ca/en/faqs — 2/2, 98.0% completeness (accordion answers ARE inlined, so high score unlike dynamic-list pages).
- Content verified: H1, hero image, intro, 7 accordion items with answers, "Need more help?" contact. Minor: one empty <h3 id=""></h3> inside an accordion answer (faithful to source's stray empty heading) — harmless.

## Design + visual critique
- accordion block (FAQ-only — verified used by NO other template/page, so safe to restyle freely): design-expert refined blocks/accordion/accordion.css ~95% from source computed values — titles switched from serif 24px to Source Sans Pro 16px/600 uppercase; plus/minus toggle indicator; 2px #ebebeb dividers; 14px body. JS unchanged (native details/summary). Expand/collapse verified.
- H1 yellow underline: added `.section.faqs .default-content-wrapper h1::after` (84px×2px var(--accent-color)) to lazy-styles.css, mirroring the content-landing h2 rule. Scoped to H1 so the accordion titles + "Need more help?" h3 are unaffected.
- Verified via live-DOM simulation (localhost serves remote-published faqs): section gets `faqs` class; H1 underline 84×2px yellow Asar; accordion titles Source Sans 16px/600; 7 items expand; "Need more help?" h3 correctly NOT underlined.
- Full project lint passes. Temp sim file removed. No shared-block disruption (accordion is faqs-only).
- KNOWN: re-upload/publish content/us/en/faqs.plain.html + ca/en/faqs.plain.html to Document Authoring to render the styled accordion + H1 underline live.

## Visual critique (page mode, follow-up) + 2-column fix
- Full-page geometry comparison (desktop 1440) revealed the ONE real gap: SOURCE uses a 2-column layout — main content (title/hero/intro/accordion) in a wide left column (x152, w748) + "Need more help?" contact in a ~291px right sidebar pinned to the top row (x1011, y245). Migrated version rendered single-column stacked (contact below accordion).
- FIX (same pattern as article-main): added `.section.faqs` CSS grid at >=900px in lazy-styles.css — `minmax(0,1fr) 291px`, 97px gutter, container reset on child wrappers; first .default-content-wrapper + .accordion-wrapper → left column (grid-column 1), LAST .default-content-wrapper (contact) → right sidebar (grid-column 2, grid-row 1/span 99). Scoped to .section.faqs so no other page is affected.
- Verified via live-DOM sim: desktop renders 2-col (content/accordion left w=812, contact right x=1029 w=291 top-aligned) matching source; mobile (375) correctly stacks (grid disabled <900px, contact below accordion). Full lint passes. Temp sim removed.

---

# Visual critique: Nav + Footer (site chrome)

**Compared:** rendered EDS header/footer (localhost, local nav.plain.html/footer.plain.html + block CSS) vs https://wknd.site source (desktop 1440).

## Findings
### Footer (structure/colors already good)
- ✅ Match: dark #202020 bg, #ebebeb text, "Follow Us" heading, nav links, copyright.
- ❌ FIXED: social links rendered as plain text ("Facebook/Twitter/Instagram") vs source's 3 icon buttons (48×48, light bg). 
### Nav
- ❌ FIXED: nav links were 24px non-uppercase dark; source is 14px UPPERCASE. 
- ⚠️ Partial: brand is a text "WKND" wordmark (styled to Asar 32px) — source uses a WKND logo SVG (128×48). No logo asset in repo (icons/ only has search.svg).
- ⚠️ Not addressed: source header has a search box + an 11-locale language dropdown; EDS nav has neither (single en-US link). These need the navigation-orchestrator (logo asset + search + megamenu/locale structure) — out of scope for a CSS-level critique fix.

## Fixes applied (shared chrome — affects all pages)
- footer.js: added social-link → icon-button decoration (detect platform, add footer-social-<platform> class, move label to aria-label, empty text). Same accessible icon-only pattern as author-bio/cards-profiles.
- footer.css: appended .footer-social rules — 48×48 light (var(--footer-text-color)) buttons, masked-SVG facebook/twitter/instagram glyphs, hover→yellow. Verified: 3 buttons 48×48 #ebebeb bg, SVG masks, aria-labels preserved.
- header.css: nav links now uppercase 14px letter-spaced var(--text-color) with hover; brand styled as Asar serif wordmark. Verified: nav link "Home" uppercase 14px; brand Asar 32px.
- Full project lint passes (one no-descending-specificity on footer social handled with a scoped stylelint-disable, matching author-bio's pattern).
- FOLLOW-UPS (need navigation-orchestrator, not done here): WKND logo image asset in nav brand, header search box, multi-locale language dropdown. Also header/footer changes need publish to render live. [DONE — see nav follow-up fixes below]

## Nav follow-up fixes (logo + search + locale dropdown) — DONE
- Scope: the WKND nav is simple (no megamenu/deep panels), so applied the navigation content-first discipline (nav.plain.html fragment → header.js reads → header.css styles) for the three known additions rather than the full 20-gate orchestration (which targets megamenu/mobile-slide-in sites).
- LOGO: fetched source wknd-logo-dk.svg → content/images/wknd-logo.svg (1.3KB). nav.plain.html brand now `<img src="images/wknd-logo.svg" alt="WKND Logo">`. Renders 128px wide. header.css `.nav-brand img` sizes it; serif wordmark kept as text fallback.
- SEARCH: header.js builds a search form (role=search, visually-hidden label, type=search input placeholder "Search") in nav-tools per the fragment contract (controls in JS, not the fragment). header.css styles it (140px, underline, uppercase placeholder).
- LOCALE DROPDOWN: nav.plain.html tools section now lists all 11 source locales (en-US, es-US, en-CA, fr-CA, de-CH, fr-CH, it-CH, de-DE, fr-FR, es-ES, it-IT) with correct paths. header.js converts the list into a toggle button (current locale) + dropdown panel; opens on click, closes on outside-click. header.css: hidden dropdown panel on desktop (absolute, shadow), inline stacked on mobile.
- nav.plain.html contract respected: 3 flat sections, no form controls/classes/ids in the fragment, logo via relative images/ path, image exists on disk.
- Verified against source via live-DOM render from the local /content/nav.plain.html fragment: logo 128px + "WKND Logo" alt; search present; locale toggle opens all 11 locales; dropdown open/close works; mobile hamburger behavior preserved (untouched). Full project lint passes (JS + CSS).
- KNOWN: localhost's served page fetches the REMOTE-published /nav.plain.html (old: text WKND, 1 locale); the dev server's /content/nav.plain.html route serves the new local fragment, and header.js dual-fetches /content first — so publishing content/nav.plain.html renders the logo + search + 11-locale dropdown live.

---

## Remaining pages migrated (locale homepages + ca/en/adventures) — 64/64 template URLs now imported
- Locale-aware parser fix: article-list.js + adventure-list.js now derive the list `path` from the page's own locale prefix (/{country}/{lang}) instead of hardcoding /us/en. import-home.js parseDynamicLists now passes url/params through. Verified no regression: us/en still → /us/en/magazine/ + /us/en/adventures/.
- ca/en/adventures (adventures-landing): imported, adventure-list path correctly /ca/en/adventures/ with filters variant. 25.8% completeness (dynamic grid — expected).
- 10 locale homepages imported (10/10) via import-home.js:
  - ca/en → FULL homepage (carousel + 2 teasers + article-list /ca/en/magazine/ + adventure-list /ca/en/adventures/). 67.7%.
  - ca/fr, ch/de, ch/fr, ch/it, de/de, es/es, fr/fr, it/it, us/es → these are "WKND Adventures and Travel - Coming Soon!" PLACEHOLDER pages on the source (just a heading + 1 image, no carousel/teaser/lists). Imports faithfully captured that; ~82% "completeness" reflects tiny placeholder pages, not dropped content. Nothing to block-model — that IS the source.
- Full project lint passes. Coverage check: 0 missing across all 6 templates.

## Overall migration status
- ALL 6 templates + ALL 64 template URLs migrated: home (11 locales — us/en + ca/en full, 9 others are source "Coming Soon" placeholders), adventure-detail (32), article-detail (12), adventures-landing (us+ca), content-landing (magazine/about-us/members-only, us+ca), faqs (us+ca). Design applied per template + nav/footer chrome refined.
- PENDING: publish imported content/*.plain.html to Document Authoring so the newly-imported/re-styled pages render live. Nav follow-ups (WKND logo image, search box, locale dropdown) need the navigation-orchestrator.

## Notes (infra)
- Pre-existing per-page importers found: import-magazine-landing.js (magazine, template name "magazine-landing"), import-about-us.js. These predate this run. content-landing template maps both magazine + about-us; Step 6 generates import-content-landing.js.

## Notes
- content-landing groups /us/en/about-us.html and /us/en/magazine.html; migrating magazine.html as the representative.
- Template pre-existing in page-templates.json with empty blocks[]/sections — this run populates them.
- Block scope: user chose to scope to content-landing. Site-wide catalog batch (augment header/footer/hero/tabs/cards/accordion/quote + generate hero-minimal-dark-withimg, tabs-minimal-dark-withimg) DEFERRED to avoid regressing merged templates. Generate per-page after analysis instead. 7 skip-unknown catalog variants still need manual base-type review.

---

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
