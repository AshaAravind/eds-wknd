import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.replaceChildren(ul);

  // "profiles" variant (WKND contributor/guide cards): the last body paragraph
  // holds social links imported as text labels ("Facebook", "Twitter", …).
  // Render them as icon-only buttons — tag each with its platform so CSS can
  // draw the glyph, and move the label to aria-label so it stays accessible
  // but visually hidden. Guarded to `.profiles`, so the generic cards block is
  // unaffected on every other page.
  if (block.classList.contains('profiles')) {
    const platforms = ['facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'pinterest'];
    block.querySelectorAll('.cards-card-body p:last-child').forEach((p) => {
      const links = [...p.querySelectorAll('a')];
      if (links.length < 2) return; // a lone link is likely a real CTA, not a social row
      p.classList.add('cards-social');
      links.forEach((link) => {
        const label = link.textContent.trim();
        const platform = platforms.find((pf) => label.toLowerCase().includes(pf));
        if (platform) link.classList.add(`cards-social-${platform}`);
        if (label) link.setAttribute('aria-label', label);
        link.textContent = '';
      });
    });
  }
}
