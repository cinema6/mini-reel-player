import environment from '../environment.js';
import dispatcher from '../services/dispatcher.js';
import ADTECHHandler from '../handlers/ADTECHHandler.js';
import PostMessageHandler from '../handlers/PostMessageHandler.js';
import GoogleAnalyticsHandler from '../handlers/GoogleAnalyticsHandler.js';
import MoatHandler from '../handlers/MoatHandler.js';
import JumpRampHandler from '../handlers/JumpRampHandler.js';
import {EventEmitter} from 'events';
import {createKey} from 'private-parts';
import cinema6 from '../services/cinema6.js';
import adtech from '../services/adtech.js';
import browser from '../services/browser.js';
import codeLoader from '../services/code_loader.js';
import makeSocialLinks from '../fns/make_social_links.js';
import {
    map,
    forEach,
    find,
    filter
} from '../../lib/utils.js';
import ArticleCard from './ArticleCard.js';
import TextCard from './TextCard.js';
import ImageCard from './ImageCard.js';
import VideoCard from './VideoCard.js';
import AdUnitCard from './AdUnitCard.js';
import EmbeddedVideoCard from './EmbeddedVideoCard.js';
import DisplayAdCard from './DisplayAdCard.js';
import RecapCard from './RecapCard.js';
import PrerollCard from './PrerollCard.js';
import SlideshowBobCard from './SlideshowBobCard.js';

const CARD_WHITELIST = ['text', 'video', 'displayAd', 'slideshow-bob', 'recap'];

const _ = createKey();

function getCardType(card) {
    switch (card.type) {
    case 'youtube':
    case 'vimeo':
    case 'dailymotion':
    case 'rumble':
    case 'embedded':
    case 'adUnit':
        return 'video';
    default:
        return card.type;
    }
}

function initialize(whitelist, { experience, standalone, profile }) {
    const deck = filter(experience.data.deck, card => whitelist.indexOf(getCardType(card)) > -1);

    this.standalone = standalone;
    this.id = experience.id;
    this.title = experience.data.title;
    this.branding = experience.data.branding;
    this.campaign = experience.data.campaign;
    this.splash = experience.data.collateral.splash;
    this.deck = map(deck, card => {
        switch (card.type) {
         case 'article':
            return new ArticleCard(card, experience, profile);
        case 'text':
            return new TextCard(card, experience, profile);
        case 'image':
            return new ImageCard(card, experience, profile);
        case 'recap':
            return new RecapCard(card, experience, profile, this);
        case 'adUnit':
            return new AdUnitCard(card, experience, profile);
        case 'embedded':
            return new EmbeddedVideoCard(card, experience, profile);
        case 'displayAd':
            return new DisplayAdCard(card, experience, profile);
        case 'slideshow-bob':
            return new SlideshowBobCard(card, experience, profile);
        default:
            return new VideoCard(card, experience, profile);
        }
    });
    this.length = this.deck.length;
    this.adConfig = experience.data.adConfig || {
        video: {
            firstPlacement: 1,
            frequency: 3,
            waterfall: 'cinema6',
            skip: 6
        },
        display: {
            waterfall: 'cinema6'
        }
    };

    this.sponsor = experience.data.params.sponsor || null;
    this.logo = experience.data.collateral.logo || null;
    this.links = experience.data.links || {};
    this.socialLinks = makeSocialLinks(this.links);

    adtech.setDefaults({
        network: experience.data.adServer.network,
        server: experience.data.adServer.server,
        kv: { mode: this.adConfig.display.waterfall || 'default' },
    });

    this.prerollCard = new PrerollCard(null, experience, profile, this);


    if (this.branding) {
        const { apiRoot, mode } = environment;
        const base = `${apiRoot}/collateral/branding/${this.branding}/styles`;

        codeLoader.loadStyles(`${base}/${mode}/theme.css`);
        codeLoader.loadStyles(`${base}/core.css`);

        browser.test('mouse').then(hasMouse => {
            if (hasMouse) {
                codeLoader.loadStyles(`${base}/${mode}/theme--hover.css`);
                codeLoader.loadStyles(`${base}/core--hover.css`);
            }
        });
    }

    _(this).ready = true;
    this.emit('init');
    this.didMove();
}

