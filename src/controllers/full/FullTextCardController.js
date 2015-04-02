import TextCardController from '../TextCardController.js';
import FullTextCardView from '../../views/full/FullTextCardView.js';

export default class FullTextCardController extends TextCardController {
    constructor() {
        super(...arguments);

        this.view = new FullTextCardView();

        this.addListeners();
    }

    addListeners() {
        this.view.on('advance', () => this.model.complete());
    }
}
