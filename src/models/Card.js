import {EventEmitter} from 'events';
import DisplayAd from './DisplayAd.js';
import Post from './Post.js';
import {
    extend,
    reduce
} from '../../lib/utils.js';

export default class Card extends EventEmitter {
    constructor(card, experience) {
        this.id = card.id;
        this.title = card.title;
        this.note = card.note;
        this.thumbs = extend(card.thumbs);

        this.data = {};

        this.modules = reduce(card.modules || [], (modules, module) => {
            const model = (() => {
                switch (module) {
                case 'displayAd':
                    return new DisplayAd(card, experience);
                case 'post':
                    return new Post(card, experience);
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
}
