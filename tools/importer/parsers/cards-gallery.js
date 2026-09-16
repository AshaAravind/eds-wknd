/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-gallery
 * Base block: cards
 * Source: https://wknd-trendsetters.site/about-us
 * Generated: 2026-09-01
 *
 * Cards block (image gallery): 2 columns, multiple rows.
 *  - Row 1: block name (added by createBlock)
 *  - Each card row: [image cell, text cell]
 * This gallery is image-only, so the text cell is empty ('') to keep
 * every row at the 2-column count required by the block structure.
 */
export default function parse(element, { document }) {
  // Each direct-child div is a card wrapper containing an image
  const cardEls = Array.from(element.querySelectorAll(':scope > div'));

  if (cardEls.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  cardEls.forEach((card) => {
    const img = card.querySelector('img');
    if (!img) return;
    // 2-column row: image cell + empty text cell (no text in gallery cards)
    cells.push([img, '']);
  });

  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-gallery', cells });
  element.replaceWith(block);
}
