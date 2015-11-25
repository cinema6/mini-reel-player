import InstagramVideoCardController from '../InstagramVideoCardController.js';
import FullNPInstagramVideoCardView from '../../views/full-np/FullNPInstagramVideoCardView.js';

export default class FullNPInstagramVideoCardController extends InstagramVideoCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new FullNPInstagramVideoCardView());
    }
}
