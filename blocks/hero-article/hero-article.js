/*
 * Hero Article Block
 * A full-width, edge-to-edge lead image at the top of a magazine article.
 * Image-only — no overlaid heading, no scrim (unlike the standard hero).
 *
 * This is a style variation of the `hero` block: it reuses the same decoration
 * engine (tag the image cell, promote any heading/text cell to content) and
 * differs only in CSS (see hero-article.css). Article heroes have no text cell,
 * so the shared engine simply tags the image and adds no overlay.
 */
import decorate from '../hero/hero.js';

export default decorate;
