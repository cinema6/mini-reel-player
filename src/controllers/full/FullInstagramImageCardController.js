import InstagramCardController from '../InstagramCardController.js';
import FullInstagramImageCardView from '../../views/full/FullInstagramImageCardView.js';

export default class FullInstagramImageCardController extends InstagramCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new FullInstagramImageCardView());
    }
}
