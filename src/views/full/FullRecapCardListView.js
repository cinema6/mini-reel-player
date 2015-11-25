import ListView from '../../views/ListView.js';
import FullRecapCardItemView from './FullRecapCardItemView.js';

export default class FullRecapCardListView extends ListView {
    constructor() {
        super(...arguments);

        this.itemViewClass = FullRecapCardItemView;
    }
}
