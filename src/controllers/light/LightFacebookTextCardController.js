import FacebookCardController from '../FacebookCardController.js';
import LightFacebookTextCardView from '../../views/light/LightFacebookTextCardView.js';

export default class LightFacebookTextCardController extends FacebookCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new LightFacebookTextCardView());
    }
}
