import InstagramImageCardController from '../InstagramImageCardController.js';
import LightInstagramImageCardView from '../../views/light/LightInstagramImageCardView.js';

export default class LightInstagramImageCardController extends InstagramImageCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new LightInstagramImageCardView());
    }
}
