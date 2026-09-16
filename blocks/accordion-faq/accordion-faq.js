/*
 * Accordion FAQ Block
 * Expandable question/answer list. Each row becomes a <details> element with a
 * <summary> question (text + plus icon) and a body containing the answer.
 * https://www.hlx.live/developer/block-collection/accordion
 */

export default function decorate(block) {
  [...block.children].forEach((row) => {
    // decorate accordion item label (question)
    const label = row.children[0];
    const summary = document.createElement('summary');
    summary.className = 'accordion-faq-item-label';

    const text = document.createElement('span');
    text.className = 'accordion-faq-item-text';
    text.append(...label.childNodes);

    const icon = document.createElement('span');
    icon.className = 'accordion-faq-item-icon';
    icon.setAttribute('aria-hidden', 'true');

    summary.append(text, icon);

    // decorate accordion item body (answer)
    const body = row.children[1];
    body.className = 'accordion-faq-item-body';

    // decorate accordion item
    const details = document.createElement('details');
    details.className = 'accordion-faq-item';
    details.append(summary, body);
    row.replaceWith(details);
  });
}
