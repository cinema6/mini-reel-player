import TemplateView from '../../../lib/core/TemplateView.js';
import LinksListView from '../LinksListView.js';
import ButtonView from '../ButtonView.js';

const SHOW_CLASS = 'infoPanel__group--show';

export default class InfoPanelView extends TemplateView {
    constructor() {
        super(...arguments);

        this.tag = 'div';
        this.classes.push('infoPanel__group');
        this.template = require('./InfoPanelView.html');
        this.instantiates = {ButtonView, LinksListView};
    }

    show(yes) {
        if (yes) { this.addClass(SHOW_CLASS); } else { this.removeClass(SHOW_CLASS); }
    }
}
