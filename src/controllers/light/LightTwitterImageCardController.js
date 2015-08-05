import TwitterCardController from '../TwitterCardController.js';
import LightTwitterImageCardView from '../../views/light/LightTwitterImageCardView.js';

export default class LightTwitterImageCardController extends TwitterCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new LightTwitterImageCardView());
    }
}
