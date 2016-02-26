import ApplicationController from '../ApplicationController.js';
import MobileCardPlayerCtrl from './MobileCardPlayerController.js';

export default class MobileCardApplicationController extends ApplicationController {
    constructor() {
        super(...arguments);

        this.PlayerCtrl = new MobileCardPlayerCtrl(this.appView);
    }
}
