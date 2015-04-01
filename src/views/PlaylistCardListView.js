import ListView from './ListView.js';
import PlaylistCardView from './PlaylistCardView.js';

export default class PlaylistCardListView extends ListView {
    constructor() {
        super(...arguments);

        this.classes.push('playlist');

        this.itemViewClass = PlaylistCardView;
    }
}
