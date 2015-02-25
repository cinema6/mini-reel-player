import RunnerPromise from '../../lib/RunnerPromise.js';
import {createKey} from 'private-parts';

const _ = createKey();

class Browser {
    constructor() {
        _(this).tests = {};
    }

    test(feature, force = false) {
        const config = _(this).tests[feature];

        if (!config) {
            return RunnerPromise.reject(new Error(`Unknown feature test [${feature}].`));
        }

        const { tester, result } = config;

        return (!force && result) || (config.result = RunnerPromise.resolve(tester())
            .then(result => Boolean(result), () => false));
    }

    addTest(feature, tester) {
        _(this).tests[feature] = { tester, result: null };
        return this;
    }
}

export default new Browser();
