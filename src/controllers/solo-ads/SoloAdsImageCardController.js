import ImageCardController from '../ImageCardController.js';
import SoloAdsVideoCardView from '../../views/solo-ads/SoloAdsVideoCardView.js';

export default class SoloAdsImageCardController extends ImageCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new SoloAdsVideoCardView());
    }

    advance() {
        this.model.complete();
    }
}
