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
  var ARTICLE_META = {
    "/us/en/magazine/guide-la-skateparks": { category: "surfing", date: "05-01-2019", image: "https://wknd.site/us/en/magazine/guide-la-skateparks/_jcr_content/root/container/container/contentfragment/par2/image_copy.coreimg.60.800.png/1660323783259/article-01-picture-01.png" },
    "/us/en/magazine/ski-touring": { category: "skiing", date: "04-01-2019", image: "https://wknd.site/us/en/magazine/ski-touring/_jcr_content/root/container/container/contentfragment/par1/image.coreimg.60.800.jpeg/1660323789866/skitouring5sjoeberg.jpeg" },
    "/us/en/magazine/arctic-surfing": { category: "surfing", date: "03-01-2019", image: "https://wknd.site/us/en/magazine/arctic-surfing/_jcr_content/root/container/container/contentfragment/par1/image.coreimg.60.800.jpeg/1660323789770/surfer-wave-02.jpeg" },
    "/us/en/magazine/san-diego-surf": { category: "surfing", date: "02-01-2019", image: "https://wknd.site/us/en/magazine/san-diego-surf/_jcr_content/root/container/container/contentfragment/par1/image.coreimg.60.800.jpeg/1660323790169/adobestock-164735399.jpeg" },
    "/us/en/magazine/western-australia": { category: "travel", date: "01-01-2019", image: "https://wknd.site/us/en/magazine/western-australia/_jcr_content/root/container/container/contentfragment/par2/image.coreimg.60.800.jpeg/1660323770369/adobe-waadobe-wa-b6a7083.jpeg" }
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

  // tools/importer/import-article-detail.js
  var PAGE_TEMPLATE = {
    name: "article-detail",
    urls: [
      "https://wknd.site/us/en/magazine/western-australia.html",
      "https://wknd.site/us/en/magazine/arctic-surfing.html",
      "https://wknd.site/us/en/magazine/san-diego-surf.html",
      "https://wknd.site/us/en/magazine/ski-touring.html",
      "https://wknd.site/us/en/magazine/guide-la-skateparks.html"
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
  var import_article_detail_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      WebImporter.DOMUtils.remove(main, [
        "nav.cmp-breadcrumb",
        ".breadcrumb",
        ".cmp-layoutcontainer--sidebar",
        "aside.cmp-layoutcontainer--sidebar",
        ".sharing",
        ".cmp-buildingblock--btn-list"
      ]);
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      enrichMetadata(main, document, path, ARTICLE_META);
      return [{
        element: main,
        path,
        report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: [] }
      }];
    }
  };
  return __toCommonJS(import_article_detail_exports);
})();
