import cinema6 from '../services/cinema6.js';
import dispatcher from '../services/dispatcher.js';
import {
    find
} from '../../lib/utils.js';

export default class EmbedHandler {
    constructor(register, minireel) {
        this.session = cinema6.init({
            setup: (() => new Promise(resolve => {
                if (minireel.id) { return resolve(); }
                minireel.once('init', resolve);
            }))
        });
        dispatcher.addSource('session', this.session, ['show', 'hide', 'showCard']);

        register(() => this.ping('open'), 'navigation', 'launch');
        register(() => this.ping('close'), 'navigation', 'close');
        register((event, error) => this.ping('error', error.message), 'navigation', 'error');
        register(({ target: card }) => this.ping('cardComplete', card.id), 'card', 'complete');

        register(() => minireel.moveToIndex(0), 'session', 'show');
        register(() => minireel.close(), 'session', 'hide');
        register((event, id) => {
            minireel.moveTo(find(minireel.deck, card => card.id === id));
        }, 'session', 'showCard');
    }

    ping(event, data) {
        return cinema6.getSession().then(session => session.ping(event, data));
    }

    setStyles(styles) {
        return this.ping('responsiveStyles', styles);
    }
}
