/* eslint-disable */
/* global WebImporter */

import parseProfiles from './parsers/profile-cards.js';
import cleanupTransformer from './transformers/wknd-cleanup.js';
import sectionsTransformer from './transformers/wknd-sections.js';

// About Us belongs to the content-landing template. It is a single light section
// whose default-content headings ("Our Contributors", "WKND Guides") carry the
// same yellow underline accent as the magazine page — driven by the
// "content-landing" section style below.
const PAGE_TEMPLATE = {
  name: 'content-landing',
  urls: ['https://wknd.site/us/en/about-us.html'],
  sections: [
    {
      id: 'rc1',
      name: 'about-content',
      selector: ['main.cmp-layout-container--fixed', '.cmp-layout-container--fixed'],
      style: 'content-landing',
      blocks: ['cards'],
      defaultContent: ['.title', '.text'],
    },
  ],
};

const hasStyledSection = PAGE_TEMPLATE.sections
  && PAGE_TEMPLATE.sections.some((s) => s.style);
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections
    && (PAGE_TEMPLATE.sections.length > 1 || hasStyledSection)
    ? [sectionsTransformer] : []),
];

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

    // Group the 7 profile cards by the H2 section heading that precedes them
    // ("Our Contributors" → 4, "WKND Guides" → 3). Grouping preserves DOM order.
    const cards = [...document.querySelectorAll('.cmp-experience-fragment--contributor')];
    const groups = [];
    cards.forEach((card) => {
      // find the nearest preceding h2 heading text
      let node = card;
      let heading = null;
      while (node && !heading) {
        let prev = node.previousElementSibling;
        while (prev) {
          const h2 = prev.matches && prev.matches('h2') ? prev : (prev.querySelector ? prev.querySelector('h2') : null);
          if (h2) { heading = h2.textContent.trim(); break; }
          prev = prev.previousElementSibling;
        }
        node = node.parentElement;
      }
      const key = heading || 'group';
      let group = groups.find((g) => g.key === key);
      if (!group) { group = { key, els: [] }; groups.push(group); }
      group.els.push(card);
    });

    // Parse each group into its own Cards block (replaces first card in group)
    groups.forEach((group) => {
      if (group.els.every((el) => el.parentNode)) {
        try { parseProfiles(group.els, { document }); } catch (e) { console.error('profile-cards parse failed', e); }
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
      report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: ['cards (profiles)'] },
    }];
  },
};
