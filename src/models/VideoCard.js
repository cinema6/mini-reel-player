import Card from './Card.js';
import timer from '../../lib/timer.js';
import SponsoredCard from '../mixins/SponsoredCard.js';
import {
    extend
} from '../../lib/utils.js';
import {createKey} from 'private-parts';

const _ = createKey();

class VideoCard extends Card {
    constructor(data, { data: { autoplay = true, autoadvance = true, preloadVideos = true } }) { // jshint ignore:line
        super(...arguments);
        _(this).skip = data.data.skip === undefined ? true : data.data.skip;
        _(this).canSkipAfterCountdown = _(this).skip !== false;

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
        let {skip} = _(this);
        const { canSkipAfterCountdown } = _(this);

        if (this.hasSkipControl) {
            this.skippable = false;
            this.emit('becameUnskippable');

            if (canSkipAfterCountdown) {
                this.emit('skippableProgress', skip);

                const interval = timer.interval(() => {
                    const remaining = --skip;

                    this.emit('skippableProgress', remaining);

                    if (remaining < 1) {
                        timer.cancel(interval);
                    }
                }, 1000);

                interval.then(() => {
                    this.skippable = true;
                    this.emit('becameSkippable');
                });
            }

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
        this.hasSkipControl = _(this).skip !== true;
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
        const {canSkipAfterCountdown} = _(this);
        if (this.skippable || canSkipAfterCountdown) { return; }

        const remaining = Math.round(duration - currentTime);

        this.emit('skippableProgress', remaining);
        if (remaining < 1) {
            this.skippable = true;
            this.emit('becameSkippable');
        }
    }
}
VideoCard.mixin(SponsoredCard);

export default VideoCard;
