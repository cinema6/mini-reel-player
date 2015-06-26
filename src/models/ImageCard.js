import Card from './Card.js';

export default class ImageCard extends Card {
    constructor(data) {
        super(...arguments);

        this.type = 'image';
        this.thumbs = {
            small: data.data.thumbs.small,
            large: data.data.thumbs.large
        };
        this.data = {
            service: data.data.service,
            imageid: data.data.imageid,
            href: data.data.href,
            width: data.data.width,
            height: data.data.height
        };
    }

    complete() {
        this.emit('canAdvance');
        return super();
    }
}