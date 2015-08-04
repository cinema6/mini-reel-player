import TemplateView from '../../../lib/core/TemplateView.js';
import codeLoader from '../../services/code_loader.js';
import urlParser from '../../services/url_parser.js';
import Runner from '../../../lib/Runner.js';

codeLoader.configure('instagram', {
    src: urlParser.parse('//platform.instagram.com/en_US/embeds.js').href,
    after() { return global.instgrm; }
});

export default class InstagramEmbedView extends TemplateView {
    constructor() {
        super(...arguments);
        this.template = require('./InstagramEmbedView.html');
        this.tag = 'div';
    }

    didInsertElement() {
        super.didInsertElement(...arguments);
        this.process();
    }

    update() {
        super.update(...arguments);
        if(this.inserted) {
            this.process();
        }
    }

    process() {
        Runner.runNext(() => {
            codeLoader.load('instagram').then(instagram => {
                instagram.Embeds.process();
            });
        });
    }
}
