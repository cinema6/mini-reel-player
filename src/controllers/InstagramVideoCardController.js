import HtmlVideoPlayer from '../players/HtmlVideoPlayer.js';
import InstagramCardController from './InstagramCardController.js';

export default class InstagramVideoCardController extends InstagramCardController {
    constructor() {
        super(...arguments);
        const player = new HtmlVideoPlayer();
        player.src = this.model.data.src;
        this.player = player;
    }

    prepare() {
        super();
        if (this.model.data.preload) { this.player.load(); }
    }

    activate() {
        super();
        this.player[this.model.data.autoplay ? 'play' : 'load']();
    }

    render() {
        super();
        this.view.playerOutlet.append(this.player);
    }
}
