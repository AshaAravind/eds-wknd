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

  // tools/importer/import-home.js
  var import_home_exports = {};
  __export(import_home_exports, {
    default: () => import_home_default
  });

  // tools/importer/parsers/carousel.js
  function parse(element, { document: document2 }) {
    let slides = Array.from(element.querySelectorAll(".cmp-carousel__item"));
    if (!slides.length) {
      slides = Array.from(element.querySelectorAll('.cmp-teaser, [class*="__item"]'));
    }
    const cells = [];
    slides.forEach((slide) => {
      const image = slide.querySelector("picture, .cmp-teaser__image img, .cmp-image img, img");
      const contentCell = [];
      const heading = slide.querySelector('.cmp-teaser__title, h1, h2, h3, [class*="title"]');
      if (heading) contentCell.push(heading);
      const description = slide.querySelector('.cmp-teaser__description, p, [class*="description"]');
      if (description) contentCell.push(description);
      const ctaLinks = Array.from(slide.querySelectorAll(".cmp-teaser__action-link, .cmp-teaser__action-container a, a.button"));
      ctaLinks.forEach((cta) => contentCell.push(cta));
      if (image || contentCell.length) {
        cells.push([image || "", contentCell]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "carousel", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/teaser.js
  function parse2(element, { document: document2 }) {
    const image = element.querySelector("picture, .cmp-teaser__image img, .cmp-image img, img");
    const contentCell = [];
    const content = element.querySelector('.cmp-teaser__content, [class*="__content"]');
    if (content) {
      Array.from(content.children).forEach((child) => {
        if (child.querySelector && child.querySelector("img, picture")) return;
        if (child.tagName === "IMG" || child.tagName === "PICTURE") return;
        contentCell.push(child);
      });
    } else {
      const eyebrow = element.querySelector('.cmp-teaser__pretitle, [class*="pretitle"], [class*="eyebrow"]');
      if (eyebrow) contentCell.push(eyebrow);
      const heading = element.querySelector('.cmp-teaser__title, h1, h2, h3, [class*="title"]');
      if (heading) contentCell.push(heading);
      const description = element.querySelector('.cmp-teaser__description, [class*="description"]');
      if (description) contentCell.push(description);
      const ctaLinks = Array.from(element.querySelectorAll(".cmp-teaser__action-link, a.button"));
      ctaLinks.forEach((cta) => contentCell.push(cta));
    }
    if (!image && !contentCell.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [[image || "", contentCell]];
    const isSecure = element.classList.contains("cmp-teaser--secure") || element.querySelector(".cmp-teaser--secure");
    const name = isSecure ? "teaser (members-only)" : "teaser";
    const block = WebImporter.Blocks.createBlock(document2, { name, cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/article-list.js
  function localePrefix(src) {
    if (!src) return "/us/en";
    try {
      const parts = new URL(src).pathname.split("/").filter(Boolean);
      if (parts.length >= 2) return `/${parts[0]}/${parts[1].replace(/\.html?$/, "")}`;
    } catch (e) {
    }
    return "/us/en";
  }
  function parse3(element, { document: document2, url, params } = {}) {
    const prefix = localePrefix(params && params.originalURL || url);
    const cells = [
      ["path", `${prefix}/magazine/`],
      ["limit", "4"]
    ];
    const block = WebImporter.Blocks.createBlock(document2, { name: "article-list", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/adventure-list.js
  function localePrefix2(src) {
    if (!src) return "/us/en";
    try {
      const parts = new URL(src).pathname.split("/").filter(Boolean);
      if (parts.length >= 2) return `/${parts[0]}/${parts[1].replace(/\.html?$/, "")}`;
    } catch (e) {
    }
    return "/us/en";
  }
  function parse4(element, { document: document2, url, params } = {}) {
    const tabLabels = Array.from(
      element.querySelectorAll('.cmp-tabs__tab, [role="tab"]')
    ).map((tab) => tab.textContent.trim()).filter(Boolean);
    const prefix = localePrefix2(params && params.originalURL || url);
    const cells = [["path", `${prefix}/adventures/`]];
    if (tabLabels.length) {
      cells.push(["filters", tabLabels.join(", ")]);
    } else {
      cells.push(["limit", "4"]);
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "adventure-list", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header.cmp-experiencefragment--header",
        "footer.cmp-experiencefragment--footer",
        "#destination_publishing_iframe_wkndsite_0",
        "#toggleNav",
        "#mobileNav",
        // Content-fragment internal title (visually hidden on source). The visible page
        // title comes from the separate .cmp-title--underline heading; importing this
        // too produces a duplicate "Bali Surf Camp" heading. Found in cleaned.html:
        //   <h3 class="cmp-contentfragment__title">Bali Surf Camp</h3>
        ".cmp-contentfragment__title"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "meta",
        "iframe",
        "noscript",
        "link",
        // Non-authorable social-share chrome in the article sidebar. The authorable
        // sidebar content is the .cmp-list--upnext "up next" cards block; the share
        // label + widget are site UI, not something an author would create.
        // Scoped to the sidebar so the site-wide cleanup can't touch authorable
        // titles elsewhere. Found in cleaned.html:
        //   line 363 <div class="title cmp-title--black ...">SHARE THIS STORY</div>
        //   line 368 <div class="sharing"> (empty FB div + empty Pinterest <a> -> stray [](url))
        ".cmp-layoutcontainer--sidebar .title.cmp-title--black",
        ".cmp-layoutcontainer--sidebar .sharing",
        // Hidden decorative separators (sidebar line 374, footer line 490). These emit a
        // stray thematic break in the import. Targets the classed cmp-separator wrapper
        // only — NOT bare <hr> — so the section transformer's inserted <hr> breaks survive.
        ".cmp-separator--hidden"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("data-cmp-data-layer");
        el.removeAttribute("data-cmp-hook-image");
        el.removeAttribute("data-cmp-data-layer-name");
        el.removeAttribute("data-cmp-data-layer-enabled");
      });
    }
  }

  // tools/importer/transformers/wknd-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function querySection(root, selectors) {
    for (const sel of selectors) {
      const el = root.querySelector(sel);
      if (el) return el;
    }
    return null;
  }
  function transform2(hookName, element, payload) {
    const sections = payload.template && payload.template.sections || [];
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = querySection(element, section.selector);
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
        const anchor = marker || querySection(element, section.selector);
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

  // tools/importer/import-home.js
  var PAGE_TEMPLATE = {
    name: "home",
    description: "Homepage: hero carousel, featured article teaser, recent articles list, next adventure teaser, adventures list",
    urls: ["https://wknd.site/us/en.html"],
    blocks: [
      { name: "carousel", instances: [".carousel.cmp-carousel--hero", ".cmp-carousel"] },
      { name: "teaser", instances: [".teaser.cmp-teaser--featured", ".teaser.cmp-teaser--imagebottom"] },
      { name: "article-list", instances: [".cmp-image-list"] },
      { name: "adventure-list", instances: [".cmp-image-list"] }
    ],
    sections: [
      { id: "1", name: "hero-carousel", selector: [".carousel.cmp-carousel--hero"], style: null, blocks: ["carousel"], defaultContent: [] },
      { id: "2", name: "featured-article", selector: [".teaser.cmp-teaser--featured"], style: "grey", blocks: ["teaser"], defaultContent: [] },
      { id: "3", name: "recent-articles", selector: [".cmp-image-list"], style: null, blocks: ["article-list"], defaultContent: [] },
      { id: "4", name: "next-adventures", selector: [".teaser"], style: null, blocks: ["teaser"], defaultContent: [] },
      { id: "5", name: "adventures", selector: [".cmp-image-list"], style: null, blocks: ["adventure-list"], defaultContent: [] }
    ]
  };
  var parsers = {
    carousel: parse,
    teaser: parse2,
    "article-list": parse3,
    "adventure-list": parse4
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function parseDynamicLists(document2, url, params) {
    const lists = [...document2.querySelectorAll(".cmp-image-list")];
    if (lists[0] && lists[0].parentNode) parse3(lists[0], { document: document2, url, params });
    if (lists[1] && lists[1].parentNode) parse4(lists[1], { document: document2, url, params });
  }
  var import_home_default = {
    transform: (payload) => {
      const { document: document2, url, params } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      ["carousel", "teaser"].forEach((name) => {
        const def = PAGE_TEMPLATE.blocks.find((b) => b.name === name);
        const seen = /* @__PURE__ */ new Set();
        def.instances.forEach((selector) => {
          document2.querySelectorAll(selector).forEach((el) => {
            if (seen.has(el) || !el.parentNode) return;
            seen.add(el);
            try {
              parsers[name](el, { document: document2, url, params });
            } catch (e) {
              console.error(`Failed to parse ${name} (${selector}):`, e);
            }
          });
        });
      });
      parseDynamicLists(document2, url, params);
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: ["carousel", "teaser", "article-list", "adventure-list"]
        }
      }];
    }
  };
  return __toCommonJS(import_home_exports);
})();
