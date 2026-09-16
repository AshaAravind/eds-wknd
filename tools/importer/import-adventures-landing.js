/* eslint-disable */
/* global WebImporter */

import teaserParser from './parsers/teaser.js';
import adventureListFilteredParser from './parsers/adventure-list-filtered.js';
import cleanupTransformer from './transformers/wknd-cleanup.js';

const PAGE_TEMPLATE = {
  name: 'adventures-landing',
  urls: ['https://wknd.site/us/en/adventures.html'],
  blocks: [
    { name: 'teaser', instances: ['.teaser.cmp-teaser--hero'] },
    { name: 'adventure-list', instances: ['.cmp-image-list'] },
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

    // teaser (intro)
    document.querySelectorAll('.teaser.cmp-teaser--hero').forEach((el) => {
      if (el.parentNode) {
        try { teaserParser(el, { document, url, params }); } catch (e) { console.error('teaser parse failed', e); }
      }
    });

    // dynamic adventure list with filters — the source has one .cmp-image-list per
    // category tab panel (6 total). Replace the first with the block, remove the rest
    // and their outer .image-list wrappers so no raw source cards remain.
    const lists = [...document.querySelectorAll('.cmp-image-list')];
    if (lists.length) {
      try { adventureListFilteredParser(lists[0], { document }); } catch (e) { console.error('adventure-list parse failed', e); }
      lists.slice(1).forEach((l) => {
        const wrapper = l.closest('.image-list') || l;
        wrapper.remove();
      });
    }
    // remove any now-empty tab-panel / image-list wrappers left behind
    document.querySelectorAll('.image-list.list, .cmp-tabs__tabpanel').forEach((el) => {
      if (!el.querySelector('.adventure-list') && !el.textContent.trim()) el.remove();
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
      report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: ['teaser', 'adventure-list'] },
    }];
  },
};
