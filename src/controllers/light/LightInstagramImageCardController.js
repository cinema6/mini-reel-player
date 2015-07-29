import InstagramCardController from '../InstagramCardController.js';
import LightInstagramImageCardView from '../../views/light/LightInstagramImageCardView.js';

export default class LightInstagramImageCardController extends InstagramCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new LightInstagramImageCardView());
    }
}
