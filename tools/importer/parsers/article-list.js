/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: article-list
 * Base block: article-list (dynamic listing)
 * Source: https://wknd.site/us/en.html (.cmp-image-list — recent articles)
 * Generated: 2026-09-16
 *
 * DYNAMIC / config-only block. The source renders a static list of article cards,
 * but in EDS this content is generated dynamically by the article-list block from a
 * query index. The parser therefore does NOT enumerate the source cards — it emits a
 * configuration block table with `path` and `limit` rows.
 *
 * Structure: block name row, then one config row per key/value pair (2 columns).
 *
 * Locale-aware: the `path` is derived from the page's own locale prefix
 * (e.g. /us/en, /ca/fr) so a locale homepage lists that locale's articles.
 * Falls back to /us/en when no usable URL is provided.
 */
function localePrefix(src) {
  if (!src) return '/us/en';
  try {
    const parts = new URL(src).pathname.split('/').filter(Boolean);
    // homepage path is /{country}/{lang}(.html) → first two segments are the locale
    if (parts.length >= 2) return `/${parts[0]}/${parts[1].replace(/\.html?$/, '')}`;
  } catch (e) { /* fall through */ }
  return '/us/en';
}

export default function parse(element, { document, url, params } = {}) {
  const prefix = localePrefix((params && params.originalURL) || url);
  const cells = [
    ['path', `${prefix}/magazine/`],
    ['limit', '4'],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'article-list', cells });
  element.replaceWith(block);
}
