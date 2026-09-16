/*
 * Hero Block
 * A single full-width banner: background image with an overlaid heading
 * (and optional supporting text / CTA). Used for detail and landing page heroes.
 */

export default function decorate(block) {
  const picture = block.querySelector('picture');
  if (picture) {
    const pictureWrapper = picture.closest('div');
    if (pictureWrapper) pictureWrapper.classList.add('hero-image');
  }

  // the content wrapper is any block child that is not the image-only cell
  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => {
      if (!cell.classList.contains('hero-image') && cell.querySelector('h1, h2, h3, p')) {
        cell.classList.add('hero-content');
      }
    });
  });
}
