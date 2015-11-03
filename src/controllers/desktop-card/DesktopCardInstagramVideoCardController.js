import CardController from '../CardController.js';
import DesktopCardInstagramVideoCardView from
    '../../views/desktop-card/DesktopCardInstagramVideoCardView.js';

export default class DesktopCardInstagramVideoCardController extends CardController {
    constructor(card, rootView) {
        super(card, rootView);

        this.view = this.addView(new DesktopCardInstagramVideoCardView());
    }
}
