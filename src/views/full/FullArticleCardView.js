import CardView from '../CardView.js';
import SkipTimerView from '../SkipTimerView.js';

export default class FullArticleCardView extends CardView {
    constructor() {
        super(...arguments);

        this.template = require('./FullArticleCardView.html');
        this.instantiates = { SkipTimerView };
    }

    didCreateElement() {
        super(...arguments);

        this.skipTimer.hide();
    }
}
