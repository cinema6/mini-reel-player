import CardView from './CardView.js';
import injectHtml from '../fns/inject_html.js';
import { createKey } from 'private-parts';
import Runner from '../../lib/Runner.js';

const _ = createKey();

export default class ImageCardView extends CardView {
    constructor() {
        super(...arguments);

        _(this).embedCode = null;

        // For unit tests
        if (window.__karma__) {
            this.__private__ = _(this);
        }
    }

    loadEmbed(embedCode) {
        if(!this.embed) {
            this.create();
        }
        if(_(this).embedCode===embedCode) {
            return;
        }
        _(this).embedCode = embedCode;
        Runner.scheduleOnce('render', this, injectHtml, [embedCode, this.embed.element]);
    }
}
