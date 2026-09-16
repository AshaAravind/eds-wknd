/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: adventure-list
 * Base block: adventure-list (dynamic listing)
 * Source: https://wknd.site/us/en.html (.cmp-image-list — adventures)
 * Generated: 2026-09-16
 *
 * DYNAMIC / config-only block. The source renders a static list of adventure cards,
 * but in EDS this content is generated dynamically by the adventure-list block from a
 * query index. The parser therefore does NOT enumerate the source cards — it emits a
 * configuration block table with `path` and `limit` rows.
 *
 * Structure: block name row, then one config row per key/value pair (2 columns).
 */
export default function parse(element, { document }) {
  const cells = [
    ['path', '/us/en/adventures/'],
    ['limit', '4'],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'adventure-list', cells });
  element.replaceWith(block);
}
