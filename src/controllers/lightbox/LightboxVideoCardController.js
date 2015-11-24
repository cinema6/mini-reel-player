import VideoCardController from '../VideoCardController.js';
import LightboxVideoCardView from '../../views/lightbox/LightboxVideoCardView.js';
import ModalShareVideoCardController from '../../mixins/ModalShareVideoCardController.js';

export default class LightboxVideoCardController extends VideoCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new LightboxVideoCardView());

        this.initShare();
    }
}
LightboxVideoCardController.mixin( // jshint ignore:line
    ModalShareVideoCardController
);
