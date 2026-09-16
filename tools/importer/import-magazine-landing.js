/* eslint-disable */
/* global WebImporter */

import teaserParser from './parsers/teaser.js';
import teaserMembersParser from './parsers/teaser-members.js';
import articleListAllParser from './parsers/article-list-all.js';
import cleanupTransformer from './transformers/wknd-cleanup.js';

const PAGE_TEMPLATE = {
  name: 'magazine-landing',
  urls: ['https://wknd.site/us/en/magazine.html'],
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

    // 1. Featured article teaser (has a real CTA)
    document.querySelectorAll('.teaser.cmp-teaser--featured').forEach((el) => {
      if (el.parentNode) {
        try { teaserParser(el, { document, url, params }); } catch (e) { console.error('teaser parse failed', e); }
      }
    });

    // 2. Dynamic "All Articles" list (config-only, before members teasers consume DOM)
    const list = document.querySelector('.cmp-image-list');
    if (list && list.parentNode) {
      try { articleListAllParser(list, { document }); } catch (e) { console.error('article-list parse failed', e); }
    }

    // 3. Members-only secure teasers (inert CTAs)
    document.querySelectorAll('.teaser.cmp-teaser--secure').forEach((el) => {
      if (el.parentNode) {
        try { teaserMembersParser(el, { document, url, params }); } catch (e) { console.error('teaser-members parse failed', e); }
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
      report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: ['teaser', 'article-list', 'teaser-members'] },
    }];
  },
};
