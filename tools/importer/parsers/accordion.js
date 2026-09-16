/* eslint-disable */
/* global WebImporter */

/**
 * Parser for the FAQ accordion.
 * Emits an "Accordion" block: row 1 = block name; each subsequent row is a
 * 2-cell accordion item [title cell, content cell], per the EDS accordion convention.
 */
export default function parse(element, { document }) {
  const items = [...element.querySelectorAll('.cmp-accordion__item')];
  const rows = [['Accordion']];

  items.forEach((item) => {
    const title = item.querySelector('.cmp-accordion__title, .cmp-accordion__header');
    const panel = item.querySelector('.cmp-accordion__panel');

    const titleCell = document.createElement('div');
    titleCell.textContent = title ? title.textContent.trim() : '';

    const contentCell = document.createElement('div');
    if (panel) {
      [...panel.childNodes].forEach((n) => contentCell.append(n.cloneNode(true)));
    }

    rows.push([titleCell, contentCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
