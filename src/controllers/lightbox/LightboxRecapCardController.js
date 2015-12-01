import RecapCardController from '../RecapCardController.js';
import LightboxRecapCardView from '../../views/lightbox/LightboxRecapCardView.js';

export default class LightboxRecapCardController extends RecapCardController {
    constructor() {
        super(...arguments);

        this.view = new LightboxRecapCardView();

        this.addListeners();
    }
}
