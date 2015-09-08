import TemplateView from '../../../lib/core/TemplateView.js';

export default class VzaarEmbedView extends TemplateView {
    constructor() {
        super(...arguments);

        this.tag = 'div';
        this.template = require('./VzaarEmbedView.html');
    }
}
