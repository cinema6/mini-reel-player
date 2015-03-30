import BillingHandler from './BillingHandler.js';
import tracker from '../services/tracker.js';
import timer from '../../lib/timer.js';
import browser from '../services/browser.js';
import {
    noop,
    extend
} from '../../lib/utils.js';

function waitFor(emitter, event, timeout = 1000) {
    return new Promise((fulfill, reject) => {
        emitter.once(event, () => fulfill(emitter));
        timer.wait(timeout).then(() => {
            reject(`Timed out after ${timeout}ms waiting for "${event}".`);
        });
    });
}

export default class GoogleAnalyticsHandler extends BillingHandler {
    constructor(register, minireel, config) {
        const { accountId, clientId } = config;

        super(...arguments);

        this.tracker = tracker.get('c6mr');
        this.startedSession = false;

        this.minireel = minireel;
        this.config = config;

        this.tracker.create(accountId, {
            name: 'c6mr',
            clientId,
            storage: 'none',
            cookieDomain: 'none'
        });
        this.tracker.alias({
            category: 'eventCategory',
            action: 'eventAction',
            label: 'eventLabel',
            href: 'dimension11',
            slideCount: 'dimension4',
            slideIndex: 'dimension7',
            videoDuration: 'dimension8',
            videoSource: 'dimension9'
        });
        this.tracker.set({
            checkProtocolTask: noop,
            slideCount: minireel.length,
            hostname: (function() {
                try {
                    return global.parent.location.hostname;
                } catch (e) {}
            }()),
            href: (function() {
                try {
                    return global.parent.location.href;
                } catch(e) {}
            }())
        });

        register(({ target: minireel }) => {
            const index = minireel.currentIndex;

            if (!this.startedSession && index === 0) {
                this.tracker.trackPage(this.getTrackingData({ sessionControl: 'start' }));
                this.startedSession = true;
            } else if (index > -1) {
                this.tracker.trackPage(this.getTrackingData());
            }
        }, 'navigation', 'move');

        register(({ target: player, data: card }) => {
            this.tracker.trackEvent(this.getVideoTrackingData(player, 'Play', card.data.autoplay));
        }, 'video', 'play');

        register(({ target: player }) => {
            this.tracker.trackEvent(this.getVideoTrackingData(player, 'Pause'));
        }, 'video', 'pause');

        register(({ target: player }) => {
            this.tracker.trackEvent(this.getVideoTrackingData(player, 'End'));
        }, 'video', 'ended');

        register(({ target: player }) => {
            const label = (player.error && player.error.message) || 'An unknown error occurred.';
            this.tracker.trackEvent(this.getVideoTrackingData(player, 'Error', true, label));
        }, 'video', 'error');

        register(({ target: player }) => {
            this.tracker.trackEvent(this.getVideoTrackingData(player, 'Quartile1'));
        }, 'video', 'firstQuartile');
        register(({ target: player }) => {
            this.tracker.trackEvent(this.getVideoTrackingData(player, 'Quartile2'));
        }, 'video', 'midpoint');
        register(({ target: player }) => {
            this.tracker.trackEvent(this.getVideoTrackingData(player, 'Quartile3'));
        }, 'video', 'thirdQuartile');
        register(({ target: player }) => {
            this.tracker.trackEvent(this.getVideoTrackingData(player, 'Quartile4'));
        }, 'video', 'complete');

        register(({ target: card, data: player }) => {
            if (card.data.autoplay) {
                browser.test('autoplay').then(autoplayable => {
                    if (!autoplayable) { return; }

                    this.tracker.trackEvent(
                        this.getVideoTrackingData(player, 'AutoPlayAttempt', true)
                    );
                    waitFor(player, 'play', 5000).catch(() => {
                        this.tracker.trackEvent(
                            this.getVideoTrackingData(
                                player,
                                'Error', true, 'Video play timed out.'
                            )
                        );
                    });
                });
            }
        }, 'card', 'activate');

        this.on('AdCount', (card, player) => {
            this.tracker.trackEvent(this.getVideoTrackingData(player, 'AdCount', true));
        });
    }

    getTrackingData(params = {}) {
        const { id, title, branding, currentCard, currentIndex: index } = this.minireel;
        const { config } = this;
        const card = (currentCard && currentCard.id) ? currentCard : undefined;

        const pagePath = (() => {
            const cardId = card && card.id;
            let result = '/mr/' + id + (cardId ? '/' + cardId : '') + '/';
            const qf = [];
            const query = {};

            if (config) {
                query.cx = config.context;
                query.ct = config.container;
                query.gp = config.group;
            }

            if (card) {
                query.ix = index;
            }
            query.bd = branding;

            for (let p in query){ if(query[p]!==undefined){qf.push(p + '=' + query[p]);} }
            if (qf.length){ result += '?' + qf.join('&'); }

            return result;
        }());

        return extend(params, {
            page: pagePath,
            title: `${title}${card ? (' - ' + card.title) : ''}`,
            slideIndex: index
        });
    }

    getVideoTrackingData(player, event, nonInteractive = false, label = undefined) {
        const { currentCard: card } = this.minireel;

        return this.getTrackingData({
            category: 'Video',
            action: event,
            label: label || card.data.href || 'null',
            videoSource: card.data.source || card.data.type,
            videoDuration: player.duration,
            nonInteraction: Number(nonInteractive)
        });
    }
}
