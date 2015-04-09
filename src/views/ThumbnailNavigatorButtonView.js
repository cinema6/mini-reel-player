import ButtonView from './ButtonView.js';
import View from '../../lib/core/View.js';

const ACTIVE_CLASS = 'page__btn--active';
const AD_CLASS = 'page__btn--ad';

export default class ThumbnailNavigatorButtonView extends ButtonView {
    constructor() {
        super(...arguments);

        this.classes.push('page__btn');
        this.template = require('./ThumbnailNavigatorButtonView.html');

        this.itemId = null;
    }

    update(data) {
        const { id, title, thumb, active, ad } = data;
        if (!this.thumb) { this.create(); }

        this.itemId = id;

        this.setAttribute('title', title);
        this.thumb.setAttribute('style', `background-image: url("${thumb}");`);

        if (active) {
            this.addClass(ACTIVE_CLASS);
        } else {
            this.removeClass(ACTIVE_CLASS);
        }

        if (ad) {
            this.addClass(AD_CLASS);
        } else {
            this.removeClass(AD_CLASS);
        }
    }

    didCreateElement() {
        super();

        this.thumb = new View(this.element.firstChild);
    }
}
