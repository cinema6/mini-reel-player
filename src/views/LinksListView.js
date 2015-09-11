import ListView from './ListView.js';
import LinkItemView from './LinkItemView.js';

export default class LinksListView extends ListView {
    constructor() {
        super(...arguments);

        this.itemIdentifier = 'type';
        this.itemViewClass = LinkItemView;
    }
}
