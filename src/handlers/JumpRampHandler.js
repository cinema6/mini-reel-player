import BillingHandler from './BillingHandler.js';
import fetcher from '../../lib/fetcher.js';

function send(message) {
    return fetcher.get(`http://webview_message/${message}`);
}

export default class JumpRampHandler extends BillingHandler {
    constructor(register ) {
        super(...arguments);

        register(() => {
            return send('close');
        }, 'navigation', 'close');

        this.on('AdCount', () => {
            return send('complete');
        });

        register(({ data: card }) => {
            const type = !!card.sponsor ? 'sponsor' : 'content';
            return send(`complete/${type}`);
        }, 'video', 'complete');
    }
}

