import ListView from './ListView.js';
import ModalShareItemView from './ModalShareItemView.js';

export default class ModalShareListView extends ListView {
    constructor() {
        super(...arguments);

        this.itemIdentifier = 'type';
        this.itemViewClass = ModalShareItemView;
    }
}
