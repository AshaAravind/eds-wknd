import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Reads optional key/value configuration rows authored into the block.
 * Recognised keys: `path` (path prefix filter), `limit` (max items),
 * `exclude` (comma-separated paths to omit).
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

function buildCard(item) {
  const li = document.createElement('li');
  const article = document.createElement('article');

  if (item.image) {
    const imageLink = document.createElement('a');
    imageLink.href = item.path;
    imageLink.className = 'article-list-card-image';
    imageLink.setAttribute('aria-label', item.title || '');
    imageLink.append(createOptimizedPicture(item.image, item.title || '', false, [{ width: '750' }]));
    article.append(imageLink);
  }

  const body = document.createElement('div');
  body.className = 'article-list-card-body';

  const titleLink = document.createElement('a');
  titleLink.href = item.path;
  titleLink.className = 'article-list-card-title';
  titleLink.textContent = item.title || item.path;
  const title = document.createElement('h3');
  title.append(titleLink);
  body.append(title);

  if (item.description) {
    const desc = document.createElement('p');
    desc.className = 'article-list-card-description';
    desc.textContent = item.description;
    body.append(desc);
  }

  article.append(body);
  li.append(article);
  return li;
}

export default async function decorate(block) {
  const config = readConfig(block);
  const pathFilter = config.path || '/us/en/magazine/';
  const limit = config.limit ? parseInt(config.limit, 10) : 0;
  const exclude = (config.exclude || '')
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);

  block.textContent = '';

  const indexUrl = `${window.hlx.codeBasePath}/query-index.json`;
  let items = await fetchIndex(indexUrl);

  items = items.filter((item) => item.path
    && item.path.startsWith(pathFilter)
    && item.path !== pathFilter
    && item.path !== pathFilter.replace(/\/$/, '')
    && !exclude.includes(item.path));

  // newest first when a date field is available, otherwise keep index order
  items.sort((a, b) => (parseInt(b.date || b.publishDate || 0, 10))
    - (parseInt(a.date || a.publishDate || 0, 10)));

  if (limit > 0) items = items.slice(0, limit);

  const ul = document.createElement('ul');
  ul.className = 'article-list-items';
  items.forEach((item) => ul.append(buildCard(item)));
  block.append(ul);
}
