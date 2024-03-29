import BillingHandler from './BillingHandler.js';

export default class VPAIDHandler extends BillingHandler {
    constructor(register, session) {
        const updateState = (state => {
            return session.ping('vpaid:stateUpdated', state);
        });
        const videoCall = ((() => {
            const queue = [];
            let video;

            function flush() {
                let item;
                while ((item = queue.shift())) {
                    video[item.method](...item.args);
                }
            }

            register(({ target }) => {
                video = target;
                flush();
            }, 'video', '@addSource');

            return function videoCall(method, ...args) {
                queue.push({ method, args });

                if (video) { flush(); }
            };
        })());
        const updateAdRemainingTime = (video => {
            if (!video.duration) { return; }
            const value = Math.max(video.duration - video.currentTime, 0);

            updateState({
                prop: 'adRemainingTime',
                value: value,
                event: 'AdRemainingTimeChange'
            });
        });

        super(register);

        // Pause video when vpaid.pauseAd() is called (3.1.6)
        register(() => videoCall('pause'), 'session', 'vpaid:pauseAd');
        // Play video when vpaid.resumeAd() is called (3.1.7)
        register(() => videoCall('play'), 'session', 'vpaid:resumeAd');

        // Emit AdPlaying event after vpaid.resumeAd() is called (3.3.17)
        register(((() => {
            let hasPaused = false;
            videoCall('once', 'pause', () => hasPaused = true);

            return (() => {
                if (hasPaused) {
                    updateState({
                        event: 'AdPlaying'
                    });
                }
            });
        })()), 'video', 'play');
        // Emit AdPaused event after vpaid.pauseAd() is called (3.3.17)
        register(() => updateState({
            event: 'AdPaused'
        }), 'video', 'pause');

        // Emit AdUserClose event after the user closes the player (3.3.16)
        register(() => updateState({
            event: 'AdUserClose'
        }), 'navigation', 'close');
        // Set adSkippableState to false when the card becomes unskippable (3.2.5)
        register(() => updateState({
            prop: 'adSkippableState',
            value: false,
            event: 'AdSkippableStateChange'
        }), 'card', 'becameUnskippable');
        // Set adSkippableState to true when the card becomes skippable (3.2.5)
        register(() => updateState({
            prop: 'adSkippableState',
            value: true,
            event: 'AdSkippableStateChange'
        }), 'card', 'becameSkippable');
        // Emit AdClickThru event when the user clicks on a link (3.3.14)
        register((event, { link: { uri }, type }) => updateState({
            event: 'AdClickThru',
            params: [uri, type, false]
        }), 'card', 'clickthrough');
        // Set adDuration prop when the video duration changes (3.2.7)
        register(({ target: video }) => {
            updateState({ prop: 'adDuration', value: video.duration, event: 'AdDurationChange' });
            updateAdRemainingTime(video);
        }, 'video', 'loadedmetadata');
        // Set adRemainingTime property as playback progresses (3.2.6)
        register(({ target: video }) => updateAdRemainingTime(video), 'video', 'timeupdate');
        // Emit AdVideoFirstQuartile event when the first quartile is reached (3.3.13)
        register(() => updateState({
            event: 'AdVideoFirstQuartile'
        }), 'video', 'firstQuartile');
        // Emit AdVideoMidpoint event when the video midpoint is reached (3.3.13)
        register(() => updateState({
            event: 'AdVideoMidpoint'
        }), 'video', 'midpoint');
        // Emit AdVideoThirdQuartile event when the thirdQuartile is reached (3.3.13)
        register(() => updateState({
            event: 'AdVideoThirdQuartile'
        }), 'video', 'thirdQuartile');
        // Emit AdVideoComplete event when the video is completed (3.3.13)
        register(() => updateState({
            event: 'AdVideoComplete'
        }), 'video', 'complete');
        // Emit AdVideoStart event when the video starts playing (3.3.13)
        this.on('AdStart', (card, video) => {
            if (!video) { return; }

            const update = (() => updateState({ event: 'AdVideoStart' }));

            if (video.duration) { update(); } else { video.once('loadedmetadata', update); }
        });
    }
}
