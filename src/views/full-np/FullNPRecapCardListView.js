import ListView from '../../views/ListView.js';
import FullNPRecapCardItemView from './FullNPRecapCardItemView.js';

export default class FullNPRecapCardListView extends ListView {
    constructor() {
        super(...arguments);

        this.itemViewClass = FullNPRecapCardItemView;
    }
}
