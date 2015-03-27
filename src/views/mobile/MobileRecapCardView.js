import RecapCardView from '../RecapCardView.js';
import MobileRecapCardListView from './MobileRecapCardListView.js';

export default class MobileRecapCardView extends RecapCardView {
    constructor() {
        super(...arguments);

        this.template = require('./MobileRecapCardView.html');
        this.instantiates = {MobileRecapCardListView};
    }
}
