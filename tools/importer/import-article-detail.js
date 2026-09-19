/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroArticleParser from './parsers/hero-article.js';
import breadcrumbsParser from './parsers/breadcrumbs.js';
import authorBioParser from './parsers/author-bio.js';
import cardsRelatedParser from './parsers/cards-related.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-cleanup.js';
import sectionsTransformer from './transformers/wknd-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-article': heroArticleParser,
  breadcrumbs: breadcrumbsParser,
  'author-bio': authorBioParser,
  'cards-related': cardsRelatedParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'article-detail',
  description: 'Long-form article page with hero image, title and byline, rich body with inline images and headings, related-links sidebar, and author bio',
  urls: [
    'https://wknd.site/us/en/magazine/san-diego-surf.html',
  ],
  blocks: [
    {
      name: 'hero-article',
      instances: ['main.cmp-layout-container--fixed > .cmp-container > .aem-Grid > .image', '.cmp-layout-container--fixed > .cmp-container > .aem-Grid > .image.aem-GridColumn--default--12'],
    },
    {
      name: 'breadcrumbs',
      instances: ['.breadcrumb'],
    },
    {
      name: 'author-bio',
      instances: ['.cmp-experiencefragment--justin-barr', '.experiencefragment'],
    },
    {
      name: 'cards-related',
      instances: ['.list.cmp-list--upnext', '.cmp-list--upnext'],
    },
  ],
  sections: [
    {
      id: 'rc1', name: 'hero-article', selector: ['main.cmp-layout-container--fixed > .cmp-container > .aem-Grid > .image', '.cmp-layout-container--fixed > .cmp-container > .aem-Grid > .image.aem-GridColumn--default--12'], style: null, blocks: ['hero-article'], defaultContent: [],
    },
    {
      id: 'rc2', name: 'breadcrumbs', selector: ['.breadcrumb'], style: null, blocks: ['breadcrumbs'], defaultContent: [],
    },
    {
      // Article header, body, author-bio and sidebar merged into one section so
      // the article content and the related-articles sidebar can render as a
      // 2-column layout (matching the source). Blocks still parse via
      // PAGE_TEMPLATE.blocks; keeping them in one section (no separate entries)
      // means no <hr> break splits the column pair apart.
      id: 'rc3', name: 'article-main', selector: ['.title:nth-of-type(1)', 'main.aem-GridColumn--default--8 > .cmp-container > .title'], style: 'article-main', blocks: ['author-bio', 'cards-related'], defaultContent: ['.title', '.byline', '.cmp-contentfragment--san-diego-surfspots'],
    },
  ],
};

// TRANSFORMER REGISTRY - cleanup runs first, sections last (adds <hr> breaks)
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - 'beforeTransform' or 'afterTransform'
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  const seen = new Set();
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element) => {
        if (seen.has(element)) return; // avoid double-processing across fallback selectors
        seen.add(element);
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. beforeTransform cleanup
    executeTransformers('beforeTransform', main, payload);

    // 2. Discover blocks
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block (skip elements already replaced by an earlier parser)
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform cleanup + section breaks
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Sanitized path (root maps to /index to avoid empty-path crash)
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
