import FacebookCardController from '../FacebookCardController.js';
import FullFacebookVideoCardView from '../../views/full/FullFacebookVideoCardView.js';

export default class FullFacebookVideoCardController extends FacebookCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new FullFacebookVideoCardView());
    }
}
