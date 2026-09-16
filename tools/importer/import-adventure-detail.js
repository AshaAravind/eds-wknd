/* eslint-disable */
/* global WebImporter */

import galleryParser from './parsers/adventure-gallery.js';
import detailsParser from './parsers/adventure-details.js';
import cleanupTransformer from './transformers/wknd-cleanup.js';

const PAGE_TEMPLATE = {
  name: 'adventure-detail',
  urls: [
    'https://wknd.site/us/en/adventures/climbing-new-zealand.html',
    'https://wknd.site/us/en/adventures/bali-surf-camp.html',
    'https://wknd.site/us/en/adventures/beervana-portland.html',
    'https://wknd.site/us/en/adventures/colorado-rock-climbing.html',
    'https://wknd.site/us/en/adventures/cycling-southern-utah.html',
    'https://wknd.site/us/en/adventures/cycling-tuscany.html',
    'https://wknd.site/us/en/adventures/downhill-skiing-wyoming.html',
    'https://wknd.site/us/en/adventures/gastronomic-marais-tour.html',
    'https://wknd.site/us/en/adventures/napa-wine-tasting.html',
    'https://wknd.site/us/en/adventures/riverside-camping-australia.html',
    'https://wknd.site/us/en/adventures/ski-touring-mont-blanc.html',
    'https://wknd.site/us/en/adventures/surf-camp-costa-rica.html',
    'https://wknd.site/us/en/adventures/tahoe-skiing.html',
    'https://wknd.site/us/en/adventures/west-coast-cycling.html',
    'https://wknd.site/us/en/adventures/whistler-mountain-biking.html',
    'https://wknd.site/us/en/adventures/yosemite-backpacking.html',
  ],
  blocks: [
    { name: 'carousel', instances: ['.carousel.cmp-carousel--mini'] },
    { name: 'columns', instances: ['.cmp-contentfragment--elements'] },
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

    // Remove auto-populated / non-authorable chrome and interactive-only widgets
    // that flatten to default content:
    //   - breadcrumb navigation
    //   - the clickable tab list (Overview / Itinerary / What to Bring); the tab
    //     PANELS remain and flatten into sequential default content
    //   - redundant contentfragment titles (duplicate the H1 adventure name)
    //   - the empty "Share this Adventure" social sharing links
    WebImporter.DOMUtils.remove(main, [
      'nav.cmp-breadcrumb',
      '.breadcrumb',
      '.cmp-tabs__tablist',
      '.cmp-contentfragment__title',
      '.sharing',
    ]);

    // 3-image gallery -> Carousel block (image-only slides).
    document.querySelectorAll('.carousel.cmp-carousel--mini').forEach((el) => {
      if (el.parentNode) {
        try { galleryParser(el, { document, url, params }); } catch (e) { console.error('gallery parse failed', e); }
      }
    });

    // Trip-details definition list -> Columns block (label | value rows).
    document.querySelectorAll('.cmp-contentfragment--elements').forEach((el) => {
      if (el.parentNode) {
        try { detailsParser(el, { document, url, params }); } catch (e) { console.error('adventure-details parse failed', e); }
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
      report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: ['carousel', 'columns'] },
    }];
  },
};
