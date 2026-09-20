/*
 * Cards Related Block
 * A curated "related articles" / "up next" list. Each authored row is one
 * related item: an article title (usually a link) and a publish date. No images.
 *
 * This is a style variation of the `cards` block: it reuses the exact same
 * decoration engine (rows → ul/li, cells classified as `cards-card-body` when
 * they hold no image) and differs only in CSS (see cards-related.css). Keeping a
 * single engine avoids duplicating the list-building logic across two blocks.
 */
import decorate from '../cards/cards.js';

export default decorate;
