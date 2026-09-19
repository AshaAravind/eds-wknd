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

  // tools/importer/import-article-detail.js
  var import_article_detail_exports = {};
  __export(import_article_detail_exports, {
    default: () => import_article_detail_default
  });

  // tools/importer/parsers/hero-article.js
  function parse(element, { document: document2 }) {
    const image = element.querySelector(".cmp-image__image, .cmp-image img, img");
    if (!image) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cells.push([[image]]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/breadcrumbs.js
  function parse2(element, { document: document2 }) {
    const items = Array.from(element.querySelectorAll(".cmp-breadcrumb__item, li"));
    const list = document2.createElement("ul");
    items.forEach((item) => {
      const link = item.querySelector("a");
      const li = document2.createElement("li");
      if (link) {
        const label = (link.textContent || "").trim();
        if (label) link.textContent = label;
        li.append(link);
      } else {
        const label = (item.textContent || "").trim();
        if (!label) return;
        li.textContent = label;
      }
      list.append(li);
    });
    if (!list.children.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cells.push([list]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "breadcrumbs", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/author-bio.js
  function parse3(element, { document: document2 }) {
    const avatar = element.querySelector(".cmp-byline__image img, .cmp-byline img, img");
    const name = element.querySelector('.cmp-byline__name, h2, [class*="name"]');
    const role = element.querySelector('.cmp-byline__occupations, p[class*="occupation"]');
    const socialLinks = Array.from(
      element.querySelectorAll(".cmp-buildingblock--btn-list a.cmp-button, .cmp-buildingblock--btn-list a")
    );
    if (!avatar && !name && !role && socialLinks.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const imageCell = avatar ? [avatar] : [""];
    const infoCell = [];
    if (name) infoCell.push(name);
    if (role) infoCell.push(role);
    const socialCell = [];
    socialLinks.forEach((link) => {
      const label = (link.textContent || "").trim();
      if (label) link.textContent = label;
      socialCell.push(link);
    });
    const cells = [];
    cells.push([imageCell, infoCell.length ? infoCell : "", socialCell.length ? socialCell : ""]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "author-bio", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-related.js
  function parse4(element, { document: document2 }) {
    const items = Array.from(element.querySelectorAll(".cmp-list__item, li"));
    const cells = [];
    items.forEach((item) => {
      const link = item.querySelector("a.cmp-list__item-link, a");
      const titleEl = item.querySelector('.cmp-list__item-title, [class*="title"]');
      const dateEl = item.querySelector('.cmp-list__item-date, [class*="date"]');
      const title = titleEl ? (titleEl.textContent || "").trim() : "";
      const date = dateEl ? (dateEl.textContent || "").trim() : "";
      if (!title && !date && !(link && link.href)) return;
      const cellContent = [];
      if (link && (title || link.textContent.trim())) {
        const a = document2.createElement("a");
        a.href = link.getAttribute("href") || link.href || "";
        a.textContent = title || (link.textContent || "").trim();
        cellContent.push(a);
      } else if (title) {
        const p = document2.createElement("p");
        p.textContent = title;
        cellContent.push(p);
      }
      if (date) {
        const dateP = document2.createElement("p");
        dateP.textContent = date;
        cellContent.push(dateP);
      }
      cells.push([cellContent]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-related", cells });
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

  // tools/importer/import-article-detail.js
  var parsers = {
    "hero-article": parse,
    breadcrumbs: parse2,
    "author-bio": parse3,
    "cards-related": parse4
  };
  var PAGE_TEMPLATE = {
    name: "article-detail",
    description: "Long-form article page with hero image, title and byline, rich body with inline images and headings, related-links sidebar, and author bio",
    urls: [
      "https://wknd.site/us/en/magazine/san-diego-surf.html"
    ],
    blocks: [
      {
        name: "hero-article",
        instances: ["main.cmp-layout-container--fixed > .cmp-container > .aem-Grid > .image", ".cmp-layout-container--fixed > .cmp-container > .aem-Grid > .image.aem-GridColumn--default--12"]
      },
      {
        name: "breadcrumbs",
        instances: [".breadcrumb"]
      },
      {
        name: "author-bio",
        instances: [".cmp-experiencefragment--justin-barr", ".experiencefragment"]
      },
      {
        name: "cards-related",
        instances: [".list.cmp-list--upnext", ".cmp-list--upnext"]
      }
    ],
    sections: [
      {
        id: "rc1",
        name: "hero-article",
        selector: ["main.cmp-layout-container--fixed > .cmp-container > .aem-Grid > .image", ".cmp-layout-container--fixed > .cmp-container > .aem-Grid > .image.aem-GridColumn--default--12"],
        style: null,
        blocks: ["hero-article"],
        defaultContent: []
      },
      {
        id: "rc2",
        name: "breadcrumbs",
        selector: [".breadcrumb"],
        style: null,
        blocks: ["breadcrumbs"],
        defaultContent: []
      },
      {
        // Article header, body, author-bio and sidebar merged into one section so
        // the article content and the related-articles sidebar can render as a
        // 2-column layout (matching the source). Blocks still parse via
        // PAGE_TEMPLATE.blocks; keeping them in one section (no separate entries)
        // means no <hr> break splits the column pair apart.
        id: "rc3",
        name: "article-main",
        selector: [".title:nth-of-type(1)", "main.aem-GridColumn--default--8 > .cmp-container > .title"],
        style: "article-main",
        blocks: ["author-bio", "cards-related"],
        defaultContent: [".title", ".byline", ".cmp-contentfragment--san-diego-surfspots"]
      }
    ]
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
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    const seen = /* @__PURE__ */ new Set();
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        document2.querySelectorAll(selector).forEach((element) => {
          if (seen.has(element)) return;
          seen.add(element);
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    return pageBlocks;
  }
  var import_article_detail_default = {
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
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
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
  return __toCommonJS(import_article_detail_exports);
})();
