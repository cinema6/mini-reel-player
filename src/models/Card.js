import {EventEmitter} from 'events';
import {
    extend
} from '../../lib/utils.js';

export default class Card extends EventEmitter {
    constructor(card) {
        this.id = card.id;
        this.title = card.title;
        this.note = card.note;
        this.thumbs = extend(card.thumbs);

        this.data = {};

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
