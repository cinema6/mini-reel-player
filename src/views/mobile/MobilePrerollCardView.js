import CardView from '../CardView.js';
import PlayerOutletView from '../PlayerOutletView.js';

export default class MobilePrerollCardView extends CardView {
    constructor() {
        super(...arguments);

        this.template = require('./MobilePrerollCardView.html');
        this.instantiates = {PlayerOutletView};
    }
}
