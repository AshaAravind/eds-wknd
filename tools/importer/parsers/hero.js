/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: hero
 * Base block: hero
 * Source: https://wknd.site/us/en/adventures.html (.teaser.cmp-teaser--hero)
 * Generated: 2026-09-19
 *
 * Library convention: 1 column, 3 rows.
 *   Row 1: block name
 *   Row 2: background image (optional)
 *   Row 3: title (heading) + subheading/text + optional CTA
 *
 * Source is an AEM Core teaser (hero variant): a content block with the
 * title/description and a separate image block. The parser pulls the image
 * into the background-image row and the heading + description into the content row.
 */
export default function parse(element, { document }) {
  // Background image (optional)
  const bgImage = element.querySelector(
    '.cmp-teaser__image img, .cmp-image__image, img',
  );

  // Heading
  const heading = element.querySelector(
    '.cmp-teaser__title, h1, h2, [class*="title"]',
  );

  // Description / subheading text (preserve inner markup)
  const descriptionWrapper = element.querySelector(
    '.cmp-teaser__description, [class*="description"]',
  );
  const description = descriptionWrapper
    ? (descriptionWrapper.querySelector('p') || descriptionWrapper)
    : element.querySelector('p');

  // Optional call-to-action links
  const ctaLinks = Array.from(
    element.querySelectorAll('.cmp-teaser__action-link, .cmp-teaser__action-container a, a.button'),
  );

  // Empty-block guard
  if (!heading && !description && !bgImage) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: background image (optional)
  if (bgImage) cells.push([bgImage]);

  // Row 3: single content cell holding heading, description and CTAs
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  contentCell.push(...ctaLinks);
  cells.push([contentCell]);

  // Emit the "landing" option so EDS renders <div class="hero landing">, which
  // triggers the white-content-card treatment defined in hero.css (.hero.landing).
  const block = WebImporter.Blocks.createBlock(document, { name: 'hero (landing)', cells });
  element.replaceWith(block);
}
