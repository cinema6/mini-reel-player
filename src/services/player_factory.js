/* #if card.types.indexOf('youtube') > -1 */
import YouTubePlayer from '../players/YouTubePlayer.js';
/* #endif */

/* #if card.types.indexOf('vimeo') > -1 */
import VimeoPlayer from '../players/VimeoPlayer.js';
/* #endif */

/* #if card.types.indexOf('adUnit') > -1 */
import VASTPlayer from '../players/VASTPlayer.js';
import VPAIDPlayer from '../players/VPAIDPlayer.js';
/* #endif */

/* #if card.types.indexOf('dailymotion') > -1 */
import DailymotionPlayer from '../players/DailymotionPlayer.js';
/* #endif */

/* #if card.types.indexOf('slideshow-bob') > -1 */
import SlideshowBobPlayer from '../players/SlideshowBobPlayer.js';
/* #endif */

/* #if card.types.indexOf('vine') > -1 */
import VinePlayer from '../players/VinePlayer.js';
/* #endif */

/* #if card.types.indexOf('instagram') > -1 || card.types.indexOf('htmlvideo') > -1 */
import HtmlVideoPlayer from '../players/HtmlVideoPlayer.js';
/* #endif */

/* #if card.types.indexOf('vzaar') > -1 */
import VzaarPlayer from '../players/VzaarPlayer.js';
/* #endif */

/* #if card.types.indexOf('wistia') > -1 */
import WistiaPlayer from '../players/WistiaPlayer.js';
/* #endif */

/* #if card.types.indexOf('jwplayer') > -1 */
import JWPlayer from '../players/JWPlayer.js';
/* #endif */

/* #if card.types.indexOf('vidyard') > -1 */
import VidyardPlayer from '../players/VidyardPlayer.js';
/* #endif */

/* #if card.types.indexOf('brightcove') > -1 */
import BrightcovePlayer from '../players/BrightcovePlayer.js';
/* #endif */

/* #if card.types.indexOf('kaltura') > -1 */
import KalturaPlayer from '../players/KalturaPlayer.js';
/* #endif */

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
        case 'slideshow-bob':
            return new SlideshowBobPlayer();
        case 'vine':
            return new VinePlayer();
        case 'vzaar':
            return new VzaarPlayer();
        case 'wistia':
            return new WistiaPlayer();
        case 'jwplayer':
            return new JWPlayer();
        case 'vidyard':
            return new VidyardPlayer();
        case 'htmlvideo':
            return new HtmlVideoPlayer();
        case 'brightcove':
            return new BrightcovePlayer();
        case 'kaltura':
            return new KalturaPlayer();
        default:
            throw new TypeError(`Have no Player for VideoCard with type "${card.data.type}".`);
        }
    }
}

export default new PlayerFactory();
