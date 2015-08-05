import FacebookCardController from '../FacebookCardController.js';
import FullFacebookTextCardView from '../../views/full/FullFacebookTextCardView.js';

export default class FullFacebookTextCardController extends FacebookCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new FullFacebookTextCardView());
    }
}
