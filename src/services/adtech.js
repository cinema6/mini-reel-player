import codeLoader from './code_loader.js';
import environment from '../environment.js';
import {createKey} from 'private-parts';
import {
    extend
} from '../../lib/utils.js';

const _ = createKey();

codeLoader.configure('adtech', {
    src: '//aka-cdn.adtechus.com/dt/common/DAC.js',
    after() { return global.ADTECH; }
});

class ADTECH {
    constructor() {
        _(this).defaults = {};
    }

    load(config) {
        return codeLoader.load('adtech').then(adtech => {
            return new Promise(fulfill => {
                adtech.loadAd(extend(_(this).defaults, config, {
                    secure: environment.secure,
                    debugMode: environment.debug,
                    complete: fulfill
                }));
            });
        });
    }

    setDefaults(defaults) {
        _(this).defaults = defaults;
    }
}

export default new ADTECH();
