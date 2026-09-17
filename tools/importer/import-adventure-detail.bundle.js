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

  // tools/importer/import-adventure-detail.js
  var import_adventure_detail_exports = {};
  __export(import_adventure_detail_exports, {
    default: () => import_adventure_detail_default
  });

  // tools/importer/parsers/adventure-gallery.js
  function parse(element, { document }) {
    const slides = Array.from(element.querySelectorAll(".cmp-carousel__item"));
    const cells = [];
    slides.forEach((slide) => {
      const image = slide.querySelector("picture, .cmp-image img, img");
      if (image) cells.push([image]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/adventure-details.js
  function parse2(element, { document }) {
    const items = Array.from(element.querySelectorAll(".cmp-contentfragment__element"));
    const rows = [["Columns"]];
    items.forEach((item) => {
      const term = item.querySelector(".cmp-contentfragment__element-title, dt");
      const value = item.querySelector(".cmp-contentfragment__element-value, dd");
      const labelCell = document.createElement("div");
      labelCell.textContent = term ? term.textContent.trim() : "";
      const valueCell = document.createElement("div");
      valueCell.textContent = value ? value.textContent.trim() : "";
      if (labelCell.textContent || valueCell.textContent) {
        rows.push([labelCell, valueCell]);
      }
    });
    if (rows.length < 2) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const table = WebImporter.DOMUtils.createTable(rows, document);
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

  // tools/importer/wknd-metadata.js
  var ADVENTURE_META = {
    "/us/en/adventures/bali-surf-camp": { category: "surfing", date: "01-01-2019", image: "https://wknd.site/us/en/adventures/bali-surf-camp/_jcr_content/root/container/carousel/image.coreimg.60.800.jpeg/1660323792187/adobestock-175749320.jpeg" },
    "/us/en/adventures/beervana-portland": { category: "travel", date: "01-02-2019", image: "https://wknd.site/us/en/adventures/beervana-portland/_jcr_content/root/container/carousel/image.coreimg.60.800.jpeg/1660323790531/adobestock-200192344.jpeg" },
    "/us/en/adventures/climbing-new-zealand": { category: "climbing", date: "01-03-2019", image: "https://wknd.site/us/en/adventures/climbing-new-zealand/_jcr_content/root/container/carousel/item_1571266094599.coreimg.60.800.jpeg/1660323785724/sport-climbing.jpeg" },
    "/us/en/adventures/colorado-rock-climbing": { category: "climbing", date: "01-04-2019", image: "https://wknd.site/us/en/adventures/colorado-rock-climbing/_jcr_content/root/container/carousel/image.coreimg.60.800.jpeg/1660323789363/adobestock-201222633.jpeg" },
    "/us/en/adventures/cycling-southern-utah": { category: "cycling", date: "01-05-2019", image: "https://wknd.site/us/en/adventures/cycling-southern-utah/_jcr_content/root/container/carousel/image.coreimg.60.800.jpeg/1660323777766/adobestock-185324648.jpeg" },
    "/us/en/adventures/cycling-tuscany": { category: "cycling, travel", date: "01-06-2019", image: "https://wknd.site/us/en/adventures/cycling-tuscany/_jcr_content/root/container/carousel/image.coreimg.60.800.jpeg/1660323789294/adobestock-59459597.jpeg" },
    "/us/en/adventures/downhill-skiing-wyoming": { category: "skiing", date: "01-07-2019", image: "https://wknd.site/us/en/adventures/downhill-skiing-wyoming/_jcr_content/root/container/carousel/image.coreimg.jpeg/1660323784078/adobestock-185234795.jpeg" },
    "/us/en/adventures/gastronomic-marais-tour": { category: "travel", date: "01-08-2019", image: "https://wknd.site/us/en/adventures/gastronomic-marais-tour/_jcr_content/root/container/carousel/image.coreimg.jpeg/1660323786247/adobestock-294203896.jpeg" },
    "/us/en/adventures/napa-wine-tasting": { category: "travel", date: "01-09-2019", image: "https://wknd.site/us/en/adventures/napa-wine-tasting/_jcr_content/root/container/carousel/image.coreimg.jpeg/1660323791204/adobestock-280313729.jpeg" },
    "/us/en/adventures/riverside-camping-australia": { category: "travel", date: "01-10-2019", image: "https://wknd.site/us/en/adventures/riverside-camping-australia/_jcr_content/root/container/carousel/image.coreimg.jpeg/1660323783461/adobe-waadobe-wa-mg-2466.jpeg" },
    "/us/en/adventures/ski-touring-mont-blanc": { category: "skiing", date: "01-11-2019", image: "https://wknd.site/us/en/adventures/ski-touring-mont-blanc/_jcr_content/root/container/carousel/item_1571168419252.coreimg.jpeg/1660323789507/adobestock-238230356.jpeg" },
    "/us/en/adventures/surf-camp-costa-rica": { category: "surfing", date: "01-12-2019", image: "https://wknd.site/us/en/adventures/surf-camp-costa-rica/_jcr_content/root/container/carousel/image.coreimg.jpeg/1660323786122/adobestock-278302117.jpeg" },
    "/us/en/adventures/tahoe-skiing": { category: "skiing", date: "01-13-2019", image: "https://wknd.site/us/en/adventures/tahoe-skiing/_jcr_content/root/container/carousel/image.coreimg.jpeg/1660323785476/adobestock-184591344.jpeg" },
    "/us/en/adventures/west-coast-cycling": { category: "cycling", date: "01-14-2019", image: "https://wknd.site/us/en/adventures/west-coast-cycling/_jcr_content/root/container/carousel/image.coreimg.jpeg/1660323786740/adobestock-151584995.jpeg" },
    "/us/en/adventures/whistler-mountain-biking": { category: "cycling", date: "01-15-2019", image: "https://wknd.site/us/en/adventures/whistler-mountain-biking/_jcr_content/root/container/carousel/image.coreimg.jpeg/1660323789625/adobestock-122615840.jpeg" },
    "/us/en/adventures/yosemite-backpacking": { category: "travel", date: "01-16-2019", image: "https://wknd.site/us/en/adventures/yosemite-backpacking/_jcr_content/root/container/carousel/image.coreimg.jpeg/1660323790695/adobestock-231698835.jpeg" }
  };
  function enrichMetadata(main, document, path, map) {
    const meta = map[path];
    if (!meta) return;
    const table = [...main.querySelectorAll("table")].find((t) => {
      const firstCell = t.querySelector("tr th, tr td");
      return firstCell && /^metadata$/i.test(firstCell.textContent.trim());
    });
    if (!table) return;
    const hasRow = (key) => [...table.querySelectorAll("tr")].some((tr) => {
      const c = tr.querySelector("td, th");
      return c && c.textContent.trim().toLowerCase() === key.toLowerCase();
    });
    const addRow = (key, value) => {
      if (!value || hasRow(key)) return;
      const tr = document.createElement("tr");
      const kCell = document.createElement("td");
      kCell.textContent = key;
      const vCell = document.createElement("td");
      if (key === "Image") {
        const img = document.createElement("img");
        img.src = value;
        vCell.append(img);
      } else {
        vCell.textContent = value;
      }
      tr.append(kCell, vCell);
      table.append(tr);
    };
    addRow("Category", meta.category);
    addRow("Publication Date", meta.date);
    addRow("Image", meta.image);
  }

  // tools/importer/import-adventure-detail.js
  var PAGE_TEMPLATE = {
    name: "adventure-detail",
    urls: [
      "https://wknd.site/us/en/adventures/climbing-new-zealand.html",
      "https://wknd.site/us/en/adventures/bali-surf-camp.html",
      "https://wknd.site/us/en/adventures/beervana-portland.html",
      "https://wknd.site/us/en/adventures/colorado-rock-climbing.html",
      "https://wknd.site/us/en/adventures/cycling-southern-utah.html",
      "https://wknd.site/us/en/adventures/cycling-tuscany.html",
      "https://wknd.site/us/en/adventures/downhill-skiing-wyoming.html",
      "https://wknd.site/us/en/adventures/gastronomic-marais-tour.html",
      "https://wknd.site/us/en/adventures/napa-wine-tasting.html",
      "https://wknd.site/us/en/adventures/riverside-camping-australia.html",
      "https://wknd.site/us/en/adventures/ski-touring-mont-blanc.html",
      "https://wknd.site/us/en/adventures/surf-camp-costa-rica.html",
      "https://wknd.site/us/en/adventures/tahoe-skiing.html",
      "https://wknd.site/us/en/adventures/west-coast-cycling.html",
      "https://wknd.site/us/en/adventures/whistler-mountain-biking.html",
      "https://wknd.site/us/en/adventures/yosemite-backpacking.html"
    ],
    blocks: [
      { name: "carousel", instances: [".carousel.cmp-carousel--mini"] },
      { name: "columns", instances: [".cmp-contentfragment--elements"] }
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
  var import_adventure_detail_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      WebImporter.DOMUtils.remove(main, [
        "nav.cmp-breadcrumb",
        ".breadcrumb",
        ".cmp-tabs__tablist",
        ".cmp-contentfragment__title",
        ".sharing"
      ]);
      document.querySelectorAll(".carousel.cmp-carousel--mini").forEach((el) => {
        if (el.parentNode) {
          try {
            parse(el, { document, url, params });
          } catch (e) {
            console.error("gallery parse failed", e);
          }
        }
      });
      document.querySelectorAll(".cmp-contentfragment--elements").forEach((el) => {
        if (el.parentNode) {
          try {
            parse2(el, { document, url, params });
          } catch (e) {
            console.error("adventure-details parse failed", e);
          }
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      enrichMetadata(main, document, path, ADVENTURE_META);
      return [{
        element: main,
        path,
        report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: ["carousel", "columns"] }
      }];
    }
  };
  return __toCommonJS(import_adventure_detail_exports);
})();
