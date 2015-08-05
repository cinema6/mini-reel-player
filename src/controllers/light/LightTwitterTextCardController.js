import TwitterCardController from '../TwitterCardController.js';
import LightTwitterTextCardView from '../../views/light/LightTwitterTextCardView.js';

export default class LightTwitterTextCardController extends TwitterCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new LightTwitterTextCardView());
    }
}
