import VideoCardController from '../VideoCardController.js';
import LightboxVideoCardView from '../../views/lightbox/LightboxVideoCardView.js';
import DisplayAdVideoCardController from '../../mixins/DisplayAdVideoCardController.js';

export default class LightboxVideoCardController extends VideoCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new LightboxVideoCardView());

        this.initDisplayAd();
    }
}
LightboxVideoCardController.mixin(DisplayAdVideoCardController); // jshint ignore:line
