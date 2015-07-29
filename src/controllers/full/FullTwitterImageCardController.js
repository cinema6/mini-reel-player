import TwitterCardController from '../TwitterCardController.js';
import FullTwitterImageCardView from '../../views/full/FullTwitterImageCardView.js';

export default class FullTwitterImageCardController extends TwitterCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new FullTwitterImageCardView());
    }
}
