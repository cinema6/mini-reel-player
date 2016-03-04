import ThirdPartyPlayer from './ThirdPartyPlayer.js';
import Player from 'vast-player';
import { createKey } from 'private-parts';
import Runner from '../../lib/Runner.js';
import completeUrl from '../fns/complete_url.js';
import PlayButtonView from '../views/PlayButtonView.js';

const _ = createKey();

Player.vpaidSWFLocation = 'swf/vast-player--vpaid.swf';

export default class VASTPlayer extends ThirdPartyPlayer {
    constructor() {
        super(...arguments);

        _(this).adStarted = false;
        _(this).player = null;
        const playButton = _(this).playButton = new PlayButtonView();

        this.__api__.name = 'VASTPlayer';

        this.__api__.autoplayTest = false;
        this.__api__.singleUse = true;

        this.__api__.loadPlayer = (src => {
            if (_(this).player && !_(this).adStarted) { return _(this).player; }

            _(this).adStarted = false;
            return (_(this).player = new Player(this.element, {
                tracking: { mapper: completeUrl }
            })).load(src).catch(() => {
                _(this).player = null;

                return this.unload();
            });
        });
        this.__api__.onReady = (api => this.__setProperty__('duration', api.adRemainingTime));

        this.__api__.methods.play = (api => {
            if (_(this).adStarted) {
                return api.resumeAd();
            }

            _(this).adStarted = true;
            return api.startAd();
        });
        this.__api__.methods.pause = (api => {
            if (!_(this).adStarted) { return; }

            return api.pauseAd();
        });
        this.__api__.methods.unload = (api => {
            if (!_(this).adStarted || this.ended) { return; }

            return api.stopAd();
        });
        this.__api__.methods.volume = ((api, volume) => api.adVolume = volume);
        this.__api__.methods.addEventListener = ((api, event, handler) => {
            const runHandler = ((...args) => Runner.run(handler, api, ...args));

            api.on(event, runHandler);

            return runHandler;
        });
        this.__api__.methods.removeEventListener = ((api, event, handler) => {
            api.removeListener(event, handler);
        });

        this.__api__.events.AdVideoStart = (() => {
            this.__setProperty__('ended', false);
            this.__setProperty__('paused', false);
        });
        this.__api__.events.AdPaused = (() => {
            this.__setProperty__('paused', true);
        });
        this.__api__.events.AdPlaying = (() => {
            this.__setProperty__('paused', false);
        });
        this.__api__.events.AdVideoComplete = (() => {
            this.__setProperty__('ended', true);
            this.__setProperty__('paused', true);
        });
        this.__api__.events.AdStopped = (() => {
            this.__setProperty__('ended', true);
            this.__setProperty__('paused', true);
        });
        this.__api__.events.AdVolumeChange = (api => {
            this.__setProperty__('volume', api.adVolume);
        });
        this.__api__.events.AdError = ((api, message) => {
            this.__setProperty__('error', new Error(message));
        });
        this.__api__.events.error = ((api, error) => {
            this.__setProperty__('error', error);
        });

        this.__api__.pollingDelay = 250;
        this.__api__.onPoll = ((api) => {
            const { adRemainingTime } = api;
            const { duration } = this;

            if (duration) { this.__setProperty__('currentTime', duration - adRemainingTime); }
        });

        this.on('ended', () => _(this).player = null);

        this.on('play', () => playButton.hide());
        this.on('pause', () => playButton.show());
        playButton.on('press', () => this.play());

        playButton.hide();
    }

    didCreateElement() {
        this.append(_(this).playButton);

        return super.didCreateElement();
    }
}
