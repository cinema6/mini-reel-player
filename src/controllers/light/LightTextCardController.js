import TextCardController from '../TextCardController.js';
import LightTextCardView from '../../views/light/LightTextCardView.js';

export default class LightTextCardController extends TextCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new LightTextCardView());
    }

    advance() {
        this.model.complete();
    }
}
