import InstagramCardView from '../InstagramCardView.js';
import PlayerOutletView from '../PlayerOutletView.js';

export default class MobileInstagramVideoCardView extends InstagramCardView {
    constructor() {
        super(...arguments);

        this.instantiates.PlayerOutletView = PlayerOutletView;
        this.template = require('./MobileInstagramVideoCardView.html');
    }
}
