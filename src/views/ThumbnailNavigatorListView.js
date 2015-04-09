import ListView from './ListView.js';
import ThumbnailNavigatorItemView from './ThumbnailNavigatorItemView.js';

export default class ThumbnailNavigatorListView extends ListView {
    constructor() {
        super(...arguments);

        this.itemViewClass = ThumbnailNavigatorItemView;
    }
}
