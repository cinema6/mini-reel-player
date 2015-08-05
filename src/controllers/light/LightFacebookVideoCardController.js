import FacebookCardController from '../FacebookCardController.js';
import LightFacebookVideoCardView from '../../views/light/LightFacebookVideoCardView.js';

export default class LightFacebookVideoCardController extends FacebookCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new LightFacebookVideoCardView());
    }
}
