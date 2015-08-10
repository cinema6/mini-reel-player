import PinterestCardController from '../PinterestCardController.js';
import LightPinterestVideoCardView from '../../views/light/LightPinterestVideoCardView.js';

export default class LightPinterestVideoCardController extends PinterestCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new LightPinterestVideoCardView());
    }
}
