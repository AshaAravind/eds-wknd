/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: hero-article
 * Base block: hero
 * Source: https://wknd.site/us/en/magazine/san-diego-surf.html
 *   (.cmp-layout-container--fixed > .cmp-container > .aem-Grid > .image:first-child / .image.aem-GridColumn--default--12:first-of-type)
 * Generated: 2026-09-18
 *
 * Source structure: a full-width image column (<div class="image ..."> containing
 *   <div class="cmp-image"> with a single <img class="cmp-image__image">).
 *
 * Output: single-column hero block whose one cell contains the article's full-width
 *   image. No title/subheading/CTA exists in this instance, so only the image row is emitted.
 */
export default function parse(element, { document }) {
  // Validated against source.html: img lives inside .cmp-image
  const image = element.querySelector('.cmp-image__image, .cmp-image img, img');

  // Empty-block guard — nothing to render without the hero image
  if (!image) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  // 1-column block: one row, one cell holding the image
  cells.push([[image]]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-article', cells });
  element.replaceWith(block);
}
