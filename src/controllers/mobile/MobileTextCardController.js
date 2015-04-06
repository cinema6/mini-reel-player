import TextCardController from '../TextCardController.js';
import MobileTextCardView from '../../views/mobile/MobileTextCardView.js';

export default class MobileTextCardController extends TextCardController {
    constructor() {
        super(...arguments);

        this.view = this.addView(new MobileTextCardView());
    }
}
