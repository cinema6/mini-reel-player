import InstagramCardView from '../InstagramCardView.js';

export default class MobileInstagramImageCardView extends InstagramCardView {
    constructor() {
        super(...arguments);

        this.template = require('./MobileInstagramImageCardView.html');
    }
}
