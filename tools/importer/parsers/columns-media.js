/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-media
 * Base block: columns
 * Source: https://wknd-trendsetters.site/about-us
 * Generated: 2026-09-01
 *
 * Columns block: multi-column layout. The source has two direct child <div>s:
 *  - a text column (heading, subheading, button group)
 *  - a media column (one or more images)
 * Produces a single content row with those two columns as cells.
 */
export default function parse(element, { document }) {
  // Direct children are the visual columns
  const columnEls = Array.from(element.querySelectorAll(':scope > div'));

  // Fallback: if no direct-child divs found, bail gracefully
  if (columnEls.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  // One content row: each direct-child div becomes a column cell
  cells.push(columnEls);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-media', cells });
  element.replaceWith(block);
}
