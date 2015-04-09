import VideoCardController from '../VideoCardController.js';
import LightVideoCardView from '../../views/light/LightVideoCardView.js';

export default class LightVideoCardController extends VideoCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new LightVideoCardView());
    }
}
