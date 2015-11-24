import RecapCardView from '../RecapCardView.js';
import FullNPRecapCardListView from '../full-np/FullNPRecapCardListView.js';

export default class LightboxRecapCardView extends RecapCardView {
    constructor() {
        super(...arguments);

        this.template = require('./LightboxRecapCardView.html');
        this.instantiates = {FullNPRecapCardListView};
    }
}
