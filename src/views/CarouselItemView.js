import TemplateView from '../../lib/core/TemplateView.js';

export default class CarouselItemView extends TemplateView {
    click(event) {
        const getAnchor = (element => {
            if (element === this.element) { return null; }
            if (element.tagName === 'A') { return element; }

            return getAnchor(element.parentNode);
        });
        const anchor = getAnchor(event.target);

        event.preventDefault();

        if (anchor) {
            this.emit('clickthrough', anchor.href);
        }
    }
}
