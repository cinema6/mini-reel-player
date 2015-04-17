import YouTubePlayer from '../players/YouTubePlayer.js';
import VimeoPlayer from '../players/VimeoPlayer.js';
import VASTPlayer from '../players/VASTPlayer.js';
import DailymotionPlayer from '../players/DailymotionPlayer.js';
import EmbeddedPlayer from '../players/EmbeddedPlayer.js';

class PlayerFactory {
    playerForCard(card) {
        switch (card.data.type) {
        case 'youtube':
            return new YouTubePlayer();
        case 'vimeo':
            return new VimeoPlayer();
        case 'adUnit':
            return new VASTPlayer();
        case 'dailymotion':
            return new DailymotionPlayer();
        case 'embedded':
            return new EmbeddedPlayer();

        default:
            throw new TypeError(`Have no Player for VideoCard with type "${card.data.type}".`);
        }
    }
}

export default new PlayerFactory();
