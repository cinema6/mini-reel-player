import CardView from '../CardView.js';

export default class DesktopCardInstagramVideoCardView extends CardView {
    constructor(element) {
        super(element);

        this.template = require('./DesktopCardInstagramVideoCardView.html');
    }
}
