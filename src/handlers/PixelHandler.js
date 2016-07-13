import imageLoader from '../services/image_loader.js';
import BillingHandler from './BillingHandler.js';
import completeUrl from '../fns/complete_url.js';
import environment from '../environment.js';
import {
    map,
    filter,
    forEach
} from '../../lib/utils.js';

function getMacroConfig({ delay, context, coordinates = {} }) {
    return {
        '{delay}': delay,
        '{context}': context || '',
        '{screenWidth}': window.screen.width,
        '{screenHeight}': window.screen.height,
        '{playerWidth}': window.innerWidth,
        '{playerHeight}': window.innerHeight,
        '{screenX}': coordinates.x || '',
        '{screenY}': coordinates.y || ''
    };
}

function completeUrlWithCardViewDelay({ card, context, coordinates }) {
    return function completeUrlWithCardViewDelayAndUrl(url) {
        const { lastViewedTime } = card;
        const delay = Date.now() - lastViewedTime;

        return completeUrl(url, getMacroConfig({ delay, context, coordinates }));
    };
}

function completeUrlWithLoadDelay(context) {
    return function completeUrlWithLoadDelayAndUrl(url) {
        const { loadStartTime } = environment;
        const delay = loadStartTime && (Date.now() - loadStartTime);

        return completeUrl(url, getMacroConfig({ delay, context }));
    };
}

function firePixels(groups, mapper, context) {
    const unfired = filter(groups, group => group && !(group.fired || {})[context]);
    const pixels = [].concat(...unfired);

    if (pixels.length > 0) {
        imageLoader.load(...map(pixels, mapper));
        forEach(unfired, group => {
            if (!group.fired) { group.fired = {}; }
            group.fired[context] = true;
        });
    }
}

export default class PixelHandler extends BillingHandler {
    constructor(register) {
        super(...arguments);

        register(({ target: minireel }) => {
            const launchUrls = map(minireel.deck, card => card.get('campaign.launchUrls') || []);

            firePixels(launchUrls, completeUrlWithLoadDelay());
        }, 'navigation', 'launch');
        register(({ target: minireel }) => {
            const loadUrls = map(minireel.deck, card => card.get('campaign.loadUrls') || []);

            firePixels(loadUrls, completeUrlWithLoadDelay());
        }, 'navigation', 'init');

        register(({ data: card }) => {
            firePixels([card.get('campaign.bufferUrls')], completeUrlWithLoadDelay());
        }, 'video', 'buffering');
        register(({ data: card }) => {
            firePixels([card.get('campaign.q1Urls')], completeUrlWithCardViewDelay({ card }));
        }, 'video', 'firstQuartile');
        register(({ data: card }) => {
            firePixels([card.get('campaign.q2Urls')], completeUrlWithCardViewDelay({ card }));
        }, 'video', 'midpoint');
        register(({ data: card }) => {
            firePixels([card.get('campaign.q3Urls')], completeUrlWithCardViewDelay({ card }));
        }, 'video', 'thirdQuartile');
        register(({ data: card }) => {
            firePixels([card.get('campaign.q4Urls')], completeUrlWithCardViewDelay({ card }));
        }, 'video', 'complete');

        register(({ target: card }) => {
            firePixels([card.get('campaign.viewUrls')], completeUrlWithLoadDelay());
        }, 'card', 'activate');
        register(({ target: card }, { link: { tracking }, context, coordinates }) => (
            firePixels([tracking], completeUrlWithCardViewDelay({
                card,
                context,
                coordinates
            }), context)
        ), 'card', 'clickthrough', 'share');

        register(({ target: controller }, context) => {
            const card = controller.model;
            const interactionUrls = card.get('campaign.interactionUrls');

            firePixels([interactionUrls], completeUrlWithCardViewDelay({ card, context }), context);
        }, 'ui', 'interaction');

        this.on('AdStart', card => {
            firePixels([card.get('campaign.playUrls')], completeUrlWithCardViewDelay({ card }));
        });

        this.on('AdCount', card => {
            firePixels([card.get('campaign.countUrls')], completeUrlWithCardViewDelay({ card }));
        });
    }
}
