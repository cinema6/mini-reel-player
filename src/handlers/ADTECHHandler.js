import imageLoader from '../services/image_loader.js';
import BillingHandler from './BillingHandler.js';

export default class ADTECHHandler extends BillingHandler {
    constructor() {
        super(...arguments);

        this.on('AdClick', card => {
            const {clickUrls} = card.campaign;

            if (clickUrls) { imageLoader.load(...clickUrls); }
        });

        this.on('AdCount', card => {
            const {countUrls} = card.campaign;

            if (countUrls) { imageLoader.load(...countUrls); }
        });
    }
}
