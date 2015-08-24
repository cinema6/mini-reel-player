import TwitterCardController from '../TwitterCardController.js';
import MobileTwitterTextCardView from '../../views/mobile/MobileTwitterTextCardView.js';

export default class MobileTwitterTextCardController extends TwitterCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new MobileTwitterTextCardView());
    }
}
