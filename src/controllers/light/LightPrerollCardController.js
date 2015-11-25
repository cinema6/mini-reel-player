import PrerollCardController from '../PrerollCardController.js';
import LightPrerollCardView from '../../views/light/LightPrerollCardView.js';

export default class LightPrerollCardController extends PrerollCardController {
    constructor() {
        super(...arguments);

        this.view = new LightPrerollCardView();
    }
}
