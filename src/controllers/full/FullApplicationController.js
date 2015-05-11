import ApplicationController from '../ApplicationController.js';
import FullPlayerController from './FullPlayerController.js';
import 'gsap/src/uncompressed/plugins/CSSPlugin.js';
import '../../animations/full.js';

export default class FullApplicationController extends ApplicationController {
    constructor() {
        super(...arguments);

        this.PlayerCtrl = new FullPlayerController(this.appView);
    }
}
