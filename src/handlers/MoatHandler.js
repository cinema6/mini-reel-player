import moatApi from '../services/moat.js';
import environment from '../environment.js';

export default class MoatHandler {
    constructor(register,config ) {
        const { container } = config;
        const site = environment.hostname;

        function moatEvent(evtType,player){
            return { type : evtType, adVolume : player.volume };
        }

        register(({ target: player, data: card }) => {
            if (!card.data.moat) {
                return;
            }
            
            const ids = {
                level1  : card.sponsor,
                level2  : card.data.moat.campaign,
                level3  : card.data.moat.creative,
                slicer1 : site,
                slicer2 : container
            };
            moatApi.initTracker(card.id,player.element,ids,player.duration);
        }, 'video', 'loadedmetadata');
        
        register(({ target: card, data: player}) => {
            moatApi.dispatchEvent(card.id,moatEvent('AdStopped',player));
        }, 'card', 'deactivate');
       
        register(({ target: player, data: card }) => {
            moatApi.dispatchEvent(card.id,moatEvent('AdVideoStart',player));
        }, 'video', 'play');

        register(({ target: player, data: card }) => {
            moatApi.dispatchEvent(card.id,moatEvent('AdVideoFirstQuartile',player));
        }, 'video', 'firstQuartile');
        
        register(({ target: player, data: card }) => {
            moatApi.dispatchEvent(card.id,moatEvent('AdVideoMidpoint',player));
        }, 'video', 'midpoint');
        
        register(({ target: player, data: card }) => {
            moatApi.dispatchEvent(card.id,moatEvent('AdVideoThirdQuartile',player));
        }, 'video', 'thirdQuartile');
        
        register(({ target: player, data: card }) => {
            moatApi.dispatchEvent(card.id,moatEvent('AdVideoComplete',player));
        }, 'video', 'complete');

        // AdPaused
        // AdPlaying
        // AdVolumeChange
    }
}
