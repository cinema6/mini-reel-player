import imageLoader from '../services/image_loader.js';

export default class ADTECHHandler {
    constructor(register) {
        this.cache = {};

        const getHistory = (card => this.cache[card.id] || (this.cache[card.id] = {
            click: false,
            count: false
        }));

        register(event => {
            const card = event.data;
            const {clickUrls} = card.campaign;
            const history = getHistory(card);

            if (clickUrls && !history.click) {
                imageLoader.load(...clickUrls);
                history.click = true;
            }
        }, 'video', 'play');

        register(event => {
            const card = event.data;
            const {countUrls, minViewTime} = card.campaign;
            const history = getHistory(card);

            if (minViewTime > -1 || !countUrls) { return; }

            if (!history.count) {
                imageLoader.load(...countUrls);
                history.count = true;
            }
        }, 'video', 'complete');

        register(event => {
            const card = event.data;
            const {countUrls, minViewTime} = card.campaign;

            if (minViewTime < 1 || !countUrls) { return; }

            const history = getHistory(card);
            const player = event.target;
            const {currentTime} = player;

            if (currentTime >= minViewTime && !history.count) {
                imageLoader.load(...countUrls);
                history.count = true;
            }
        }, 'video', 'timeupdate');
    }
}
