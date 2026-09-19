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

  // tools/importer/import-content-landing.js
  var import_content_landing_exports = {};
  __export(import_content_landing_exports, {
    default: () => import_content_landing_default
  });

  // tools/importer/parsers/teaser.js
  function parse(element, { document: document2 }) {
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

  // tools/importer/parsers/teaser-members.js
  function parse2(element, { document: document2 }) {
    const content = element.querySelector(".cmp-teaser__content") || element;
    const title = content.querySelector(".cmp-teaser__title, h1, h2, h3");
    const description = content.querySelector(".cmp-teaser__description");
    const action = content.querySelector(".cmp-teaser__action-link, a");
    const contentCell = document2.createElement("div");
    if (title) {
      const h = document2.createElement("h3");
      h.textContent = title.textContent.trim();
      contentCell.append(h);
    }
    if (description) {
      const p = document2.createElement("p");
      p.textContent = description.textContent.trim();
      contentCell.append(p);
    }
    const label = action ? action.textContent.trim() : "Read More";
    const cta = document2.createElement("p");
    const link = document2.createElement("a");
    link.href = "#";
    link.textContent = label;
    cta.append(link);
    contentCell.append(cta);
    const imageCell = document2.createElement("div");
    const pic = element.querySelector("picture, img");
    if (pic) imageCell.append(pic.closest("picture") || pic);
    const cells = [["Teaser (members-only)"], [imageCell, contentCell]];
    const table = WebImporter.DOMUtils.createTable(cells, document2);
    element.replaceWith(table);
  }

  // tools/importer/parsers/article-list-all.js
  function parse3(element, { document: document2 }) {
    const cells = [
      ["Article List"],
      ["path", "/us/en/magazine/"]
    ];
    const table = WebImporter.DOMUtils.createTable(cells, document2);
    element.replaceWith(table);
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

  // tools/importer/import-content-landing.js
  var PAGE_TEMPLATE = {
    name: "content-landing",
    description: "Content landing page with featured-article split panel and a grid of teaser cards",
    urls: [
      "https://wknd.site/us/en/magazine.html"
    ],
    blocks: [
      {
        name: "teaser",
        instances: [".teaser.cmp-teaser--featured", ".teaser.cmp-teaser--secure", ".teaser.cmp-teaser--list"]
      },
      {
        name: "article-list",
        instances: [".image-list.list", ".cmp-image-list"]
      }
    ],
    sections: [
      {
        id: "rc1",
        name: "magazine-content",
        selector: ["main.cmp-layout-container--fixed", ".cmp-layout-container--fixed"],
        style: "content-landing",
        blocks: ["teaser", "article-list"],
        defaultContent: [
          ".title:not(.cmp-title--underline)",
          ".title.cmp-title--underline",
          ".text",
          ".separator"
        ]
      }
    ]
  };
  var hasStyledSection = PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.some((s) => s.style);
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && (PAGE_TEMPLATE.sections.length > 1 || hasStyledSection) ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE }));
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  var import_content_landing_default = {
    transform: (payload) => {
      const {
        document: document2,
        url,
        html,
        params
      } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      document2.querySelectorAll(".teaser.cmp-teaser--featured, .teaser.cmp-teaser--list").forEach((el) => {
        if (el.parentNode) {
          try {
            parse(el, { document: document2, url, params });
          } catch (e) {
            console.error("teaser parse failed", e);
          }
        }
      });
      const list = document2.querySelector(".image-list.list, .cmp-image-list");
      if (list && list.parentNode) {
        try {
          parse3(list, { document: document2, url, params });
        } catch (e) {
          console.error("article-list parse failed", e);
        }
      }
      document2.querySelectorAll(".teaser.cmp-teaser--secure").forEach((el) => {
        if (el.parentNode) {
          try {
            parse2(el, { document: document2, url, params });
          } catch (e) {
            console.error("teaser-members parse failed", e);
          }
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
          blocks: ["teaser", "article-list", "teaser-members"]
        }
      }];
    }
  };
  return __toCommonJS(import_content_landing_exports);
})();
