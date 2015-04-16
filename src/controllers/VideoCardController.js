import CardController from './CardController.js';
import Runner from '../../lib/Runner.js';
import playerFactory from '../services/player_factory.js';
import dispatcher from '../services/dispatcher.js';
import PostVideoCardController from '../mixins/PostVideoCardController.js';
import BallotVideoCardController from '../mixins/BallotVideoCardController.js';

export default class VideoCardController extends CardController {
    constructor() {
        super(...arguments);

        const player = playerFactory.playerForCard(this.model);
        player.poster = this.model.thumbs.large;
        player.src = this.model.data.videoid;
        player.controls = this.model.data.controls;
        player.start = this.model.data.start;
        player.end = this.model.data.end;

        this.player = player;

        dispatcher.addSource('card', this.model, ['activate','deactivate'], player);

        /* VideoCard (model) events. */
        this.model.on('prepare', () =>  player.load());
        this.model.on('activate', () => {
            player[this.model.data.autoplay ? 'play' : 'load']();
            dispatcher.addSource('video', player, [
                'play', 'timeupdate', 'pause', 'ended', 'error',
                'firstQuartile', 'midpoint', 'thirdQuartile', 'complete',
                'loadedmetadata'
            ], this.model);
            if (player.readyState >= 1) {
                player.emit('loadedmetadata');
            }
        });
        this.model.on('deactivate', () => {
            player.pause();
            Runner.schedule('afterRender', player, 'unload');
            dispatcher.removeSource(player);
        });

        /* Player events. */
        player.on('timeupdate', () => {
            const {currentTime, duration} = player;
            if (!duration) { return; }

            this.model.setPlaybackState({ currentTime, duration });
        });
        player.on('ended', () => {
            if (player.minimize() instanceof Error) { player.reload(); }
            if (this.canAutoadvance()) { this.model.complete(); }
        });

        this.initPost();
        this.initBallot();
    }

    canAutoadvance() {
        return true;
    }

    replay() {
        this.player.play();
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
        this.view.playerOutlet.append(this.player);

        return super(...arguments);
    }
}
VideoCardController.mixin(PostVideoCardController, BallotVideoCardController); // jshint ignore:line
