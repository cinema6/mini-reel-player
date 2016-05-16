import ShowcaseCard from './ShowcaseCard';
import { extend } from '../../lib/utils.js';
import timer from '../../lib/timer.js';
import { createKey } from 'private-parts';

const _ = createKey();

export default class ShowcaseAppCard extends ShowcaseCard {
    constructor(card) {
        super(...arguments);

        _(this).advanceInterval = (card.data.advanceInterval || 0) * 1000;
        _(this).interval = null;

        this.type = 'showcase-app';

        this.currentIndex = 0;
        this.slides = extend(card.data.slides);

        this.data = extend(this.data, {
            rating: card.data.rating,
            price: card.data.price
        });
    }

    get currentSlide() {
        return this.slides[this.currentIndex];
    }

    goToIndex(index) {
        if (index === this.currentIndex) { return this; }

        this.currentIndex = index;
        return this.emit('move');
    }

    nextSlide() {
        const nextIndex = this.currentIndex === (this.slides.length - 1) ?
            0 : (this.currentIndex + 1);

        return this.goToIndex(nextIndex);
    }

    stopAdvancing() {
        const { interval } = _(this);

        if (interval) {
            timer.cancel(interval);
            _(this).interval = null;
        }
    }

    activate() {
        const { advanceInterval } = _(this);

        if (advanceInterval) {
            _(this).interval = timer.interval(() => this.nextSlide(), advanceInterval);
        }

        return super.activate(...arguments);
    }

    deactivate() {
        this.stopAdvancing();

        return super.deactivate(...arguments);
    }
}
