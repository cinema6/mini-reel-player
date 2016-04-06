import moatApi from '../services/moat.js';
import environment from '../environment.js';

function ignoreError(fn) {
    try { return fn(); } catch(e) { return undefined; }
}

export default class MoatHandler {
    constructor(register) {
        const site = environment.hostname;
        const { container, placement } = environment.params;

        function moatEvent(evtType,player){
            var vol = player.volume;
            if (!!player.muted) {
                vol = 0;
            }
            return { type : evtType, adVolume : vol };
        }

        register(({ target: player, data: card }) => ignoreError(() => {
            if (!card.data.moat) {
                return;
            }

            const ids = {
                level1  : card.sponsor,
                level2  : card.data.moat.campaign,
                level3  : card.data.moat.creative,
                slicer1 : site,
                slicer2 : placement || container
            };
            moatApi.initTracker(card.id,player.element,ids,player.duration);
        }), 'video', 'loadedmetadata');

        register(({ target: card, data: player}) => ignoreError(() => {
            moatApi.dispatchEvent(card.id,moatEvent('AdStopped',player));
        }), 'card', 'deactivate');

        register(({ target: player, data: card }) => ignoreError(() => {
            moatApi.dispatchEvent(card.id,moatEvent('AdVideoStart',player));
        }), 'video', 'play');

        register(({ target: player, data: card }) => ignoreError(() => {
            moatApi.dispatchEvent(card.id,moatEvent('AdVideoFirstQuartile',player));
        }), 'video', 'firstQuartile');

        register(({ target: player, data: card }) => ignoreError(() => {
            moatApi.dispatchEvent(card.id,moatEvent('AdVideoMidpoint',player));
        }), 'video', 'midpoint');

        register(({ target: player, data: card }) => ignoreError(() => {
            moatApi.dispatchEvent(card.id,moatEvent('AdVideoThirdQuartile',player));
        }), 'video', 'thirdQuartile');

        register(({ target: player, data: card }) => ignoreError(() => {
            moatApi.dispatchEvent(card.id,moatEvent('AdVideoComplete',player));
        }), 'video', 'complete');

        // AdPaused
        // AdPlaying
        // AdVolumeChange
    }
}
