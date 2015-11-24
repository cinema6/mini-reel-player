import RecapCardController from '../RecapCardController.js';
import FullNPRecapCardView from '../../views/full-np/FullNPRecapCardView.js';

export default class FullNPRecapCardController extends RecapCardController {
    constructor() {
        super(...arguments);

        this.view = new FullNPRecapCardView();

        this.addListeners();
    }
}
