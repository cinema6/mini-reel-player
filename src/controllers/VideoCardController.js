import CardController from './CardController.js';
import playerFactory from '../services/player_factory.js';
import dispatcher from '../services/dispatcher.js';
import SponsoredCardController from '../mixins/SponsoredCardController.js';
import environment from '../environment.js';

/* #if card.modules.indexOf('post') > -1 */
import PostVideoCardController from '../mixins/PostVideoCardController.js';
/* #endif */

export default class VideoCardController extends CardController {
    constructor() {
        super(...arguments);

        const player = playerFactory.playerForCard(this.model);
        player.poster = this.model.thumbs.large;
        player.src = this.model.getSrc();
        player.controls = this.model.data.controls;
        player.start = this.model.data.start;
        player.end = this.model.data.end;
        player.prebuffer = !!environment.params.prebuffer;

        this.player = player;

        dispatcher.addSource('card', this.model, [
            'activate', 'deactivate', 'complete',
            'becameUnskippable', 'becameSkippable', 'skippableProgress'
        ], player);
        dispatcher.addSource('video', player, ['buffering'], this.model);

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
            const { currentTime, duration, paused } = player;
            if (!duration) { return; }

            this.model.setPlaybackState({ currentTime, duration, paused });
        });
        player.on('ended', () => {
            const { duration } = player;

            this.model.setPlaybackState({ currentTime: duration, duration });
            if (player.minimize() instanceof Error) { player.reload(); }
            if (this.canAutoadvance()) { this.model.complete(); }
        });

        /* #if card.modules.indexOf('post') > -1 */
        this.initPost();
        /* #endif */
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
            showSource: !card.get('data.hideSource'),
            links: card.get('socialLinks'),
            website: {
                label: 'Website',
                href: card.get('links.Website.uri'),
                logo: card.get('logo'),
                text: card.get('sponsor')
            },
            action: {
                label: 'Action',
                href: card.get('links.Action.uri'),
                text: card.get('action.label'),
                isButton: card.get('action.type') === 'button',
                isText: card.get('action.type') === 'text'
            },
            videoOnly: !(
                card.title || card.note || card.logo || Object.keys(card.links).length > 0||
                    Object.keys(card.shareLinks).length > 0 || card.action.label
            ),
            canShare: (card.shareLinks && card.shareLinks.length > 0)
        });
        this.view.playerOutlet.append(this.player);

        return super.render(...arguments);
    }
}
VideoCardController.mixin(// jshint ignore:line
    /* #if card.modules.indexOf('post') > -1 */
    PostVideoCardController,
    /* #endif */

    SponsoredCardController
);
