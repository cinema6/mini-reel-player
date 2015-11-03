import CardView from '../CardView.js';

export default class DesktopCardInstagramImageCardView extends CardView {
    constructor(element) {
        super(element);

        this.template = require('./DesktopCardInstagramImageCardView.html');
    }
}
