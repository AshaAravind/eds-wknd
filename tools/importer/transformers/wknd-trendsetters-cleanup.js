/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: wknd-trendsetters site-wide cleanup.
 * All selectors verified against migration-work/cleaned.html.
 *
 * NOTE: The first authorable section is `<header class="section secondary-section">`
 * (Intro columns). Do NOT remove the bare `header` tag — only the site chrome
 * selectors below.
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Breadcrumb navigation inside the Feature columns section
    // (found in cleaned.html: <div class="breadcrumbs"> ...). Removed before
    // block parsing so it is not absorbed into the columns-media block.
    WebImporter.DOMUtils.remove(element, [
      '.breadcrumbs',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Global site chrome (found in cleaned.html, all outside #main-content):
    //   <a class="skip-link">, <div class="navbar">, <footer class="footer inverse-footer">
    WebImporter.DOMUtils.remove(element, [
      '.skip-link',
      '.navbar',
      'footer.footer',
    ]);
  }
}
