import InstagramCardView from '../InstagramCardView.js';

export default class FullInstagramImageCardView extends InstagramCardView {
    constructor() {
        super(...arguments);

        this.template = require('./FullInstagramImageCardView.html');
    }
}
