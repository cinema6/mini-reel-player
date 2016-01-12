import dispatcher from '../services/dispatcher.js';
import {
    find
} from '../../lib/utils.js';

export default class EmbedHandler {
    constructor(register, minireel) {
        const { embed } = minireel;

        dispatcher.addSource('session', embed, [
            'ready', 'show', 'hide', 'showCard', 'vpaid:pauseAd', 'vpaid:resumeAd'
        ]);

        register(() => embed.ping('open'), 'navigation', 'launch');
        register(() => embed.ping('close'), 'navigation', 'close');
        register((event, error) => embed.ping('error', error.message), 'navigation', 'error');
        register(({ target: card }) => embed.ping('cardComplete', card.id), 'card', 'complete');

        register(() => minireel.moveToIndex(0), 'session', 'show');
        register(() => minireel.close(), 'session', 'hide');
        register((event, id) => {
            minireel.moveTo(find(minireel.deck, card => card.id === id));
        }, 'session', 'showCard');

        register(() => embed.ping('video:play'), 'video', 'play');
    }
}
