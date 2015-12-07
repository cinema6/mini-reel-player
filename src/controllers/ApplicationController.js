import Controller from '../../lib/core/Controller.js';
import browser from '../../src/services/browser.js';
import codeLoader from '../../src/services/code_loader.js';
import environment from '../environment.js';
import Runner from '../../lib/Runner.js';

import ApplicationView from '../views/ApplicationView.js';

export default class ApplicationController extends Controller {
    constructor(root) {
        // If we're running in MRAID, we want to be able to render the player when the UIWebView is
        // off-screen. To do that, we can't render in calls to requestAnimationFrame(), so we're
        // giving the RenderQueue the same flush() method as the BeforeRenderQueue() (which does
        // not use RAF.)
        if (environment.params.context === 'mraid') {
            const BeforeRenderQueue = Runner.queues[0];
            const RenderQueue = Runner.queues[1];

            RenderQueue.prototype.flush = BeforeRenderQueue.prototype.flush;
        }

        super(...arguments);

        this.appView = new ApplicationView(root);
        this.appView.create();

        browser.test('mouse').then(hasMouse => {
            if (hasMouse) { codeLoader.loadStyles(`css/${environment.mode}--hover.css`); }
        });
    }
}
