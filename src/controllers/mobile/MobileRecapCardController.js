import RecapCardController from '../RecapCardController.js';
import MobileRecapCardView from '../../views/mobile/MobileRecapCardView.js';

export default class MobileRecapCardController extends RecapCardController {
    constructor() {
        super(...arguments);

        this.view = new MobileRecapCardView();

        this.addListeners();
    }
}
