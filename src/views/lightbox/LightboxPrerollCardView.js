import CardView from '../CardView.js';
import PlayerOutletView from '../PlayerOutletView.js';
import View from '../../../lib/core/View.js';

export default class LightboxPrerollCardView extends CardView {
    constructor() {
        super(...arguments);

        this.template = require('./LightboxPrerollCardView.html');
        this.instantiates = {PlayerOutletView, View};
    }
}
