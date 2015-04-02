import RecapCardItemView from '../RecapCardItemView.js';
import LinksListView from '../LinksListView.js';

export default class FullRecapCardItemView extends RecapCardItemView {
    constructor() {
        super(...arguments);

        this.classes.push('recap__item', 'clearfix');
        this.template = require('./FullRecapCardItemView.html');
        this.instantiates = {LinksListView};
    }

    update(data) {
        super(data);
        this.addClass(`recap__item--${data.type}`);
        this.links.update(data.links);
    }
}
