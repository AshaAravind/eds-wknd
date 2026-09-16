# Full Site Migration to AEM Edge Delivery Services

## Overview
Migrate an entire website to AEM Edge Delivery Services (EDS). The migration will crawl the full site, discover and group pages into templates, extract the design system, and instrument navigation and footer. This plan covers the end-to-end workflow from URL discovery through validated, imported pages.

**Scope confirmed:**
- **Source:** _(URL to be provided — required before execution)_
- **Breadth:** Full site crawl (sitemap/crawl-based discovery)
- **Includes:** Page content · Navigation/Header · Footer · Design/Styling

## Prerequisites (needed before execution)
- [ ] **Source site URL** — the exact address to crawl (e.g. `https://www.example.com`)
- [ ] Confirm the target EDS repo is this project (`main` branch, boilerplate-based)
- [ ] Local dev server available at preview for rendering verification

## Phase 1 — Discovery & Scope
- [ ] Discover all URLs via sitemap (fallback to crawl if no sitemap)
- [ ] Analyze representative pages and detect project type (doc / da / xwalk)
- [ ] Identify the project-specific block library endpoint / available EDS blocks
- [ ] Produce a site scope report (URL count, page types, blocks in use)

## Phase 2 — Template Cataloging
- [ ] Group similar pages into page templates
- [ ] Build the site catalog (template → representative URLs)
- [ ] Confirm template groupings and pick representative pages per template

## Phase 3 — Design System Extraction
- [ ] Extract global design tokens (colors, typography, spacing) from the source
- [ ] Apply site-level styling to `styles/styles.css`, `fonts.css`, `lazy-styles.css`
- [ ] Establish per-block styling baselines for reuse across templates

## Phase 4 — Page Analysis & Block Mapping
- [ ] Analyze each template's structure (sections, sequences, default content vs blocks)
- [ ] Detect and reuse existing block variants (similarity matching); create new variants where needed
- [ ] Record block mappings + DOM selectors in `page-templates.json`

## Phase 5 — Import Infrastructure
- [ ] Generate block parsers for each variant (`tools/importer/parsers/`)
- [ ] Generate page transformers (cleanup, sections, Dynamic Media) (`tools/importer/transformers/`)
- [ ] Assemble the import script combining templates + parsers + transformers

## Phase 6 — Content Import
- [ ] Run bulk import across all discovered URLs (via bundled import script)
- [ ] Generate HTML content into the content directory (script-driven only)

## Phase 7 — Navigation & Footer
- [ ] Instrument the header/navigation (desktop, mobile, megamenu as applicable) with screenshot evidence
- [ ] Build and instrument the footer (desktop, mobile, validation)

## Phase 8 — Validation & QA
- [ ] Post-import validation: score each page for content completeness (source vs output)
- [ ] Visual critique of flagged pages/sections against the original
- [ ] Verify rendering in preview (DOM snapshot + computed-style checks)
- [ ] Run `npm run lint` and fix issues
- [ ] Spot-check accessibility (heading hierarchy, alt text) and performance

## Checklist (Summary)
- [ ] Provide source site URL _(blocks execution)_
- [ ] Phase 1 — Discover URLs & site scope
- [ ] Phase 2 — Catalog templates
- [ ] Phase 3 — Extract & apply design system
- [ ] Phase 4 — Analyze pages & map blocks
- [ ] Phase 5 — Build import infrastructure
- [ ] Phase 6 — Run content import
- [ ] Phase 7 — Migrate navigation & footer
- [ ] Phase 8 — Validate, critique, lint & QA

## Notes
- **Execution requires Execute mode** — this is a plan only. Once you provide the URL and approve, I'll begin with Phase 1 (discovery).
- A full site crawl can surface a large number of pages; after discovery I'll report the count and confirm before running the bulk import.
