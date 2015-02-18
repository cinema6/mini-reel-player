import animator from '../../lib/animator.js';
import TimelineLite from 'gsap/src/uncompressed/TimelineLite.js';

function getOrientation() {
    if (window.innerHeight > window.innerWidth) {
        return 'portrait';
    }

    return 'landscape';
}

const animations = {
    navbar: {
        show(view, done) {
            const {element} = view;
            const prop = getOrientation() === 'portrait' ? 'y' : 'x';

            (new TimelineLite()).set(element, { display: '', [prop]: '-100%' })
                .to(element, 0.5, { [prop]: '0%', force3D: true })
                .set(element, { clearProps: 'transform' })
                .call(done);
        },

        hide(view, done) {
            const {element} = view;
            const prop = getOrientation() === 'portrait' ? 'y' : 'x';

            this.shown = false;

            (new TimelineLite()).to(element, 0.5, { [prop]: '-100%', force3D: true })
                .set(element, { clearProps: 'transform', display: 'none' })
                .call(done);
        }
    },

    toc: {
        shown: false,

        show(view, done) {
            const {element} = view;
            const prop = getOrientation() === 'portrait' ? 'y' : 'x';

            element.style.display = '';

            this.shown = true;

            const tl = new TimelineLite();

            tl.set(element, { [prop]: '100%' })
                .to(element, 0.5, { [prop]: '0%', force3D: true })
                .set(element, { clearProps: 'transform' })
                .call(done);
        },

        hide(view, done) {
            if (!this.shown) { return done(); }

            const tl = new TimelineLite();
            const prop = getOrientation() === 'portrait' ? 'y' : 'x';

            this.shown = false;

            tl.to(view.element, 0.5, { [prop]: '100%', force3D: true })
                .set(view.element, { clearProps: 'transform', display: 'none' })
                .call(done);
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
