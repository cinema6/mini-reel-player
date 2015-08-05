import FacebookCardController from '../FacebookCardController.js';
import MobileFacebookCardView from '../../views/mobile/MobileFacebookCardView.js';

export default class MobileFacebookCardController extends FacebookCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new MobileFacebookCardView());
    }
}
