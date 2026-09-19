/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND site-wide cleanup.
 * Removes non-authorable AEM WCM site chrome (experience-fragment header/footer,
 * mobile nav, tracking iframe) and strips leftover non-authorable elements.
 * All selectors verified against migration-work/cleaned.html.
 * Template-agnostic: reused across every WKND template (content-landing,
 * adventure-detail, adventures-landing, faqs, home, article-detail).
 *
 * content-landing / magazine coverage (verified against magazine.html cleaned.html):
 *   header/footer experience-fragments, demdex iframe, #toggleNav, #mobileNav and
 *   empty <meta> tags inside cmp-image blocks are the only non-authorable chrome and
 *   are all removed by the selectors below. The page's main content (h1 "Magazine",
 *   featured teaser, "All Articles"/"Members Only" titles, image-list, members-only
 *   text, and the two secure teasers) is authorable and left intact.
 *   IMPORTANT: the magazine's visible authorable separator
 *   (.separator.cmp-separator--space-medium, holding a real <hr>) MUST be preserved —
 *   cleanup only strips .cmp-separator--hidden, never that visible separator or bare <hr>.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Non-authorable site chrome removed before block parsing so parsers only see page content.
    // Found in cleaned.html:
    //   line 5   <header class="experiencefragment cmp-experiencefragment--header ...">
    //   line 471 <footer class="experiencefragment cmp-experiencefragment--footer ...">
    //   line 566 <iframe id="destination_publishing_iframe_wkndsite_0" ...> (Adobe ID/demdex tracking)
    //   line 568 <div id="toggleNav"> (mobile nav toggle)
    //   line 574 <div id="mobileNav" class="cmp-navigation--mobile"> (mobile nav duplicate)
    WebImporter.DOMUtils.remove(element, [
      'header.cmp-experiencefragment--header',
      'footer.cmp-experiencefragment--footer',
      '#destination_publishing_iframe_wkndsite_0',
      '#toggleNav',
      '#mobileNav',
      // Content-fragment internal title (visually hidden on source). The visible page
      // title comes from the separate .cmp-title--underline heading; importing this
      // too produces a duplicate "Bali Surf Camp" heading. Found in cleaned.html:
      //   <h3 class="cmp-contentfragment__title">Bali Surf Camp</h3>
      '.cmp-contentfragment__title',
    ]);

    // WKND CTA buttons (`wknd/components/button`, e.g. "All Articles", "All Trips")
    // are standalone links in the source. EDS only buttonizes a <p><a> when the
    // link is authored bold/italic, so wrap each button anchor in <strong> → it
    // becomes a `.button.primary` (yellow) at render time, matching the source.
    element.querySelectorAll('a.cmp-button, .cmp-button__link, a.button').forEach((a) => {
      if (a.closest('strong') || a.querySelector('img')) return;
      const strong = document.createElement('strong');
      a.replaceWith(strong);
      strong.append(a);
    });
  }

  if (hookName === TransformHook.afterTransform) {
    // Leftover non-authorable elements. Found in cleaned.html:
    //   empty <meta> tags scattered inside cmp-image blocks (lines 183, 204, 227, 271, 334, 378)
    //   demdex iframe fallback, any noscript/link
    WebImporter.DOMUtils.remove(element, [
      'meta',
      'iframe',
      'noscript',
      'link',
      // Non-authorable social-share chrome in the article sidebar. The authorable
      // sidebar content is the .cmp-list--upnext "up next" cards block; the share
      // label + widget are site UI, not something an author would create.
      // Scoped to the sidebar so the site-wide cleanup can't touch authorable
      // titles elsewhere. Found in cleaned.html:
      //   line 363 <div class="title cmp-title--black ...">SHARE THIS STORY</div>
      //   line 368 <div class="sharing"> (empty FB div + empty Pinterest <a> -> stray [](url))
      '.cmp-layoutcontainer--sidebar .title.cmp-title--black',
      '.cmp-layoutcontainer--sidebar .sharing',
      // Hidden decorative separators (sidebar line 374, footer line 490). These emit a
      // stray thematic break in the import. Targets the classed cmp-separator wrapper
      // only — NOT bare <hr> — so the section transformer's inserted <hr> breaks survive.
      '.cmp-separator--hidden',
    ]);

    // Strip AEM data-layer / accessibility tracking attributes left on nodes.
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-cmp-data-layer');
      el.removeAttribute('data-cmp-hook-image');
      el.removeAttribute('data-cmp-data-layer-name');
      el.removeAttribute('data-cmp-data-layer-enabled');
    });
  }
}
