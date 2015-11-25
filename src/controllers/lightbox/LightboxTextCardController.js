import TextCardController from '../TextCardController.js';
import LightboxTextCardView from '../../views/lightbox/LightboxTextCardView.js';

export default class LightboxTextCardController extends TextCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new LightboxTextCardView());
    }

    advance() {
        this.model.complete();
    }
}
