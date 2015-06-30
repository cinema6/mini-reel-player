import TemplateView from '../../../lib/core/TemplateView.js';

export default class GettyEmbedView extends TemplateView {
    constructor() {
        super(...arguments);
        this.template = require('./GettyEmbedView.html');
        this.classes.push('imgCard', 'imgCard--getty');
        this.tag = 'div';
    }
}
