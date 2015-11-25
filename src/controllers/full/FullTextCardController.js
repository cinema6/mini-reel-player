import TextCardController from '../TextCardController.js';
import FullTextCardView from '../../views/full/FullTextCardView.js';

export default class FullTextCardController extends TextCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new FullTextCardView());
    }

    advance() {
        this.model.complete();
    }
}
