export default function decorate(block) {
  const rows = [...block.children];

  // first row holds the background image; if absent, render text-only variant
  if (!block.querySelector(':scope > div:first-child picture')) {
    block.classList.add('no-image');
  }

  // buttonize the CTA link (authored as a plain link, rendered as a pill)
  const contentRow = rows[rows.length - 1];
  contentRow?.querySelectorAll('p > a[href]').forEach((a) => {
    const p = a.closest('p');
    if (p.textContent.trim() !== a.textContent.trim()) return;
    a.className = 'button';
    p.classList.add('button-container');
  });
}
