import VideoCardController from '../VideoCardController.js';
import DisplayAdVideoCardController from '../../mixins/DisplayAdVideoCardController.js';
import SoloAdsVideoCardView from '../../views/solo-ads/SoloAdsVideoCardView.js';

export default class SoloAdsVideoCardController extends VideoCardController {
    constructor() {
        super(...arguments);

        this.view = new SoloAdsVideoCardView();

        this.initDisplayAd();
    }
}
SoloAdsVideoCardController.mixin(DisplayAdVideoCardController); // jshint ignore:line
