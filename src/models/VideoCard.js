import Card from './Card.js';
import timer from '../../lib/timer.js';
import {
    map,
    filter,
    extend
} from '../../lib/utils.js';
import {createKey} from 'private-parts';

const SOCIAL_LINKS = ['Facebook', 'Pinterest', 'Twitter', 'YouTube', 'Vimeo'];

const _ = createKey();

export default class VideoCard extends Card {
    constructor(data, { data: { autoplay = true, autoadvance = true } }) { // jshint ignore:line
        super(...arguments);
        _(this).skip = data.data.skip === undefined ? true : data.data.skip;
        _(this).isUnskippable = _(this).skip !== true;
        _(this).canSkipAfterCountdown = _(this).skip !== false;

        this.type = 'video';
        this.skippable = true;

        this.thumbs = this.thumbs || extend(data.data.thumbs);

        this.campaign = data.campaign;
        this.sponsor = data.params.sponsor;
        this.action = data.params.action || {};
        this.logo = data.collateral.logo;
        this.links = data.links || {};
        this.socialLinks = map(
            filter(
                Object.keys(this.links),
                label => SOCIAL_LINKS.indexOf(label) > -1
            ),
            label => ({ type: label.toLowerCase(), label, href: data.links[label] })
        );
        this.ad = !!data.params.ad;

        this.data = {
            type: data.type,
            source: data.source,
            hideSource: !!data.data.hideSource,
            videoid: data.data.videoid,
            href: data.data.href,
            controls: data.data.controls,
            autoplay: 'autoplay' in data.data ? data.data.autoplay : autoplay,
            autoadvance: 'autoadvance' in data.data ? data.data.autoadvance : autoadvance,
            moat : data.data.moat || null,
            end: data.data.end,
            start: data.data.start
        };
    }

    activate() {
        let {skip} = _(this);
        const {isUnskippable, canSkipAfterCountdown} = _(this);

        if (isUnskippable) {
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
        }

        return super(...arguments);
    }

    complete() {
        super(...arguments);

        if (this.data.autoadvance) {
            this.emit('canAdvance');
        }
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
