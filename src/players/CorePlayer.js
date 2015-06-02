import View from '../../lib/core/View.js';
import {createKey} from 'private-parts';
import Runner from '../../lib/Runner.js';

const _ = createKey();

function updatePoster() {
    const { poster } = _(this);

    this.element.style.backgroundImage = (poster || '') && `url('${_(this).poster}')`;
}

export default class CorePlayer extends View {
    constructor() {
        super(...arguments);

        const events = [];

        const fireEventOnce = ((event, predicate) => {
            if (predicate() && events.indexOf(event) < 0) {
                this.emit(event);
                events.push(event);
            }
        });

        this.tag = 'div';
        this.classes.push('playerBox');

        _(this).poster = null;

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
        return _(this).poster;
    }
    set poster(value) {
        _(this).poster = value;

        if (this.element) { Runner.scheduleOnce('render', this, updatePoster); }
    }

    unload() {}

    didCreateElement() {
        Runner.scheduleOnce('render', this, updatePoster);
        return super(...arguments);
    }

    willRemoveElement() {
        this.unload();

        return super(...arguments);
    }
}
