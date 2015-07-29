import InstagramCardController from '../InstagramCardController.js';
import LightInstagramVideoCardView from '../../views/light/LightInstagramVideoCardView.js';

export default class LightInstagramVideoCardController extends InstagramCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new LightInstagramVideoCardView());
    }

    renderInstagram() {

    }
}
