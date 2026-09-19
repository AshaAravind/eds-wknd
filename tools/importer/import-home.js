/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import carouselParser from './parsers/carousel.js';
import teaserParser from './parsers/teaser.js';
import articleListParser from './parsers/article-list.js';
import adventureListParser from './parsers/adventure-list.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-cleanup.js';
import sectionsTransformer from './transformers/wknd-sections.js';

// PAGE TEMPLATE CONFIGURATION (embedded from page-templates.json)
const PAGE_TEMPLATE = {
  name: 'home',
  description: 'Homepage: hero carousel, featured article teaser, recent articles list, next adventure teaser, adventures list',
  urls: ['https://wknd.site/us/en.html'],
  blocks: [
    { name: 'carousel', instances: ['.carousel.cmp-carousel--hero', '.cmp-carousel'] },
    { name: 'teaser', instances: ['.teaser.cmp-teaser--featured', '.teaser.cmp-teaser--imagebottom'] },
    { name: 'article-list', instances: ['.cmp-image-list'] },
    { name: 'adventure-list', instances: ['.cmp-image-list'] },
  ],
  sections: [
    { id: '1', name: 'hero-carousel', selector: ['.carousel.cmp-carousel--hero'], style: null, blocks: ['carousel'], defaultContent: [] },
    { id: '2', name: 'featured-article', selector: ['.teaser.cmp-teaser--featured'], style: 'grey', blocks: ['teaser'], defaultContent: [] },
    { id: '3', name: 'recent-articles', selector: ['.cmp-image-list'], style: null, blocks: ['article-list'], defaultContent: [] },
    { id: '4', name: 'next-adventures', selector: ['.teaser'], style: null, blocks: ['teaser'], defaultContent: [] },
    { id: '5', name: 'adventures', selector: ['.cmp-image-list'], style: null, blocks: ['adventure-list'], defaultContent: [] },
  ],
};

const parsers = {
  carousel: carouselParser,
  teaser: teaserParser,
  'article-list': articleListParser,
  'adventure-list': adventureListParser,
};

const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

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
 * The two dynamic lists ("Recent Articles" then "Where do you want to go?")
 * share the `.cmp-image-list` selector. Disambiguate positionally: the first
 * .cmp-image-list is the article-list, the second is the adventure-list.
 */
function parseDynamicLists(document, url, params) {
  const lists = [...document.querySelectorAll('.cmp-image-list')];
  if (lists[0] && lists[0].parentNode) articleListParser(lists[0], { document, url, params });
  if (lists[1] && lists[1].parentNode) adventureListParser(lists[1], { document, url, params });
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    // 1. beforeTransform cleanup (removes header/footer chrome, inserts section breaks)
    executeTransformers('beforeTransform', main, payload);

    // 2. Parse carousel + teaser instances (skip the list selectors here)
    ['carousel', 'teaser'].forEach((name) => {
      const def = PAGE_TEMPLATE.blocks.find((b) => b.name === name);
      const seen = new Set();
      def.instances.forEach((selector) => {
        document.querySelectorAll(selector).forEach((el) => {
          if (seen.has(el) || !el.parentNode) return;
          seen.add(el);
          try {
            parsers[name](el, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${name} (${selector}):`, e);
          }
        });
      });
    });

    // 3. Parse the two dynamic lists positionally
    parseDynamicLists(document, url, params);

    // 4. afterTransform (section metadata + final cleanup)
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Sanitized path (map root → /index to avoid empty-path crash)
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
        blocks: ['carousel', 'teaser', 'article-list', 'adventure-list'],
      },
    }];
  },
};
