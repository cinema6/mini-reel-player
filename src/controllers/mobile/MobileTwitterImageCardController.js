import TwitterCardController from '../TwitterCardController.js';
import MobileTwitterImageCardView from '../../views/mobile/MobileTwitterImageCardView.js';

export default class MobileTwitterImageCardController extends TwitterCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new MobileTwitterImageCardView());
    }
}
