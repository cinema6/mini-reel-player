import BillingHandler from './BillingHandler.js';
import tracker from '../services/tracker.js';
import timer from '../../lib/timer.js';
import Runner from '../../lib/Runner.js';
import environment from '../environment.js';
import {
    noop,
    extend
} from '../../lib/utils.js';

function existy(value) {
    return value !== undefined && value !== null;
}

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
            origins: 'dimension11'
        });
        this.tracker.set({
            checkProtocolTask: noop,
            hostname: environment.hostname,
            origins: environment.ancestorOrigins.join('|')
        });

        Runner.schedule('afterRender', null, () => {
            const now = Date.now();

            this.tracker.trackTiming(this.getTrackingData({
                timingCategory: 'Player',
                timingVar: 'jsBootstrap',
                timingLabel: 'null',
                timingValue: now - environment.initTime
            }));

            this.tracker.trackTiming(this.getTrackingData({
                timingCategory: 'Player',
                timingVar: 'bootstrap',
                timingLabel: 'null',
                timingValue: now - global.performance.timing.domLoading
            }));
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
        register((data, error) => {
            this.tracker.trackEvent(this.getTrackingData({
                category: 'Error',
                label: error.message
            }));
        }, 'navigation', 'error');

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
            this.tracker.trackEvent(this.getVideoTrackingData(player, 'Quartile 1'));
        }, 'video', 'firstQuartile');
        register(({ target: player }) => {
            this.tracker.trackEvent(this.getVideoTrackingData(player, 'Quartile 2'));
        }, 'video', 'midpoint');
        register(({ target: player }) => {
            this.tracker.trackEvent(this.getVideoTrackingData(player, 'Quartile 3'));
        }, 'video', 'thirdQuartile');
        register(({ target: player }) => {
            this.tracker.trackEvent(this.getVideoTrackingData(player, 'Quartile 4'));
        }, 'video', 'complete');

        let currentPlayer = null;
        const trackAutoplayAttempt = (() => {
            this.tracker.trackEvent(
                this.getVideoTrackingData(currentPlayer, 'AutoPlayAttempt', true)
            );
            waitFor(currentPlayer, 'play', 5000).catch(() => {
                this.tracker.trackEvent(this.getVideoTrackingData(
                    currentPlayer, 'Error', true, 'Video play timed out.'
                ));
            });
        });

        register(({ target: card, data: player }) => {
            if (currentPlayer) {
                currentPlayer.removeListener('attemptPlay', trackAutoplayAttempt);
            }

            currentPlayer = player;

            if (card.data.autoplay) {
                player.once('attemptPlay', trackAutoplayAttempt);
            }
        }, 'card', 'activate');

        this.on('AdCount', (card, player) => {
            this.tracker.trackEvent(this.getVideoTrackingData(player, 'AdCount'));
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
                query.ex = config.experiment;
                query.vr = config.variant;
            }

            if (card) {
                query.ix = index;
            }
            query.bd = branding;

            for (let p in query){ if(existy(query[p])){qf.push(p + '=' + query[p]);} }
            if (qf.length){ result += '?' + qf.join('&'); }

            return result;
        }());

        return extend(params, {
            page: pagePath,
            title: `${title}${card ? (' - ' + card.title) : ''}`
        });
    }

    getVideoTrackingData(player, event, nonInteractive = false, label = undefined) {
        const { currentCard: card } = this.minireel;

        return this.getTrackingData({
            category: 'Video',
            action: event,
            label: label || card.data.href || 'null',
            nonInteraction: Number(nonInteractive)
        });
    }
}
