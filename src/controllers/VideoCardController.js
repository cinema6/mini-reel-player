import CardController from './CardController.js';
import playerFactory from '../services/player_factory.js';
import dispatcher from '../services/dispatcher.js';
import PostVideoCardController from '../mixins/PostVideoCardController.js';
import BallotVideoCardController from '../mixins/BallotVideoCardController.js';

export default class VideoCardController extends CardController {
    constructor() {
        super(...arguments);

        const player = playerFactory.playerForCard(this.model);
        player.poster = this.model.thumbs.large;
        player.src = this.model.getSrc();
        player.controls = this.model.data.controls;
        player.start = this.model.data.start;
        player.end = this.model.data.end;

        this.player = player;

        dispatcher.addSource('card', this.model, ['activate','deactivate'], player);

        /* VideoCard (model) events. */
        this.model.on('prepare', () =>  {
            if (this.model.data.preload) { player.load(); }
        });
        this.model.on('activate', () => {
            dispatcher.addSource('video', player, [
                'attemptPlay', 'play', 'timeupdate', 'pause', 'ended', 'error',
                'firstQuartile', 'midpoint', 'thirdQuartile', 'complete',
                'loadedmetadata'
            ], this.model);
            if (player.readyState >= 1) {
                player.emit('loadedmetadata');
            }
            player[this.model.data.autoplay ? 'play' : 'load']();
        });
        this.model.on('deactivate', () => {
            player.pause();
            dispatcher.removeSource(player);
        });
        this.model.on('cleanup', () => player.unload());

        /* Player events. */
        player.on('timeupdate', () => {
            const {currentTime, duration} = player;
            if (!duration) { return; }

            this.model.setPlaybackState({ currentTime, duration });
        });
        player.on('ended', () => {
            const { duration } = player;

            this.model.setPlaybackState({ currentTime: duration, duration });
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
            source: card.get('data.source'),
            href: card.get('data.href'),
            sponsor: card.get('sponsor'),
            logo: card.get('logo'),
            showSource: !card.get('data.hideSource'),
            links: card.get('socialLinks'),
            website: card.get('links.Website.uri'),
            action: {
                label: card.get('action.label'),
                href: card.get('links.Action.uri'),
                isButton: card.get('action.type') === 'button',
                isText: card.get('action.type') === 'text'
            },
            canShare: (card.shareLinks && card.shareLinks.length > 0)
        });
        this.view.playerOutlet.append(this.player);

        return super(...arguments);
    }

    shareItemClicked(shareItem, shareLink) {
        const sizes = {
            facebook: {
                w: 570,
                h: 550
            },
            twitter: {
                w: 580,
                h: 250
            },
            pinterest: {
                w: 750,
                h: 550
            }
        };
        const w = sizes[shareLink.type].w;
        const h = sizes[shareLink.type].h;
        const left = (screen.width/2)-(w/2);
        const top = (screen.height/2)-(h/2)-50;
        const title = 'Share to ' + shareLink.type.charAt(0).toUpperCase() +
            shareLink.type.slice(1);
        return window.open(shareLink.href, title,
            `width=${w},height=${h},top=${top},left=${left}`);
    }
}
VideoCardController.mixin(PostVideoCardController, BallotVideoCardController); // jshint ignore:line
