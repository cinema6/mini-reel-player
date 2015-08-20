import InstagramCardView from '../InstagramCardVIew.js';

export default class FullInstagramImageCardView extends InstagramCardView {
    constructor() {
        super(...arguments);

        this.template = require('./FullInstagramImageCardView.html');
    }
}
