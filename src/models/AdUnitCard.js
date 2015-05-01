import VideoCard from './VideoCard.js';
import environment from '../environment.js';
import {
    reduce
} from '../../lib/utils.js';

export default class AdUnitCard extends VideoCard {
    constructor(card, experience, profile) {
        super(...arguments);

        this.data.type = (profile.flash && card.data.vpaid) ? 'vpaid' : 'vast';
        this.data.videoid = card.data[this.data.type];
    }

    getSrc() {
        const { debug, href, guid } = environment;
        const data = [
            ['pageUrl', debug ? 'mutantplayground.com' : href],
            ['cachebreaker', Date.now()],
            ['guid', guid]
        ];

        return reduce(data, (result, [key, value]) => {
            return result.replace(new RegExp(`{${key}}`, 'g'), encodeURIComponent(value));
        }, this.data.videoid || '');
    }
}
