import TwitterCardController from '../TwitterCardController.js';
import MobileTwitterCardView from '../../views/mobile/MobileTwitterCardView.js';

export default class MobileTwitterCardController extends TwitterCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new MobileTwitterCardView());
    }
}
