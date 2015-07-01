import ImageCardController from '../ImageCardController.js';
import MobileImageCardView from '../../views/mobile/MobileImageCardView.js';

export default class MobileImageCardController extends ImageCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new MobileImageCardView());
    }

    advance() {
        this.model.complete();
    }
}
