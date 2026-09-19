/* eslint-disable */
/*
 * WKND per-page metadata (category, image, date) keyed by document path.
 * Used by the detail-page import scripts to enrich the page metadata block so
 * the backend query-index (/query-index.json) carries the fields the
 * article-list / adventure-list blocks (and the category filter) need.
 */

export const ADVENTURE_META = {
  '/us/en/adventures/bali-surf-camp': { category: 'surfing', date: '01-01-2019', image: 'https://wknd.site/us/en/adventures/bali-surf-camp/_jcr_content/root/container/carousel/image.coreimg.60.800.jpeg/1660323792187/adobestock-175749320.jpeg' },
  '/us/en/adventures/beervana-portland': { category: 'travel', date: '01-02-2019', image: 'https://wknd.site/us/en/adventures/beervana-portland/_jcr_content/root/container/carousel/image.coreimg.60.800.jpeg/1660323790531/adobestock-200192344.jpeg' },
  '/us/en/adventures/climbing-new-zealand': { category: 'climbing', date: '01-03-2019', image: 'https://wknd.site/us/en/adventures/climbing-new-zealand/_jcr_content/root/container/carousel/item_1571266094599.coreimg.60.800.jpeg/1660323785724/sport-climbing.jpeg' },
  '/us/en/adventures/colorado-rock-climbing': { category: 'climbing', date: '01-04-2019', image: 'https://wknd.site/us/en/adventures/colorado-rock-climbing/_jcr_content/root/container/carousel/image.coreimg.60.800.jpeg/1660323789363/adobestock-201222633.jpeg' },
  '/us/en/adventures/cycling-southern-utah': { category: 'cycling', date: '01-05-2019', image: 'https://wknd.site/us/en/adventures/cycling-southern-utah/_jcr_content/root/container/carousel/image.coreimg.60.800.jpeg/1660323777766/adobestock-185324648.jpeg' },
  '/us/en/adventures/cycling-tuscany': { category: 'cycling, travel', date: '01-06-2019', image: 'https://wknd.site/us/en/adventures/cycling-tuscany/_jcr_content/root/container/carousel/image.coreimg.60.800.jpeg/1660323789294/adobestock-59459597.jpeg' },
  '/us/en/adventures/downhill-skiing-wyoming': { category: 'skiing', date: '01-07-2019', image: 'https://wknd.site/us/en/adventures/downhill-skiing-wyoming/_jcr_content/root/container/carousel/image.coreimg.jpeg/1660323784078/adobestock-185234795.jpeg' },
  '/us/en/adventures/gastronomic-marais-tour': { category: 'travel', date: '01-08-2019', image: 'https://wknd.site/us/en/adventures/gastronomic-marais-tour/_jcr_content/root/container/carousel/image.coreimg.jpeg/1660323786247/adobestock-294203896.jpeg' },
  '/us/en/adventures/napa-wine-tasting': { category: 'travel', date: '01-09-2019', image: 'https://wknd.site/us/en/adventures/napa-wine-tasting/_jcr_content/root/container/carousel/image.coreimg.jpeg/1660323791204/adobestock-280313729.jpeg' },
  '/us/en/adventures/riverside-camping-australia': { category: 'travel', date: '01-10-2019', image: 'https://wknd.site/us/en/adventures/riverside-camping-australia/_jcr_content/root/container/carousel/image.coreimg.jpeg/1660323783461/adobe-waadobe-wa-mg-2466.jpeg' },
  '/us/en/adventures/ski-touring-mont-blanc': { category: 'skiing', date: '01-11-2019', image: 'https://wknd.site/us/en/adventures/ski-touring-mont-blanc/_jcr_content/root/container/carousel/item_1571168419252.coreimg.jpeg/1660323789507/adobestock-238230356.jpeg' },
  '/us/en/adventures/surf-camp-costa-rica': { category: 'surfing', date: '01-12-2019', image: 'https://wknd.site/us/en/adventures/surf-camp-costa-rica/_jcr_content/root/container/carousel/image.coreimg.jpeg/1660323786122/adobestock-278302117.jpeg' },
  '/us/en/adventures/tahoe-skiing': { category: 'skiing', date: '01-13-2019', image: 'https://wknd.site/us/en/adventures/tahoe-skiing/_jcr_content/root/container/carousel/image.coreimg.jpeg/1660323785476/adobestock-184591344.jpeg' },
  '/us/en/adventures/west-coast-cycling': { category: 'cycling', date: '01-14-2019', image: 'https://wknd.site/us/en/adventures/west-coast-cycling/_jcr_content/root/container/carousel/image.coreimg.jpeg/1660323786740/adobestock-151584995.jpeg' },
  '/us/en/adventures/whistler-mountain-biking': { category: 'cycling', date: '01-15-2019', image: 'https://wknd.site/us/en/adventures/whistler-mountain-biking/_jcr_content/root/container/carousel/image.coreimg.jpeg/1660323789625/adobestock-122615840.jpeg' },
  '/us/en/adventures/yosemite-backpacking': { category: 'travel', date: '01-16-2019', image: 'https://wknd.site/us/en/adventures/yosemite-backpacking/_jcr_content/root/container/carousel/image.coreimg.jpeg/1660323790695/adobestock-231698835.jpeg' },
};

