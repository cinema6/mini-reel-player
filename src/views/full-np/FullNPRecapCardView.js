import RecapCardView from '../RecapCardView.js';
import FullNPRecapCardListView from './FullNPRecapCardListView.js';


export default class FullNPRecapCardView extends RecapCardView {
    constructor() {
        super(...arguments);

        this.instantiates = {FullNPRecapCardListView};
        this.template = require('./FullNPRecapCardView.html');
    }
}
