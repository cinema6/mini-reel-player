import Controller from '../../lib/core/Controller.js';
import browser from '../../src/services/browser.js';
import codeLoader from '../../src/services/code_loader.js';
import environment from '../environment.js';

import ApplicationView from '../views/ApplicationView.js';

export default class ApplicationController extends Controller {
    constructor(root) {
        super(...arguments);

        this.appView = new ApplicationView(root);

        browser.test('mouse').then(hasMouse => {
            if (hasMouse) { codeLoader.loadStyles(`css/${environment.mode}--hover.css`); }
        });
    }
}
