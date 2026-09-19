/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import breadcrumbsParser from './parsers/breadcrumbs.js';
import carouselParser from './parsers/carousel.js';
import tabsParser from './parsers/tabs.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/wknd-cleanup.js';
import sectionsTransformer from './transformers/wknd-sections.js';

// METADATA
import { keywordsForPath } from './wknd-metadata.js';

// PARSER REGISTRY
const parsers = {
  breadcrumbs: breadcrumbsParser,
  carousel: carouselParser,
  tabs: tabsParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'adventure-detail',
  description: 'Detail page with full-width hero carousel, left metadata sidebar, and tabbed body content',
  urls: [
    'https://wknd.site/us/en/adventures/bali-surf-camp.html',
  ],
  blocks: [
    {
      name: 'breadcrumbs',
      instances: ['.breadcrumb.cmp-breadcrumb--fixed', '.breadcrumb'],
    },
    {
      name: 'carousel',
      instances: ['.carousel.cmp-carousel--mini', '.carousel.panelcontainer'],
    },
    {
      name: 'tabs',
      instances: ['.tabs.panelcontainer', '.tabs'],
    },
  ],
  sections: [
    {
      id: 'rc1',
      name: 'breadcrumbs',
      selector: ['.breadcrumb.cmp-breadcrumb--fixed', '.breadcrumb'],
      style: null,
      blocks: ['breadcrumbs'],
      defaultContent: [],
    },
    {
      id: 'rc2',
      name: 'hero-carousel',
      selector: ['.carousel.cmp-carousel--mini', '.carousel.panelcontainer'],
      style: null,
      blocks: ['carousel'],
      defaultContent: [],
    },
    {
      // Title + metadata + tabs share one section so the metadata sidebar and
      // tab content can render as a 2-column layout (matching the source). The
      // tabs block still parses via PAGE_TEMPLATE.blocks; keeping it in this
      // section (no separate entry) means no <hr> break splits them apart.
      id: 'rc3',
      name: 'title-metadata-tabs',
      selector: ['.cmp-layout-container--fixed', 'main.cmp-layout-container--fixed'],
      style: 'adventure-info',
      blocks: ['tabs'],
      defaultContent: ['.title.cmp-title--underline', '.contentfragment.cmp-contentfragment--elements', '.text.cmp-text--font-xsmall'],
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

    // Capture the adventure Category from the content fragment BEFORE parsing
    // consumes it. Maps the Activity value to a WKND filter category so the
    // adventures-landing filter grid works (query-index category column).
    let adventureCategory = '';
    (() => {
      let activity = '';
      // The content-fragment metadata is normalised to <li><p>label</p><p>value</p></li>
      // (and/or a <dt>Activity</dt><dd>value</dd> pair). Match either shape.
      main.querySelectorAll('li, dl > div').forEach((item) => {
        const ps = item.querySelectorAll('p, dt, dd');
        if (ps.length >= 2 && ps[0].textContent.trim().toLowerCase() === 'activity') {
          activity = ps[1].textContent.trim();
        }
      });
      if (!activity) {
        const dt = [...main.querySelectorAll('dt')].find((d) => d.textContent.trim().toLowerCase() === 'activity');
        if (dt && dt.nextElementSibling) activity = dt.nextElementSibling.textContent.trim();
      }
      const a = activity.toLowerCase();
      if (/climb/.test(a)) adventureCategory = 'climbing';
      else if (/cycl|bike|biking/.test(a)) adventureCategory = 'cycling';
      else if (/ski/.test(a)) adventureCategory = 'skiing';
      else if (/surf/.test(a)) adventureCategory = 'surfing';
      else adventureCategory = 'travel';
    })();

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
    const metaBlock = WebImporter.rules.createMetadata(main, document);
    // Append a Category row so query-index picks it up (drives the
    // adventures-landing filter grid). createMetadata may return the block
    // element (a <table>) or a cells object depending on version — handle a DOM
    // element robustly; fall back to querying the serialized block in `main`.
    if (adventureCategory) {
      const addRow = (tableEl) => {
        const tr = document.createElement('tr');
        const k = document.createElement('td');
        k.textContent = 'Category';
        const v = document.createElement('td');
        v.textContent = adventureCategory;
        tr.append(k, v);
        (tableEl.querySelector('tbody') || tableEl).append(tr);
      };
      let table = (metaBlock && typeof metaBlock.querySelector === 'function') ? metaBlock : null;
      if (!table) {
        const tables = main.querySelectorAll('table');
        table = [...tables].find((t) => /metadata/i.test(t.textContent.slice(0, 20)))
          || tables[tables.length - 1] || null;
      }
      if (table) addRow(table);
    }

    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Sanitized path (root maps to /index to avoid empty-path crash)
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    // Append a Keywords row (verbatim source keywords + curated Travel tag) so
    // the backend query-index carries a `keywords` column the adventures-landing
    // filter grid matches against. Find the Metadata table and append the row.
    const keywords = keywordsForPath(path);
    if (keywords) {
      const metaTable = [...main.querySelectorAll('table')].find((t) => {
        const firstCell = t.querySelector('tr th, tr td');
        return firstCell && /^metadata$/i.test(firstCell.textContent.trim());
      });
      const hasKeywords = metaTable && [...metaTable.querySelectorAll('tr')].some((tr) => {
        const c = tr.querySelector('td, th');
        return c && c.textContent.trim().toLowerCase() === 'keywords';
      });
      if (metaTable && !hasKeywords) {
        const tr = document.createElement('tr');
        const k = document.createElement('td');
        k.textContent = 'Keywords';
        const v = document.createElement('td');
        v.textContent = keywords;
        tr.append(k, v);
        metaTable.append(tr);
      }
    }

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
