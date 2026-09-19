/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: adventure-list
 * Base block: adventure-list (dynamic listing)
 * Source: https://wknd.site/us/en/adventures.html (.tabs.panelcontainer / .cmp-tabs)
 *   and https://wknd.site/us/en.html (.cmp-image-list — "next adventures" preview)
 * Generated: 2026-09-19
 *
 * DYNAMIC / config-only block. The source renders adventure cards, but in EDS this
 * content is generated at render time by the adventure-list block from
 * query-index.json. The parser therefore does NOT enumerate the source cards — it
 * emits a configuration block table (2 columns: key/value).
 *
 * Two instances are supported:
 *  - adventures-landing: the FULL filterable grid (source has `.cmp-tabs__tab`
 *    category tabs). Emits `path` + `filters` (labels read from the source tabs);
 *    no `limit`, so the block shows all adventures with filter tabs.
 *  - home "next adventures": a preview grid (no tabs). Emits `path` + `limit` = 4.
 */
export default function parse(element, { document }) {
  // Category filter tabs identify the full filterable grid variant
  const tabLabels = Array.from(
    element.querySelectorAll('.cmp-tabs__tab, [role="tab"]'),
  )
    .map((tab) => tab.textContent.trim())
    .filter(Boolean);

  const cells = [['path', '/us/en/adventures/']];

  if (tabLabels.length) {
    // Full filterable grid — emit filter tab labels, no limit (show all)
    cells.push(['filters', tabLabels.join(', ')]);
  } else {
    // Preview grid (e.g. home page "next adventures") — limit to 4 cards
    cells.push(['limit', '4']);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'adventure-list', cells });
  element.replaceWith(block);
}
