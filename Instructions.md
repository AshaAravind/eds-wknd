# Instructions.md

Project-specific context for the WKND → Edge Delivery Services migration. Read this **and** [AGENTS.md](AGENTS.md) before starting work — AGENTS.md covers general EDS/project conventions, this file covers what's specific to this migration.

## Project Context

- **What**: Migrating the WKND Adventures & Travel site into Edge Delivery Services (EDS), authored on **Document Authoring (da.live)**, using the Experience Modernization Agent (EMA) migration tooling.
- **Repo**: `AshaAravind/eds-wknd` on GitHub.
- **Source site**: https://wknd.site — the classic Adobe WKND adventures/travel demo (AEM Sites/WCM-rendered). Nav: Home, Magazine, Adventures, FAQs, About Us, plus a language/region selector. Locked scope is **all pages under `/us/en`**; other locales (`ca/en`, `ca/fr`, `ch/de`, `ch/fr`, `ch/it`, `de/de`, `es/es`, `fr/fr`, `it/it`, `us/es`) are only in scope for the `home` template today.
- **da.live target**: org `ashaaravind`, site `eds-wknd`, content host `https://content.da.live/ashaaravind/eds-wknd/` (see [.migration/project.json](.migration/project.json)). Use the `da-live-admin` MCP tools when you need to inspect/manage authored content, the block library, media index, or site config on da.live rather than guessing.

## Migration Planning Artifacts (read these first)

EMA maintains its own planning/analysis output in-repo — **treat these as the source of truth**, don't re-derive this info by hand:

