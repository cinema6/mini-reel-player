import ImageCardController from '../ImageCardController.js';
import FullImageCardView from '../../views/full/FullImageCardView.js';

export default class FullImageCardController extends ImageCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new FullImageCardView());
    }

    advance() {
        this.model.complete();
    }
}
