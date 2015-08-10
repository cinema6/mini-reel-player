import PinterestCardController from '../PinterestCardController.js';
import FullPinterestImageCardView from '../../views/full/FullPinterestImageCardView.js';

export default class FullPinterestImageCardController extends PinterestCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new FullPinterestImageCardView());
    }
}
