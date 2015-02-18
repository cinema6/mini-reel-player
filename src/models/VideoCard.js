import Card from './Card.js';

export default class VideoCard extends Card {
    constructor(data) {
        super(...arguments);

        this.type = 'video';

        this.data = {
            type: data.type,
            source: data.source,
            videoid: data.data.videoid,
            href: data.data.href
        };
    }
}
