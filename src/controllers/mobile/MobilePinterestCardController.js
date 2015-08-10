import PinterestCardController from '../PinterestCardController.js';
import MobilePinterestCardView from '../../views/mobile/MobilePinterestCardView.js';

export default class MobilePinterestCardController extends PinterestCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new MobilePinterestCardView());
    }
}
