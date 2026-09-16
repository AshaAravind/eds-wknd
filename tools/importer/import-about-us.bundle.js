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

  // tools/importer/parsers/profile-cards.js
  function parseProfiles(cardEls, { document }) {
    if (!cardEls.length) return;
    const rows = [["Cards"]];
    cardEls.forEach((card) => {
      const imageCell = document.createElement("div");
      const img = card.querySelector("img.cmp-image__image, picture, img");
      if (img) imageCell.append(img.closest("picture") || img);
      const bodyCell = document.createElement("div");
      const name = card.querySelector(".title h3, h3");
      const role = card.querySelector("h5");
      if (name) {
        const h = document.createElement("h3");
        h.textContent = name.textContent.trim();
        bodyCell.append(h);
      }
      if (role) {
        const p = document.createElement("p");
        p.textContent = role.textContent.trim();
        bodyCell.append(p);
      }
      const links = [...card.querySelectorAll("a.cmp-button, .buildingblock a")];
      if (links.length) {
        const social = document.createElement("p");
        links.forEach((a) => {
          const label = a.querySelector(".cmp-button__icon");
          let type = "Link";
          if (label) {
            const cls = [...label.classList].find((c) => c.includes("--")) || "";
            type = cls.split("--").pop() || "Link";
          }
          const link = document.createElement("a");
          link.href = a.getAttribute("href") || "#";
          link.textContent = type.charAt(0).toUpperCase() + type.slice(1);
          social.append(link, document.createTextNode(" "));
        });
        bodyCell.append(social);
      }
      rows.push([imageCell, bodyCell]);
    });
    const table = WebImporter.DOMUtils.createTable(rows, document);
    cardEls[0].replaceWith(table);
    cardEls.slice(1).forEach((el) => el.remove());
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

  // tools/importer/import-about-us.js
  var PAGE_TEMPLATE = {
    name: "about-us",
    urls: ["https://wknd.site/us/en/about-us.html"]
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
  var import_about_us_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const cards = [...document.querySelectorAll(".cmp-experience-fragment--contributor")];
      const groups = [];
      cards.forEach((card) => {
        let node = card;
        let heading = null;
        while (node && !heading) {
          let prev = node.previousElementSibling;
          while (prev) {
            const h2 = prev.matches && prev.matches("h2") ? prev : prev.querySelector ? prev.querySelector("h2") : null;
            if (h2) {
              heading = h2.textContent.trim();
              break;
            }
            prev = prev.previousElementSibling;
          }
          node = node.parentElement;
        }
        const key = heading || "group";
        let group = groups.find((g) => g.key === key);
        if (!group) {
          group = { key, els: [] };
          groups.push(group);
        }
        group.els.push(card);
      });
      groups.forEach((group) => {
        if (group.els.every((el) => el.parentNode)) {
          try {
            parseProfiles(group.els, { document });
          } catch (e) {
            console.error("profile-cards parse failed", e);
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
      return [{
        element: main,
        path,
        report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: ["cards"] }
      }];
    }
  };
  return __toCommonJS(import_about_us_exports);
})();
