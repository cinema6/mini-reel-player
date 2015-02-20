import CardView from './CardView.js';

export default class VideoCardView extends CardView {
    constructor() {
        super(...arguments);

        this.template = require('./VideoCardView.html');
    }
}
