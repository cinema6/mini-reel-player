import CardController from '../CardController.js';
import DesktopCardInstagramImageCardView from
    '../../views/desktop-card/DesktopCardInstagramImageCardView.js';

export default class DesktopCardInstagramImageCardController extends CardController {
    constructor(card, rootView) {
        super(card, rootView);

        this.view = this.addView(new DesktopCardInstagramImageCardView());
    }
}
