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
  function parseProfiles(cardEls, { document: document2 }) {
    if (!cardEls.length) return;
    const rows = [["Cards (profiles)"]];
    cardEls.forEach((card) => {
      const imageCell = document2.createElement("div");
      const img = card.querySelector("img.cmp-image__image, picture, img");
      if (img) imageCell.append(img.closest("picture") || img);
      const bodyCell = document2.createElement("div");
      const name = card.querySelector(".title h3, h3");
      const role = card.querySelector("h5");
      if (name) {
        const h = document2.createElement("h3");
        h.textContent = name.textContent.trim();
        bodyCell.append(h);
      }
      if (role) {
        const p = document2.createElement("p");
        p.textContent = role.textContent.trim();
        bodyCell.append(p);
      }
      const links = [...card.querySelectorAll("a.cmp-button, .buildingblock a")];
      if (links.length) {
        const social = document2.createElement("p");
        links.forEach((a) => {
          const label = a.querySelector(".cmp-button__icon");
          let type = "Link";
          if (label) {
            const cls = [...label.classList].find((c) => c.includes("--")) || "";
            type = cls.split("--").pop() || "Link";
          }
          const link = document2.createElement("a");
          link.href = a.getAttribute("href") || "#";
          link.textContent = type.charAt(0).toUpperCase() + type.slice(1);
          social.append(link, document2.createTextNode(" "));
        });
        bodyCell.append(social);
      }
      rows.push([imageCell, bodyCell]);
    });
    const table = WebImporter.DOMUtils.createTable(rows, document2);
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

  // tools/importer/import-about-us.js
  var PAGE_TEMPLATE = {
    name: "content-landing",
    urls: ["https://wknd.site/us/en/about-us.html"],
    sections: [
      {
        id: "rc1",
        name: "about-content",
        selector: ["main.cmp-layout-container--fixed", ".cmp-layout-container--fixed"],
        style: "content-landing",
        blocks: ["cards"],
        defaultContent: [".title", ".text"]
      }
    ]
  };
  var hasStyledSection = PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.some((s) => s.style);
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && (PAGE_TEMPLATE.sections.length > 1 || hasStyledSection) ? [transform2] : []
  ];
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
      const { document: document2, url, params } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const cards = [...document2.querySelectorAll(".cmp-experience-fragment--contributor")];
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
            parseProfiles(group.els, { document: document2 });
          } catch (e) {
            console.error("profile-cards parse failed", e);
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
        report: { title: document2.title, template: PAGE_TEMPLATE.name, blocks: ["cards (profiles)"] }
      }];
    }
  };
  return __toCommonJS(import_about_us_exports);
})();
