import View from '../../../lib/core/View.js';
import SwipeableView from '../../../src/mixins/SwipeableView.js';
import { createKey } from 'private-parts';
import Runner from '../../../lib/Runner.js';
import {
    map,
    reduce
} from '../../../lib/utils.js';

function add(...values) {
    return reduce(values, (result, value) => result + value, 0);
}

const _ = createKey();

function translateAmount(widths, index) {
    return -(add(...widths.slice(0, index)));
}

function refresh() {
    const { children } = _(this);
    const widths = (_(this).childWidths = map(children, child => child.element.clientWidth));
    _(this).bounds.max = 0;
    _(this).bounds.min = -(add(...widths.slice(0, widths.length - 1)));
    this.snapPoints = map(widths, (width, index) =>  -(add(...widths.slice(0, index))));
    return widths;
}

export default class CardPannerView extends View {
    constructor() {
        super(...arguments);

        _(this).children = [];
        _(this).childWidths = [];
        _(this).bounds = {
            min: -Infinity,
            max: Infinity
        };

        _(this).resize = () => Runner.run(() => {
            this.setOffset(translateAmount(refresh.call(this), this.currentIndex));
        });

        this.tag = 'ul';

        this.locked = false;
        this.currentIndex = 0;
        this.delegate = null;

        Object.defineProperties(this.bounds, {
            min: {
                get: () => this.locked ? this.snapPoints[this.currentIndex] : _(this).bounds.min
            },

            max: {
                get: () => this.locked ? this.snapPoints[this.currentIndex] : _(this).bounds.max
            }
        });
    }

    refresh() {
        Runner.schedule('afterRender', this, refresh);
    }

    lock(yes) {
        this.locked = !!yes;
    }

    scrollTo(index) {
        if (index === this.currentIndex || index < 0) { return; }

        this.currentIndex = index;
        this.animateOffset(translateAmount(_(this).childWidths, index), 0.5);
    }

    append(child) {
        _(this).children.push(child);
        return super(child);
    }

    didInsertElement() {
        window.addEventListener('resize', _(this).resize, false);

        return super();
    }

    willRemoveElement() {
        window.removeEventListener('resize', _(this).resize, false);

        return super();
    }

    validateSnap(offset) {
        if (this.locked) { return this.snapPoints[this.currentIndex]; }

        const { delegate } = this;
        const index = delegate && delegate.getSnapCardIndex ?
            delegate.getSnapCardIndex(this.snapPoints.indexOf(offset)) :
            this.snapPoints.indexOf(offset);

        this.once('animationStart', () => {
            this.currentIndex = index;
            this.emit('swipe');
        });

        return this.snapPoints[index];
    }
}
CardPannerView.mixin(SwipeableView); //jshint ignore:line
