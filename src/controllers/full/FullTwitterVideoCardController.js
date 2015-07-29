import TwitterCardController from '../TwitterCardController.js';
import FullTwitterVideoCardView from '../../views/full/FullTwitterVideoCardView.js';

export default class FullTwitterVideoCardController extends TwitterCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new FullTwitterVideoCardView());
    }
}
