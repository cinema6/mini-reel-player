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
import makeSocialLinks from '../fns/make_social_links.js';
import {
    map,
    forEach,
    find
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

const _ = createKey();

function initialize(minireel, { experience, standalone, profile }) {
    minireel.standalone = standalone;
    minireel.id = experience.id;
    minireel.title = experience.data.title;
    minireel.branding = experience.data.branding;
    minireel.campaign = experience.data.campaign;
    minireel.splash = experience.data.collateral.splash;
    minireel.deck = map(experience.data.deck, card => {
        switch (card.type) {
         case 'article':
            return new ArticleCard(card, experience, profile);
        case 'text':
            return new TextCard(card, experience, profile);
        case 'image':
            return new ImageCard(card, experience, profile);
        case 'recap':
            return new RecapCard(card, experience, profile, minireel);
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
    minireel.length = minireel.deck.length;
    minireel.adConfig = experience.data.adConfig || {
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

    minireel.sponsor = experience.data.params.sponsor || null;
    minireel.logo = experience.data.collateral.logo || null;
    minireel.links = experience.data.links || {};
    minireel.socialLinks = makeSocialLinks(minireel.links);

    adtech.setDefaults({
        network: experience.data.adServer.network,
        server: experience.data.adServer.server,
        kv: { mode: minireel.adConfig.display.waterfall || 'default' },
    });

    minireel.prerollCard = new PrerollCard(null, experience, profile, minireel);

    _(minireel).ready = true;
    minireel.emit('init');
    minireel.didMove();
}

export default class MiniReel extends EventEmitter {
    constructor() {
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

        _(this).ready = false;
        _(this).cardsShown = 0;
        _(this).prerollShown = 0;
        _(this).previousIndex = this.currentIndex - 1;
        _(this).nextIndex = this.currentIndex + 1;

        _(this).cardCanAdvanceHandler = (() => this.next());
        _(this).becameUnskippableHandler = (() => this.emit('becameUnskippable'));
        _(this).becameSkippableHandler = (() => this.emit('becameSkippable'));
        _(this).skippableProgressHandler = (remaining => this.emit('skippableProgress', remaining));

        cinema6.getAppData()
            .then(appData => initialize(this, appData))
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

        const previousCard = this.currentCard;
        const previousIndex = this.currentIndex;
        let currentCard = this.deck[index] || null;
        const atTail = (index === this.length - 1);

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
            if (!atTail) {
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
        forEach(this.deck.concat([this.prerollCard]), card => {
            if (card === this.currentCard) {
                card.activate();
            } else {
                card.deactivate();
            }
        });

        const nextCard = (this.currentIndex !== null) && this.deck[this.currentIndex + 1];

        if (nextCard) {
            nextCard.prepare();
        }

        this.emit('move');
    }
}
