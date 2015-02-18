import TemplateView from '../../lib/core/TemplateView.js';

export default class TableOfContentsCardView extends TemplateView {
    constructor() {
        super(...arguments);

        this.tag = 'li';
        this.classes.push('toc__item', 'c6-show', 'clearfix');
        this.template = require('./TableOfContentsCardView.html');
    }

    click() {
        this.emit('select');
    }
}
