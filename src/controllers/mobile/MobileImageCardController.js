import ImageCardController from '../ImageCardController.js';
import MobileVideoCardView from '../../views/mobile/MobileVideoCardView.js';

export default class MobileImageCardController extends ImageCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new MobileVideoCardView());
    }

    advance() {
        this.model.complete();
    }
}
