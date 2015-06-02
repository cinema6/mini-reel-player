import prefix from 'prefix';
import Runner from '../../lib/Runner.js';
import { createKey } from 'private-parts';
import {
    forEach,
    map
} from '../../lib/utils.js';

export const DIRECTIONS = {
    UP: 'UP',
    DOWN: 'DOWN',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    NONE: 'NONE'
};
const TRANSITION_END_EVENTS = [
    'webkitTransitionEnd',
    'oTransitionEnd',
    'otransitionend',
    'transitionend'
];
const TRANSITION_PROPS = map([
    'transition-property',
    'transition-duration',
    'transition-timing-function'
], prefix);
const TRANSLATE_MATCHER = (/translate3d\((-?\d+\.?\d*)px, 0px, 0px\)/);
const PHASES = {
    START: 'start',
    MOVE: 'move',
    END: 'end'
};
const RESISTANCE_FACTOR = 0.3;
const SNAP_SPEED = 0.25; // seconds
const SNAP_EASING = 'cubic-bezier(0.250, 0.460, 0.450, 0.940)';

function addEventListeners(element, events, handler) {
    forEach(events, event => element.addEventListener(event, handler, false));
}

function removeEventListeners(element, events, handler) {
    forEach(events, event => element.removeEventListener(event, handler, false));
}

function transform(px) {
    this.element.style[prefix('transform')] = `translate3d(${px}px, 0px, 0px)`;
}

const _ = createKey();

function animate(px, duration, easing) {
    const { element } = this;
    const { style } = element;

    style[prefix('transition-property')] = prefix.dash('transform');
    style[prefix('transition-duration')] = `${duration}s`;
    style[prefix('transition-timing-function')] = easing;

    this.reflow();
    transform.call(this, px);

    return new Promise(fulfill => {
        const transitionend = (() => {
            forEach(TRANSITION_PROPS, prop => style[prop] = '');
            removeEventListeners(element, TRANSITION_END_EVENTS, transitionend);
            fulfill();

            Runner.runNext(() => {
                this.animating = false;
                this.emit('animationEnd');
            });
        });

        addEventListeners(element, TRANSITION_END_EVENTS, transitionend);
    });
}

function elementCreatingMethod(method) {
    return function() {
        if (!this.element) { this.create(); }
        return method.call(this, ...arguments);
    };
}

function SwipeableView() {
    _(this).offset = 0;

    this.animating = false;
    this.snapPoints = [];
    this.decelerationRate = -20000; // px/s
    this.bounds = {
        min: -Infinity,
        max: Infinity
    };
}
SwipeableView.prototype = {
    getOffset: function getOffset() {
        const { element } = this;
        if (!element || !element.style[prefix('transform')]) { return 0; }

        return parseFloat(element.style[prefix('transform')].match(TRANSLATE_MATCHER)[1]);
    },

    setOffset: elementCreatingMethod(function setOffset(px) {
        if (this.animating) { this.cancelAnimation(); }
        Runner.scheduleOnce('render', this, transform, [px]);
    }),

    animateOffset: elementCreatingMethod(function animateOffset(px, duration = 1, easing = 'ease') {
        this.animating = true;
        this.emit('animationStart');

        Runner.scheduleOnce('render', this, animate, [px, duration, easing]);
    }),

    cancelAnimation: elementCreatingMethod(function cancelAnimation() {
        const event = document.createEvent('CustomEvent');
        event.initCustomEvent('transitionend');
        this.element.dispatchEvent(event);

        this.element.style[prefix('transform')] = this.element.style[prefix('transform')];
    }),

    validateSnap: function validateSnap(offset) {
        return this.super ? this.super(offset) : offset;
    },

    swipe: function swipe(event) {
        const { snapPoints, bounds: { min, max } } = this;
        const { phase, deltaX, velocityX, directionX } = event;
        const { START, MOVE, END } = PHASES;
        const { LEFT, RIGHT } = DIRECTIONS;
        const offset = phase === START ? this.getOffset() : _(this).offset;
        const desiredPosition = offset + deltaX;
        const modifier = (() => {
            if (desiredPosition > max) {
                return (desiredPosition - max) * RESISTANCE_FACTOR;
            } else if (desiredPosition < min) {
                return (desiredPosition - min) * RESISTANCE_FACTOR;
            }

            return 0;
        }());
        const position = Math.min(max, Math.max(min, desiredPosition)) + modifier;

        if (phase === MOVE) {
            this.setOffset(position);
        } else if (phase === END && snapPoints.length > 0) {
            const velocity = velocityX * 1000; // px/s
            const extraDistance = (-Math.pow(velocity, 2) / (2 * this.decelerationRate)) * (() => {
                switch (directionX) {
                case LEFT:
                    return -1;
                case RIGHT:
                    return 1;
                default:
                    return 0;
                }
            }());
            const scrolledPosition = position + extraDistance;
            const distances = map(snapPoints, point => Math.abs(scrolledPosition - point));
            const snapPoint = this.validateSnap(
                snapPoints[distances.indexOf(Math.min(...distances))]
            );
            const time = Math.max(
                SNAP_SPEED,
                -velocity / this.decelerationRate
            );

            this.animateOffset(snapPoint, time, SNAP_EASING);
        }

        _(this).offset = offset;

        event.original.preventDefault();

        if (this.super) { this.super(event); }
    },

    didInsertElement: function didInsertElement() {
        let swipe = null;
        const { START, END } = PHASES;
        const { UP, DOWN, LEFT, RIGHT, NONE } = DIRECTIONS;

        const touch = (event => {
            const { screenX, screenY } = event.changedTouches[0];
            const time = Date.now();
            const phase = event.type.replace(/^touch/, '');

            if (phase === START) {
                swipe = {
                    lastTime: time,
                    lastVelocityX: 0,
                    lastVelocityY: 0,
                    lastX: screenX,
                    lastY: screenY,
                    directionX: NONE,
                    directionY: NONE,

                    origin: {
                        x: screenX,
                        y: screenY
                    }
                };
            }

            const timeDelta = time - swipe.lastTime;

            if (timeDelta > 0 && phase !== END) {
                const deltaX = screenX - swipe.lastX;
                const deltaY = screenY - swipe.lastY;

                swipe.directionX = (deltaX === 0) ? NONE :
                    (deltaX > 0) ? RIGHT : LEFT;
                swipe.directionY = (deltaY === 0) ? NONE :
                    (deltaY > 0) ? DOWN : UP;

                swipe.lastTime = time;
                swipe.lastX = screenX;
                swipe.lastY = screenY;
                swipe.lastVelocityX = Math.abs(deltaX / timeDelta);
                swipe.lastVelocityY = Math.abs(deltaY / timeDelta);
            }

            Runner.run(() => this.swipe({
                phase,
                directionX: swipe.directionX,
                directionY: swipe.directionY,
                deltaX: screenX - swipe.origin.x,
                deltaY: screenY - swipe.origin.y,
                velocityX: swipe.lastVelocityX,
                velocityY: swipe.lastVelocityY,
                original: event
            }));

            if (phase === END) {
                swipe = null;
            }
        });

        this.element.addEventListener('touchstart', touch, false);
        this.element.addEventListener('touchmove', touch, false);
        this.element.addEventListener('touchend', touch, false);

        return this.super();
    }
};

export default SwipeableView;
