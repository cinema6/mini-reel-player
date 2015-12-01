import VideoCardController from '../VideoCardController.js';
import MobileVideoCardView from '../../views/mobile/MobileVideoCardView.js';
import ModalShareVideoCardController from '../../mixins/ModalShareVideoCardController.js';

export default class MobileVideoCardController extends VideoCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new MobileVideoCardView());

        this.initShare();
    }
}
MobileVideoCardController.mixin(// jshint ignore:line
    ModalShareVideoCardController
);
