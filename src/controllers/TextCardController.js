import CardController from './CardController.js';
import TextCardView from '../views/TextCardView.js';

export default class TextCardController extends CardController {
    constructor() {
        super(...arguments);

        this.view = new TextCardView();
    }
}
