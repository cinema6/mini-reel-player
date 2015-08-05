import InstagramVideoCardController from '../InstagramVideoCardController.js';
import LightInstagramVideoCardView from '../../views/light/LightInstagramVideoCardView.js';

export default class LightInstagramVideoCardController extends InstagramVideoCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new LightInstagramVideoCardView());
    }
}
