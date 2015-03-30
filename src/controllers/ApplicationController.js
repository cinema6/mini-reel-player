import Controller from '../../lib/core/Controller.js';

import ApplicationView from '../views/ApplicationView.js';

export default class ApplicationController extends Controller {
    constructor(root) {
        super(...arguments);

        this.appView = new ApplicationView(root);
    }
}
