import ImageCardController from '../ImageCardController.js';
import FullVideoCardView from '../../views/full/FullVideoCardView.js';

export default class FullImageCardController extends ImageCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new FullVideoCardView());
    }
}
