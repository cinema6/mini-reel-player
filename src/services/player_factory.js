import YouTubePlayer from '../players/YouTubePlayer.js';
import VimeoPlayer from '../players/VimeoPlayer.js';
import VASTPlayer from '../players/VASTPlayer.js';
import VPAIDPlayer from '../players/VPAIDPlayer.js';
import DailymotionPlayer from '../players/DailymotionPlayer.js';
import EmbeddedPlayer from '../players/EmbeddedPlayer.js';
import RumblePlayer from '../players/RumblePlayer.js';

class PlayerFactory {
    playerForCard(card) {
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

        default:
            throw new TypeError(`Have no Player for VideoCard with type "${card.data.type}".`);
        }
    }
}

export default new PlayerFactory();
