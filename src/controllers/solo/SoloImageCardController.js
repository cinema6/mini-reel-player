import ImageCardController from '../ImageCardController.js';
import SoloVideoCardView from '../../views/solo/SoloVideoCardView.js';

export default class SoloImageCardController extends ImageCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new SoloVideoCardView());
    }

    advance() {
        this.model.complete();
    }
}
