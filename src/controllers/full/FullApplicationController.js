import ApplicationController from '../ApplicationController.js';
import FullPlayerController from './FullPlayerController.js';
import browser from '../../services/browser.js';
import codeLoader from '../../services/code_loader.js';

export default class FullApplicationController extends ApplicationController {
    constructor() {
        super(...arguments);

        browser.test('mouse').then(hasMouse => {
            if (hasMouse) { codeLoader.loadStyles('css/full--hover.css'); }
        });

        this.PlayerCtrl = new FullPlayerController(this.appView);
    }
}
