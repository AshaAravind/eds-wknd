/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: tabs
 * Base block: tabs
 * Source: https://wknd.site/us/en/adventures/bali-surf-camp.html (.tabs.panelcontainer / .tabs)
 * Generated: 2026-09-18
 *
 * Block library structure (Tabs): 2 columns, multiple rows.
 *  - Row 1: block name only.
 *  - Row per tab: cell 1 = tab label (mandatory), cell 2 = tab content (mandatory).
 *
 * Source: labels live in <ol class="cmp-tabs__tablist"> as <li class="cmp-tabs__tab">.
 * Each panel is a <div class="cmp-tabs__tabpanel"> whose body content lives in
 * <div class="cmp-contentfragment__elements"> (paragraphs, images, lists, headings).
 */
export default function parse(element, { document }) {
  const labels = Array.from(element.querySelectorAll('.cmp-tabs__tab, .cmp-tabs__tablist > li'));
  const panels = Array.from(element.querySelectorAll('.cmp-tabs__tabpanel'));

  const cells = [];

  panels.forEach((panel, i) => {
    // Cell 1: tab label — from the corresponding tablist item, fallback to panel title.
    const labelEl = labels[i];
    const labelText = labelEl
      ? (labelEl.textContent || '').trim()
      : ((panel.querySelector('.cmp-contentfragment__title, h1, h2, h3, h4') || {}).textContent || '').trim();

    // Cell 2: tab content — prefer the content-fragment elements container, fallback to panel.
    const contentSource = panel.querySelector('.cmp-contentfragment__elements') || panel;

    // Collect meaningful leaf content nodes (text, images, lists, headings).
    // The source wraps content in nested .aem-Grid / .aem-GridColumn layout divs; those
    // wrapper divs aren't matched here, and empty grid scaffolding produces no leaf nodes.
    // A <picture> may contain an <img>, so skip images nested inside a captured <picture>.
    const contentCell = [];
    contentSource.querySelectorAll('p, ul, ol, img, picture, h1, h2, h3, h4, h5, h6').forEach((node) => {
      if (node.tagName === 'IMG' && node.closest('picture')) return;
      contentCell.push(node);
    });

    // Only emit a row if we have a label or some content.
    if (labelText || contentCell.length) {
      cells.push([labelText || '', contentCell]);
    }
  });

  // Empty-block guard
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs', cells });
  element.replaceWith(block);
}
