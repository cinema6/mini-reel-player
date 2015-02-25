import CardView from './CardView.js';
import View from '../../lib/core/View.js';

export default class VideoCardView extends CardView {
    constructor() {
        super(...arguments);

        this.instantiates.push(View);
        this.template = require('./VideoCardView.html');
    }
}
