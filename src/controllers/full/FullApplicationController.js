import ApplicationController from '../ApplicationController.js';
import FullPlayerController from './FullPlayerController.js';

export default class FullApplicationController extends ApplicationController {
    constructor() {
        super(...arguments);

        this.PlayerCtrl = new FullPlayerController(this.appView);
    }
}
