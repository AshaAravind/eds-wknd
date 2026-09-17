/* eslint-disable */
/* global WebImporter */

import cleanupTransformer from './transformers/wknd-cleanup.js';
import { ARTICLE_META, enrichMetadata } from './wknd-metadata.js';

const PAGE_TEMPLATE = {
  name: 'article-detail',
  urls: [
    'https://wknd.site/us/en/magazine/western-australia.html',
    'https://wknd.site/us/en/magazine/arctic-surfing.html',
    'https://wknd.site/us/en/magazine/san-diego-surf.html',
    'https://wknd.site/us/en/magazine/ski-touring.html',
    'https://wknd.site/us/en/magazine/guide-la-skateparks.html',
  ],
};

const transformers = [cleanupTransformer];

function executeTransformers(hookName, element, payload) {
  transformers.forEach((fn) => {
    try {
      fn.call(null, hookName, element, { ...payload, template: PAGE_TEMPLATE });
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    // Editorial article is overwhelmingly DEFAULT CONTENT (H1 title, byline,
    // paragraphs, blockquote pull-quote, H2 sub-headings, inline images and the
    // author byline card). No custom block parsers are needed.
    // Remove auto-populated page chrome that is not authorable article content:
    //   - breadcrumb navigation
    //   - "SHARE THIS STORY" right rail (share buttons + "up next" list)
    //   - inline social share buttons under the byline
    WebImporter.DOMUtils.remove(main, [
      'nav.cmp-breadcrumb',
      '.breadcrumb',
      '.cmp-layoutcontainer--sidebar',
      'aside.cmp-layoutcontainer--sidebar',
      '.sharing',
      '.cmp-buildingblock--btn-list',
    ]);

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    // add Category / Publication Date / Image so the query-index carries the
    // fields the article-list block needs on publish.
    enrichMetadata(main, document, path, ARTICLE_META);

    return [{
      element: main,
      path,
      report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: [] },
    }];
  },
};
