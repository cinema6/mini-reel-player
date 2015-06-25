import TemplateView from '../../../lib/core/TemplateView.js';

export default class FlickrEmbedView extends TemplateView {
    constructor() {
        super(...arguments);
        this.template = require('./FlickrEmbedView.html');
        this.tag = 'div';
    }
}
