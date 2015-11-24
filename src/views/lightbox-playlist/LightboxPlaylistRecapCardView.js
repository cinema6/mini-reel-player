import RecapCardView from '../RecapCardView.js';
import FullNPRecapCardListView from '../full-np/FullNPRecapCardListView.js';

export default class LightboxPlaylistRecapCardView extends RecapCardView {
    constructor() {
        super(...arguments);

        this.template = require('./LightboxPlaylistRecapCardView.html');
        this.instantiates = {FullNPRecapCardListView};
    }
}
