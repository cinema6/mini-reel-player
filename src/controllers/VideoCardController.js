import CardController from './CardController.js';
import VideoCardView from '../views/VideoCardView.js';
import YouTubePlayer from '../players/YouTubePlayer.js';
import Runner from '../../lib/Runner.js';
import {createKey} from 'private-parts';

const _ = createKey();

export default class VideoCardController extends CardController {
    constructor() {
        super(...arguments);

        const player = new YouTubePlayer();
        player.poster = this.model.thumbs.large;
        player.src = this.model.data.videoid;

        this.view = new VideoCardView();
        _(this).player = player;

        this.model.on('prepare', () => Runner.schedule('afterRender', () => player.load()));
        this.model.on('activate', () => Runner.schedule('afterRender', () => {
            player[this.model.data.autoplay ? 'play' : 'load']();
        }));
        this.model.on('deactivate', () => {
            player.pause();
            Runner.schedule('afterRender', () => player.unload());
        });
        player.on('ended', () => {
            Runner.schedule('afterRender', () => player.reload());
            this.model.complete();
        });
    }

    render() {
        const card = this.model;

        this.view.update({
            source: card.data.source,
            href: card.data.href,
            sponsor: card.sponsor,
            logo: card.logo,
            showSource: !card.data.hideSource,
            links: card.socialLinks,
            website: card.links.Website,
            action: {
                label: card.action.label,
                href: card.links.Action,
                isButton: card.action.type === 'button',
                isText: card.action.type === 'text'
            }
        });
        this.view.playerOutlet.append(_(this).player);

        return super(...arguments);
    }
}
