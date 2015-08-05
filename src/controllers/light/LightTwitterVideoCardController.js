import TwitterCardController from '../TwitterCardController.js';
import LightTwitterVideoCardView from '../../views/light/LightTwitterVideoCardView.js';

export default class LightTwitterVideoCardController extends TwitterCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new LightTwitterVideoCardView());
    }
}
