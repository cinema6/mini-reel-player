import Card from './Card.js';

export default class InstagramVideoCard extends Card {
    constructor(data) {
        super(...arguments);
        this.type = 'instagramVideo';
    }
}
