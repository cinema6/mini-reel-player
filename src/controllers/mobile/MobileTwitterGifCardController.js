import TwitterCardController from '../TwitterCardController.js';
import MobileTwitterGifCardView from '../../views/mobile/MobileTwitterGifCardView.js';

export default class MobileTwitterGifCardController extends TwitterCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new MobileTwitterGifCardView());
    }
}
