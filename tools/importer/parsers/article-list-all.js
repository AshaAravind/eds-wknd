/* eslint-disable */
/* global WebImporter */

/**
 * Parser for the magazine-landing "All Articles" dynamic list (config-only).
 * Emits an "Article List" block with just a path (no limit → show all).
 *
 * The path filter is derived from the page's own document path so the block
 * lists the articles under the current section, locale-agnostically:
 *   /us/en/magazine.html            → /us/en/magazine/
 *   /ca/en/magazine.html            → /ca/en/magazine/
 *   /ca/en/magazine/members-only.html → /ca/en/magazine/members-only/
 * Falls back to /us/en/magazine/ when no usable URL is provided.
 */
export default function parse(element, { document, url, params } = {}) {
  let listPath = '/us/en/magazine/';
  const src = (params && params.originalURL) || url;
  if (src) {
    try {
      const raw = new URL(src).pathname
        .replace(/\/$/, '')
        .replace(/\.html?$/, '');
      if (raw) listPath = `${raw}/`;
    } catch (e) { /* keep fallback */ }
  }
  const cells = [
    ['Article List'],
    ['path', listPath],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
