// eslint-disable-next-line import/no-unresolved
import { toClassName } from '../../scripts/aem.js';

/**
 * loads and decorates the tabs-profile block
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  // build tablist
  const tablist = document.createElement('div');
  tablist.className = 'tabs-profile-list';
  tablist.setAttribute('role', 'tablist');

  const rows = [...block.children];
  rows.forEach((row, i) => {
    const labelCell = row.children[0];
    const contentCell = row.children[1];
    const id = toClassName(labelCell.textContent);

    // --- restructure the panel (content cell = photo + name + role + quote) ---
    const pic = contentCell.querySelector('picture');
    const textParas = [...contentCell.querySelectorAll(':scope > p')]
      .filter((p) => !p.querySelector('picture'));

    const inner = document.createElement('div');
    inner.className = 'tabs-profile-panel-inner';

    const photo = document.createElement('div');
    photo.className = 'tabs-profile-photo';
    if (pic) photo.append(pic);

    const text = document.createElement('div');
    text.className = 'tabs-profile-info';
    textParas.forEach((p) => text.append(p));
    const quote = text.lastElementChild;
    if (quote) quote.classList.add('tabs-profile-quote');

    inner.append(photo, text);

    // configure the panel (reuse the row element)
    row.className = 'tabs-profile-panel';
    row.id = `tabpanel-${id}`;
    row.setAttribute('aria-hidden', !!i);
    row.setAttribute('aria-labelledby', `tab-${id}`);
    row.setAttribute('role', 'tabpanel');
    row.textContent = '';
    row.append(inner);

    // --- build the tab button (avatar + name + role) ---
    const button = document.createElement('button');
    button.className = 'tabs-profile-tab';
    button.id = `tab-${id}`;
    button.setAttribute('aria-controls', `tabpanel-${id}`);
    button.setAttribute('aria-selected', !i);
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');

    const tabInner = document.createElement('div');
    tabInner.className = 'tabs-profile-tab-inner';

    // clone the person's photo into a circular avatar
    if (pic) {
      const avatar = document.createElement('div');
      avatar.className = 'tabs-profile-avatar';
      avatar.append(pic.cloneNode(true));
      tabInner.append(avatar);
    }

    // name + role label
    const label = document.createElement('div');
    label.className = 'tabs-profile-tab-label';
    label.innerHTML = labelCell.innerHTML;
    tabInner.append(label);

    button.append(tabInner);

    button.addEventListener('click', () => {
      block.querySelectorAll('[role=tabpanel]').forEach((panel) => {
        panel.setAttribute('aria-hidden', true);
      });
      tablist.querySelectorAll('button').forEach((btn) => {
        btn.setAttribute('aria-selected', false);
      });
      row.setAttribute('aria-hidden', false);
      button.setAttribute('aria-selected', true);
    });

    tablist.append(button);
  });

  block.append(tablist);
}
