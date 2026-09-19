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

  // tools/importer/parsers/breadcrumbs.js
  function parse(element, { document: document2 }) {
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

  // tools/importer/parsers/carousel.js
  function parse2(element, { document: document2 }) {
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

  // tools/importer/parsers/tabs.js
  function parse3(element, { document: document2 }) {
    const labels = Array.from(element.querySelectorAll(".cmp-tabs__tab, .cmp-tabs__tablist > li"));
    const panels = Array.from(element.querySelectorAll(".cmp-tabs__tabpanel"));
    const cells = [];
    panels.forEach((panel, i) => {
      const labelEl = labels[i];
      const labelText = labelEl ? (labelEl.textContent || "").trim() : ((panel.querySelector(".cmp-contentfragment__title, h1, h2, h3, h4") || {}).textContent || "").trim();
      const contentSource = panel.querySelector(".cmp-contentfragment__elements") || panel;
      const contentCell = [];
      contentSource.querySelectorAll("p, ul, ol, img, picture, h1, h2, h3, h4, h5, h6").forEach((node) => {
        if (node.tagName === "IMG" && node.closest("picture")) return;
        contentCell.push(node);
      });
      if (labelText || contentCell.length) {
        cells.push([labelText || "", contentCell]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "tabs", cells });
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

  // tools/importer/import-adventure-detail.js
  var parsers = {
    breadcrumbs: parse,
    carousel: parse2,
    tabs: parse3
  };
  var PAGE_TEMPLATE = {
    name: "adventure-detail",
    description: "Detail page with full-width hero carousel, left metadata sidebar, and tabbed body content",
    urls: [
      "https://wknd.site/us/en/adventures/bali-surf-camp.html"
    ],
    blocks: [
      {
        name: "breadcrumbs",
        instances: [".breadcrumb.cmp-breadcrumb--fixed", ".breadcrumb"]
      },
      {
        name: "carousel",
        instances: [".carousel.cmp-carousel--mini", ".carousel.panelcontainer"]
      },
      {
        name: "tabs",
        instances: [".tabs.panelcontainer", ".tabs"]
      }
    ],
    sections: [
      {
        id: "rc1",
        name: "breadcrumbs",
        selector: [".breadcrumb.cmp-breadcrumb--fixed", ".breadcrumb"],
        style: null,
        blocks: ["breadcrumbs"],
        defaultContent: []
      },
      {
        id: "rc2",
        name: "hero-carousel",
        selector: [".carousel.cmp-carousel--mini", ".carousel.panelcontainer"],
        style: null,
        blocks: ["carousel"],
        defaultContent: []
      },
      {
        // Title + metadata + tabs share one section so the metadata sidebar and
        // tab content can render as a 2-column layout (matching the source). The
        // tabs block still parses via PAGE_TEMPLATE.blocks; keeping it in this
        // section (no separate entry) means no <hr> break splits them apart.
        id: "rc3",
        name: "title-metadata-tabs",
        selector: [".cmp-layout-container--fixed", "main.cmp-layout-container--fixed"],
        style: "adventure-info",
        blocks: ["tabs"],
        defaultContent: [".title.cmp-title--underline", ".contentfragment.cmp-contentfragment--elements", ".text.cmp-text--font-xsmall"]
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
  var import_adventure_detail_default = {
    transform: (payload) => {
      const {
        document: document2,
        url,
        html,
        params
      } = payload;
      const main = document2.body;
      let adventureCategory = "";
      (() => {
        let activity = "";
        main.querySelectorAll("li, dl > div").forEach((item) => {
          const ps = item.querySelectorAll("p, dt, dd");
          if (ps.length >= 2 && ps[0].textContent.trim().toLowerCase() === "activity") {
            activity = ps[1].textContent.trim();
          }
        });
        if (!activity) {
          const dt = [...main.querySelectorAll("dt")].find((d) => d.textContent.trim().toLowerCase() === "activity");
          if (dt && dt.nextElementSibling) activity = dt.nextElementSibling.textContent.trim();
        }
        const a = activity.toLowerCase();
        if (/climb/.test(a)) adventureCategory = "climbing";
        else if (/cycl|bike|biking/.test(a)) adventureCategory = "cycling";
        else if (/ski/.test(a)) adventureCategory = "skiing";
        else if (/surf/.test(a)) adventureCategory = "surfing";
        else adventureCategory = "travel";
      })();
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
      const metaBlock = WebImporter.rules.createMetadata(main, document2);
      if (adventureCategory) {
        const addRow = (tableEl) => {
          const tr = document2.createElement("tr");
          const k = document2.createElement("td");
          k.textContent = "Category";
          const v = document2.createElement("td");
          v.textContent = adventureCategory;
          tr.append(k, v);
          (tableEl.querySelector("tbody") || tableEl).append(tr);
        };
        let table = metaBlock && typeof metaBlock.querySelector === "function" ? metaBlock : null;
        if (!table) {
          const tables = main.querySelectorAll("table");
          table = [...tables].find((t) => /metadata/i.test(t.textContent.slice(0, 20))) || tables[tables.length - 1] || null;
        }
        if (table) addRow(table);
      }
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
  return __toCommonJS(import_adventure_detail_exports);
})();
