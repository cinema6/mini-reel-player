import TwitterCardController from '../TwitterCardController.js';
import MobileTwitterVideoCardView from '../../views/mobile/MobileTwitterVideoCardView.js';

export default class MobileTwitterVideoCardController extends TwitterCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new MobileTwitterVideoCardView());
    }
}
