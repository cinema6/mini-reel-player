import ListView from '../views/ListView.js';
import SwipeableView from '../mixins/SwipeableView.js';
import CarouselItemView from './CarouselItemView.js';
import { createKey } from 'private-parts';
import Runner from '../../lib/Runner.js';
import {
    map,
    reduce
} from '../../lib/utils.js';

function add(...values) {
    return reduce(values, (result, value) => result + value, 0);
}

const _ = createKey();

function translateAmount(widths, index) {
    return add(...widths.slice(0, Math.abs(index))) * (index < 0 ? 1 : -1);
}

function refresh() {
    const { children } = this;
    const widths = (_(this).childWidths = map(children, child => child.element.clientWidth));

    _(this).bounds.max = 0;
    _(this).bounds.min = -(add(...widths.slice(0, widths.length - 1)));
    this.snapPoints = map(widths, (width, index) =>  -(add(...widths.slice(0, index))));

    this.setOffset(translateAmount(widths, this.currentIndex));
    this.emit('refresh');
}

export default class CarouselView extends ListView {
    constructor() {
        super(...arguments);

        _(this).childWidths = [];
        _(this).bounds = {
            min: -Infinity,
            max: Infinity
        };

        _(this).resize = () => Runner.run(() => this.refresh());

        this.tag = 'ul';
        this.itemViewClass = CarouselItemView;

        this.locked = false;
        this.currentIndex = 0;

        Object.defineProperties(this.bounds, {
            min: {
                get: () => this.locked ? this.snapPoints[this.currentIndex] : _(this).bounds.min
            },

            max: {
                get: () => this.locked ? this.snapPoints[this.currentIndex] : _(this).bounds.max
            }
        });

        this.on('addChild', () => this.refresh());
    }

    clickthrough(child, event) {
        if (this.children.indexOf(child) === this.currentIndex) {
            window.open(event.href);
            this.emit('click', child, event);
        }
    }

    refresh() {
        Runner.scheduleOnce('afterRender', this, refresh);
    }

    lock(yes) {
        this.locked = !!yes;
    }

    scrollTo(index) {
        if (index === this.currentIndex) { return; }

        this.currentIndex = index;
        this.animateOffset(translateAmount(_(this).childWidths, index), 0.5);
    }

    didInsertElement() {
        window.addEventListener('resize', _(this).resize, false);
        this.refresh();

        return super.didInsertElement();
    }

    willRemoveElement() {
        window.removeEventListener('resize', _(this).resize, false);

        return super.willRemoveElement();
    }

    validateSnap(offset, { deltaX, velocityX }) {
        const { currentIndex, snapPoints } = this;
        const currentOffset = snapPoints[currentIndex];
        const index = (() => {
            if (velocityX > 0.2) {
                const lastIndex = this.snapPoints.length - 1;
                const firstIndex = 0;
                const modifier = deltaX > 0 ? -1 : 1;

                return Math.max(Math.min(currentIndex + modifier, lastIndex), firstIndex);
            } else {
                return snapPoints.indexOf(offset);
            }
        })();

        if (this.locked) { return currentOffset; }

        this.once('animationStart', () => {
            this.currentIndex = index;
            this.emit('swipe');
        });

        return this.snapPoints[index];
    }
}
CarouselView.mixin(SwipeableView);
