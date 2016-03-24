import Runner from '../../lib/Runner.js';
import environment from '../environment.js';
import dispatcher from '../services/dispatcher.js';
import resource from '../services/resource.js';
import Mixable from '../../lib/core/Mixable.js';
import SafelyGettable from '../mixins/SafelyGettable.js';
import { EventEmitter } from 'events';
import {createKey} from 'private-parts';
import EmbedSession from '../utils/EmbedSession.js';
import browser from '../services/browser.js';
import normalizeLinks from '../fns/normalize_links.js';
import makeSocialLinks from '../fns/make_social_links.js';
import {
    map,
    forEach,
    filter
} from '../../lib/utils.js';
import RunnerPromise from '../../lib/RunnerPromise.js';

/***************************************************************************************************
 * CARD MODEL IMPORTS
 **************************************************************************************************/
import VideoCard from './VideoCard.js';

/* #if card.types.indexOf('image') > -1 */
import ImageCard from './ImageCard.js';
/* #endif */

/* #if card.types.indexOf('adUnit') > -1 */
import AdUnitCard from './AdUnitCard.js';
/* #endif */

/* #if card.types.indexOf('recap') > -1 */
import RecapCard from './RecapCard.js';
/* #endif */

/* #if card.types.indexOf('slideshow-bob') > -1 */
import SlideshowBobCard from './SlideshowBobCard.js';
/* #endif */

/* #if card.types.indexOf('instagram') > -1 */
import InstagramImageCard from './InstagramImageCard.js';
import InstagramVideoCard from './InstagramVideoCard.js';
/* #endif */

/* #if card.types.indexOf('brightcove') > -1 */
import BrightcoveVideoCard from './BrightcoveVideoCard.js';
/* #endif */

/* #if card.types.indexOf('kaltura') > -1 */
import KalturaVideoCard from './KalturaVideoCard.js';
/* #endif */

/***************************************************************************************************
 * EVENT HANDLER IMPORTS
 **************************************************************************************************/
import PixelHandler from '../handlers/PixelHandler.js';
import PostMessageHandler from '../handlers/PostMessageHandler.js';
import GoogleAnalyticsHandler from '../handlers/GoogleAnalyticsHandler.js';
import MoatHandler from '../handlers/MoatHandler.js';

/* #if context !== 'standalone' */
import EmbedHandler from '../handlers/EmbedHandler.js';
/* #endif */

/* #if context === 'vpaid' */
import VPAIDHandler from '../handlers/VPAIDHandler.js';
/* #endif */

const CARD_WHITELIST = ['video', 'image', 'slideshow-bob', 'recap', 'instagram'];
const CONTEXTS = {
    STANDALONE: 'standalone',
    MRAID: 'mraid',
    VPAID: 'vpaid',
    EMBED: 'embed'
};

const _ = createKey();

function getCardType(card) {
    switch (card.type) {
    case 'youtube':
    case 'vimeo':
    case 'dailymotion':
    case 'adUnit':
    case 'vine':
    case 'vzaar':
    case 'wistia':
    case 'jwplayer':
    case 'vidyard':
    case 'htmlvideo':
    case 'brightcove':
    case 'kaltura':
    case 'facebook':
        return 'video';
    default:
        return card.type;
    }
}

function initialize(whitelist, experience, profile) {
    const { standalone, interstitial, autoLaunch } = environment.params;
    const deck = filter(experience.data.deck, card => whitelist.indexOf(getCardType(card)) > -1);

    this.standalone = standalone;
    this.interstitial = interstitial;
    this.id = experience.id;
    this.title = experience.data.title;
    this.branding = experience.data.branding;
    this.campaign = experience.data.campaign;
    this.splash = experience.data.collateral.splash;
    this.deck = map(deck, card => {
        switch (card.type) {
        case 'image':
            return new ImageCard(card, experience, profile);
        case 'recap':
            return new RecapCard(card, experience, profile, this);
        case 'adUnit':
            return new AdUnitCard(card, experience, profile);
        case 'slideshow-bob':
            return new SlideshowBobCard(card, experience, profile);
        case 'instagram':
            if(card.data.type === 'image') {
                return new InstagramImageCard(card, experience, profile);
            } else {
                return new InstagramVideoCard(card, experience, profile);
            }
            break;
        case 'brightcove':
            return new BrightcoveVideoCard(card, experience, profile);
        case 'kaltura':
            return new KalturaVideoCard(card, experience, profile);
        default:
            return new VideoCard(card, experience, profile);
        }
    });
    this.length = this.deck.length;

    this.sponsor = experience.data.params.sponsor || null;
    this.logo = experience.data.collateral.logo || null;
    this.links = normalizeLinks(experience.data.links);
    this.socialLinks = makeSocialLinks(this.links);

    this.closeable = !standalone;

    _(this).ready = true;
    this.emit('init');
    this.deck[0].prepare();

    if (autoLaunch) { this.moveToIndex(0); }
}

