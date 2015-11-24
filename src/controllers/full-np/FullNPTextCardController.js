import TextCardController from '../TextCardController.js';
import FullNPTextCardView from '../../views/full-np/FullNPTextCardView.js';

export default class FullNPTextCardController extends TextCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new FullNPTextCardView());
    }

    advance() {
        this.model.complete();
    }
}
