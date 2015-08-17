import CardView from '../CardView.js';
import InstagramCaptionView from '../InstagramCaptionView.js';
import PlayerOutletView from '../PlayerOutletView.js';

export default class FullInstagramVideoCardView extends CardView {
    constructor() {
        super(...arguments);

        this.instantiates = { InstagramCaptionView, PlayerOutletView };
        this.template = require('./FullInstagramVideoCardView.html');
    }
}
