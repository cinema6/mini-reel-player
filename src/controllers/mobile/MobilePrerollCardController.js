import PrerollCardController from '../PrerollCardController.js';
import MobilePrerollCardView from '../../views/mobile/MobilePrerollCardView.js';

export default class MobilePrerollCardController extends PrerollCardController {
    constructor() {
        super(...arguments);

        this.view = new MobilePrerollCardView();
    }
}