- [.migration/plans/wknd-homepage-migration.md](.migration/plans/wknd-homepage-migration.md) — the locked-in overall migration plan: scope, branding decisions, and the key architectural call that **article and adventure listings are dynamic, `query-index.json`-backed lists**, not static content (each article/adventure is its own page; the classic site's "cards" are actually query-driven Lists over Content Fragments). Read this before touching `article-list`, `adventure-list`, or anything listing-related.
- [migration-work/migration-plan.md](migration-work/migration-plan.md) — a running, per-template work log (not the locked plan above) with progress notes, completeness %, and visual-fix history. Currently covers `article-detail` (complete, all 12 pages, 96.7–98.9% completeness) and `adventure-detail` (complete). Append to this rather than duplicating the overall plan.
- [.migration/project.json](.migration/project.json) — da.live site wiring (org/site/content host, sidekick library URL).
- [catalog/summary.json](catalog/summary.json) — site-analysis snapshot: 64 pages crawled across 7 locales, 6 templates, 31 detected block types (24 mapped to EDS block variants, 7 unknown as of the last analysis run).
- [catalog/template-catalog.json](catalog/template-catalog.json) and [tools/importer/page-templates.json](tools/importer/page-templates.json) — the current template/block/URL mapping (see below).

## Current Templates & Blocks

Per `page-templates.json`, the site resolves to **6 templates**:

| Template | Representative URL | Blocks used |
|---|---|---|
| `home` | `/us/en.html` (+ other locale homepages) | `carousel` (hero), `teaser` (featured/next), `article-list`, `adventure-list` |
| `adventure-detail` | `/us/en/adventures/bali-surf-camp.html` | `breadcrumbs`, `carousel` (hero), `tabs` (title/metadata/body) — **complete**, all 32 pages (us+ca) |
| `article-detail` | `/us/en/magazine/san-diego-surf.html` | `hero-article`, `breadcrumbs`, `author-bio`, `cards-related` — **complete**, all 12 pages |
| `adventures-landing` | `/us/en/adventures.html` | `hero` (banner + intro text overlay), `adventure-list` (filterable card grid) — mapped as of PR #4 |
| `content-landing` | `/us/en/about-us.html`, `/us/en/magazine.html` | not yet mapped in `page-templates.json` (featured-article split panel + teaser card grid) |
| `faqs` | `/us/en/faqs.html` | not yet mapped in `page-templates.json` (title, hero image, intro, accordion, contact sidebar) |

**PR #4** ("Add breadcrumbs, carousel, tabs blocks, update importer") merged into `main` on 2026-09-19 — it's what took `adventure-detail`/`article-detail` to complete and added the `adventures-landing` block mapping above.

Blocks under [blocks/](blocks) as of `main`:

- `header`, `footer` — site chrome
- `hero` — banner block used by `adventures-landing` (not the homepage hero, which uses `carousel`)
- `carousel` — hero slider; also used as the adventure-detail mini gallery
- `teaser` — featured/next-adventure promo blocks
- `article-list`, `adventure-list` — **dynamic**, index-backed listing blocks (read `query-index.json`); `adventure-list` also drives the category filter tabs (All/Climbing/Cycling/Skiing/Surfing/Travel)
- `breadcrumbs` — page breadcrumb trail (adventure-detail, article-detail)
- `tabs` — adventure-detail body tabs
- `hero-article` — article-detail hero image
- `author-bio` — article-detail author block (renders social links as icon-only buttons — see `migration-work/migration-plan.md` for why: raw text labels overlapped in the dark square buttons)
- `cards-related` — article-detail "up next" related links
- `quote` — pull-quote block (generated for article-detail pages with pull-quotes; not yet used by the imported pages, which have none)
- `cards`, `columns` — general-purpose fallbacks
- `fragment`, `widget` — reusable includes / misc embeds

Before creating a new block, check this list, `page-templates.json`, and the migration plan's block-gap table for an existing block that already covers the pattern.

## Design Tokens

Brand tokens live in `styles/brand.css` and are surfaced as CSS custom properties in [styles/styles.css](styles/styles.css):

- Fonts: `--body-font-family` (Instrument Sans), `--heading-font-family` (Syncopate)
- Colors: `--background-color`, `--light-color`, `--dark-color`, `--text-color`, `--link-color`, `--link-hover-color`
- Heading sizes are mobile-first with a `900px` override block

The migration plan requires **matching WKND branding** (fonts/colors/buttons) — check these tokens against the live site's design before hardcoding a value, and update tokens rather than one-off styles when a value recurs.

## Migration-Specific Rules

- **Dynamic listings, not static cards**: `article-list` and `adventure-list` must read from `query-index.json` (configured via `helix-query.yaml`), not from hardcoded per-page content — this was a deliberate architectural decision (see the migration plan), not an oversight. Detail pages must carry the metadata (category, tags, hero image, publish-date) the index and filter tabs depend on.
- **Visual parity first**: for every block, compare the rendered EDS page against the corresponding source URL on `wknd.site`. The goal is equivalent structure/content, not pixel-identical CSS.
- **Never hardcode the source domain** (`wknd.site`) into block JS/CSS — it's a migration reference only, not a runtime dependency.
- **Preserve the author contract**: block markup structures are designed against real authored content. If you change a block's expected DOM shape, check `page-templates.json` for every section/template that maps to it, and re-run/verify the corresponding importer under `tools/importer`.
- **Members Only section**: migrated as static content only; its CTAs are intentionally inert placeholders (no auth yet) — don't wire them up without a separate decision to add auth.
- **Images**: importer-pulled images must go through normal EDS optimization; don't commit unoptimized source-site images directly into the repo (icons/fonts excluded).
- Follow the shared JS/CSS/HTML conventions in [AGENTS.md](AGENTS.md) — this file only adds migration-specific context, it doesn't replace those rules.

## Working Branch Hygiene

This project's agent-driven commits land on timestamped branches (e.g. `aem-20260918-2153`) that get PR'd into `main`. **Not every such branch gets merged** — at least one earlier branch (`aem-20260916-1202`, an early exploration that pointed at a placeholder `wknd-trendsetters.site` instead of the real source) diverged from `main` and was abandoned in favor of a later branch that got it right. Before starting new work, confirm which branch you're on and whether it's up to date with `origin/main` (`git log --oneline origin/main` vs the current branch) rather than assuming the working directory reflects the latest migration state. Once a branch's PR merges, switch back to `main` and pull before starting the next chunk of work.

## Status / Open Items

> Fill this section in as the migration progresses — it's the fastest way for an agent to "warm up" on where things stand.

- [x] **PR #4** merged into `main` (2026-09-19, commit `f6984c8`) — `adventure-detail` and `article-detail` templates are complete; `adventures-landing` now has a block mapping (`hero`, `adventure-list`).
- [ ] `content-landing` and `faqs` templates still have no `blocks` mapping in `page-templates.json` — the two remaining templates to build out.
- [ ] `query-index.json` / `helix-query.yaml` setup for `article-list`/`adventure-list` — no config found at the repo root yet; confirm whether this is still pending or lives elsewhere.
- [ ] Locale scope beyond `home` (`ca`, `ch`, `de`, `fr`, `es`, `it`) — confirmed out of scope for now, revisit if that changes.
- [ ] `catalog/summary.json` still reports 7 "unknown" block variants and 1 error, but this looks like a **stale snapshot from the initial 2026-09-18 analysis run** — `migration-work/migration-plan.md` notes 3 of those were already resolved to `hero-article`/`cards-related` during article-detail work. Re-run the analysis or otherwise confirm the current unresolved count before treating this number as accurate.
