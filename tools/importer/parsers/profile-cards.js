/* eslint-disable */
/* global WebImporter */

/**
 * Builds a "Cards" block from a set of WKND contributor/guide profile cards.
 * Each card: image cell + body cell (name H3 + role + social links).
 * `cardEls` is an array of `.cmp-experience-fragment--contributor` elements.
 * Replaces the first card element with the table; removes the rest.
 */
export default function parseProfiles(cardEls, { document }) {
  if (!cardEls.length) return;
  const rows = [['Cards']];

  cardEls.forEach((card) => {
    const imageCell = document.createElement('div');
    const img = card.querySelector('img.cmp-image__image, picture, img');
    if (img) imageCell.append(img.closest('picture') || img);

    const bodyCell = document.createElement('div');
    const name = card.querySelector('.title h3, h3');
    const role = card.querySelector('h5');
    if (name) {
      const h = document.createElement('h3');
      h.textContent = name.textContent.trim();
      bodyCell.append(h);
    }
    if (role) {
      const p = document.createElement('p');
      p.textContent = role.textContent.trim();
      bodyCell.append(p);
    }
    // social links
    const links = [...card.querySelectorAll('a.cmp-button, .buildingblock a')];
    if (links.length) {
      const social = document.createElement('p');
      links.forEach((a) => {
        const label = a.querySelector('.cmp-button__icon');
        let type = 'Link';
        if (label) {
          const cls = [...label.classList].find((c) => c.includes('--')) || '';
          type = cls.split('--').pop() || 'Link';
        }
        const link = document.createElement('a');
        link.href = a.getAttribute('href') || '#';
        link.textContent = type.charAt(0).toUpperCase() + type.slice(1);
        social.append(link, document.createTextNode(' '));
      });
      bodyCell.append(social);
    }

    rows.push([imageCell, bodyCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  cardEls[0].replaceWith(table);
  cardEls.slice(1).forEach((el) => el.remove());
}
