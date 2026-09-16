/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: teaser
 * Base block: teaser
 * Source: https://wknd.site/us/en.html
 *   (.teaser.cmp-teaser--featured — "Featured Article"; also plain .teaser "Next Adventures")
 * Generated: 2026-09-16
 *
 * Structure (inferred — no library convention): 2 columns, single row.
 *  - Cell 1 = image.
 *  - Cell 2 = content in order: eyebrow/pretitle, heading, description, CTA link.
 *
 * Source: `.cmp-teaser` with `.cmp-teaser__content` holding `.cmp-teaser__pretitle`
 * (eyebrow), `.cmp-teaser__title` (h2), `.cmp-teaser__description`, and
 * `.cmp-teaser__action-container > a.cmp-teaser__action-link`; image in
 * `.cmp-teaser__image img`.
 */
export default function parse(element, { document }) {
  // Cell 1: teaser image (picture preferred, else img)
  const image = element.querySelector('picture, .cmp-teaser__image img, .cmp-image img, img');

  // Cell 2: content — take the content container's children in document order so
  // the eyebrow, heading, description and CTA are all preserved regardless of markup.
  const contentCell = [];
  const content = element.querySelector('.cmp-teaser__content, [class*="__content"]');

  if (content) {
    Array.from(content.children).forEach((child) => {
      // Skip an image that may live inside the content container (handled as cell 1)
      if (child.querySelector && child.querySelector('img, picture')) return;
      if (child.tagName === 'IMG' || child.tagName === 'PICTURE') return;
      contentCell.push(child);
    });
  } else {
    // Fallback: explicit selectors when no content container exists
    const eyebrow = element.querySelector('.cmp-teaser__pretitle, [class*="pretitle"], [class*="eyebrow"]');
    if (eyebrow) contentCell.push(eyebrow);
    const heading = element.querySelector('.cmp-teaser__title, h1, h2, h3, [class*="title"]');
    if (heading) contentCell.push(heading);
    const description = element.querySelector('.cmp-teaser__description, [class*="description"]');
    if (description) contentCell.push(description);
    const ctaLinks = Array.from(element.querySelectorAll('.cmp-teaser__action-link, a.button'));
    ctaLinks.forEach((cta) => contentCell.push(cta));
  }

  // Empty-block guard
  if (!image && !contentCell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [[image || '', contentCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'teaser', cells });
  element.replaceWith(block);
}
