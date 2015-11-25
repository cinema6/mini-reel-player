import RecapCardItemView from '../RecapCardItemView.js';
import LinksListView from '../LinksListView.js';

export default class FullNPRecapCardItemView extends RecapCardItemView {
    constructor() {
        super(...arguments);

        this.classes.push('recap__item', 'clearfix');
        this.template = require('./FullNPRecapCardItemView.html');
        this.instantiates = {LinksListView};
    }

    update(data) {
        super(data);
        this.addClass(`recap__item--${data.type}`);
    }
}
