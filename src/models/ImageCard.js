import Card from './Card.js';

export default class ImageCard extends Card {
    constructor(data) {
        super(...arguments);

        this.type = 'image';
        if(data.data.thumbs) {
            this.thumbs = {
                small: data.data.thumbs.small,
                large: data.data.thumbs.large
            };
        }
        this.data = {
            service: data.data.service,
            imageid: data.data.imageid,
            src: data.data.src,
            width: data.data.width,
            height: data.data.height,
            href: data.data.href,
            source: data.data.source
        };
    }
}
