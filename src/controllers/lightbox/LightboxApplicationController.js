import ApplicationController from '../ApplicationController.js';
import LightboxPlayerController from './LightboxPlayerController.js';
import browser from '../../services/browser.js';
import codeLoader from '../../services/code_loader.js';

export default class LightboxApplicationController extends ApplicationController {
    constructor() {
        super(...arguments);

        this.PlayerCtrl = new LightboxPlayerController(this.appView);

        browser.test('mouse').then(hasMouse => {
            if (hasMouse) { codeLoader.loadStyles('css/lightbox--hover.css'); }
        });
    }
}
