import ViewController from './ViewController.js';
import VASTPlayer from '../players/VASTPlayer.js';
import environment from '../environment.js';
import { createKey } from 'private-parts';

function parseTag(tag = '') {
    const pageUrl = environment.debug ? 'mutantplayground.com' : environment.href;
    const cachebreaker = Date.now();

    return tag.replace('{cachebreaker}', cachebreaker)
        .replace('{pageUrl}', encodeURIComponent(pageUrl));
}

const _ = createKey();

export default class PrerollCardController extends ViewController {
    constructor(card) {
        super(...arguments);

        _(this).errorOccurred = false;

        this.model = card;
        const player = this.player = new VASTPlayer();
        player.src = parseTag(card.data.videoid);
        player.controls = false;

        this.model.on('prepare', () => this.player.load());
        this.model.on('activate', () => {
            if (_(this).errorOccurred) {
                return this.model.abort();
            }

            this.view.show();
            this.player.play();
        });
        this.model.on('deactivate', () => {
            _(this).errorOccurred = false;
            this.view.hide();
            this.player.unload();
        });

        player.on('timeupdate', () => {
            const { currentTime, duration } = this.player;
            if (!duration) { return; }

            this.model.setPlaybackState({ currentTime, duration });
        });
        player.on('ended', () => this.model.complete());
        player.on('error', () => {
            _(this).errorOccurred = true;
            this.model.abort();
        });
    }

    renderInto(view) {
        this.view.hide();
        super(view);
        this.view.playerOutlet.append(this.player);
    }
}
