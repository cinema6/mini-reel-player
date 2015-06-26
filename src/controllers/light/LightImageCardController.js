import ImageCardController from '../ImageCardController.js';
import LightVideoCardView from '../../views/light/LightVideoCardView.js';

export default class LightImageCardController extends ImageCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new LightVideoCardView());
    }

    advance() {
        this.model.complete();
    }
}
