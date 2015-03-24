import dispatcher from '../services/dispatcher.js';
import ADTECHHandler from '../handlers/ADTECHHandler.js';
import GoogleAnalyticsHandler from '../handlers/GoogleAnalyticsHandler.js';
import MoatHandler from '../handlers/MoatHandler.js';
import {EventEmitter} from 'events';
import {createKey} from 'private-parts';
import cinema6 from '../services/cinema6.js';
import adtech from '../services/adtech.js';
import {
    map,
    forEach
} from '../../lib/utils.js';

import TextCard from './TextCard.js';
import VideoCard from './VideoCard.js';
import AdUnitCard from './AdUnitCard.js';
import RecapCard from './RecapCard.js';

const _ = createKey();

function initialize(minireel, experience) {
    minireel.id = experience.id;
    minireel.title = experience.data.title;
    minireel.branding = experience.data.branding;
    minireel.splash = experience.data.collateral.splash;
    minireel.deck = map(experience.data.deck, card => {
        switch (card.type) {
        case 'text':
            return new TextCard(card, experience);
        case 'recap':
            return new RecapCard(card, experience, minireel);
        case 'adUnit':
            return new AdUnitCard(card, experience);
        default:
            return new VideoCard(card, experience);
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

    adtech.setDefaults({
        network: experience.data.adServer.network,
        server: experience.data.adServer.server,
        kv: { mode: minireel.adConfig.display.waterfall || 'default' },
    });

    _(minireel).ready = true;
    minireel.emit('init');
}

export default class MiniReel extends EventEmitter {
    constructor() {
        super(...arguments);

        this.id = null;
        this.title = null;
        this.branding = null;
        this.splash = null;
        this.deck = [];
        this.length = 0;
        this.adConfig = null;

        this.currentIndex = -1;
        this.currentCard = null;

        _(this).ready = false;

        _(this).cardCanAdvanceHandler = (() => this.next());
        _(this).becameUnskippableHandler = (() => this.emit('becameUnskippable'));
        _(this).becameSkippableHandler = (() => this.emit('becameSkippable'));
        _(this).skippableProgressHandler = (remaining => this.emit('skippableProgress', remaining));

        cinema6.getAppData().then(appData => initialize(this, appData.experience));
        cinema6.getSession().then(session => {
            session.on('show', () => this.moveToIndex(0));
            session.on('initAnalytics', config => {
                dispatcher.addClient(GoogleAnalyticsHandler, this, config);
                dispatcher.addClient(MoatHandler, config);
            });
        });

        this.on('launch', () => cinema6.getSession().then(session => session.ping('open')));
        this.on('close', () => cinema6.getSession().then(session => session.ping('close')));

        dispatcher.addClient(ADTECHHandler);
        dispatcher.addSource('navigation', this, ['move']);
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
        const currentCard = this.deck[index] || null;
        const atTail = (index === this.length - 1);

        this.currentIndex = index;
        this.currentCard = currentCard;

        if (currentCard === previousCard) { return; }

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
        return this.moveToIndex(this.currentIndex + 1);
    }

    previous() {
        return this.moveToIndex(this.currentIndex - 1);
    }

    close() {
        this.moveToIndex(-1);
    }

    didMove() {
        forEach(this.deck, card => {
            if (card === this.currentCard) {
                card.activate();
            } else {
                card.deactivate();
            }
        });

        const nextCard = this.deck[this.currentIndex + 1];

        if (nextCard) {
            nextCard.prepare();
        }

        this.emit('move');
    }
}
