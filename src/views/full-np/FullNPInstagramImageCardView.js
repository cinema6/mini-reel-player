import InstagramCardView from '../InstagramCardView.js';

export default class FullNPInstagramImageCardView extends InstagramCardView {
    constructor() {
        super(...arguments);

        this.template = require('./FullNPInstagramImageCardView.html');
    }
}
