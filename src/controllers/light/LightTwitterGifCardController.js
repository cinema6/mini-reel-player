import TwitterCardController from '../TwitterCardController.js';
import LightTwitterGifCardView from '../../views/light/LightTwitterGifCardView.js';

export default class LightTwitterGifCardController extends TwitterCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new LightTwitterGifCardView());
    }
}
