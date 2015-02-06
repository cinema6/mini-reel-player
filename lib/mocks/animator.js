import animator from '../animator.js';
const Animator = animator.constructor;
import {createKey} from 'private-parts';

const _ = createKey();

function defer() {
    let fulfill, reject;
    const promise = new Promise((_fulfill, _reject) => {
        fulfill = _fulfill;
        reject = _reject;
    });

    return { fulfill, reject, promise };
}

class MockAnimator extends Animator {
    constructor() {
        super();

        _(this).deferreds = {};
    }

    trigger(event) {
        const deferred = defer();
        const {deferreds} = _(this);

        (deferreds[event] || (deferreds[event] = [])).push(deferred);

        return deferred.promise;
    }

    flush(event) {
        const deferreds = _(this).deferreds[event];
        const promise = Promise.all(deferreds.map(deferred => deferred.promise));

        deferreds.forEach(deferred => deferred.fulfill());
        deferreds.length = 0;

        return promise;
    }
}

export default new MockAnimator();
