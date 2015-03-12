import YouTubePlayer from '../players/YouTubePlayer.js';
import VASTPlayer from '../players/VASTPlayer.js';

class PlayerFactory {
    playerForCard(card) {
        switch (card.data.type) {
        case 'youtube':
            return new YouTubePlayer();
        case 'adUnit':
            return new VASTPlayer();

        default:
            throw new TypeError(`Have no Player for VideoCard with type "${card.data.type}".`);
        }
    }
}

export default new PlayerFactory();
