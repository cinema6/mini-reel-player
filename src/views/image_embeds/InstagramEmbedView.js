import TemplateView from '../../../lib/core/TemplateView.js';
import codeLoader from '../../services/code_loader.js';
import urlParser from '../../services/url_parser.js';
import Runner from '../../../lib/Runner.js';
import {createKey} from 'private-parts';

let _;

codeLoader.configure('instagram', {
    src: urlParser.parse('//platform.instagram.com/en_US/embeds.js').href,
    after() { return global.instgrm; }
});

class Private {
    constructor(instance) {
        this.__public__ = instance;
    }

    process() {
        Runner.runNext(() => {
            codeLoader.load('instagram').then(instagram => {
                instagram.Embeds.process();
            });
        });
    }
}

_ = createKey(instance => new Private(instance));

export default class InstagramEmbedView extends TemplateView {
    constructor() {
        super(...arguments);
        this.template = require('./InstagramEmbedView.html');
        this.tag = 'div';

        if (global.__karma__) { this.__private__ = _(this); }
    }

    didInsertElement() {
        super.didInsertElement(...arguments);
        _(this).process();
    }

    update() {
        super.update(...arguments);
        if(this.inserted) {
            _(this).process();
        }
    }
}
