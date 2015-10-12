import RunnerPromise from '../../lib/RunnerPromise.js';
import timer from '../../lib/timer.js';
import { createKey } from 'private-parts';
import { map, reduce } from '../../lib/utils.js';

const _ = createKey();

class Browser {
    constructor() {
        _(this).tests = {};

        if (global.__karma__) { this.__private__ = _(this); }
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

    getProfile(timeout = 10) {
        return RunnerPromise.all(map(Object.keys(_(this).tests), feature => Promise.race([
            timer.wait(timeout).then(() => [feature, undefined]),
            this.test(feature).then(result => [feature, result])
        ]))).then(results => reduce(results, (profile, [feature, result]) => {
            if (result !== undefined) { profile[feature] = result; }
            return profile;
        }, {}));
    }
}

export default new Browser();
