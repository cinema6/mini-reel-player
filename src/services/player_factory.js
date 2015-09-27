import YouTubePlayer from '../players/YouTubePlayer.js';
import VimeoPlayer from '../players/VimeoPlayer.js';
import VASTPlayer from '../players/VASTPlayer.js';
import VPAIDPlayer from '../players/VPAIDPlayer.js';
import DailymotionPlayer from '../players/DailymotionPlayer.js';
import EmbeddedPlayer from '../players/EmbeddedPlayer.js';
import RumblePlayer from '../players/RumblePlayer.js';
import SlideshowBobPlayer from '../players/SlideshowBobPlayer.js';
import VinePlayer from '../players/VinePlayer.js';
import HtmlVideoPlayer from '../players/HtmlVideoPlayer.js';
import VzaarPlayer from '../players/VzaarPlayer.js';
import WistiaPlayer from '../players/WistiaPlayer.js';

class PlayerFactory {
    playerForCard(card) {
        if(card.type === 'instagramVideo') {
            return new HtmlVideoPlayer();
        }
        switch (card.data.type) {
        case 'youtube':
            return new YouTubePlayer();
        case 'vimeo':
            return new VimeoPlayer();
        case 'vast':
            return new VASTPlayer();
        case 'vpaid':
            return new VPAIDPlayer();
        case 'dailymotion':
            return new DailymotionPlayer();
        case 'embedded':
            return new EmbeddedPlayer();
        case 'rumble':
            return new RumblePlayer();
        case 'slideshow-bob':
            return new SlideshowBobPlayer();
        case 'vine':
            return new VinePlayer();
        case 'vzaar':
            return new VzaarPlayer();
        case 'wistia':
            return new WistiaPlayer();
        default:
            throw new TypeError(`Have no Player for VideoCard with type "${card.data.type}".`);
        }
    }
}

export default new PlayerFactory();
