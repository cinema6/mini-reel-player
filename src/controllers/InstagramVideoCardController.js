import InstagramCardController from './InstagramCardController.js';
import { createKey } from 'private-parts';
import playerFactory from '../services/player_factory.js';

const _ = createKey();

export default class InstagramVideoCardController extends InstagramCardController {
    constructor() {
        super(...arguments);
        const player = playerFactory.playerForCard(this.model);
        player.src = this.model.data.src;
        player.loop = true;
        _(this).player = player;

        if (global.__karma__) { this.__private__ = _(this); }
    }

    prepare() {
        super.prepare();
        if (this.model.data.preload) {
            _(this).player.load();
        }
    }

    activate() {
        super.activate();
        if(this.model.data.autoplay) {
            _(this).player.play();
        } else {
            _(this).player.load();
        }
    }

    deactivate() {
        super.deactivate();
        _(this).player.pause();
    }

    render() {
        super.render();
        this.view.playerOutlet.append(_(this).player);
    }
}
