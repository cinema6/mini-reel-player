import HtmlVideoPlayer from '../players/HtmlVideoPlayer.js';
import InstagramCardController from './InstagramCardController.js';
import { createKey } from 'private-parts';

const _ = createKey();

export default class InstagramVideoCardController extends InstagramCardController {
    constructor() {
        super(...arguments);
        const player = new HtmlVideoPlayer();
        player.src = this.model.data.src;
        player.loop = true;
        _(this).player = player;

        if (global.__karma__) { this.__private__ = _(this); }
    }

    prepare() {
        super();
        if (this.model.data.preload) {
            _(this).player.load();
        }
    }

    activate() {
        super();
        _(this).player.load();
        if(this.model.data.autoplay) {
            _(this).player.play();
        }
    }

    render() {
        super();
        this.view.playerOutlet.append(_(this).player);
    }
}
