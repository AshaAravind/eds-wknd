/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-faq-contact.js
  var import_faq_contact_exports = {};
  __export(import_faq_contact_exports, {
    default: () => import_faq_contact_default
  });

  // tools/importer/parsers/columns-media.js
  function parse(element, { document: document2 }) {
    const columnEls = Array.from(element.querySelectorAll(":scope > div"));
    if (columnEls.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cells.push(columnEls);
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-media", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse2(element, { document: document2 }) {
    const items = Array.from(element.querySelectorAll(":scope > details, :scope > .faq-item, details.faq-item"));
    if (items.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    items.forEach((item) => {
      const summary = item.querySelector("summary, .faq-question");
      let titleEl = null;
      if (summary) {
        const span = summary.querySelector("span");
        titleEl = span || summary;
      }
      const content = item.querySelector('.faq-answer, [class*="answer"]');
      if (!titleEl && !content) return;
      cells.push([titleEl || "", content || ""]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-contact.js
  function parse3(element, { document: document2 }) {
    const columns = Array.from(element.querySelectorAll(":scope > div"));
    const textCol = [];
    const heading = element.querySelector('h1, h2, h3, [class*="heading"]');
    if (heading) textCol.push(heading);
    const intro = element.querySelector('p.paragraph-lg, p[class*="paragraph"], p');
    if (intro && !intro.closest(".contact-items")) textCol.push(intro);
    const contactCol = [];
    const contactItems = element.querySelector(".contact-items");
    if (contactItems) {
      contactCol.push(contactItems);
    } else {
      const secondCol = columns[1];
      if (secondCol) contactCol.push(...secondCol.childNodes);
    }
    if (textCol.length === 0 && contactCol.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cells.push([textCol, contactCol]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-contact", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-trendsetters-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".breadcrumbs"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".skip-link",
        ".navbar",
        "footer.footer"
      ]);
    }
  }

  // tools/importer/transformers/wknd-trendsetters-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function transform2(hookName, element, payload) {
    const sections = payload && payload.template && payload.template.sections || [];
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) continue;
        const hr = document.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker || element.querySelector(section.selector);
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) {
          marker.removeAttribute(SECTION_MARKER_ATTR);
          if (i === 0) marker.remove();
        }
      }
    }
  }

  // tools/importer/import-faq-contact.js
  var parsers = {
    "columns-media": parse,
    "accordion-faq": parse2,
    "columns-contact": parse3
  };
  var PAGE_TEMPLATE = {
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
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((fn) => {
      try {
        fn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        elements.forEach((element) => pageBlocks.push({ name: blockDef.name, selector, element, section: blockDef.section || null }));
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_faq_contact_default = {
    transform: (payload) => {
      const { document: document2, url, html, params } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(`/ema-test${rawPath === "" ? "/index" : rawPath}`);
      return [{ element: main, path, report: { title: document2.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) } }];
    }
  };
  return __toCommonJS(import_faq_contact_exports);
})();
