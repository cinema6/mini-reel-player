import ViewController from './ViewController.js';
import playerFactory from '../services/player_factory.js';
import { createKey } from 'private-parts';
import timer from '../../lib/timer.js';

function waitFor(emitter, event, timeout) {
    const aborter = timer.wait(timeout);

    emitter.once(event, () => timer.cancel(aborter));
    return aborter.then(
        () => Promise.reject(new Error(`Timeout out waiting for ${event}.`)),
        () => emitter
    );
}

const _ = createKey();

export default class PrerollCardController extends ViewController {
    constructor(card) {
        super(...arguments);

        _(this).errorOccurred = false;

        this.model = card;
        const player = this.player = playerFactory.playerForCard(card);
        player.src = card.getSrc();
        player.controls = false;

        this.model.on('prepare', () => this.player.load());
        this.model.on('activate', () => {
            if (_(this).errorOccurred) {
                return this.model.abort();
            }

            this.view.show();

            waitFor(this.player, 'play', 5000).catch(() => this.model.abort());
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
