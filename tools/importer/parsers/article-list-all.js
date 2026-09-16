/* eslint-disable */
/* global WebImporter */

/**
 * Parser for the magazine-landing "All Articles" dynamic list (config-only).
 * Emits an "Article List" block with just a path (no limit → show all).
 */
export default function parse(element, { document }) {
  const cells = [
    ['Article List'],
    ['path', '/us/en/magazine/'],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
