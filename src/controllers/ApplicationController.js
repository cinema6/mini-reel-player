import Controller from '../../lib/core/Controller.js';
import cinema6 from '../services/cinema6.js';

import ApplicationView from '../views/ApplicationView.js';
import PlayerController from './PlayerController.js';

export default class ApplicationController extends Controller {
    constructor(root) {
        super(...arguments);

        this.session = cinema6.init();
        this.appView = new ApplicationView(root);

        this.PlayerCtrl = new PlayerController(this.appView);
    }
}
