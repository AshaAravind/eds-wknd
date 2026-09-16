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

  // tools/importer/import-trends-listing.js
  var import_trends_listing_exports = {};
  __export(import_trends_listing_exports, {
    default: () => import_trends_listing_default
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

  // tools/importer/parsers/cards-article.js
  function parse2(element, { document: document2 }) {
    const cardEls = Array.from(element.querySelectorAll(":scope > a.article-card, :scope > .article-card, :scope > a.trend-card, :scope > .trend-card, :scope > a.card-link"));
    if (cardEls.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cardEls.forEach((card) => {
      const img = card.querySelector("img");
      const href = card.getAttribute("href");
      const body = card.querySelector('.article-card-body, .trend-card-body, [class*="card-body"]') || card;
      const textCell = [];
      const meta = body.querySelector('.article-card-meta, [class*="meta"]');
      if (meta) {
        textCell.push(meta);
      } else {
        const tag = body.querySelector('.tag, [class*="tag"]');
        if (tag) textCell.push(tag);
        const date = body.querySelector('time, .date, [class*="date"]');
        if (date && date !== meta) textCell.push(date);
      }
      const heading = body.querySelector('h1, h2, h3, h4, h5, h6, [class*="heading"]');
      if (heading) {
        if (href) {
          const link = document2.createElement("a");
          link.href = href;
          link.textContent = heading.textContent.trim();
          heading.textContent = "";
          heading.appendChild(link);
        }
        textCell.push(heading);
      } else if (href) {
        const link = document2.createElement("a");
        link.href = href;
        link.textContent = "Read more";
        textCell.push(link);
      }
      const paragraphs = Array.from(body.querySelectorAll("p"));
      paragraphs.forEach((p) => {
        if (p.textContent.trim() && !textCell.includes(p) && (!meta || !meta.contains(p))) {
          textCell.push(p);
        }
      });
      cells.push([img || "", textCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-article", cells });
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

  // tools/importer/import-trends-listing.js
  var parsers = { "columns-media": parse, "cards-article": parse2 };
  var PAGE_TEMPLATE = {
    "name": "trends-listing",
    "description": "Trends listing page: hero, a multi-column grid of tagged trend cards, a feature block, and a call-to-action banner",
    "urls": [
      "https://wknd-trendsetters.site/fashion-trends-young-adults-casual-sport"
    ],
    "blocks": [
      {
        "name": "columns-media",
        "instances": [
          "#main-content > header.section.secondary-section > div.container > div.grid-layout.tablet-1-column.grid-gap-xxl",
          "#main-content > section.section.secondary-section:nth-of-type(2) > div.container > div.grid-layout.tablet-1-column.grid-gap-lg"
        ]
      },
      {
        "name": "cards-article",
        "instances": [
          "#main-content > section.section:nth-of-type(1) > div.container > div.grid-layout.desktop-4-column.tablet-2-column-1.mobile-portrait-1-column.grid-gap-md"
        ]
      }
    ],
    "sections": [
      {
        "id": "s1",
        "name": "Hero intro",
        "selector": "#main-content > header.section.secondary-section",
        "style": "grey",
        "blocks": [
          "columns-media"
        ],
        "defaultContent": []
      },
      {
        "id": "s2",
        "name": "Trend alert grid",
        "selector": "#main-content > section.section:nth-of-type(1)",
        "style": null,
        "blocks": [
          "cards-article"
        ],
        "defaultContent": [
          "#main-content > section.section:nth-of-type(1) > div.container > div.utility-text-align-center"
        ]
      },
      {
        "id": "s3",
        "name": "Feature block",
        "selector": "#main-content > section.section.secondary-section:nth-of-type(2)",
        "style": "grey",
        "blocks": [
          "columns-media"
        ],
        "defaultContent": []
      },
      {
        "id": "s4",
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
  var transformers = [transform, ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []];
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
  var import_trends_listing_default = {
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
  return __toCommonJS(import_trends_listing_exports);
})();