/*
 * Adventure `keywords` metadata, keyed by adventure slug (locale-agnostic).
 * Sourced verbatim from each source page's <meta name="keywords"> and augmented
 * with the tab category the source groups the adventure under. The source
 * adventures-landing tabs (All, Climbing, Cycling, Skiing, Surfing, Travel) are
 * a manual curation: the four sport tabs coincide with literal source keywords,
 * but "Travel" is a curated group with no shared keyword — so it is appended to
 * the six adventures the source places under the Travel tab. The adventure-list
 * block filters by matching a tab label against this comma-separated list.
 */
export const ADVENTURE_KEYWORDS = {
  'bali-surf-camp': 'Surfing',
  'beervana-portland': 'Social,Engage,Summer,United States,Convert,Spring,Fall,Travel',
  'climbing-new-zealand': 'Convert,Climbing,Summer,Engage',
  'colorado-rock-climbing': 'Climbing',
  'cycling-southern-utah': '',
  'cycling-tuscany': 'Convert,Social,Italy,Cycling,Engage,Summer,Travel',
  'downhill-skiing-wyoming': 'United States,Convert,Skiing,Winter,Engage',
  'gastronomic-marais-tour': 'Social,Travel',
  'napa-wine-tasting': 'United States,Social,Travel',
  'riverside-camping-australia': 'Hiking,Australia,Engage,Summer,Convert,Hunting & Fishing,Camping,Travel',
  'ski-touring-mont-blanc': 'Convert,Skiing,Switzerland,Winter,Engage',
  'surf-camp-costa-rica': 'Convert,Surfing,Engage,Summer',
  'tahoe-skiing': 'Skiing',
  'west-coast-cycling': 'Cycling,Fall',
  'whistler-mountain-biking': 'Canada,Convert,Cycling,Engage,Summer',
  'yosemite-backpacking': 'Hiking,Camping,Travel',
};

/** Look up keywords for a document path (any locale) by its adventure slug. */
export function keywordsForPath(path) {
  const slug = (path || '').split('/').filter(Boolean).pop() || '';
  return ADVENTURE_KEYWORDS[slug] || '';
}

export const ARTICLE_META = {
  '/us/en/magazine/guide-la-skateparks': { category: 'surfing', date: '05-01-2019', image: 'https://wknd.site/us/en/magazine/guide-la-skateparks/_jcr_content/root/container/container/contentfragment/par2/image_copy.coreimg.60.800.png/1660323783259/article-01-picture-01.png' },
  '/us/en/magazine/ski-touring': { category: 'skiing', date: '04-01-2019', image: 'https://wknd.site/us/en/magazine/ski-touring/_jcr_content/root/container/container/contentfragment/par1/image.coreimg.60.800.jpeg/1660323789866/skitouring5sjoeberg.jpeg' },
  '/us/en/magazine/arctic-surfing': { category: 'surfing', date: '03-01-2019', image: 'https://wknd.site/us/en/magazine/arctic-surfing/_jcr_content/root/container/container/contentfragment/par1/image.coreimg.60.800.jpeg/1660323789770/surfer-wave-02.jpeg' },
  '/us/en/magazine/san-diego-surf': { category: 'surfing', date: '02-01-2019', image: 'https://wknd.site/us/en/magazine/san-diego-surf/_jcr_content/root/container/container/contentfragment/par1/image.coreimg.60.800.jpeg/1660323790169/adobestock-164735399.jpeg' },
  '/us/en/magazine/western-australia': { category: 'travel', date: '01-01-2019', image: 'https://wknd.site/us/en/magazine/western-australia/_jcr_content/root/container/container/contentfragment/par2/image.coreimg.60.800.jpeg/1660323770369/adobe-waadobe-wa-b6a7083.jpeg' },
};

/**
 * Appends Category / Publication Date / Image rows to the page's metadata block
 * (the one created by WebImporter.rules.createMetadata). Safe to call after that
 * rule has run. `path` is the sanitized document path (no extension).
 */
export function enrichMetadata(main, document, path, map) {
  const meta = map[path];
  if (!meta) return;

  // WebImporter.rules.createMetadata appends a <table> whose first row is a
  // <th>Metadata</th> header and whose remaining rows are <td>key</td><td>value</td>.
  // Find that table (first cell text === "Metadata") and append rows to it.
  const table = [...main.querySelectorAll('table')].find((t) => {
    const firstCell = t.querySelector('tr th, tr td');
    return firstCell && /^metadata$/i.test(firstCell.textContent.trim());
  });
  if (!table) return;

  const hasRow = (key) => [...table.querySelectorAll('tr')].some((tr) => {
    const c = tr.querySelector('td, th');
    return c && c.textContent.trim().toLowerCase() === key.toLowerCase();
  });

  const addRow = (key, value) => {
    if (!value || hasRow(key)) return;
    const tr = document.createElement('tr');
    const kCell = document.createElement('td');
    kCell.textContent = key;
    const vCell = document.createElement('td');
    if (key === 'Image') {
      const img = document.createElement('img');
      img.src = value;
      vCell.append(img);
    } else {
      vCell.textContent = value;
    }
    tr.append(kCell, vCell);
    table.append(tr);
  };

  addRow('Category', meta.category);
  addRow('Publication Date', meta.date);
  addRow('Image', meta.image);
}
