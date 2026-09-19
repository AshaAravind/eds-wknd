/*
 * Hero Article Block
 * A full-width, edge-to-edge lead image at the top of a magazine article.
 * Image-only — no overlaid heading, no scrim (unlike the standard hero).
 */

export default function decorate(block) {
  const picture = block.querySelector('picture');
  if (picture) {
    const pictureWrapper = picture.closest('div');
    if (pictureWrapper) pictureWrapper.classList.add('hero-article-image');
  }
}
