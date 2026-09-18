/**
 * Breadcrumbs block
 * Renders an authored trail of links as an accessible, horizontal breadcrumb list.
 *
 * Expected authored structure (Document Authoring):
 * one crumb per row, or a single cell with several links; the trailing crumb is
 * typically the current page and may be plain text rather than a link.
 *
 * @param {Element} block The breadcrumbs block element
 */
export default function decorate(block) {
  // collect crumbs in document order: each anchor becomes a link crumb,
  // any trailing plain text (no anchor) becomes the current-page crumb.
  const crumbs = [];
  block.querySelectorAll(':scope > div').forEach((row) => {
    const cell = row.querySelector(':scope > div') || row;
    const anchors = [...cell.querySelectorAll('a')];
    if (anchors.length) {
      anchors.forEach((a) => {
        crumbs.push({ label: a.textContent.trim(), href: a.getAttribute('href') });
      });
    } else {
      const text = cell.textContent.trim();
      if (text) crumbs.push({ label: text, href: null });
    }
  });

  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Breadcrumb');

  const list = document.createElement('ol');
  list.className = 'breadcrumbs-list';

  crumbs.forEach((crumb, idx) => {
    const item = document.createElement('li');
    item.className = 'breadcrumbs-item';
    const isLast = idx === crumbs.length - 1;

    if (crumb.href && !isLast) {
      const link = document.createElement('a');
      link.href = crumb.href;
      link.textContent = crumb.label;
      item.append(link);
    } else {
      const current = document.createElement('span');
      current.textContent = crumb.label;
      if (isLast) current.setAttribute('aria-current', 'page');
      item.append(current);
    }
    list.append(item);
  });

  nav.append(list);
  block.textContent = '';
  block.append(nav);
}
