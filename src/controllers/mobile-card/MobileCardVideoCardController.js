import VideoCardController from '../VideoCardController.js';
import ModalShareVideoCardController from '../../mixins/ModalShareVideoCardController.js';
import MobileCardVideoCardView from '../../views/mobile-card/MobileCardVideoCardView.js';

export default class MobileCardVideoCardController extends VideoCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new MobileCardVideoCardView());

        this.initShare();
    }
}
MobileCardVideoCardController.mixin(
    ModalShareVideoCardController
);
