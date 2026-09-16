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

  // tools/importer/import-about-us.js
  var import_about_us_exports = {};
  __export(import_about_us_exports, {
    default: () => import_about_us_default
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

  // tools/importer/parsers/cards-gallery.js
  function parse2(element, { document: document2 }) {
    const cardEls = Array.from(element.querySelectorAll(":scope > div"));
    if (cardEls.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cardEls.forEach((card) => {
      const img = card.querySelector("img");
      if (!img) return;
      cells.push([img, ""]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-gallery", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-profile.js
  function parse3(element, { document: document2 }) {
    const panes = Array.from(element.querySelectorAll(".tabs-content > .tab-pane, .tab-pane"));
    const menuLinks = Array.from(element.querySelectorAll('.tab-menu > .tab-menu-link, .tab-menu-link, button[id^="tab-"]'));
    if (panes.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    panes.forEach((pane, i) => {
      let labelCell = "";
      const menu = menuLinks[i];
      if (menu) {
        const textWrap = menu.querySelector(".flex-horizontal > div:not(.avatar)") || menu;
        labelCell = textWrap;
      }
      const contentCell = pane;
      cells.push([labelCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "tabs-profile", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse4(element, { document: document2 }) {
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

  // tools/importer/parsers/accordion-faq.js
  function parse5(element, { document: document2 }) {
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

  // tools/importer/parsers/hero-overlay.js
  function parse6(element, { document: document2 }) {
    const bgImage = element.querySelector(':scope > img, img.cover-image, img[class*="overlay"]');
    const contentContainer = element.querySelector('.card-body, [class*="card-body"]') || element;
    const heading = contentContainer.querySelector('h1, h2, h3, [class*="heading"]');
    const subheading = contentContainer.querySelector('p, .subheading, [class*="subheading"]');
    const ctaLinks = Array.from(contentContainer.querySelectorAll(".button-group a, a.button"));
    if (!heading && !subheading && ctaLinks.length === 0 && !bgImage) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (bgImage) cells.push([bgImage]);
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subheading) contentCell.push(subheading);
    contentCell.push(...ctaLinks);
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-overlay", cells });
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

  // tools/importer/import-about-us.js
  var parsers = {
    "columns-media": parse,
    "cards-gallery": parse2,
    "tabs-profile": parse3,
    "cards-article": parse4,
    "accordion-faq": parse5,
    "hero-overlay": parse6
  };
  var PAGE_TEMPLATE = {
    name: "about-us",
    description: "About Us page: intro columns, feature columns, image gallery, profile tabs, article cards, FAQ accordion, and overlay hero banner.",
    urls: [
      "https://wknd-trendsetters.site/about-us"
    ],
    blocks: [
      {
        name: "columns-media",
        instances: [
          "#main-content > header.section.secondary-section > div.container > div.grid-layout.tablet-1-column.grid-gap-xxl",
          "#main-content > section.section:nth-of-type(1) > div.container > div.grid-layout.tablet-1-column.grid-gap-lg"
        ]
      },
      {
        name: "cards-gallery",
        instances: [
          "#main-content > section.section.secondary-section:nth-of-type(2) > div.container > div.grid-layout.desktop-4-column.tablet-2-column-1.mobile-portrait-1-column.grid-gap-sm"
        ]
      },
      {
        name: "tabs-profile",
        instances: [
          "#main-content > section.section:nth-of-type(3) > div.container > div.tabs-wrapper"
        ]
      },
      {
        name: "cards-article",
        instances: [
          "#main-content > section.section.secondary-section:nth-of-type(4) > div.container > div.grid-layout.desktop-4-column.tablet-2-column-1.mobile-portrait-1-column.grid-gap-md"
        ]
      },
      {
        name: "accordion-faq",
        instances: [
          "#main-content > section.section:nth-of-type(5) > div.container > div.grid-layout.tablet-1-column.grid-gap-xxl > div.faq-list"
        ]
      },
      {
        name: "hero-overlay",
        instances: [
          "#main-content > section.section.inverse-section > div.container > div.grid-layout.desktop-1-column > div.utility-position-relative.utility-radius-card.utility-overflow-clip"
        ]
      }
    ],
    sections: [
      { id: "rc1", name: "Intro columns", selector: "#main-content > header.section.secondary-section", style: "grey", blocks: ["columns-media"], defaultContent: [] },
      { id: "rc2", name: "Feature columns", selector: "#main-content > section.section:nth-of-type(1)", style: null, blocks: ["columns-media"], defaultContent: [] },
      { id: "rc3", name: "Image gallery", selector: "#main-content > section.section.secondary-section:nth-of-type(2)", style: "grey", blocks: ["cards-gallery"], defaultContent: ["#main-content > section.section.secondary-section:nth-of-type(2) > div.container > div.utility-text-align-center.utility-margin-bottom-8rem"] },
      { id: "rc4", name: "Profile tabs", selector: "#main-content > section.section:nth-of-type(3)", style: null, blocks: ["tabs-profile"], defaultContent: [] },
      { id: "rc5", name: "Latest articles", selector: "#main-content > section.section.secondary-section:nth-of-type(4)", style: "grey", blocks: ["cards-article"], defaultContent: ["#main-content > section.section.secondary-section:nth-of-type(4) > div.container > div.utility-text-align-center"] },
      { id: "rc6", name: "FAQ", selector: "#main-content > section.section:nth-of-type(5)", style: null, blocks: ["accordion-faq"], defaultContent: ["#main-content > section.section:nth-of-type(5) > div.container > div.grid-layout.tablet-1-column.grid-gap-xxl > div:nth-of-type(1)"] },
      { id: "rc7", name: "Overlay hero banner", selector: "#main-content > section.section.inverse-section", style: null, blocks: ["hero-overlay"], defaultContent: [] }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
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
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_about_us_default = {
    transform: (payload) => {
      const {
        document: document2,
        url,
        html,
        params
      } = payload;
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
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_about_us_exports);
})();
