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

export default class ADTECHHandler extends BillingHandler {
    constructor(register) {
        super(...arguments);

        register(({ target: minireel }) => {
            const { launchUrls } = minireel.campaign;
            const { loadStartTime } = environment;
            const launchDelay = loadStartTime && (Date.now() - loadStartTime);

            if (launchUrls) {
                imageLoader.load(...map(launchUrls, url => completeUrl(url, {
                    '{launchDelay}': launchDelay,
                    '{delay}': launchDelay
                })));
            }
        }, 'navigation', 'launch');
        register(({ target: minireel }) => {
            const { loadStartTime } = environment;
            const loadDelay = loadStartTime && (Date.now() - loadStartTime);

            imageLoader.load(...map(reduce(minireel.deck, (result, card) => {
                return result.concat(card.get('campaign.loadUrls') || []);
            }, []), url => completeUrl(url, { '{loadDelay}': loadDelay, '{delay}': loadDelay })));
        }, 'navigation', 'init');

        register(({ data: card }) => {
            const { bufferUrls } = card.campaign;

            if (bufferUrls) { imageLoader.load(...map(bufferUrls, completeUrlWithLoadDelay())); }
        }, 'video', 'buffering');
        register(({ data: card }) => {
            const { q1Urls } = card.campaign;

            if (q1Urls) { imageLoader.load(...map(q1Urls, completeUrlWithCardViewDelay(card))); }
        }, 'video', 'firstQuartile');
        register(({ data: card }) => {
            const { q2Urls } = card.campaign;

            if (q2Urls) { imageLoader.load(...map(q2Urls, completeUrlWithCardViewDelay(card))); }
        }, 'video', 'midpoint');
        register(({ data: card }) => {
            const { q3Urls } = card.campaign;

            if (q3Urls) { imageLoader.load(...map(q3Urls, completeUrlWithCardViewDelay(card))); }
        }, 'video', 'thirdQuartile');
        register(({ data: card }) => {
            const { q4Urls } = card.campaign;

            if (q4Urls) { imageLoader.load(...map(q4Urls, completeUrlWithCardViewDelay(card))); }
        }, 'video', 'complete');

        register(({ target: card }) => {
            const { viewUrls } = card.campaign;

            if (viewUrls) { imageLoader.load(...map(viewUrls, completeUrlWithLoadDelay())); }
        }, 'card', 'activate');
        register(({ target: card }, { tracking }) => {
            imageLoader.load(...map(tracking, completeUrlWithCardViewDelay(card)));
        }, 'card', 'clickthrough', 'share');

        this.on('AdClick', card => {
            const { campaign: { playUrls }, lastViewedTime } = card;
            const playDelay = Date.now() - lastViewedTime;

            if (playUrls) {
                imageLoader.load(...map(playUrls, url => completeUrl(url, {
                    '{playDelay}': playDelay,
                    '{delay}': playDelay
                })));
            }
        });

        this.on('AdCount', card => {
            const { countUrls } = card.campaign;

            if (countUrls) {
                imageLoader.load(...map(countUrls, completeUrlWithCardViewDelay(card)));
            }
        });
    }
}
