import InstagramCardController from '../InstagramCardController.js';
import FullInstagramCardView from '../../views/full/FullInstagramCardView.js';

export default class FullInstagramCardController extends InstagramCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new FullInstagramCardView());
    }
}
