import TwitterCardController from '../TwitterCardController.js';
import FullTwitterTextCardView from '../../views/full/FullTwitterTextCardView.js';

export default class FullTwitterTextCardController extends TwitterCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new FullTwitterTextCardView());
    }
}
