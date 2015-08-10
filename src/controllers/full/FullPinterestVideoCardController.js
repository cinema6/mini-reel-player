import PinterestCardController from '../PinterestCardController.js';
import FullPinterestVideoCardView from '../../views/full/FullPinterestVideoCardView.js';

export default class FullPinterestVideoCardController extends PinterestCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new FullPinterestVideoCardView());
    }
}
