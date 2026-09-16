/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: carousel-gallery
 * Base block: carousel
 * Source: adventure-detail top visual (.carousel.cmp-carousel--mini)
 *
 * The gallery slides are image-only (no title/description/CTA). The local
 * Carousel block treats cell 1 of each row as the slide image and cell 2 as
 * optional text content. For an image-only gallery we emit one row per slide
 * with only the image cell, producing a "Carousel" block.
 */
export default function parse(element, { document }) {
  const slides = Array.from(element.querySelectorAll('.cmp-carousel__item'));

  const cells = [];
  slides.forEach((slide) => {
    const image = slide.querySelector('picture, .cmp-image img, img');
    if (image) cells.push([image]);
  });

  // Empty-block guard: leave content in place if no slides found.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel', cells });
  element.replaceWith(block);
}
