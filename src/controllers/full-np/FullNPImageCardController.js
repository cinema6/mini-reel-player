import ImageCardController from '../ImageCardController.js';
import FullNPVideoCardView from '../../views/full-np/FullNPVideoCardView.js';

export default class FullNPImageCardController extends ImageCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new FullNPVideoCardView());
    }
}
