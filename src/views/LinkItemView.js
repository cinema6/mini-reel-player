import TemplateView from '../../lib/core/TemplateView.js';
import ContextualView from '../mixins/ContextualView.js';

export default class LinkItemView extends TemplateView {
    click({ screenX, screenY, target }) {
        const getAnchor = (element => {
            if (element.tagName === 'A') { return element; }
            if (element === this.element) { return null; }

            return getAnchor(element.parentNode);
        });
        const anchor = getAnchor(target);

        if (anchor) {
            this.sendAction(this, {
                coordinates: {
                    x: screenX,
                    y: screenY
                },
                href: anchor.href
            });
        }
    }
}
LinkItemView.mixin(ContextualView);
