import InstagramVideoCardController from '../InstagramVideoCardController.js';
import FullInstagramVideoCardView from '../../views/full/FullInstagramVideoCardView.js';

export default class FullInstagramVideoCardController extends InstagramVideoCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new FullInstagramVideoCardView());
    }
}
