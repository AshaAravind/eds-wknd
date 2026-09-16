/*
 * Teaser Block
 * A featured content promo: image alongside eyebrow + heading + description + CTA.
 * Expected authoring structure — a single row with two cells (image cell and
 * text cell, in either order). Add the `members-only` variant to render inert CTAs.
 */

export default function decorate(block) {
  const row = block.firstElementChild;
  if (!row) return;

  [...row.children].forEach((cell) => {
    const pic = cell.querySelector('picture');
    if (pic && cell.children.length === 1 && cell.textContent.trim() === '') {
      cell.classList.add('teaser-image');
    } else {
      cell.classList.add('teaser-content');
    }
  });

  // if no image cell was detected, still tag the remaining cell as content
  if (!row.querySelector('.teaser-image') && !row.querySelector('.teaser-content')) {
    row.firstElementChild.classList.add('teaser-content');
  }

  // members-only variant: CTAs are placeholders that lead nowhere
  if (block.classList.contains('members-only')) {
    block.querySelectorAll('a[href]').forEach((a) => {
      a.setAttribute('aria-disabled', 'true');
      a.setAttribute('tabindex', '-1');
      a.removeAttribute('href');
      a.setAttribute('role', 'link');
    });
  }
}
