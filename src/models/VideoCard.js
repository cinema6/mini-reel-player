import Card from './Card.js';
import SponsoredCard from '../mixins/SponsoredCard.js';
import {
    extend
} from '../../lib/utils.js';
import {createKey} from 'private-parts';

const _ = createKey();

class VideoCard extends Card {
    constructor(data, { data: { autoplay = true, autoadvance = true, preloadVideos = true } }) { // jshint ignore:line
        super(...arguments);
        _(this).skip = (data.data.skip === undefined || data.data.skip === true) ?
            0 : (data.data.skip === false || data.data.skip === -1 ? Infinity : data.data.skip);

        this.type = 'video';
        this.skippable = true;

        this.thumbs = this.thumbs || extend(data.data.thumbs);

        this.data = {
            type: data.type,
            source: data.source,
            hideSource: !!data.data.hideSource,
            videoid: data.data.videoid,
            href: data.data.href,
            controls: data.data.controls,
            autoplay: 'autoplay' in data.data ? data.data.autoplay : autoplay,
            autoadvance: 'autoadvance' in data.data ? data.data.autoadvance : autoadvance,
            preload: 'preload' in data.data ? data.data.preload : preloadVideos,
            moat : data.data.moat || null,
            end: data.data.end,
            start: data.data.start
        };

        this.reset();
    }

    getSrc() {
        return this.data.videoid;
    }

    activate() {
        if (this.hasSkipControl) {
            this.skippable = false;
            this.emit('becameUnskippable');

            this.once('becameSkippable', () => this.hasSkipControl = false);
        }

        return super.activate(...arguments);
    }

    complete() {
        super.complete(...arguments);
        const advance = (() => this.emit('canAdvance'));

        if (this.data.autoadvance) {
            if (this.skippable) { advance(); } else { this.once('becameSkippable', advance); }
        }
    }

    reset() {
        this.hasSkipControl = _(this).skip !== 0;
        return super.reset();
    }

    abort() {
        if (!this.skippable) {
            this.skippable = true;
            this.emit('becameSkippable');
        }

        return super.abort();
    }

    setPlaybackState({ currentTime, duration }) {
        if (this.skippable) { return; }

        const { skip } = _(this);
        const remaining = Math.round(Math.min(skip, duration) - currentTime);

        this.emit('skippableProgress', remaining);
        if (remaining < 1) {
            this.skippable = true;
            this.emit('becameSkippable');
        }
    }
}
VideoCard.mixin(SponsoredCard);

export default VideoCard;
