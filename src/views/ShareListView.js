import ListView from './ListView.js';
import ShareItemView from './ShareItemView.js';

export default class ShareListView extends ListView {
    constructor() {
        super(...arguments);

        this.itemIdentifier = 'type';
        this.itemViewClass = ShareItemView;
    }
}
