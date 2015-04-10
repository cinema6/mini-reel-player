import ApplicationController from '../ApplicationController.js';
import LightPlayerController from './LightPlayerController.js';
import browser from '../../services/browser.js';
import codeLoader from '../../services/code_loader.js';

export default class LightApplicationController extends ApplicationController {
    constructor() {
        super(...arguments);

        this.PlayerCtrl = new LightPlayerController(this.appView);

        browser.test('mouse').then(hasMouse => {
            if (hasMouse) { codeLoader.loadStyles('css/light--hover.css'); }
        });
    }
}
