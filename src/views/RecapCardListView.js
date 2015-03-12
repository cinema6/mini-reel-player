import ListView from './ListView.js';
import RecapCardItemView from './RecapCardItemView.js';

export default class RecapCardListView extends ListView {
    constructor() {
        super(...arguments);

        this.itemViewClass = RecapCardItemView;
    }
}
