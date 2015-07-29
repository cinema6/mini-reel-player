import CardView from '../CardView.js';
import View from '../../../lib/core/View.js';
import Runner from '../../../lib/Runner.js';

export default class MobileTwitterImageCardView extends CardView {
    constructor() {
        super(...arguments);

        this.template = require('./MobileTwitterCardView.html');
    }

    didInsertElement() {
        const script = document.createElement('script');
        script.setAttribute('src', '//platform.twitter.com/widgets.js');
        Runner.run(() => {
            this.insert(new View(script));
        });
    }
}
