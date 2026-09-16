export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-media-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-media-img-col');
        }
      }
    });
  });

  // Blog-article header byline: the author separates each meta value into its
  // own <p> ("By", author, date, "•", read time, category). Group them to match
  // the source article header. Guarded on a standalone "By" paragraph so other
  // instances (e.g. about-us, whose byline is authored as combined paragraphs)
  // are left untouched.
  [...block.querySelectorAll(':scope > div > div')].forEach((col) => {
    if (col.classList.contains('columns-media-img-col')) return;
    const ps = [...col.querySelectorAll(':scope > p')];
    const byIdx = ps.findIndex((p) => p.textContent.trim().toLowerCase() === 'by');
    if (byIdx === -1 || !ps[byIdx + 1]) return;

    col.classList.add('columns-media-article-meta');

    // last paragraph is the category tag pill
    const tag = ps[ps.length - 1];
    const isTag = tag && tag !== ps[byIdx] && tag !== ps[byIdx + 1];
    if (isTag) tag.classList.add('columns-media-tag');

    const byline = document.createElement('div');
    byline.className = 'columns-media-byline';

    // author line: "By" (muted) + author name
    const author = document.createElement('div');
    author.className = 'columns-media-author';
    ps[byIdx].classList.add('columns-media-by');
    author.append(ps[byIdx], ps[byIdx + 1]);
    byline.append(author);

    // date line: remaining meta values (date, separator, read time)
    const dateEnd = isTag ? ps.length - 1 : ps.length;
    const dateParts = ps.slice(byIdx + 2, dateEnd);
    if (dateParts.length) {
      const dateline = document.createElement('div');
      dateline.className = 'columns-media-dateline';
      dateline.append(...dateParts);
      byline.append(dateline);
    }

    // place grouped byline where the "By" paragraph used to be
    const heading = col.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) heading.after(byline);
    else col.prepend(byline);
    if (isTag) byline.after(tag);
  });
}
