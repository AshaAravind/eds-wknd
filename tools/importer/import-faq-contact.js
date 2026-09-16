/* eslint-disable */
/* global WebImporter */

import columnsMediaParser from "./parsers/columns-media.js";
import accordionFaqParser from "./parsers/accordion-faq.js";
import columnsContactParser from "./parsers/columns-contact.js";

import cleanupTransformer from "./transformers/wknd-trendsetters-cleanup.js";
import sectionsTransformer from "./transformers/wknd-trendsetters-sections.js";

const parsers = {
  "columns-media": columnsMediaParser,
  "accordion-faq": accordionFaqParser,
  "columns-contact": columnsContactParser,
};

const PAGE_TEMPLATE = {
  "name": "faq-contact",
  "description": "FAQ page: hero, expandable FAQ accordion, a contact-details block, and a call-to-action banner",
  "urls": [
    "https://wknd-trendsetters.site/faq"
  ],
  "blocks": [
    {
      "name": "columns-media",
      "instances": [
        "#main-content > header.section.secondary-section > div.container > div.grid-layout.tablet-1-column.grid-gap-xxl"
      ]
    },
    {
      "name": "accordion-faq",
      "instances": [
        "#main-content > section.section:nth-of-type(1) > div.container > div.faq-list"
      ]
    },
    {
      "name": "columns-contact",
      "instances": [
        "#main-content > section.section.secondary-section:nth-of-type(2) > div.container > div.grid-layout.tablet-1-column.grid-gap-xxl"
      ]
    }
  ],
  "sections": [
    {
      "id": "hero",
      "name": "Hero",
      "selector": "#main-content > header.section.secondary-section",
      "style": "grey",
      "blocks": [
        "columns-media"
      ],
      "defaultContent": []
    },
    {
      "id": "faq",
      "name": "FAQ",
      "selector": "#main-content > section.section:nth-of-type(1)",
      "style": null,
      "blocks": [
        "accordion-faq"
      ],
      "defaultContent": []
    },
    {
      "id": "contact",
      "name": "Contact details",
      "selector": "#main-content > section.section.secondary-section:nth-of-type(2)",
      "style": "grey",
      "blocks": [
        "columns-contact"
      ],
      "defaultContent": []
    },
    {
      "id": "cta",
      "name": "CTA banner",
      "selector": "#main-content > section.section.accent-section",
      "style": "accent",
      "blocks": [],
      "defaultContent": [
        "#main-content > section.section.accent-section > div.container > div.utility-text-align-center"
      ]
    }
  ]
};

const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((fn) => { try { fn.call(null, hookName, element, enhancedPayload); } catch (e) { console.error(`Transformer failed at ${hookName}:`, e); } });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      elements.forEach((element) => pageBlocks.push({ name: blockDef.name, selector, element, section: blockDef.section || null }));
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;
    const main = document.body;
    executeTransformers("beforeTransform", main, payload);
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) { try { parser(block.element, { document, url, params }); } catch (e) { console.error(`Failed to parse ${block.name} (${block.selector}):`, e); } }
      else { console.warn(`No parser found for block: ${block.name}`); }
    });
    executeTransformers("afterTransform", main, payload);
    const hr = document.createElement("hr");
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
    const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
    const path = WebImporter.FileUtils.sanitizePath(`/ema-test${rawPath === "" ? "/index" : rawPath}`);
    return [{ element: main, path, report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) } }];
  },
};
