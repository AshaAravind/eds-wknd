/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-profile
 * Base block: tabs
 * Source: https://wknd-trendsetters.site/about-us
 * Generated: 2026-09-01
 *
 * Tabs block: 2 columns, multiple rows.
 *  - Row 1: block name (added by createBlock)
 *  - Each tab row: [tab label cell, tab content cell]
 * The source separates the tab labels (.tab-menu > .tab-menu-link buttons)
 * from the tab content panels (.tabs-content > .tab-pane). They are paired
 * by index. The label uses the person's name + role from the menu button.
 */
export default function parse(element, { document }) {
  const panes = Array.from(element.querySelectorAll('.tabs-content > .tab-pane, .tab-pane'));
  const menuLinks = Array.from(element.querySelectorAll('.tab-menu > .tab-menu-link, .tab-menu-link, button[id^="tab-"]'));

  if (panes.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  panes.forEach((pane, i) => {
    // Label: the matching menu button's inner content (name + role); skip the avatar image
    let labelCell = '';
    const menu = menuLinks[i];
    if (menu) {
      // Use the text container next to the avatar; fall back to the whole button
      const textWrap = menu.querySelector('.flex-horizontal > div:not(.avatar)') || menu;
      labelCell = textWrap;
    }

    // Content: the tab pane's inner content
    const contentCell = pane;

    cells.push([labelCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-profile', cells });
  element.replaceWith(block);
}
