/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: author-bio
 * Base block: author (custom — no library convention, inferred from source HTML)
 * Source: https://wknd.site/us/en/magazine/san-diego-surf.html
 *   (.cmp-experiencefragment--justin-barr / .experiencefragment)
 * Generated: 2026-09-18
 *
 * Source structure: an experience fragment containing a <div class="cmp-byline"> with
 *   an avatar image (.cmp-byline__image img), a name heading (h2.cmp-byline__name),
 *   an occupations line (p.cmp-byline__occupations), and a list of social share buttons
 *   (a.cmp-button inside .cmp-buildingblock--btn-list).
 *
 * Output: single row, 3 cells — [avatar image] [name heading + role text] [social links].
 */
export default function parse(element, { document }) {
  // Avatar image — validated: .cmp-byline__image img
  const avatar = element.querySelector('.cmp-byline__image img, .cmp-byline img, img');

  // Name heading — validated: h2.cmp-byline__name
  const name = element.querySelector('.cmp-byline__name, h2, [class*="name"]');

  // Role / occupations text — validated: p.cmp-byline__occupations
  const role = element.querySelector('.cmp-byline__occupations, p[class*="occupation"]');

  // Social links — validated: a.cmp-button inside the button-list building block
  const socialLinks = Array.from(
    element.querySelectorAll('.cmp-buildingblock--btn-list a.cmp-button, .cmp-buildingblock--btn-list a'),
  );

  // Empty-block guard — nothing meaningful to render
  if (!avatar && !name && !role && socialLinks.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Cell 1: avatar image
  const imageCell = avatar ? [avatar] : [''];

  // Cell 2: name heading + role text
  const infoCell = [];
  if (name) infoCell.push(name);
  if (role) infoCell.push(role);

  // Cell 3: social links (flatten each button to a plain text link where possible)
  const socialCell = [];
  socialLinks.forEach((link) => {
    const label = (link.textContent || '').trim();
    if (label) link.textContent = label;
    socialCell.push(link);
  });

  const cells = [];
  cells.push([imageCell, infoCell.length ? infoCell : '', socialCell.length ? socialCell : '']);

  const block = WebImporter.Blocks.createBlock(document, { name: 'author-bio', cells });
  element.replaceWith(block);
}
