import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // "Follow Us" social links import as text labels ("Facebook", "Twitter", …).
  // Render them as icon-only buttons — tag each with its platform so CSS can draw
  // the glyph, and move the label to aria-label so it stays accessible but hidden.
  const socialHeading = [...footer.querySelectorAll('h4')].find((h) => /follow us/i.test(h.textContent));
  const socialRow = socialHeading ? socialHeading.nextElementSibling : null;
  if (socialRow && socialRow.querySelector('a')) {
    socialRow.classList.add('footer-social');
    const platforms = ['facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'pinterest'];
    socialRow.querySelectorAll('a').forEach((link) => {
      const label = link.textContent.trim();
      const platform = platforms.find((p) => label.toLowerCase().includes(p));
      if (platform) link.classList.add(`footer-social-${platform}`);
      if (label) link.setAttribute('aria-label', label);
      link.textContent = '';
    });
  }

  block.append(footer);
}
