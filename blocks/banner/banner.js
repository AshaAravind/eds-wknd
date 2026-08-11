import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const [imageRow, contentRow] = block.children;

  if (imageRow) {
    imageRow.className = 'banner-image';
    const img = imageRow.querySelector('img');
    if (img) {
      img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, true, [{ width: '1600' }]));
    }
  }

  if (contentRow) {
    contentRow.className = 'banner-content';
  }
}
