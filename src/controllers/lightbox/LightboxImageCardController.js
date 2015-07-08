import ImageCardController from '../ImageCardController.js';
import LightboxVideoCardView from '../../views/lightbox/LightboxVideoCardView.js';

export default class LightboxImageCardController extends ImageCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new LightboxVideoCardView());
    }
}
