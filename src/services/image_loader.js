import RunnerPromise from '../../lib/RunnerPromise.js';
import {
    map
} from '../../lib/utils.js';

class ImageLoader {
    load(...srcs) {
        return RunnerPromise.all(map(srcs, src => {
            return new Promise((fulfill, reject) => {
                const img = new Image();

                img.onload = (() => fulfill(img));
                img.onerror = (() => reject([img]));

                img.src = src;
            });
        }));
    }
}

export default new ImageLoader();
