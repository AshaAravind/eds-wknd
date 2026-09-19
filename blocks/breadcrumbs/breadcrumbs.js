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
  // collect crumbs in document order. Authors express the trail either as a
  // single cell holding a <ul> of crumbs (linked crumbs + a trailing plain-text
  // current page) or as one crumb per row. A crumb is a link when it contains an
  // anchor; otherwise it is plain text (the current page).
  const crumbs = [];
  const pushCrumb = (node) => {
    const anchor = node.querySelector('a');
    if (anchor) {
      crumbs.push({ label: anchor.textContent.trim(), href: anchor.getAttribute('href') });
    } else {
      const text = node.textContent.trim();
      if (text) crumbs.push({ label: text, href: null });
    }
  };

  const listItems = block.querySelectorAll(':scope li');
  if (listItems.length) {
    // authored as a <ul>/<ol> of crumbs
    listItems.forEach(pushCrumb);
  } else {
    // authored as one crumb per row
    block.querySelectorAll(':scope > div').forEach((row) => {
      const cell = row.querySelector(':scope > div') || row;
      pushCrumb(cell);
    });
  }

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
