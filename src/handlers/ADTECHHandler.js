import imageLoader from '../services/image_loader.js';
import BillingHandler from './BillingHandler.js';
import completeUrl from '../fns/complete_url.js';
import environment from '../environment.js';
import {
    map,
    reduce
} from '../../lib/utils.js';

function completeUrlWithCardViewDelay(card) {
    return function completeUrlWithCardViewDelayAndUrl(url) {
        const { lastViewedTime } = card;
        const delay = Date.now() - lastViewedTime;

        return completeUrl(url, { '{delay}': delay });
    };
}

function completeUrlWithLoadDelay() {
    return function completeUrlWithLoadDelayAndUrl(url) {
        const { loadStartTime } = environment;
        const delay = loadStartTime && (Date.now() - loadStartTime);

        return completeUrl(url, { '{delay}': delay });
    };
}

function firePixels(campaign, type, mapper) {
    const pixels = campaign[type];

    if (pixels) { imageLoader.load(...map(pixels, mapper)); }
}

export default class ADTECHHandler extends BillingHandler {
    constructor(register) {
        super(...arguments);

        register(({ target: minireel }) => {
            const { loadStartTime } = environment;
            const launchDelay = loadStartTime && (Date.now() - loadStartTime);

            firePixels(minireel.campaign, 'launchUrls', url => completeUrl(url, {
                '{launchDelay}': launchDelay,
                '{delay}': launchDelay
            }));
        }, 'navigation', 'launch');
        register(({ target: minireel }) => {
            const { loadStartTime } = environment;
            const loadDelay = loadStartTime && (Date.now() - loadStartTime);

            imageLoader.load(...map(reduce(minireel.deck, (result, card) => {
                return result.concat(card.get('campaign.loadUrls') || []);
            }, []), url => completeUrl(url, { '{loadDelay}': loadDelay, '{delay}': loadDelay })));
        }, 'navigation', 'init');

        register(({ data: card }) => {
            firePixels(card.campaign, 'bufferUrls', completeUrlWithLoadDelay());
        }, 'video', 'buffering');
        register(({ data: card }) => {
            firePixels(card.campaign, 'q1Urls', completeUrlWithCardViewDelay(card));
        }, 'video', 'firstQuartile');
        register(({ data: card }) => {
            firePixels(card.campaign, 'q2Urls', completeUrlWithCardViewDelay(card));
        }, 'video', 'midpoint');
        register(({ data: card }) => {
            firePixels(card.campaign, 'q3Urls', completeUrlWithCardViewDelay(card));
        }, 'video', 'thirdQuartile');
        register(({ data: card }) => {
            firePixels(card.campaign, 'q4Urls', completeUrlWithCardViewDelay(card));
        }, 'video', 'complete');

        register(({ target: card }) => {
            firePixels(card.campaign, 'viewUrls', completeUrlWithLoadDelay());
        }, 'card', 'activate');
        register(({ target: card }, { tracking }) => {
            imageLoader.load(...map(tracking, completeUrlWithCardViewDelay(card)));
        }, 'card', 'clickthrough', 'share');

        this.on('AdClick', card => {
            const { lastViewedTime } = card;
            const playDelay = Date.now() - lastViewedTime;

            firePixels(card.campaign, 'playUrls', url => completeUrl(url, {
                '{playDelay}': playDelay,
                '{delay}': playDelay
            }));
        });

        this.on('AdCount', card => {
            firePixels(card.campaign, 'countUrls', completeUrlWithCardViewDelay(card));
        });
    }
}
