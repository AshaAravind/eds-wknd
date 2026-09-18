/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: carousel
 * Base block: carousel
 * Source (hero): https://wknd.site/us/en.html (.carousel.cmp-carousel--hero / .cmp-carousel)
 * Source (mini): https://wknd.site/us/en/adventures/bali-surf-camp.html (.carousel.cmp-carousel--mini / .carousel.panelcontainer)
 * Generated: 2026-09-18
 *
 * Block library structure (Carousel): 2 columns, multiple rows.
 *  - Row 1: block name only.
 *  - Row per slide: cell 1 = image (mandatory, no other content),
 *    cell 2 = text content (title / description / CTA), optional.
 *
 * Source: each slide is a `.cmp-carousel__item`. The hero variant contains a
 * `.cmp-teaser` with `.cmp-teaser__title`, `.cmp-teaser__description`,
 * `.cmp-teaser__action-link`, and an image in `.cmp-teaser__image img`.
 * The mini variant contains only a plain image in `.cmp-image img` (no text).
 * Navigation controls (actions/indicators) are ignored.
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
