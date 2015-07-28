import InstagramCardController from '../InstagramCardController.js';
import FullInstagramVideoCardView from '../../views/full/FullInstagramVideoCardView.js';

export default class FullInstagramVideoCardController extends InstagramCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new FullInstagramVideoCardView());
    }

    renderInstagram() {

    }
}
