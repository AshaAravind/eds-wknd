/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import teaserParser from './parsers/teaser.js';
import teaserMembersParser from './parsers/teaser-members.js';
import articleListAllParser from './parsers/article-list-all.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-cleanup.js';
import sectionsTransformer from './transformers/wknd-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'content-landing',
  description: 'Content landing page with featured-article split panel and a grid of teaser cards',
  urls: [
    'https://wknd.site/us/en/magazine.html',
  ],
  blocks: [
    {
      name: 'teaser',
      instances: ['.teaser.cmp-teaser--featured', '.teaser.cmp-teaser--secure', '.teaser.cmp-teaser--list'],
    },
    {
      name: 'article-list',
      instances: ['.image-list.list', '.cmp-image-list'],
    },
  ],
  sections: [
    {
      id: 'rc1',
      name: 'magazine-content',
      selector: ['main.cmp-layout-container--fixed', '.cmp-layout-container--fixed'],
      style: 'content-landing',
      blocks: ['teaser', 'article-list'],
      defaultContent: [
        '.title:not(.cmp-title--underline)',
        '.title.cmp-title--underline',
        '.text',
        '.separator',
      ],
    },
  ],
};

// TRANSFORMER REGISTRY - section transformer runs after cleanup. It emits a
// Section Metadata block for any styled section (e.g. the single "content-landing"
// styled section on the magazine page, which drives the yellow heading-underline
// accent) and <hr> breaks for multi-section content landing pages (e.g. about-us).
const hasStyledSection = PAGE_TEMPLATE.sections
  && PAGE_TEMPLATE.sections.some((s) => s.style);
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections
    && (PAGE_TEMPLATE.sections.length > 1 || hasStyledSection)
    ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook.
 * @param {string} hookName - 'beforeTransform' or 'afterTransform'
 * @param {Element} element - The DOM element to transform (typically document.body)
 * @param {Object} payload - { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, { ...payload, template: PAGE_TEMPLATE });
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. beforeTransform (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Featured-article teaser (real CTA) → teaser block
    document.querySelectorAll('.teaser.cmp-teaser--featured, .teaser.cmp-teaser--list').forEach((el) => {
      if (el.parentNode) {
        try {
          teaserParser(el, { document, url, params });
        } catch (e) {
          console.error('teaser parse failed', e);
        }
      }
    });

    // 3. Dynamic "All Articles" list (config-only) → article-list block.
    //    Run before the secure teasers so it can locate the list while the DOM
    //    is intact. Target the outer .image-list.list once, else the inner
    //    .cmp-image-list; never both (they are nested).
    const list = document.querySelector('.image-list.list, .cmp-image-list');
    if (list && list.parentNode) {
      try {
        articleListAllParser(list, { document, url, params });
      } catch (e) {
        console.error('article-list parse failed', e);
      }
    }

    // 4. Members-only secure teasers (inert CTAs) → teaser (members-only) block
    document.querySelectorAll('.teaser.cmp-teaser--secure').forEach((el) => {
      if (el.parentNode) {
        try {
          teaserMembersParser(el, { document, url, params });
        } catch (e) {
          console.error('teaser-members parse failed', e);
        }
      }
    });

    // 5. afterTransform (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 6. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 7. Sanitized path (map root URL to /index to avoid the bundled importer crash)
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
        blocks: ['teaser', 'article-list', 'teaser-members'],
      },
    }];
  },
};
