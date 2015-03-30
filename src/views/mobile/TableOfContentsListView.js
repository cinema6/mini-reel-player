import ListView from '../ListView.js';
import TableOfContentsCardView from './TableOfContentsCardView.js';

export default class TableOfContentsListView extends ListView {
    constructor() {
        super(...arguments);

        this.itemViewClass = TableOfContentsCardView;
    }
}
