# WKND Full-Site Migration Plan — `wknd.site/us/en`

Migrate the WKND Adventures site (starting at `https://wknd.site/us/en.html`) and all linked pages into this Edge Delivery site. Match WKND branding, replace the hero with a carousel, and build dynamic index-backed listings.

**All decisions locked in — plan is execution-ready:**
- ✅ Migrate **all pages** under `/us/en`
- ✅ **Match WKND branding** (fonts / colors / buttons)
- ✅ Replace the empty `hero` stub with a **`carousel`** block
- ✅ Article & adventure listings are **dynamic** (index-backed) — confirmed: each article/adventure **is a separate page**, so an EDS `query-index.json` will index them and the listing blocks read from it
- ✅ **Replicate** the adventure category filter tabs (All / Climbing / Cycling / Skiing / Surfing / Travel)
- ✅ **Members Only** section migrated as **static content**; its buttons are inert placeholders (revisit auth later)

## Dynamic / Non-Authored Content Analysis

The classic WKND reference site is an **AEM Sites (WCM)** site. Several sections that look like hand-authored cards are actually **query-driven Lists backed by Content Fragments** — a plain scrape captures rendered output, not the authoring model. Because each article/adventure has its own detail page, the EDS-native approach is a **dynamic list block reading `query-index.json`**.

| Section | Source rendering | EDS approach |
|---------|-----------------|--------------|
| **Hero** | JS multi-slide carousel | `carousel` block; slides authored as rows |
| **Recent / All Articles** | Query-driven List over article CFs | **Dynamic** `article-list` block ← `query-index.json` (one row per article page) |
| **Adventures grid + tabs** | Query-driven List + category filter | **Dynamic** `adventure-list` block ← `query-index.json` + **client-side filter tabs** |
| **Magazine → Members Only** | Gated / personalized | **Static** teaser; **inert** buttons (no destination) |
| **Featured / Next teasers** | Statically authored | `teaser` / `columns` block |
| **Language/region selector** | Static hrefs | Static (only `/us/en` tree in scope) |
| **Header / Footer** | Static | Reuse existing blocks |

**Index strategy:** define `query-index.json` config (via `helix-query.yaml`) that indexes migrated article and adventure pages, exposing fields the listing blocks need — `title`, `image`, `description`, `path`, `category`/`tags` (for adventure filtering), `publish-date`. Article/adventure detail pages carry page metadata (category, tags, hero image) so the index and filter tabs populate correctly.

## Scope — Pages to Migrate (all under `/us/en`)

- [ ] Homepage (`/us/en`)
- [ ] Magazine landing + **each** article detail page (LA Skateparks, Ski Touring, Arctic Surfing, San Diego Surf, Camping WA, Alaskan Adventure, Fly Fishing…)
- [ ] Adventures landing + **each** adventure detail page (Climbing NZ, Yosemite, Whistler, West Coast Cycling, Tahoe…)
- [ ] FAQs
- [ ] About Us

> Full URL inventory discovered via sitemap/crawl in step 1; list above is provisional. Detail pages are essential — they are the rows the dynamic listings index.

## Block Gap Analysis (source needs vs. GitHub repo)

**Existing blocks:** `cards`, `columns`, `footer`, `fragment`, `header`, `hero` (⚠️ empty stub), `widget`

| Need | Block | Status | Action |
|------|-------|--------|--------|
| Header/nav + language selector | `header` | ✅ Exists | Reuse; wire nav content |
| Hero slider | **`carousel`** | ❌ Build new | Block Collection seed — replaces `hero` stub |
| Featured/Next teasers | **`teaser`** | ⚠️ Partial | Build (image + heading + copy + CTA); `columns` fallback |
| Article listing | **`article-list`** | ❌ Build new | Dynamic, reads `query-index.json` |
| Adventure listing + filter tabs | **`adventure-list`** | ❌ Build new | Dynamic + client-side category filtering |
| Detail-page body | `columns` + default content | ✅ Exists | Reuse |
| Members-only teaser (inert CTA) | `teaser` / default content | ⚠️ Partial | Static; buttons have no target |
| FAQ accordion | **`accordion`** | ❌ Build new (if needed) | Block Collection seed if FAQ uses accordions |
| Footer | `footer` | ✅ Exists | Reuse; wire social + attribution |

**New blocks to create:** `carousel`, `teaser`, `article-list`, `adventure-list`, and `accordion` (if FAQ requires it).

## Design / Branding Updates (match WKND)

- [ ] **Typography** — WKND display/serif headings + clean sans body; replace Roboto tokens in `styles/fonts.css` + `--heading-font-family`/`--body-font-family`
- [ ] **Color palette** — WKND warm accent CTA on dark imagery; update `--link-color`, button `accent`/`primary` in `styles.css`
- [ ] **Buttons** — source CTAs rectangular/outlined-on-image vs. current pill (`border-radius: 2.4em`) — adjust
- [ ] **Carousel overlay** — text-on-image, gradient scrim, bottom-left alignment, dot nav
- [ ] **Listings/cards** — borderless, image-led, tight title + muted description; filter-tab bar styling
- [ ] **Header** — transparent-over-hero treatment; **Footer** — dark theme with social icons
- [ ] **Section spacing & max-width** — verify against source rhythm

## Checklist

- [ ] Discover full URL inventory (sitemap/crawl) for `/us/en`; group into page templates (home, magazine landing, article, adventures landing, adventure, FAQ, about)
- [ ] Scrape all in-scope pages — cleaned HTML, screenshots, metadata, images
- [ ] Run page analysis per template to confirm sections + block variants
- [ ] Extract WKND design tokens → update `styles/styles.css` + `styles/fonts.css`
- [ ] Build **`carousel`** block (replaces empty `hero` stub) — slides, overlay, CTA, dot nav
- [ ] Build **`teaser`** block (featured/next/members-only; members CTAs inert)
- [ ] Build **`article-list`** block (dynamic, reads `query-index.json`)
- [ ] Build **`adventure-list`** block (dynamic + client-side category filter tabs)
- [ ] Build **`accordion`** block if FAQ requires it
- [ ] Define `helix-query.yaml` → `query-index.json` (title, image, description, path, category/tags, date) and set detail-page metadata for indexing + filtering
- [ ] Wire **`header`** (nav + language selector) and **`footer`** (nav + social + attribution) content
- [ ] Generate import infrastructure (parsers + transformers) per template
- [ ] Bulk-import all pages into `content/` via the project import script
- [ ] Preview locally; verify dynamic listings populate and adventure filters work; compare each page to source; iterate on design (visual critique)
- [ ] Run `npm run lint` and fix issues
- [ ] Post-import validation (content completeness) + performance (target PageSpeed 100) + accessibility

## Notes / Deferred

- **Members Only auth** — migrated as static content with inert buttons; real gating/personalization is a future task.
- **Regions** — only the `/us/en` tree is in scope; other language/region trees deferred.

> **Note:** This plan is in Plan mode and is now execution-ready. Actually running it — scraping, creating blocks, editing CSS/tokens, defining the query index, and importing content — requires switching to **Execute mode**.

All open questions are resolved. Approve this plan (switch to Execute mode) and I'll begin with URL discovery and scraping.
