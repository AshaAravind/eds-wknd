/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-overlay
 * Base block: hero
 * Source: https://wknd-trendsetters.site/about-us
 * Generated: 2026-09-01
 *
 * Hero block: 1 column, up to 3 rows.
 *  - Row 1: block name (added by createBlock)
 *  - Row 2: background image (optional)
 *  - Row 3: content cell (heading, subheading, CTA buttons)
 */
export default function parse(element, { document }) {
  // Background image (the overlay cover image)
  const bgImage = element.querySelector(':scope > img, img.cover-image, img[class*="overlay"]');

  // Content container holds heading, subheading, CTAs
  const contentContainer = element.querySelector('.card-body, [class*="card-body"]') || element;

  const heading = contentContainer.querySelector('h1, h2, h3, [class*="heading"]');
  const subheading = contentContainer.querySelector('p, .subheading, [class*="subheading"]');
  const ctaLinks = Array.from(contentContainer.querySelectorAll('.button-group a, a.button'));

  // Empty-block guard
  if (!heading && !subheading && ctaLinks.length === 0 && !bgImage) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: background image (optional)
  if (bgImage) cells.push([bgImage]);

  // Row 3: content cell (single column: one cell holding all text/CTA elements)
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  contentCell.push(...ctaLinks);
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-overlay', cells });
  element.replaceWith(block);
}
