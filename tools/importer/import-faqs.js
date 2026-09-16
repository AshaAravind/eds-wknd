/* eslint-disable */
/* global WebImporter */

import accordionParser from './parsers/accordion.js';
import cleanupTransformer from './transformers/wknd-cleanup.js';

const PAGE_TEMPLATE = {
  name: 'faqs',
  urls: ['https://wknd.site/us/en/faqs.html'],
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

    // Accordion (FAQ Q&A). Default content (H1, intro, "Need more help") passes through.
    document.querySelectorAll('.cmp-accordion').forEach((el) => {
      if (el.parentNode) {
        try { accordionParser(el, { document, url, params }); } catch (e) { console.error('accordion parse failed', e); }
      }
    });

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: ['accordion'] },
    }];
  },
};
