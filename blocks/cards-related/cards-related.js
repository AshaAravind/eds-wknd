/*
 * Cards Related Block
 * A curated "related articles" / "up next" list. Each authored row is one
 * related item: an article title (usually a link) and a publish date. No images.
 * Forked from the cards block — scoped to the cards-related class only, never
 * the base block class.
 */

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'cards-related-item';
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((cell, idx) => {
      cell.className = idx === 0 ? 'cards-related-title' : 'cards-related-date';
    });
    ul.append(li);
  });

  block.replaceChildren(ul);
}
