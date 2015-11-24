import InstagramCardView from '../InstagramCardView.js';
import PlayerOutletView from '../PlayerOutletView.js';

export default class FullNPInstagramVideoCardView extends InstagramCardView {
    constructor() {
        super(...arguments);

        this.instantiates.PlayerOutletView = PlayerOutletView;
        this.template = require('./FullNPInstagramVideoCardView.html');
    }
}
