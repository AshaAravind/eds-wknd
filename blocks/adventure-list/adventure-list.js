import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Reads optional key/value configuration rows.
 * Recognised keys: `path` (path prefix filter), `limit`, `filters`
 * (comma-separated category tab labels; defaults to the WKND set), `exclude`.
 */
function readConfig(block) {
  const config = {};
  [...block.children].forEach((row) => {
    const cells = row.children;
    if (cells.length >= 2) {
      const key = cells[0].textContent.trim().toLowerCase();
      const value = cells[1].textContent.trim();
      if (key) config[key] = value;
    }
  });
  return config;
}

async function fetchIndex(indexUrl) {
  try {
    const resp = await fetch(indexUrl);
    if (!resp.ok) return [];
    const json = await resp.json();
    return json.data || [];
  } catch {
    return [];
  }
}

function itemCategory(item) {
  return (item.category || item.tags || '').toString().toLowerCase();
}

function buildCard(item) {
  const li = document.createElement('li');
  li.dataset.category = itemCategory(item);
  const article = document.createElement('article');

  if (item.image) {
    const imageLink = document.createElement('a');
    imageLink.href = item.path;
    imageLink.className = 'adventure-list-card-image';
    imageLink.setAttribute('aria-label', item.title || '');
    imageLink.append(createOptimizedPicture(item.image, item.title || '', false, [{ width: '750' }]));
    article.append(imageLink);
  }

  const body = document.createElement('div');
  body.className = 'adventure-list-card-body';

  const titleLink = document.createElement('a');
  titleLink.href = item.path;
  titleLink.className = 'adventure-list-card-title';
  titleLink.textContent = item.title || item.path;
  const title = document.createElement('h3');
  title.append(titleLink);
  body.append(title);

  if (item.description) {
    const desc = document.createElement('p');
    desc.className = 'adventure-list-card-description';
    desc.textContent = item.description;
    body.append(desc);
  }

  article.append(body);
  li.append(article);
  return li;
}

function buildFilterTabs(labels) {
  const tablist = document.createElement('div');
  tablist.className = 'adventure-list-filters';
  tablist.setAttribute('role', 'tablist');

  labels.forEach((label, idx) => {
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'adventure-list-filter';
    tab.textContent = label;
    tab.dataset.filter = idx === 0 ? 'all' : label.toLowerCase();
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');
    if (idx === 0) tab.classList.add('active');
    tablist.append(tab);
  });

  return tablist;
}

function applyFilter(block, filter) {
  block.querySelectorAll('.adventure-list-items > li').forEach((li) => {
    const cat = li.dataset.category || '';
    const show = filter === 'all' || cat.includes(filter);
    li.hidden = !show;
  });
}

export default async function decorate(block) {
  const config = readConfig(block);
  const pathFilter = config.path || '/us/en/adventures/';
  const limit = config.limit ? parseInt(config.limit, 10) : 0;
  const exclude = (config.exclude || '')
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);
  const filterLabels = (config.filters
    ? config.filters.split(',').map((f) => f.trim())
    : ['All', 'Climbing', 'Cycling', 'Skiing', 'Surfing', 'Travel']).filter(Boolean);

  block.textContent = '';

  const indexUrl = `${window.hlx.codeBasePath}/query-index.json`;
  let items = await fetchIndex(indexUrl);

  items = items.filter((item) => item.path
    && item.path.startsWith(pathFilter)
    && item.path !== pathFilter
    && item.path !== pathFilter.replace(/\/$/, '')
    && !exclude.includes(item.path));

  items.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
  if (limit > 0) items = items.slice(0, limit);

  // Filter tabs are the full filterable-grid experience (adventures landing).
  // The homepage uses a plain preview grid — the `no-filters` variant (or an
  // explicit `filters=none` config) suppresses the tab bar to match the source.
  const showFilters = !block.classList.contains('no-filters')
    && (config.filters || '').toLowerCase() !== 'none';

  if (showFilters) {
    const tabs = buildFilterTabs(filterLabels);
    block.append(tabs);
    tabs.addEventListener('click', (e) => {
      const tab = e.target.closest('.adventure-list-filter');
      if (!tab) return;
      tabs.querySelectorAll('.adventure-list-filter').forEach((t) => {
        t.classList.toggle('active', t === tab);
        t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
      });
      applyFilter(block, tab.dataset.filter);
    });
  }

  const ul = document.createElement('ul');
  ul.className = 'adventure-list-items';
  items.forEach((item) => ul.append(buildCard(item)));
  block.append(ul);
}
