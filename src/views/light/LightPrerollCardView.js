import CardView from '../CardView.js';
import PlayerOutletView from '../PlayerOutletView.js';

export default class LightPrerollCardView extends CardView {
    constructor() {
        super(...arguments);

        this.template = require('./LightPrerollCardView.html');
        this.instantiates = {PlayerOutletView};
    }
}
