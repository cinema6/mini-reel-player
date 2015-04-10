import CardController from './CardController.js';
import Runner from '../../lib/Runner.js';
import playerFactory from '../services/player_factory.js';
import moduleService from '../services/module.js';
import dispatcher from '../services/dispatcher.js';
import {
    forEach
} from '../../lib/utils.js';

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
        this.moduleControllers = moduleService.getControllers(this.model.modules);

        dispatcher.addSource('card', this.model, ['activate','deactivate'], player);

        /* Module events. */
        const {
            post: PostCtrl
        } = this.moduleControllers;

        if (PostCtrl) {
            PostCtrl.on('activate', () => this.view.playerOutlet.hide());
            PostCtrl.on('deactivate', () => this.view.playerOutlet.show());
            PostCtrl.on('replay', () => player.play());
        }

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
            if (PostCtrl) { PostCtrl.deactivate(); }
            player.pause();
            Runner.schedule('afterRender', () => player.unload());
            dispatcher.removeSource(player);
        });

        /* Player events. */
        player.on('play', () => {
            if (PostCtrl) { PostCtrl.deactivate(); }
        });
        player.on('timeupdate', () => {
            const {currentTime, duration} = player;
            if (!duration) { return; }

            this.model.setPlaybackState({ currentTime, duration });
        });
        player.on('ended', () => {
            const { post } = this.model.modules;

            if (player.minimize() instanceof Error) { player.reload(); }

            if (post) {
                PostCtrl.activate();
            }

            if (this.canAutoadvance()) { this.model.complete(); }
        });
    }

    canAutoadvance() {
        return !('post' in this.moduleControllers);
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
        forEach(Object.keys(this.moduleControllers), type => {
            const outlet = this.view.moduleOutlets[type];
            const Ctrl = this.moduleControllers[type];

            if (outlet) { Ctrl.renderInto(outlet); }
        });

        return super(...arguments);
    }
}
