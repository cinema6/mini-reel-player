import CardController from './CardController.js';
import VideoCardView from '../views/VideoCardView.js';
import Runner from '../../lib/Runner.js';
import playerFactory from '../services/player_factory.js';
import module from '../services/module.js';
import {createKey} from 'private-parts';
import dispatcher from '../services/dispatcher.js';
import {
    forEach
} from '../../lib/utils.js';

const _ = createKey();

export default class VideoCardController extends CardController {
    constructor() {
        super(...arguments);

        const player = playerFactory.playerForCard(this.model);
        player.poster = this.model.thumbs.large;
        player.src = this.model.data.videoid;
        player.controls = this.model.data.controls;

        this.view = new VideoCardView();
        this.moduleControllers = module.getControllers(this.model.modules);

        /* Module events. */
        const {
            displayAd: DisplayAdCtrl
        } = this.moduleControllers;

        if (DisplayAdCtrl) {
            DisplayAdCtrl.on('activate', () => {
                this.view.playerOutlet.hide();
                this.view.replayContainer.show();
            });
            DisplayAdCtrl.on('deactivate', () => {
                this.view.playerOutlet.show();
                this.view.replayContainer.hide();
            });
        }

        /* VideoCard (model) events. */
        this.model.on('prepare', () =>  player.load());
        this.model.on('activate', () => {
            player[this.model.data.autoplay ? 'play' : 'load']();
            dispatcher.addSource('video', player, [
                'play', 'timeupdate', 'pause', 'ended', 'error',
                'firstQuartile', 'midpoint', 'thirdQuartile', 'complete'
            ], this.model);
        });
        this.model.on('deactivate', () => {
            player.pause();
            Runner.schedule('afterRender', () => player.unload());
            dispatcher.removeSource(player);
        });

        /* Player events. */
        player.on('play', () => {
            if (DisplayAdCtrl) { DisplayAdCtrl.deactivate(); }
        });
        player.on('ended', () => {
            const {displayAd} = this.model.modules;

            if (player.minimize() instanceof Error) { player.reload(); }

            if (displayAd && !displayAd.isDefault) {
                DisplayAdCtrl.activate();
            } else {
                this.model.complete();
            }
        });

        /* View events. */
        this.view.on('replay', () => {
            player.play();

            if (DisplayAdCtrl) {
                DisplayAdCtrl.deactivate();
            }
        });

        dispatcher.addSource('card', this.model, ['activate'], player);

        _(this).player = player;
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
        forEach(Object.keys(this.moduleControllers), type => {
            this.moduleControllers[type].renderInto(this.view.moduleOutlets[type]);
        });

        return super(...arguments);
    }
}
