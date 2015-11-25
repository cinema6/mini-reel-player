import CardView from '../CardView.js';
import PlayerOutletView from '../PlayerOutletView.js';
import SkipTimerView from '../SkipTimerView.js';
import View from '../../../lib/core/View.js';

export default class FullPrerollCardView extends CardView {
    constructor() {
        super(...arguments);

        this.template = require('./FullPrerollCardView.html');
        this.instantiates = {View, PlayerOutletView, SkipTimerView};
    }
}
