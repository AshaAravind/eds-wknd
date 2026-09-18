/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: breadcrumbs
 * Base block: breadcrumbs (custom — no library convention, inferred from source HTML)
 * Source: https://wknd.site/us/en/adventures/bali-surf-camp.html (.breadcrumb.cmp-breadcrumb--fixed / .breadcrumb)
 * Generated: 2026-09-18
 *
 * Source structure: <nav class="cmp-breadcrumb"> containing
 *   <ol class="cmp-breadcrumb__list"> with <li class="cmp-breadcrumb__item">.
 *   Non-active items hold an <a class="cmp-breadcrumb__item-link"> (with an inner <span> label);
 *   the active (current) item holds a plain <span> label with no link.
 *
 * Output: single-column block whose one cell contains a <ul> of breadcrumb entries,
 * preserving links for navigable crumbs and plain text for the current page.
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll('.cmp-breadcrumb__item, li'));

  const list = document.createElement('ul');

  items.forEach((item) => {
    const link = item.querySelector('a');
    const li = document.createElement('li');

    if (link) {
      // Navigable crumb — preserve the anchor (flatten inner span to link text).
      const label = (link.textContent || '').trim();
      if (label) link.textContent = label;
      li.append(link);
    } else {
      // Current/active crumb — plain text label.
      const label = (item.textContent || '').trim();
      if (!label) return;
      li.textContent = label;
    }

    list.append(li);
  });

  // Empty-block guard
  if (!list.children.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  cells.push([list]); // 1-column block: one row, one cell holding the list

  const block = WebImporter.Blocks.createBlock(document, { name: 'breadcrumbs', cells });
  element.replaceWith(block);
}
