I'll investigate the current state to build an accurate plan.I have enough to draft the plan, but one scoping decision affects what work is needed.# Move About Us Page into "ema-test" Folder

## Goal
Relocate the migrated About Us page so it lives under an `ema-test/` folder (path `/ema-test/about-us`), and update the import pipeline so future re-imports write to the new location automatically.

## Current State
- Content file: `content/about-us.plain.html` (imported, 93.4% completeness)
- Import report path: `about-us`
- Import script: `tools/importer/import-about-us.js` derives the output path from the source URL pathname (`/about-us`), so re-imports currently land at `content/about-us.plain.html`
- No `content/ema-test/` folder exists yet

## Approach
The page's document path is derived in `import-about-us.js` from the source URL. To durably move the page, I'll (a) relocate the existing file, and (b) add a folder prefix in the import script's path-generation step so re-imports go to `/ema-test/about-us`.

## Checklist
- [ ] Create the `content/ema-test/` directory
- [ ] Move `content/about-us.plain.html` → `content/ema-test/about-us.plain.html`
- [ ] Update `tools/importer/import-about-us.js` path logic to prefix the derived path with `/ema-test` (so re-imports write to `/ema-test/about-us`)
- [ ] Re-bundle the import script (`import-about-us.bundle.js`) so the bundle reflects the new path
- [ ] Verify the moved file renders correctly in the preview at `/ema-test/about-us`
- [ ] Confirm no stale file remains at the old `content/about-us.plain.html` location

## Notes
- The import report (`about-us.report.json`) records the old path; it will be regenerated with the correct path on the next import — no manual edit needed.
- Execution requires **Execute mode** — this plan makes file changes (moving content, editing the import script) that plan mode does not permit.
