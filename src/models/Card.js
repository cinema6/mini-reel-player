import {EventEmitter} from 'events';
import DisplayAd from './DisplayAd.js';
import Post from './Post.js';
import Ballot from './Ballot.js';
import {
    extend,
    reduce
} from '../../lib/utils.js';

export default class Card extends EventEmitter {
    constructor(card, experience) {
        super();

        this.id = card.id;
        this.title = card.title;
        this.note = card.note;
        this.thumbs = (card.thumbs || null) && extend(card.thumbs);

        this.data = {};

        this.modules = reduce(card.modules || [], (modules, module) => {
            const model = (() => {
                switch (module) {
                case 'displayAd':
                    return new DisplayAd(card, experience);
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
    }

    activate() {
        const wasInactive = !this.active;

        this.active = true;

        if (wasInactive) {
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
