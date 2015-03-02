import CardView from './CardView.js';

export default class TextCardView extends CardView {
    constructor() {
        super(...arguments);

        this.template = require('./TextCardView.html');
    }
}