export default class MiniReel extends Mixable {
    constructor(whitelist = CARD_WHITELIST) {
        const context = environment.params.context;

        super(...arguments);

        this.standalone = null;
        this.interstitial = null;

        this.embed = new EmbedSession();

        this.id = null;
        this.title = null;
        this.branding = null;
        this.campaign = null;
        this.splash = null;
        this.deck = [];
        this.length = 0;

        this.sponsor = null;
        this.logo = null;
        this.links = null;
        this.socialLinks = null;

        this.currentIndex = -1;
        this.currentCard = null;
        this.skippable = true;
        this.closeable = true;

        _(this).ready = false;

        _(this).cardCanAdvanceHandler = (() => this.next());
        _(this).becameUnskippableHandler = (() => {
            this.skippable = false;
            this.emit('becameUnskippable');
        });
        _(this).becameSkippableHandler = (() => {
            this.skippable = true;
            this.emit('becameSkippable');
        });
        _(this).skippableProgressHandler = (remaining => this.emit('skippableProgress', remaining));

        this.on('becameUnskippable', () => {
            if (this.interstitial && this.closeable) {
                this.closeable = false;
                this.emit('becameUncloseable');
            }
        });
        this.on('becameSkippable', () => {
            if (!this.closeable && !this.standalone) {
                this.closeable = true;
                this.emit('becameCloseable');
            }
        });

        // TO-DO Place this listener on own window, not parent, when we switch away from
        // friendly iframe
        const handleBeforeunload = (() => Runner.run(() => this.close()));
        try {
            global.parent.addEventListener('beforeunload', handleBeforeunload, false);
        } catch(e) {
            global.addEventListener('beforeunload', handleBeforeunload, false);
        }

        if (context !== CONTEXTS.STANDALONE) { dispatcher.addClient(EmbedHandler, this); }
        dispatcher.addClient(GoogleAnalyticsHandler, this);
        dispatcher.addClient(MoatHandler);
        dispatcher.addClient(PixelHandler);
        dispatcher.addClient(PostMessageHandler, window.parent.postMessage);
        if (context === CONTEXTS.VPAID) { dispatcher.addClient(VPAIDHandler, this.embed); }

        dispatcher.addSource('navigation', this, ['launch', 'move', 'close', 'error', 'init']);

        const getReady = ((() => {
            const promise = this.embed.init();

            return (() => promise);
        })());

        RunnerPromise.all([
            resource.get('experience').catch(() => this.embed.getExperience()),
            browser.getProfile()
        ]).then(([experience, profile]) => {
            initialize.call(this, whitelist, experience, profile);

            getReady().then(ready => ready());
        }).catch(error => this.emit('error', error));
    }

    moveToIndex(index) {
        if (!_(this).ready) {
            throw new Error('Cannot move until the MiniReel has been initialized.');
        }

        if (index < -1) {
            throw new RangeError('Cannot move below index -1.');
        }

        if (index > (this.length - 1)) {
            throw new RangeError('Cannot move past the last index.');
        }

        if (!this.skippable) {
            if (index === -1) {
                this.currentCard.abort();
            } else {
                return;
            }
        }

        const previousCard = this.currentCard;
        const currentCard = this.deck[index] || null;
        const nextCard = this.deck[index + 1] || null;

        if (currentCard === previousCard) { return; }

        if (currentCard) {
            if (index !== (this.length - 1)) {
                currentCard.on('canAdvance', _(this).cardCanAdvanceHandler);
            }

            currentCard.on('becameUnskippable', _(this).becameUnskippableHandler);
            currentCard.on('becameSkippable', _(this).becameSkippableHandler);
            currentCard.on('skippableProgress', _(this).skippableProgressHandler);
        }

        if (previousCard) {
            previousCard.removeListener('canAdvance', _(this).cardCanAdvanceHandler);
            previousCard.removeListener('becameUnskippable', _(this).becameUnskippableHandler);
            previousCard.removeListener('becameSkippable', _(this).becameSkippableHandler);
            previousCard.removeListener('skippableProgress', _(this).skippableProgressHandler);

            previousCard.deactivate();
        }

        this.currentIndex = index;
        this.currentCard = currentCard;

        if (currentCard) {
            currentCard.activate();
        } else {
            forEach(this.deck, card => card.cleanup());
        }

        if (nextCard) { nextCard.prepare(); }

        this.emit('move');

        if (!previousCard) {
            this.emit('launch');
        }

        if (!currentCard) {
            this.emit('close');
        }
    }

    moveTo(card) {
        return this.moveToIndex(this.deck.indexOf(card));
    }

    next() {
        return this.moveToIndex(this.currentIndex + 1);
    }

    previous() {
        return this.moveToIndex(this.currentIndex - 1);
    }

    close() {
        this.moveToIndex(-1);
    }
}
MiniReel.mixin(EventEmitter, SafelyGettable); // jshint ignore:line