export default class MiniReel extends EventEmitter {
    constructor(whitelist = CARD_WHITELIST) {
        super(...arguments);

        this.standalone = null;

        this.id = null;
        this.title = null;
        this.branding = null;
        this.campaign = null;
        this.splash = null;
        this.deck = [];
        this.prerollCard = null;
        this.length = 0;
        this.adConfig = null;

        this.sponsor = null;
        this.logo = null;
        this.links = null;
        this.socialLinks = null;

        this.currentIndex = -1;
        this.currentCard = null;
        this.skippable = true;

        _(this).ready = false;
        _(this).cardsShown = 0;
        _(this).prerollShown = 0;
        _(this).previousIndex = this.currentIndex - 1;
        _(this).nextIndex = this.currentIndex + 1;

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

        cinema6.getAppData()
            .then(appData => initialize.call(this, whitelist, appData))
            .catch(error => this.emit('error', error));
        cinema6.getSession().then(session => {
            session.on('show', () => this.moveToIndex(0));
            session.on('initAnalytics', config => {
                dispatcher.addClient(GoogleAnalyticsHandler, this, config);
                dispatcher.addClient(MoatHandler, config);
                if (config.container === 'jumpramp'){
                    dispatcher.addClient(JumpRampHandler );
                }
            });
            session.on('showCard', id => this.moveTo(find(this.deck, card => card.id === id)));
        });

        this.on('launch', () => cinema6.getSession().then(session => session.ping('open')));
        this.on('close', () => cinema6.getSession().then(session => session.ping('close')));

        dispatcher.addClient(ADTECHHandler);
        dispatcher.addClient(PostMessageHandler, window.parent.postMessage);
        dispatcher.addSource('navigation', this, ['launch', 'move', 'close', 'error']);
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

        if (!this.skippable) { return; }

        const previousCard = this.currentCard;
        const previousIndex = this.currentIndex;
        let currentCard = this.deck[index] || null;

        this.currentIndex = index;
        this.currentCard = currentCard;

        _(this).previousIndex = index - 1;
        _(this).nextIndex = index + 1;

        if (currentCard === previousCard) { return; }

        const { cardsShown, prerollShown } = _(this);
        const firstPlacement = this.adConfig.video.firstPlacement > -1 ?
            this.adConfig.video.firstPlacement : Infinity;
        const frequency = this.adConfig.video.frequency || Infinity;
        const showedFirstPreroll = prerollShown > 0;
        const cardsShownSinceFirstPreroll = (cardsShown - firstPlacement);
        const shouldLoadPreroll = ((cardsShown + 1) === firstPlacement) ||
            (((cardsShownSinceFirstPreroll + 1) % frequency) === 0);
        const shouldShowPreroll = ((cardsShown === firstPlacement) && !showedFirstPreroll) ||
            (showedFirstPreroll && (prerollShown <= (cardsShownSinceFirstPreroll / frequency)));

        if (shouldLoadPreroll) {
            this.prerollCard.prepare();
        }

        if (shouldShowPreroll) {
            currentCard = this.currentCard = this.prerollCard;
            this.currentIndex = null;
            _(this).prerollShown++;

            _(this).nextIndex = index;
            _(this).previousIndex = previousIndex;
        } else {
            _(this).cardsShown++;
        }

        if (currentCard) {
            if (this.currentIndex !== (this.length - 1)) {
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
        }

        if (!previousCard) {
            this.emit('launch');
        }

        if (!currentCard) {
            this.emit('close');
        }

        this.didMove();
    }

    moveTo(card) {
        return this.moveToIndex(this.deck.indexOf(card));
    }

    next() {
        return this.moveToIndex(_(this).nextIndex);
    }

    previous() {
        return this.moveToIndex(_(this).previousIndex);
    }

    close() {
        this.moveToIndex(-1);
    }

    didMove() {
        const { currentIndex, currentCard, deck, prerollCard } = this;
        const cards = deck.concat([prerollCard]);

        forEach(cards, card => {
            if (card === currentCard) {
                card.activate();
            } else {
                card.deactivate();
            }
        });

        const nextCard = (currentIndex !== null) && deck[currentIndex + 1];

        if (nextCard) {
            nextCard.prepare();
        }

        this.emit('move');

        if (currentIndex === -1) {
            forEach(cards, card => card.cleanup());
        }
    }
}
