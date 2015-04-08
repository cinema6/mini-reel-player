import RecapCardView from '../RecapCardView.js';
import FullRecapCardListView from '../full/FullRecapCardListView.js';

export default class LightboxPlaylistRecapCardView extends RecapCardView {
    constructor() {
        super(...arguments);

        this.template = require('./LightboxPlaylistRecapCardView.html');
        this.instantiates = {FullRecapCardListView};
    }
}
