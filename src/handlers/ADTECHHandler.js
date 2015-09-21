import imageLoader from '../services/image_loader.js';
import BillingHandler from './BillingHandler.js';
import completeUrl from '../fns/complete_url.js';
import {
    map,
    reduce
} from '../../lib/utils.js';

export default class ADTECHHandler extends BillingHandler {
    constructor(register) {
        super(...arguments);

        register(({ target: minireel }) => {
            const { launchUrls } = minireel.campaign;

            if (launchUrls) { imageLoader.load(...map(launchUrls, completeUrl)); }
        }, 'navigation', 'launch');
        register(({ target: minireel }) => {
            imageLoader.load(...map(reduce(minireel.deck, (result, card) => {
                return result.concat(card.get('campaign.loadUrls') || []);
            }, []), completeUrl));
        }, 'navigation', 'init');

        register(({ data: card }) => {
            const { q1Urls } = card.campaign;

            if (q1Urls) { imageLoader.load(...map(q1Urls, completeUrl)); }
        }, 'video', 'firstQuartile');
        register(({ data: card }) => {
            const { q2Urls } = card.campaign;

            if (q2Urls) { imageLoader.load(...map(q2Urls, completeUrl)); }
        }, 'video', 'midpoint');
        register(({ data: card }) => {
            const { q3Urls } = card.campaign;

            if (q3Urls) { imageLoader.load(...map(q3Urls, completeUrl)); }
        }, 'video', 'thirdQuartile');
        register(({ data: card }) => {
            const { q4Urls } = card.campaign;

            if (q4Urls) { imageLoader.load(...map(q4Urls, completeUrl)); }
        }, 'video', 'complete');

        register((event, data) => {
            imageLoader.load(...map(data.tracking, completeUrl));
        }, 'card', 'clickthrough');

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
