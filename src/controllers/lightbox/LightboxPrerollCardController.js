import PrerollCardController from '../PrerollCardController.js';
import LightboxPrerollCardView from '../../views/lightbox/LightboxPrerollCardView.js';

export default class LightboxPrerollCardController extends PrerollCardController {
    constructor() {
        super(...arguments);

        this.view = new LightboxPrerollCardView();
    }
}
