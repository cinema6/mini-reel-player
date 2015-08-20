import InstagramVideoCardController from '../InstagramVideoCardController.js';
import MobileInstagramVideoCardView from '../../views/mobile/MobileInstagramVideoCardView.js';

export default class MobileInstagramVideoCardController extends InstagramVideoCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new MobileInstagramVideoCardView());
    }
}
