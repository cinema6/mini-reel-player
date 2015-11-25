import RecapCardView from '../RecapCardView.js';
import FullRecapCardListView from './FullRecapCardListView.js';


export default class FullRecapCardView extends RecapCardView {
    constructor() {
        super(...arguments);

        this.instantiates = {FullRecapCardListView};
        this.template = require('./FullRecapCardView.html');
    }
}
