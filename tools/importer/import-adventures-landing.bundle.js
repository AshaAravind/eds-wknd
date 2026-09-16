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

  // tools/importer/import-adventures-landing.js
  var import_adventures_landing_exports = {};
  __export(import_adventures_landing_exports, {
    default: () => import_adventures_landing_default
  });

  // tools/importer/parsers/teaser.js
  function parse(element, { document }) {
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
    const block = WebImporter.Blocks.createBlock(document, { name: "teaser", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/adventure-list-filtered.js
  function parse2(element, { document }) {
    const cells = [
      ["Adventure List"],
      ["path", "/us/en/adventures/"],
      ["filters", "All, Climbing, Cycling, Skiing, Surfing, Travel"]
    ];
    const table = WebImporter.DOMUtils.createTable(cells, document);
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
        "#mobileNav"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "meta",
        "iframe",
        "noscript",
        "link"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("data-cmp-data-layer");
        el.removeAttribute("data-cmp-hook-image");
        el.removeAttribute("data-cmp-data-layer-name");
        el.removeAttribute("data-cmp-data-layer-enabled");
      });
    }
  }

  // tools/importer/import-adventures-landing.js
  var PAGE_TEMPLATE = {
    name: "adventures-landing",
    urls: ["https://wknd.site/us/en/adventures.html"],
    blocks: [
      { name: "teaser", instances: [".teaser.cmp-teaser--hero"] },
      { name: "adventure-list", instances: [".cmp-image-list"] }
    ]
  };
  var transformers = [transform];
  function executeTransformers(hookName, element, payload) {
    transformers.forEach((fn) => {
      try {
        fn.call(null, hookName, element, __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE }));
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  var import_adventures_landing_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      document.querySelectorAll(".teaser.cmp-teaser--hero").forEach((el) => {
        if (el.parentNode) {
          try {
            parse(el, { document, url, params });
          } catch (e) {
            console.error("teaser parse failed", e);
          }
        }
      });
      const lists = [...document.querySelectorAll(".cmp-image-list")];
      if (lists.length) {
        try {
          parse2(lists[0], { document });
        } catch (e) {
          console.error("adventure-list parse failed", e);
        }
        lists.slice(1).forEach((l) => {
          const wrapper = l.closest(".image-list") || l;
          wrapper.remove();
        });
      }
      document.querySelectorAll(".image-list.list, .cmp-tabs__tabpanel").forEach((el) => {
        if (!el.querySelector(".adventure-list") && !el.textContent.trim()) el.remove();
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: ["teaser", "adventure-list"] }
      }];
    }
  };
  return __toCommonJS(import_adventures_landing_exports);
})();
