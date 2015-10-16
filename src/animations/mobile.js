import animator from '../../lib/animator.js';
import {
    select,
    set,
    transition,
    many
} from 'moti.js';

function getOrientation() {
    if (window.innerHeight > window.innerWidth) {
        return 'portrait';
    }

    return 'landscape';
}

function getTransformValue(offset) {
    if (getOrientation() === 'portrait') {
        return `translate3d(0px, ${offset}, 0)`;
    } else {
        return `translate3d(${offset}, 0px, 0)`;
    }
}

function isHidden(element) {
    return window.getComputedStyle(element).display === 'none';
}

function rejectIf(predicate, reason) {
    return function test(element) {
        if (predicate(element)) {
            return Promise.reject(new Error(reason));
        } else {
            return element;
        }
    };
}

const animations = {
    navbar: {
        shown: true,

        show(view, done) {
            const { element } = view;

            select(element)
                .then(many([set('display', ''), set('transform', getTransformValue('-100%'))]))
                .then(rejectIf(isHidden, 'Element is hidden.'))
                .then(transition('transform', getTransformValue('0%'), 0.5))
                .then(set('transform', ''))
                .finally(done);
        },

        hide(view, done) {
            const { element } = view;

            this.shown = false;

            select(element)
                .then(rejectIf(isHidden, 'Element is hidden.'))
                .then(transition('transform', getTransformValue('-100%'), 0.5))
                .then(many([set('transform', ''), set('display', 'none')]))
                .finally(done);
        }
    },

    toc: {
        shown: false,

        show(view, done) {
            const { element } = view;

            this.shown = true;

            select(element)
                .then(many([set('display', ''), set('transform', getTransformValue('100%'))]))
                .then(transition('transform', getTransformValue('0%'), 0.5))
                .then(set('transform', ''))
                .finally(done);
        },

        hide(view, done) {
            const { element } = view;
            if (!this.shown) { return done(); }

            select(element)
                .then(transition('transform', getTransformValue('100%'), 0.5))
                .then(many([set('transform', ''), set('display', 'none')]))
                .finally(done);
        }
    }
};

function proxy(method) {
    return function(view, done) {
        const animation = animations[view.id];

        if (animation && animation[method]) {
            return animation[method](view, done);
        }

        return done();
    };
}

animator.on('view:show', proxy('show'));
animator.on('view:hide', proxy('hide'));
