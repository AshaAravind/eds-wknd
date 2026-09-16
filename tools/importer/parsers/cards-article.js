/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-article
 * Base block: cards
 * Source: https://wknd-trendsetters.site/about-us
 * Generated: 2026-09-01
 *
 * Cards block (article cards): 2 columns, multiple rows.
 *  - Row 1: block name (added by createBlock)
 *  - Each card row: [image cell, text cell]
 * Each source card is an <a class="article-card"/.trend-card"> wrapping an
 * image and a body. The body can contain: a category tag, a date, a heading
 * (h3 link), and a description paragraph. The image goes in cell 1; the card
 * body (meta/tag + date + heading + description) goes in cell 2. The card's
 * link is preserved by wrapping the heading text in an anchor using the href.
 *
 * Handles two source variants:
 *  - about-us "Latest articles": cover image + meta (tag + date) + h3 title,
 *    NO description paragraph.
 *  - trends-listing / content-hub: cover image + tag + h3 title + description
 *    paragraph (and sometimes a date span).
 */
export default function parse(element, { document }) {
  // Each card is a top-level anchor/article-card/trend-card
  const cardEls = Array.from(element.querySelectorAll(':scope > a.article-card, :scope > .article-card, :scope > a.trend-card, :scope > .trend-card, :scope > a.card-link'));

  if (cardEls.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  cardEls.forEach((card) => {
    const img = card.querySelector('img');
    const href = card.getAttribute('href');

    // The card body holds the text content; fall back to the card itself.
    const body = card.querySelector('.article-card-body, .trend-card-body, [class*="card-body"]') || card;

    // Build the text cell: meta/tag + date, then heading, then description.
    const textCell = [];

    // Meta wrapper (about-us tag + date grouped together).
    const meta = body.querySelector('.article-card-meta, [class*="meta"]');
    if (meta) {
      textCell.push(meta);
    } else {
      // No meta wrapper: pull individual tag and date if present.
      const tag = body.querySelector('.tag, [class*="tag"]');
      if (tag) textCell.push(tag);
      const date = body.querySelector('time, .date, [class*="date"]');
      if (date && date !== meta) textCell.push(date);
    }

    const heading = body.querySelector('h1, h2, h3, h4, h5, h6, [class*="heading"]');
    if (heading) {
      if (href) {
        // Preserve the card link by wrapping the heading text in an anchor.
        const link = document.createElement('a');
        link.href = href;
        link.textContent = heading.textContent.trim();
        heading.textContent = '';
        heading.appendChild(link);
      }
      textCell.push(heading);
    } else if (href) {
      const link = document.createElement('a');
      link.href = href;
      link.textContent = 'Read more';
      textCell.push(link);
    }

    // Description paragraph(s) below the heading (trends / content-hub cards).
    // Exclude any paragraph that is actually the meta/tag element.
    const paragraphs = Array.from(body.querySelectorAll('p'));
    paragraphs.forEach((p) => {
      if (p.textContent.trim() && !textCell.includes(p) && (!meta || !meta.contains(p))) {
        textCell.push(p);
      }
    });

    cells.push([img || '', textCell]);
  });

  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
