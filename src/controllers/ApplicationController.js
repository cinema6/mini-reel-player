import Controller from '../../lib/core/Controller.js';

import ApplicationView from '../views/ApplicationView.js';
import PlayerController from './PlayerController.js';

export default class ApplicationController extends Controller {
    constructor(root) {
        super(...arguments);

        require('../animations/mobile.js');

        this.appView = new ApplicationView(root);

        this.PlayerCtrl = new PlayerController(this.appView);
    }
}
