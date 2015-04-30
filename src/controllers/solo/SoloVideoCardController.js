import VideoCardController from '../VideoCardController.js';
import SoloVideoCardView from '../../views/solo/SoloVideoCardView.js';

export default class SoloVideoCardController extends VideoCardController {
    constructor() {
        super(...arguments);

        this.view = new SoloVideoCardView();
    }
}
