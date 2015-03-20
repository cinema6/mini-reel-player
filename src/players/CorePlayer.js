import View from '../../lib/core/View.js';
import PlayerPosterView from '../../src/views/PlayerPosterView.js';
import {createKey} from 'private-parts';

const _ = createKey();

export default class CorePlayer extends View {
    constructor() {
        const events = [];

        const fireEventOnce = ((event, predicate) => {
            if (predicate() && events.indexOf(event) < 0) {
                this.emit(event);
                events.push(event);
            }
        });

        super(...arguments);

        this.tag = 'div';
        this.classes.push('playerBox');

        _(this).posterSrc = null;
        _(this).poster = new PlayerPosterView();

        this.on('timeupdate', () => {
            const {currentTime, duration} = this;

            if (!duration) { return; }

            fireEventOnce('firstQuartile', function() {
                return currentTime >= (duration * 0.25);
            });

            fireEventOnce('midpoint', function() {
                return currentTime >= (duration * 0.5);
            });

            fireEventOnce('thirdQuartile', function() {
                return currentTime >= (duration * 0.75);
            });

            fireEventOnce('complete', function() {
                return currentTime >= (duration - 1);
            });
        });
    }

    get poster() {
        return _(this).posterSrc;
    }
    set poster(value) {
        _(this).posterSrc = value;
        _(this).poster.setImage(value);
    }

    unload() {}

    didCreateElement() {
        const {poster} = _(this);

        this.append(poster);
        poster.setImage(this.poster);

        return super(...arguments);
    }

    willRemoveElement() {
        this.unload();

        return super(...arguments);
    }
}
