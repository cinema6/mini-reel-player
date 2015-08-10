import PinterestCardController from '../PinterestCardController.js';
import LightPinterestImageCardView from '../../views/light/LightPinterestImageCardView.js';

export default class LightPinterestImageCardController extends PinterestCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new LightPinterestImageCardView());
    }
}
