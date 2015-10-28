import ApplicationController from '../ApplicationController.js';
import DesktopCardPlayerController from './DesktopCardPlayerController.js';

export default class DesktopCardApplicationController extends ApplicationController {
    constructor(rootView) {
        super(rootView);

        this.PlayerCtrl = new DesktopCardPlayerController(this.appView);
    }
}
