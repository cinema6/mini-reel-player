import TemplateView from '../../lib/core/TemplateView.js';
import Hideable from '../mixins/Hideable.js';
import ButtonView from './ButtonView.js';
import ModalShareListView from './ModalShareListView.js';

class ModalShareView extends TemplateView {
    constructor() {
        super(...arguments);
        this.tag = 'div';
        this.template = require('./ModalShareView.html');
        this.instantiates = { ButtonView, ModalShareListView };
    }

    update(data) {
        super(data);
        if(data.shareLinks && data.shareLinks.length > 0) {
            this.shareLinks.update(data.shareLinks);
        }
    }
}
ModalShareView.mixin(Hideable);
export default ModalShareView;
