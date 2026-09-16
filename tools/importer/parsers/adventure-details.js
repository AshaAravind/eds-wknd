/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: columns-key-value
 * Base block: columns
 * Source: adventure-detail trip-details definition list
 *   (.cmp-contentfragment--elements > dl.cmp-contentfragment__elements with
 *    .cmp-contentfragment__element--activity / --adventureType / --tripLength /
 *    --groupSize / --difficulty / --price)
 *
 * Emits a "Columns" block with one row per trip-detail: cell 1 = label
 * (dt), cell 2 = value (dd). This renders as a 2-column key/value layout.
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll('.cmp-contentfragment__element'));

  const rows = [['Columns']];
  items.forEach((item) => {
    const term = item.querySelector('.cmp-contentfragment__element-title, dt');
    const value = item.querySelector('.cmp-contentfragment__element-value, dd');

    const labelCell = document.createElement('div');
    labelCell.textContent = term ? term.textContent.trim() : '';

    const valueCell = document.createElement('div');
    valueCell.textContent = value ? value.textContent.trim() : '';

    if (labelCell.textContent || valueCell.textContent) {
      rows.push([labelCell, valueCell]);
    }
  });

  // Empty-block guard: leave content in place if no details found.
  if (rows.length < 2) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
