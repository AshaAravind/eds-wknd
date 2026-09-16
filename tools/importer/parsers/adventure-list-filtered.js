/* eslint-disable */
/* global WebImporter */

/**
 * Parser for the adventures-landing dynamic list (config-only).
 * Emits an "Adventure List" block with a path and the category filter tabs.
 * Individual cards are populated at render time from query-index.json.
 */
export default function parse(element, { document }) {
  const cells = [
    ['Adventure List'],
    ['path', '/us/en/adventures/'],
    ['filters', 'All, Climbing, Cycling, Skiing, Surfing, Travel'],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
