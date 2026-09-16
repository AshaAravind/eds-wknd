/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: carousel
 * Base block: carousel
 * Source: https://wknd.site/us/en.html (.cmp-carousel--hero / .cmp-carousel)
 * Generated: 2026-09-16
 *
 * Block library structure (Carousel): 2 columns, multiple rows.
 *  - Row per slide: cell 1 = image (mandatory, no other content),
 *    cell 2 = text content (title / description / CTA).
 *
 * Source: each slide is a `.cmp-carousel__item` containing a hero teaser
 * (`.cmp-teaser`) with `.cmp-teaser__title`, `.cmp-teaser__description`,
 * `.cmp-teaser__action-link`, and an image in `.cmp-teaser__image img`.
 */
export default function parse(element, { document }) {
  // Each slide is a carousel item. Fall back to teaser items if item class differs.
  let slides = Array.from(element.querySelectorAll('.cmp-carousel__item'));
  if (!slides.length) {
    slides = Array.from(element.querySelectorAll('.cmp-teaser, [class*="__item"]'));
  }

  const cells = [];

  slides.forEach((slide) => {
    // Cell 1: slide image (picture or img)
    const image = slide.querySelector('picture, .cmp-teaser__image img, .cmp-image img, img');

    // Cell 2: text content — heading + description + CTA
    const contentCell = [];
    const heading = slide.querySelector('.cmp-teaser__title, h1, h2, h3, [class*="title"]');
    if (heading) contentCell.push(heading);

    const description = slide.querySelector('.cmp-teaser__description, p, [class*="description"]');
    if (description) contentCell.push(description);

    const ctaLinks = Array.from(slide.querySelectorAll('.cmp-teaser__action-link, .cmp-teaser__action-container a, a.button'));
    ctaLinks.forEach((cta) => contentCell.push(cta));

    // Only emit a row if the slide has an image or some content
    if (image || contentCell.length) {
      cells.push([image || '', contentCell]);
    }
  });

  // Empty-block guard
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel', cells });
  element.replaceWith(block);
}
