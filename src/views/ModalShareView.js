import TemplateView from '../../lib/core/TemplateView.js';
import Hideable from '../mixins/Hideable.js';
import ButtonView from './ButtonView.js';
import ShareListView from './ShareListView.js';

export default class ModalShareView extends TemplateView {
    constructor() {
        super(...arguments);
        this.tag = 'div';
        this.template = require('./ModalShareView.html');
        this.instantiates = { ButtonView, ShareListView };
    }

    update(data) {
        super(data);
        if(data.shareLinks && data.shareLinks.length > 0) {
            this.shareLinks.update(data.shareLinks);
        }
    }
}
ModalShareView.mixin(Hideable);
