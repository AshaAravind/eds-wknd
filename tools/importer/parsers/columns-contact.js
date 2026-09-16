/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-contact.
 * Base block: columns.
 * Source: #main-content > section.section.secondary-section:nth-of-type(2) > div.container > div.grid-layout.tablet-1-column.grid-gap-xxl
 * Generated: 2026-09-07
 *
 * Contact-details variant of the columns block: a two-column layout.
 *   - Column 1: text column (heading + intro paragraph)
 *   - Column 2: contact list of label/value pairs (email, phone, address)
 * No images, no CTA buttons.
 */
export default function parse(element, { document }) {
  // The grid-layout has two direct child columns: text block and contact block.
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // --- Column 1: text content (heading + intro) ---
  const textCol = [];
  const heading = element.querySelector('h1, h2, h3, [class*="heading"]');
  if (heading) textCol.push(heading);
  const intro = element.querySelector('p.paragraph-lg, p[class*="paragraph"], p');
  // Only add the intro if it belongs to the text column (not a contact-items value).
  if (intro && !intro.closest('.contact-items')) textCol.push(intro);

  // --- Column 2: contact list (label/value pairs) ---
  const contactCol = [];
  const contactItems = element.querySelector('.contact-items');
  if (contactItems) {
    contactCol.push(contactItems);
  } else {
    // Fallback: use the second grid column if the contact-items class is absent.
    const secondCol = columns[1];
    if (secondCol) contactCol.push(...secondCol.childNodes);
  }

  // Empty-block guard: bail gracefully if essential content is missing.
  if (textCol.length === 0 && contactCol.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  // Single content row with two columns to match the source's side-by-side layout.
  cells.push([textCol, contactCol]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-contact', cells });
  element.replaceWith(block);
}
