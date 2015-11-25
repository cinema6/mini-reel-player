import RecapCardController from '../RecapCardController.js';
import FullRecapCardView from '../../views/full/FullRecapCardView.js';

export default class FullRecapCardController extends RecapCardController {
    constructor() {
        super(...arguments);

        this.view = new FullRecapCardView();

        this.addListeners();
    }
}
