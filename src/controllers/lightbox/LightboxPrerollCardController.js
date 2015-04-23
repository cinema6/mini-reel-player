import PrerollCardController from '../PrerollCardController.js';
import LightboxPrerollCardView from '../../views/lightbox/LightboxPrerollCardView.js';
import CompanionPrerollCardController from '../../mixins/CompanionPrerollCardController.js';

export default class LightboxPrerollCardController extends PrerollCardController {
    constructor() {
        super(...arguments);

        this.view = new LightboxPrerollCardView();

        this.initCompanion();
    }
}
LightboxPrerollCardController.mixin(CompanionPrerollCardController); // jshint ignore:line
