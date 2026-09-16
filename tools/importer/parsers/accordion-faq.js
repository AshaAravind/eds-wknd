/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq
 * Base block: accordion
 * Source: https://wknd-trendsetters.site/about-us
 * Generated: 2026-09-01
 *
 * Accordion block: 2 columns, multiple rows.
 *  - Row 1: block name (added by createBlock)
 *  - Each item row: [title cell, content cell]
 * Each source item is a <details> with a <summary> (question) and a
 * .faq-answer (answer). The decorative toggle icon in the summary is ignored.
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll(':scope > details, :scope > .faq-item, details.faq-item'));

  if (items.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  items.forEach((item) => {
    // Title: prefer the text span inside the summary to skip the toggle icon
    const summary = item.querySelector('summary, .faq-question');
    let titleEl = null;
    if (summary) {
      const span = summary.querySelector('span');
      titleEl = span || summary;
    }

    // Content: the answer body
    const content = item.querySelector('.faq-answer, [class*="answer"]');

    // Skip malformed items
    if (!titleEl && !content) return;

    cells.push([titleEl || '', content || '']);
  });

  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
