import Card from './Card.js';
import SponsoredCard from '../mixins/SponsoredCard';
import { createKey } from 'private-parts';
import timer from '../../lib/timer.js';

const _ = createKey();

export default class ShowcaseCard extends Card {
    constructor(card) {
        super(...arguments);

        _(this).skip = card.data.skip;

        this.type = 'showcase';

        this.skippable = true;
    }

    abort() {
        if (!this.skippable) {
            this.skippable = true;
            this.emit('becameSkippable');
        }

        return super.abort(...arguments);
    }

    activate() {
        const { skip } = _(this);

        if (skip > 0) {
            const progress = remaining => {
                if (this.skippable) { return; }

                this.emit('skippableProgress', remaining);

                if (remaining > 0) {
                    _(this).timer = timer.wait(1000).then(() => progress(remaining - 1));
                } else {
                    this.skippable = true;
                    this.emit('becameSkippable');
                }
            };

            this.skippable = false;
            this.emit('becameUnskippable');
            progress(skip);
        }

        return super.activate(...arguments);
    }
}
ShowcaseCard.mixin(SponsoredCard);
