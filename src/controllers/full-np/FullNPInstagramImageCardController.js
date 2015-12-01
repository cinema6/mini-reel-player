import InstagramCardController from '../InstagramCardController.js';
import FullNPInstagramImageCardView from '../../views/full-np/FullNPInstagramImageCardView.js';

export default class FullNPInstagramImageCardController extends InstagramCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new FullNPInstagramImageCardView());
    }
}
