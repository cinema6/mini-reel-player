import ListView from './ListView.js';

export default class LinksListView extends ListView {
    constructor() {
        super(...arguments);

        this.itemIdentifier = 'type';
    }
}
