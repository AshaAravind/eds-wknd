/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: cards-related
 * Base block: cards
 * Source: https://wknd.site/us/en/magazine/san-diego-surf.html
 *   (.list.cmp-list--upnext / .cmp-list--upnext)
 * Generated: 2026-09-18
 *
 * Source structure: <ul class="cmp-list"> with <li class="cmp-list__item"> items.
 *   Each item holds an <a class="cmp-list__item-link"> wrapping a title
 *   (span.cmp-list__item-title) and a date (span.cmp-list__item-date).
 *
 * Output (per Cards library convention): the "up next" list has no images, so this maps
 *   to the single-column cards structure — one row per item, one cell containing the
 *   title (as a link) and the date below it.
 */
export default function parse(element, { document }) {
  // Validated against source.html: each card is an <li class="cmp-list__item">
  const items = Array.from(element.querySelectorAll('.cmp-list__item, li'));

  const cells = [];

  items.forEach((item) => {
    const link = item.querySelector('a.cmp-list__item-link, a');
    const titleEl = item.querySelector('.cmp-list__item-title, [class*="title"]');
    const dateEl = item.querySelector('.cmp-list__item-date, [class*="date"]');

    const title = titleEl ? (titleEl.textContent || '').trim() : '';
    const date = dateEl ? (dateEl.textContent || '').trim() : '';

    // Skip items with no meaningful content
    if (!title && !date && !(link && link.href)) return;

    const cellContent = [];

    // Title as a link (preserve the item href), falling back to plain title text
    if (link && (title || link.textContent.trim())) {
      const a = document.createElement('a');
      a.href = link.getAttribute('href') || link.href || '';
      a.textContent = title || (link.textContent || '').trim();
      cellContent.push(a);
    } else if (title) {
      const p = document.createElement('p');
      p.textContent = title;
      cellContent.push(p);
    }

    // Date below the title
    if (date) {
      const dateP = document.createElement('p');
      dateP.textContent = date;
      cellContent.push(dateP);
    }

    // 1-column cards (no images): one cell per row holding title link + date
    cells.push([cellContent]);
  });

  // Empty-block guard
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-related', cells });
  element.replaceWith(block);
}
