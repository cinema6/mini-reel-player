import TwitterCardController from '../TwitterCardController.js';
import FullTwitterGifCardView from '../../views/full/FullTwitterGifCardView.js';

export default class FullTwitterGifCardController extends TwitterCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new FullTwitterGifCardView());
    }
}
