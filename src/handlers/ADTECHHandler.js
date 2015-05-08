import imageLoader from '../services/image_loader.js';
import BillingHandler from './BillingHandler.js';
import completeUrl from '../fns/complete_url.js';
import {
    map
} from '../../lib/utils.js';

export default class ADTECHHandler extends BillingHandler {
    constructor(register) {
        super(...arguments);

        register(({ target: minireel }) => {
            const { launchUrls } = minireel.campaign;

            if (launchUrls) { imageLoader.load(...map(launchUrls, completeUrl)); }
        }, 'navigation', 'launch');

        this.on('AdClick', card => {
            const {clickUrls} = card.campaign;

            if (clickUrls) { imageLoader.load(...map(clickUrls, completeUrl)); }
        });

        this.on('AdCount', card => {
            const {countUrls} = card.campaign;

            if (countUrls) { imageLoader.load(...map(countUrls, completeUrl)); }
        });
    }
}
