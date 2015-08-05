import FacebookCardController from '../FacebookCardController.js';
import LightFacebookImageCardView from '../../views/light/LightFacebookImageCardView.js';

export default class LightFacebookImageCardController extends FacebookCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new LightFacebookImageCardView());
    }
}
