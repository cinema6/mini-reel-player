import InstagramCardController from '../InstagramCardController.js';
import MobileInstagramImageCardView from '../../views/mobile/MobileInstagramImageCardView.js';

export default class MobileInstagramImageCardController extends InstagramCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new MobileInstagramImageCardView());
    }

    renderInstagram() {
    }
}
