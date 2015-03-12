import {createKey} from 'private-parts';
import {
    map,
    filter
} from '../../lib/utils.js';

function toPreferMP4s(a, b) {
    if (a[0] === 'video/mp4') {
        return -1;
    }

    if (b[0] === 'video/mp4') {
        return 1;
    }

    return 0;
}

const _ = createKey();

class Media {
    constructor() {
        _(this).video = document.createElement('video');
        _(this).supportsHTML5Video = 'canPlayType' in _(this).video;
    }

    bestVideoFormat(types) {
        const {video, supportsHTML5Video} = _(this);

        if (!supportsHTML5Video) { return null; }

        const results = map(types, type => [type, video.canPlayType(type)]).sort(toPreferMP4s);
        const greatFormats = filter(results, result => result[1] === 'probably');
        const goodFormats = filter(results, result => result[1] === 'maybe');

        const best = (greatFormats[0] || [])[0];
        const okay = (goodFormats[0] || [])[0];

        return best || okay || null;
    }
}

export default new Media();
