import ListView from '../ListView.js';
import MobileRecapCardItemView from './MobileRecapCardItemView.js';

export default class RecapCardListView extends ListView {
    constructor() {
        super(...arguments);

        this.itemViewClass = MobileRecapCardItemView;
    }
}
