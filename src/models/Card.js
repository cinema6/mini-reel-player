import { EventEmitter } from 'events';
import SafelyGettable from '../mixins/SafelyGettable.js';
import Post from './Post.js';
import Ballot from './Ballot.js';
import Mixable from '../../lib/core/Mixable.js';
import {
    extend,
    reduce
} from '../../lib/utils.js';

class Card extends Mixable {
    constructor(card, experience) {
        super(...arguments);

        this.id = card.id;
        this.title = card.title || null;
        this.note = card.note || null;
        this.thumbs = (card.thumbs || null) && extend(card.thumbs);

        this.data = {};

        this.modules = reduce(card.modules || [], (modules, module) => {
            const model = (() => {
                switch (module) {
                case 'post':
                    return new Post(card, experience);
                case 'ballot':
                    return new Ballot(card, experience);
                default:
                    return undefined;
                }
            }());

            if (model) {
                modules[module] = model;
            }

            return modules;
        }, {});

        this.active = false;
        this.lastViewedTime = null;
    }

    activate() {
        const wasInactive = !this.active;

        this.active = true;

        if (wasInactive) {
            this.lastViewedTime = new Date();
            this.emit('activate');
        }
    }

    deactivate() {
        const wasActive = this.active;

        this.active = false;

        if (wasActive) {
            this.emit('deactivate');
        }
    }

    prepare() {
        this.emit('prepare');
    }

    complete() {
        this.emit('complete');
    }

    reset() {}

    abort() {}

    cleanup() {
        this.reset();
        this.emit('cleanup');
    }
}
Card.mixin(EventEmitter, SafelyGettable);

export default Card;
