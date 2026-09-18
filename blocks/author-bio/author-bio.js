/*
 * Author Bio Block
 * Article author credit: circular avatar, author name + role, and a row of
 * social links. Authored as one row with cells: [avatar image] [name + role]
 * [social links]. Cells are tolerant — a missing avatar or social cell is fine.
 */

export default function decorate(block) {
  const row = block.querySelector(':scope > div');
  if (!row) return;
  const cells = [...row.children];

  cells.forEach((cell) => {
    if (cell.querySelector('picture, img')) {
      cell.classList.add('author-bio-avatar');
    } else if (cell.querySelector('a')) {
      cell.classList.add('author-bio-social');
    } else {
      cell.classList.add('author-bio-info');
    }
  });

  // an info cell may be absent if the author only supplied an avatar + social;
  // guarantee the wrapper class exists on whichever text cell carries the name.
  if (!block.querySelector('.author-bio-info')) {
    const textCell = cells.find((c) => c.textContent.trim()
      && !c.classList.contains('author-bio-social'));
    if (textCell) textCell.classList.add('author-bio-info');
  }
}
