import BillingHandler from './BillingHandler.js';
import fetcher from '../../lib/fetcher.js';

export default class JumpRampHandler extends BillingHandler {
    constructor(register ) {
        super(...arguments);
        
        register(() => {
            fetcher.get('http://webview_message/close');
        }, 'navigation', 'close');

        this.on('AdCount', () => {
            fetcher.get('http://webview_message/complete');
        });
    }
}

