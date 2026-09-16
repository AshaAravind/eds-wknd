/**
 * Spec block — renders a two-column spec/detail table.
 * Expected structure: each direct child row is a div with two cells
 * (label, value). Decorates rows for consistent grid styling.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.classList.add('spec-row');
    const cells = [...row.children];
    if (cells[0]) cells[0].classList.add('spec-label');
    if (cells[1]) cells[1].classList.add('spec-value');
  });
}
