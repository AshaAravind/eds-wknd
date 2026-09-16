/* eslint-disable */
/* global WebImporter */

/**
 * Parser for the "Members Only" secure teasers.
 * Emits a "Teaser (members-only)" block — the teaser block JS renders the CTA inert.
 * Content cell: heading + description + (inert) Read More label.
 */
export default function parse(element, { document }) {
  const content = element.querySelector('.cmp-teaser__content') || element;
  const title = content.querySelector('.cmp-teaser__title, h1, h2, h3');
  const description = content.querySelector('.cmp-teaser__description');
  const action = content.querySelector('.cmp-teaser__action-link, a');

  const contentCell = document.createElement('div');
  if (title) {
    const h = document.createElement('h3');
    h.textContent = title.textContent.trim();
    contentCell.append(h);
  }
  if (description) {
    const p = document.createElement('p');
    p.textContent = description.textContent.trim();
    contentCell.append(p);
  }
  // inert CTA: render as a link with a placeholder anchor so the block marks it disabled
  const label = action ? action.textContent.trim() : 'Read More';
  const cta = document.createElement('p');
  const link = document.createElement('a');
  link.href = '#';
  link.textContent = label;
  cta.append(link);
  contentCell.append(cta);

  const imageCell = document.createElement('div');
  const pic = element.querySelector('picture, img');
  if (pic) imageCell.append(pic.closest('picture') || pic);

  const cells = [['Teaser (members-only)'], [imageCell, contentCell]];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
