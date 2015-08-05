import InstagramImageCardController from '../InstagramImageCardController.js';
import FullInstagramImageCardView from '../../views/full/FullInstagramImageCardView.js';

export default class FullInstagramImageCardController extends InstagramImageCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new FullInstagramImageCardView());
    }
}
