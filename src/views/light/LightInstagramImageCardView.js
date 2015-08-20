import InstagramCardView from '../InstagramCardView.js';

export default class LightInstagramImageCardView extends InstagramCardView {
    constructor() {
        super(...arguments);

        this.template = require('./LightInstagramImageCardView.html');
    }
}
