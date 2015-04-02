import TemplateView from '../../lib/core/TemplateView.js';

const ACTIVE_CLASS = 'playlist__item--current';

export default class PlaylistCardView extends TemplateView {
    constructor() {
        super(...arguments);

        this.tag = 'li';
        this.classes.push('playlist__item', 'clearfix');
        this.template = require('./PlaylistCardView.html');
    }

    update(data) {
        if (data.active) { this.addClass(ACTIVE_CLASS); } else { this.removeClass(ACTIVE_CLASS); }
        return super(data);
    }

    click() {
        this.emit('select');
    }
}
