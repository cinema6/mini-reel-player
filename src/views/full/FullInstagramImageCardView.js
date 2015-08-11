import CardView from '../CardView.js';
import InstagramCaptionView from '../InstagramCaptionView.js';

export default class FullInstagramImageCardView extends CardView {
    constructor() {
        super(...arguments);

        this.instantiates = { InstagramCaptionView };
        this.template = require('./FullInstagramImageCardView.html');
    }
}
