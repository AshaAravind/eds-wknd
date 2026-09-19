/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: teaser
 * Base block: teaser
 * Source: https://wknd.site/us/en.html (featured/plain) +
 *   https://wknd.site/us/en/magazine.html (featured split panel + secure teasers)
 *   (.teaser.cmp-teaser--featured — "Featured Article"; plain .teaser "Next Adventures";
 *    .teaser.cmp-teaser--secure — members-only gated cards with an INERT "Read More")
 * Generated: 2026-09-16 (extended 2026-09-19 for content-landing/magazine)
 *
 * Structure (inferred — no library convention): 2 columns, single row.
 *  - Cell 1 = image.
 *  - Cell 2 = content in order: eyebrow/pretitle, heading, description, CTA.
 *
 * Source: `.cmp-teaser` with `.cmp-teaser__content` holding `.cmp-teaser__pretitle`
 * (eyebrow), `.cmp-teaser__title` (h2), `.cmp-teaser__description`, and
 * `.cmp-teaser__action-container` (an `a.cmp-teaser__action-link` for linked teasers,
 * or plain "Read More" text for secure/gated teasers); image in `.cmp-teaser__image img`.
 *
 * Variants:
 *  - `.cmp-teaser--secure` → emits the block with the `members-only` style
 *    (`teaser (members-only)`) so the block JS renders the inert CTA. The content
 *    iteration below keeps the plain-text "Read More" action container even though it
 *    has no anchor, so the image/title/description are never dropped.
 *  - everything else (featured, plain) → `teaser` (unchanged; home template output
 *    is byte-for-byte identical to before this extension).
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

  // Secure/gated teasers carry an inert (link-less) CTA. Emit the members-only
  // style so the teaser block JS renders the CTA disabled. Featured/plain teasers
  // keep the bare `teaser` name (home template output unchanged).
  const isSecure = element.classList.contains('cmp-teaser--secure')
    || element.querySelector('.cmp-teaser--secure');
  const name = isSecure ? 'teaser (members-only)' : 'teaser';

  const block = WebImporter.Blocks.createBlock(document, { name, cells });
  element.replaceWith(block);
}
