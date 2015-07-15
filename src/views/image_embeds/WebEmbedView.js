import TemplateView from '../../../lib/core/TemplateView.js';

export default class WebEmbedView extends TemplateView {
    constructor() {
        super(...arguments);
        this.template = require('./WebEmbedView.html');
        this.classes.push('imgCard');
        this.tag = 'div';
    }
}
