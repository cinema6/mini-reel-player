import InstagramCardController from '../InstagramCardController.js';
import MobileInstagramVideoCardView from '../../views/mobile/MobileInstagramVideoCardView.js';

export default class MobileInstagramVideoCardController extends InstagramCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new MobileInstagramVideoCardView());
    }

    renderInstagram() {
        this.isRendered = true;
    }
}
