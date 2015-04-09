import TemplateView from '../../lib/core/TemplateView.js';
import ThumbnailNavigatorButtonView from './ThumbnailNavigatorButtonView.js';

export default class ThumbnailNavigatorItemView extends TemplateView {
    constructor() {
        super(...arguments);

        this.tag = 'li';
        this.classes.push('pages__item');
        this.template = require('./ThumbnailNavigatorItemView.html');
        this.instantiates = {ThumbnailNavigatorButtonView};
    }

    update(data) {
        if (!this.button) { this.create(); }
        return this.button.update(data);
    }
}
