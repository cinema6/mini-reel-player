import FacebookCardController from '../FacebookCardController.js';
import FullFacebookImageCardView from '../../views/full/FullFacebookImageCardView.js';

export default class FullFacebookImageCardController extends FacebookCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new FullFacebookImageCardView());
    }
}
