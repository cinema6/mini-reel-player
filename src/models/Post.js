import Ballot from './Ballot.js';

export default class Post {
    constructor(card, experience) {
        this.website = card.links.Website;
        this.ballot = (card.ballot || null) && new Ballot(card, experience);
    }
}
