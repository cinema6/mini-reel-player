import {EventEmitter} from 'events';
import {createKey} from 'private-parts';
import cinema6 from '../services/cinema6.js';
import {
    map,
    forEach
} from '../../lib/utils.js';

import VideoCard from './VideoCard.js';
import RecapCard from './RecapCard.js';

const _ = createKey();

function initialize(minireel, experience) {
    minireel.title = experience.data.title;
    minireel.deck = map(experience.data.deck, card => {
        switch (card.type) {
        case 'recap':
            return new RecapCard(card, minireel);
        default:
            return new VideoCard(card);
        }
    });
    minireel.length = minireel.deck.length;

    _(minireel).ready = true;
    minireel.emit('init');
}

export default class MiniReel extends EventEmitter {
    constructor() {
        super(...arguments);

        this.title = null;
        this.deck = [];
        this.length = 0;

        this.currentIndex = -1;
        this.currentCard = null;

        _(this).ready = false;

        cinema6.getAppData().then(appData => initialize(this, appData.experience));
        cinema6.getSession().then(session => session.on('show', () => this.moveToIndex(0)));
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

        this.currentIndex = index;
        this.currentCard = this.deck[index];

        if (this.currentCard !== previousCard) {
            this.didMove();
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
